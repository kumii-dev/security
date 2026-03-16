/**
 * Export utilities — CSV, Excel, PDF generation
 */
import * as XLSX from 'xlsx';

/**
 * Download data as CSV
 * @param {Object[]} data
 * @param {string} filename
 */
export function exportToCsv(data, filename = 'export') {
  if (!data?.length) return;

  const headers = Object.keys(data[0]);
  const rows = [
    headers.join(','),
    ...data.map((row) =>
      headers
        .map((h) => {
          const val = row[h] ?? '';
          const str = typeof val === 'object' ? JSON.stringify(val) : String(val);
          return `"${str.replace(/"/g, '""')}"`;
        })
        .join(',')
    ),
  ];

  const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, `${sanitizeFilename(filename)}.csv`);
}

/**
 * Download data as Excel (.xlsx)
 * @param {Object[]} data
 * @param {string} filename
 */
export function exportToExcel(data, filename = 'export') {
  if (!data?.length) return;

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');

  // Style header row
  const headerStyle = { font: { bold: true }, fill: { fgColor: { rgb: '1E3A8A' } } };
  const range = XLSX.utils.decode_range(worksheet['!ref']);
  for (let col = range.s.c; col <= range.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
    if (worksheet[cellAddress]) {
      worksheet[cellAddress].s = headerStyle;
    }
  }

  XLSX.writeFile(workbook, `${sanitizeFilename(filename)}.xlsx`);
}

/**
 * Trigger browser download from Blob
 */
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Sanitize filename — remove unsafe characters
 */
function sanitizeFilename(name) {
  return name
    .replace(/[^a-z0-9\s-_]/gi, '')
    .replace(/\s+/g, '_')
    .toLowerCase();
}
