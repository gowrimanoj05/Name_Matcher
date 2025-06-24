/**
 Normalize a string for fuzzy matching
 Removes prefixes, suffixes, special characters, and extra whitespace
 */

export const normalizeString = (str) => {
  if (!str || typeof str !== 'string') return '';
  
  // Convert to lowercase and trim
  let normalized = str.toLowerCase().trim();
  
  // Remove common prefixes and suffixes
  const prefixes = ['mr.', 'mrs.', 'ms.', 'dr.', 'prof.', 'sir', 'madam'];
  const suffixes = ['jr.', 'sr.', 'ii', 'iii', 'inc.', 'ltd.', 'llc', 'corp.'];
  
  const words = normalized.split(/\s+/);
  const filteredWords = words.filter(word => 
    !prefixes.includes(word) && !suffixes.includes(word)
  );
  
  // Remove special characters but keep spaces
  normalized = filteredWords.join(' ');
  normalized = normalized.replace(/[^\w\s]/g, '');
  
  // Remove extra whitespace
  return normalized.replace(/\s+/g, ' ').trim();
};

/**
 * Create a blocking key for efficient name grouping
 */
export const createBlockingKey = (name) => {
  if (!name) return ('', 0, '');
  
  const normalized = normalizeString(name);
  const firstChars = normalized.substring(0, 3);
  const lengthBucket = Math.floor(normalized.length / 5);
  const firstWord = normalized.split(' ')[0] || '';
  const firstWordPrefix = firstWord.substring(0, 2);
  
  return `${firstChars}-${lengthBucket}-${firstWordPrefix}`;
};

/**
 * Calculate Levenshtein distance between two strings
 */
export const levenshteinDistance = (str1, str2) => {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
};

/*Calculate similarity percentage between two strings*/
export const calculateSimilarity = (str1, str2) => {
  const normalized1 = normalizeString(str1);
  const normalized2 = normalizeString(str2);
  
  if (!normalized1 || !normalized2) return 0;
  if (normalized1 === normalized2) return 100;
  
  const maxLength = Math.max(normalized1.length, normalized2.length);
  const distance = levenshteinDistance(normalized1, normalized2);
  
  return Math.round(((maxLength - distance) / maxLength) * 100);
};