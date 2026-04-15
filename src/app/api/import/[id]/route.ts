import { NextRequest, NextResponse } from 'next/server';
import { supabasePublic } from '@/lib/supabase';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { data, error } = await supabasePublic
    .from('import_sessions')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(data);
}
