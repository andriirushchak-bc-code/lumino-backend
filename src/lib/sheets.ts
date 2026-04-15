import Papa from 'papaparse';

export function toPublishedCsvUrl(sheetUrl: string): string {
  // Extract spreadsheet ID
  const idMatch = sheetUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
  if (!idMatch) {
    throw new Error('Invalid Google Sheets URL: cannot extract spreadsheet ID');
  }
  const id = idMatch[1];

  // Extract gid if present
  const gidMatch = sheetUrl.match(/[?&#]gid=(\d+)/);
  const gid = gidMatch ? gidMatch[1] : '0';

  return `https://docs.google.com/spreadsheets/d/${id}/export?format=csv&gid=${gid}`;
}

export async function fetchSheetRows(
  csvUrl: string
): Promise<{ headers: string[]; rows: Record<string, string>[] }> {
  const response = await fetch(csvUrl, { redirect: 'follow' });
  if (!response.ok) {
    throw new Error(`Failed to fetch sheet: HTTP ${response.status}`);
  }

  const text = await response.text();

  // Google returns HTML if the sheet isn't public or URL is wrong
  if (text.trimStart().startsWith('<')) {
    throw new Error(
      'Sheet returned HTML instead of CSV — make sure the sheet is published to the web (File → Share → Publish to web)'
    );
  }

  const result = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
  });

  const headers = result.meta.fields ?? [];
  return { headers, rows: result.data };
}
