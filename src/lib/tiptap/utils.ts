export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export interface CsvParseResult {
  rows: string[][];
  maxColumns: number;
}

export function parseCsv(text: string): CsvParseResult {
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
  if (!normalized) {
    return { rows: [], maxColumns: 0 };
  }

  const lines = normalized.split('\n');
  const rows: string[][] = [];
  let maxColumns = 0;

  for (const line of lines) {
    if (!line.trim()) continue;

    const cells: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i += 1) {
      const char = line[i];

      if (char === '"') {
        const next = line[i + 1];

        if (inQuotes && next === '"') {
          current += '"';
          i += 1;
          continue;
        }

        inQuotes = !inQuotes;
        continue;
      }

      if (char === ',' && !inQuotes) {
        cells.push(current.trim());
        current = '';
        continue;
      }

      current += char;
    }

    cells.push(current.trim());

    maxColumns = Math.max(maxColumns, cells.length);
    rows.push(cells);
  }

  return { rows, maxColumns };
}
