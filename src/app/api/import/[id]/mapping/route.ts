import { NextRequest, NextResponse } from 'next/server';
import { supabasePublic, supabaseAdmin } from '@/lib/supabase';
import type { MappingEntry } from '@/lib/inference';

interface MappingChange {
  excel_column: string;
  new_lumino_field?: string;
  value_mapping?: Record<string, string>;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  let body: { changes?: MappingChange[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { changes } = body;
  if (!changes || !Array.isArray(changes)) {
    return NextResponse.json({ error: 'changes array is required' }, { status: 400 });
  }

  // Fetch existing session
  const { data: session, error: fetchError } = await supabasePublic
    .from('import_sessions')
    .select('*')
    .eq('id', params.id)
    .single();

  if (fetchError || !session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  const detectedMapping = session.detected_mapping as {
    entity_type: string;
    mapping: MappingEntry[];
    match_summary: { users_matched: number; users_total_unique: number };
    warnings: string[];
  };

  // Apply changes to mapping
  const updatedMapping = detectedMapping.mapping.map((entry) => {
    const change = changes.find((c) => c.excel_column === entry.excel_column);
    if (!change) return entry;

    return {
      ...entry,
      ...(change.new_lumino_field ? { lumino_field: change.new_lumino_field } : {}),
      ...(change.value_mapping
        ? { value_mapping: { ...(entry.value_mapping ?? {}), ...change.value_mapping } }
        : {}),
    };
  });

  const newDetectedMapping = { ...detectedMapping, mapping: updatedMapping };

  const { data: updated, error: updateError } = await supabaseAdmin
    .from('import_sessions')
    .update({ detected_mapping: newDetectedMapping, status: 'mapping_updated' })
    .eq('id', params.id)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json(updated);
}
