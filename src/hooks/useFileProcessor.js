import { useState } from 'react';
import { parseCSV, readFile } from '../utils/csvParser.js';

export const useFileProcessor = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const processFiles = async (file1, file2) => {
    if (!file1 || !file2) {
      setError('Please select both files');
      return { names1: [], names2: [] };
    }

    setIsProcessing(true);
    setError('');
    
    try {
      const [content1, content2] = await Promise.all([
        readFile(file1),
        readFile(file2)
      ]);

      const names1 = parseCSV(content1);
      const names2 = parseCSV(content2);

      if (names1.length === 0 || names2.length === 0) {
        setError('No valid names found in one or both files');
        return { names1: [], names2: [] };
      }

      return { names1, names2 };
    } catch (err) {
      setError(`Error processing files: ${err.message}`);
      return { names1: [], names2: [] };
    } finally {
      setIsProcessing(false);
    }
  };

  return { processFiles, isProcessing, error, setError };
};