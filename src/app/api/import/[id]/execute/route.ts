import { NextRequest, NextResponse } from 'next/server';
import { supabasePublic, supabaseAdmin } from '@/lib/supabase';
import { toPublishedCsvUrl, fetchSheetRows } from '@/lib/sheets';
import { enrichGuest } from '@/lib/enrichment';
import type { MappingEntry } from '@/lib/inference';

interface DetectedMapping {
  entity_type: 'expenses' | 'guests';
  mapping: MappingEntry[];
  match_summary: { users_matched: number; users_total_unique: number };
  warnings: string[];
}

function applyMapping(
  rows: Record<string, string>[],
  mapping: MappingEntry[]
): Record<string, unknown>[] {
  return rows.map((row) => {
    const record: Record<string, unknown> = {};
    for (const entry of mapping) {
      if (!entry.lumino_field) continue;
      let value: string = row[entry.excel_column] ?? '';

      // Apply value_mapping if present
      if (entry.value_mapping && entry.value_mapping[value] !== undefined) {
        value = entry.value_mapping[value];
      }

      record[entry.lumino_field] = value === '' ? null : value;
    }
    return record;
  });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  let body: { enrich?: boolean };
  try {
    body = await req.json();
  } catch {
    body = {};
  }
  const enrich = body.enrich ?? false;

  // Fetch session
  const { data: session, error: fetchError } = await supabasePublic
    .from('import_sessions')
    .select('*')
    .eq('id', params.id)
    .single();

  if (fetchError || !session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  if (session.status === 'imported') {
    return NextResponse.json({ error: 'Already imported' }, { status: 409 });
  }

  const detectedMapping = session.detected_mapping as DetectedMapping;
  const { entity_type, mapping } = detectedMapping;

  // Re-fetch the sheet
  let csvUrl: string;
  try {
    csvUrl = toPublishedCsvUrl(session.sheet_url);
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Invalid sheet_url' },
      { status: 400 }
    );
  }

  let rows: Record<string, string>[];
  try {
    ({ rows } = await fetchSheetRows(csvUrl));
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to fetch sheet' },
      { status: 400 }
    );
  }

  // Transform rows via mapping
  let records = applyMapping(rows, mapping);

  // Enrichment for guests
  let enrichment_report: string | undefined;
  if (enrich && entity_type === 'guests') {
    let enrichedCount = 0;
    records = records.map((rec) => {
      const guest = rec as { full_name?: string; company?: string };
      if (guest.full_name && guest.company) {
        const enriched = enrichGuest({
          full_name: guest.full_name,
          company: guest.company,
        });
        if (enriched.company_website || enriched.linkedin_url) enrichedCount++;
        return { ...rec, ...enriched };
      }
      return rec;
    });
    enrichment_report = `Enriched ${enrichedCount} of ${records.length} guest records.`;
  }

  // Attach import_session_id to each record
  const toInsert = records.map((r) => ({
    ...r,
    import_session_id: params.id,
  }));

  // Bulk insert
  const { data: inserted, error: insertError } = await supabaseAdmin
    .from(entity_type)
    .insert(toInsert)
    .select();

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  const importedCount = inserted?.length ?? toInsert.length;
  const summary = `Imported ${importedCount} records into ${entity_type}.${enrichment_report ? ' ' + enrichment_report : ''}`;

  // Update session
  await supabaseAdmin
    .from('import_sessions')
    .update({ status: 'imported', row_count: importedCount, summary })
    .eq('id', params.id);

  const vercelUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';

  const view_url =
    entity_type === 'expenses'
      ? `${vercelUrl}/expenses?user=${session.user_email}`
      : `${vercelUrl}/guests`;

  return NextResponse.json({
    imported_count: importedCount,
    summary,
    view_url,
    ...(enrichment_report ? { enrichment_report } : {}),
  });
}
