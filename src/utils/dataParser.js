export function parseTransportData(rawText) {
  const lines = rawText.trim().split('\n');
  if (lines.length === 0) return [];

  const headers = lines[0].split('^').map(h => h.trim());
  
  return lines.slice(1).map(line => {
    const values = line.split('^').map(v => v.trim());
    let obj = {};
    headers.forEach((header, i) => {
      obj[header] = values[i] || '';
    });
    return obj;
  });
}
