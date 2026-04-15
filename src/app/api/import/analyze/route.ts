import { NextRequest, NextResponse } from 'next/server';
import { toPublishedCsvUrl, fetchSheetRows } from '@/lib/sheets';
import { inferSchema, fetchKnownUsers } from '@/lib/inference';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  let body: { sheet_url?: string; user_email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { sheet_url, user_email } = body;
  if (!sheet_url || !user_email) {
    return NextResponse.json({ error: 'sheet_url and user_email are required' }, { status: 400 });
  }

  // Convert to CSV URL
  let csvUrl: string;
  try {
    csvUrl = toPublishedCsvUrl(sheet_url);
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Invalid sheet_url' },
      { status: 400 }
    );
  }

  // Fetch and parse the sheet
  let headers: string[];
  let rows: Record<string, string>[];
  try {
    ({ headers, rows } = await fetchSheetRows(csvUrl));
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to fetch sheet' },
      { status: 400 }
    );
  }

  const sampleRows = rows.slice(0, 8);
  const rowCount = rows.length;

  // Fetch known users
  let knownUsers: { email: string; full_name: string }[];
  try {
    knownUsers = await fetchKnownUsers();
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to fetch users' },
      { status: 502 }
    );
  }

  // Call Gemini for schema inference
  let inferenceResult: Awaited<ReturnType<typeof inferSchema>>;
  try {
    inferenceResult = await inferSchema(headers, sampleRows, knownUsers);
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Gemini inference failed' },
      { status: 502 }
    );
  }

  // Insert import session
  const { data: session, error: insertError } = await getSupabaseAdmin()
    .from('import_sessions')
    .insert({
      user_email,
      sheet_url,
      entity_type: inferenceResult.entity_type,
      detected_mapping: inferenceResult,
      row_count: rowCount,
      status: 'analyzed',
    })
    .select()
    .single();

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  // Build human summary
  const matchedUsers = inferenceResult.match_summary?.users_matched ?? 0;
  const totalUsers = inferenceResult.match_summary?.users_total_unique ?? 0;
  const valueMappings = inferenceResult.mapping.filter(
    (m) => m.value_mapping && Object.keys(m.value_mapping).length > 0
  );

  let human_summary = `Detected ${rowCount} ${inferenceResult.entity_type} rows.`;
  if (totalUsers > 0) {
    human_summary += ` ${matchedUsers} of ${totalUsers} unique employee names match Lumino users.`;
  }
  if (valueMappings.length > 0) {
    const examples = valueMappings
      .flatMap((m) =>
        Object.entries(m.value_mapping!).map(([from, to]) => `'${from}' → ${to}`)
      )
      .slice(0, 2)
      .join(', ');
    human_summary += ` Value remappings detected: ${examples}.`;
  }
  if (inferenceResult.warnings?.length > 0) {
    human_summary += ` Warning: ${inferenceResult.warnings[0]}`;
  }

  return NextResponse.json({ ...session, human_summary }, { status: 200 });
}
