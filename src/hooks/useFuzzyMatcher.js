import { useState, useMemo } from 'react';
import { FuzzyMatcher } from '../utils/fuzzyMatcher.js';

export const useFuzzyMatcher = (threshold = 85, maxResults = 5) => {
  const [matches, setMatches] = useState([]);
  
  const matcher = useMemo(() => {
    return new FuzzyMatcher(threshold, maxResults);
  }, [threshold, maxResults]);

  const findMatches = (queryNames, candidateNames) => {
    const results = matcher.findMatches(queryNames, candidateNames);
    setMatches(results);
    return results;
  };

  const clearMatches = () => {
    setMatches([]);
  };

  return { matches, findMatches, clearMatches };
};