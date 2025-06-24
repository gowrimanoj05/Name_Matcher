import { normalizeString, createBlockingKey, calculateSimilarity } from './stringUtils.js';

/*FuzzyMatcher class for efficient name matching with blocking*/
export class FuzzyMatcher {
  constructor(threshold = 85, maxResults = 5) {
    this.threshold = threshold;
    this.maxResults = maxResults;
    this.blocks = {};
  }

  /*Build blocking index for candidate names*/
  buildBlocks(names) {
    this.blocks = {};
    
    names.forEach((name, idx) => {
      const blockKey = createBlockingKey(name);
      if (!this.blocks[blockKey]) {
        this.blocks[blockKey] = [];
      }
      this.blocks[blockKey].push({ name, index: idx });
    });
  }

  /*Get candidate names from relevant blocks*/
  getCandidates(queryName) {
    const blockKey = createBlockingKey(queryName);
    const [firstChars, lengthBucket, firstWordPrefix] = blockKey.split('-');
    
    const candidates = [];
    
    // Check current block and adjacent length buckets
    for (let lb = Math.max(0, parseInt(lengthBucket) - 1); lb <= parseInt(lengthBucket) + 1; lb++) {
      const adjacentKey = `${firstChars}-${lb}-${firstWordPrefix}`;
      if (this.blocks[adjacentKey]) {
        candidates.push(...this.blocks[adjacentKey]);
      }
    }
    
    return candidates;
  }

  /*Find matches for all query names against candidate names*/
  findMatches(queryNames, candidateNames) {
    // Build blocking index
    this.buildBlocks(candidateNames);
    
    const allMatches = [];
    
    queryNames.forEach((queryName, queryIndex) => {
      const queryNormalized = normalizeString(queryName);
      const candidates = this.getCandidates(queryName);
      
      // Calculate similarities
      const matches = candidates
        .map(candidate => ({
          queryName,
          queryNormalized,
          matchName: candidate.name,
          matchNormalized: normalizeString(candidate.name),
          score: calculateSimilarity(queryName, candidate.name),
          queryIndex,
          matchIndex: candidate.index
        }))
        .filter(match => match.score >= this.threshold)
        .sort((a, b) => b.score - a.score)
        .slice(0, this.maxResults);

      allMatches.push(...matches);
    });

    return allMatches;
  }
}