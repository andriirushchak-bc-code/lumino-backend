import { callGemini } from './gemini';
import { supabasePublic } from './supabase';

export interface MappingEntry {
  excel_column: string;
  lumino_field: string;
  conversion_note?: string;
  value_mapping?: Record<string, string>;
}

export interface InferenceResult {
  entity_type: 'expenses' | 'guests';
  mapping: MappingEntry[];
  match_summary: {
    users_matched: number;
    users_total_unique: number;
  };
  warnings: string[];
}

export async function inferSchema(
  headers: string[],
  sampleRows: Record<string, string>[],
  knownUsers: { email: string; full_name: string }[]
): Promise<InferenceResult> {
  const prompt = `You are a data import assistant for Lumino, a B2B expense management platform.

Analyze this spreadsheet and return strict JSON describing how it should map to Lumino's data model.

LUMINO DATA MODEL:

Table "expenses":
- expense_date (date, must be ISO YYYY-MM-DD)
- merchant (text)
- category (text — MUST be one of: Travel, Meals, Office, Software, Entertainment, Training, Other)
- amount (number, decimal)
- currency (3-letter ISO, e.g. EUR, USD, GBP)
- user_email (must match a known user — see list below)

Table "guests":
- full_name (text)
- company (text)
- company_website (text, optional — can be enriched)
- linkedin_url (text, optional — can be enriched)

KNOWN LUMINO USERS (for matching employee names → emails):
${knownUsers.map((u) => `- ${u.full_name} <${u.email}>`).join('\n')}

SPREADSHEET HEADERS:
${headers.join(' | ')}

SAMPLE ROWS (first 8):
${sampleRows.map((r, i) => `${i + 1}. ${headers.map((h) => `${h}=${r[h]}`).join(', ')}`).join('\n')}

INSTRUCTIONS:
1. Determine entity_type: "expenses" or "guests".
2. For each spreadsheet column, propose a mapping to a Lumino field.
3. If a value needs format conversion (e.g. dates from MM/DD/YYYY), note it in conversion_note.
4. If column values need value-level remapping (e.g. "F&B" → "Meals"), include value_mapping.
5. Match employee names to known emails; report match count.
6. List warnings for anything ambiguous.

Respond with ONLY this JSON shape — no markdown, no prose, no code fences:

{
  "entity_type": "expenses" | "guests",
  "mapping": [
    {
      "excel_column": "<column header>",
      "lumino_field": "<lumino field name>",
      "conversion_note": "<optional: short note>",
      "value_mapping": { "<source>": "<target>" }
    }
  ],
  "match_summary": {
    "users_matched": <int>,
    "users_total_unique": <int>
  },
  "warnings": [ "<short warning>" ]
}`;

  const raw = await callGemini(prompt);

  let parsed: InferenceResult;
  try {
    parsed = JSON.parse(raw);
  } catch {
    // Gemini occasionally wraps with extra text — try to extract JSON object
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error(`Gemini returned non-JSON response: ${raw.slice(0, 200)}`);
    }
    try {
      parsed = JSON.parse(jsonMatch[0]);
    } catch {
      throw new Error(`Failed to parse Gemini JSON response: ${raw.slice(0, 200)}`);
    }
  }

  return parsed;
}

export async function fetchKnownUsers(): Promise<{ email: string; full_name: string }[]> {
  const { data, error } = await supabasePublic
    .from('users')
    .select('email, full_name');
  if (error) throw new Error(`Failed to fetch users: ${error.message}`);
  return data ?? [];
}
