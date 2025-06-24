/*Parse CSV content and extract names from the first column*/
export const parseCSV = (text) => {
  const lines = text.split('\n').filter(line => line.trim());
  if (lines.length === 0) return [];
  
  // Skip header row and extract names from first column
  const dataLines = lines.slice(1);
  return dataLines.map(line => {
    const columns = line.split(',').map(col => col.trim().replace(/"/g, ''));
    return columns[0];
  }).filter(name => name && name.length > 0);
};

/*Read file content as text*/
export const readFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
};

/*Export matches to CSV format*/
export const exportToCSV = (matches, filename = 'fuzzy_matching_results.csv') => {
  if (matches.length === 0) return;

  const csvContent = [
    ['Query Name', 'Match Name', 'Similarity Score', 'Query Normalized', 'Match Normalized'],
    ...matches.map(match => [
      match.queryName,
      match.matchName,
      match.score,
      match.queryNormalized,
      match.matchNormalized
    ])
  ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};