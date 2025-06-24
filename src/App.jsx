import React, { useState } from 'react';
import FileUploader from './components/FileUploader.jsx';
import MatchSettings from './components/MatchSettings.jsx';
import MatchTable from './components/MatchTable.jsx';
import StatsPanel from './components/StatsPanel.jsx';
import ErrorMessage from './components/ErrorMessage.jsx';
import { useFileProcessor } from './hooks/useFileProcessor.js';
import { useFuzzyMatcher } from './hooks/useFuzzyMatcher.js';
import { exportToCSV } from './utils/csvParser.js';
import './App.css';

function App() {
  // File state
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  
  // Settings state
  const [threshold, setThreshold] = useState(85);
  const [maxResults, setMaxResults] = useState(5);
  
  // Data state
  const [queryNames, setQueryNames] = useState([]);
  const [candidateNames, setCandidateNames] = useState([]);
  const [selectedQueryName, setSelectedQueryName] = useState(null);
  
  // Hooks
  const { processFiles, isProcessing, error, setError } = useFileProcessor();
  const { matches, findMatches, clearMatches } = useFuzzyMatcher(threshold, maxResults);

  // Filtered and sorted matches
  const displayMatches = React.useMemo(() => {
    let filteredMatches = matches;
    
    // Filter by selected query name if one is selected
    if (selectedQueryName) {
      filteredMatches = matches.filter(match => match.queryName === selectedQueryName);
    }
    
    // Sort by score in descending order (highest similarity first)
    return filteredMatches.sort((a, b) => b.score - a.score);
  }, [matches, selectedQueryName]);

  // Get unique query names for the filter dropdown
  const uniqueQueryNames = React.useMemo(() => {
    const names = [...new Set(matches.map(match => match.queryName))];
    return names.sort();
  }, [matches]);

  const handleProcess = async () => {
    if (!file1 || !file2) {
      setError('Please select both files');
      return;
    }

    

    // Process files
    const { names1, names2 } = await processFiles(file1, file2);
    
    if (names1.length === 0 || names2.length === 0) {
      return; // Error already set by useFileProcessor
    }

    // Store names for statistics
    setQueryNames(names1);
    setCandidateNames(names2);

    // Find matches
    findMatches(names1, names2);
  };

  const handleExport = () => {
    if (matches.length === 0) {
      setError('No matches to export');
      return;
    }
    
    try {
      exportToCSV(matches);
    } catch (err) {
      setError('Failed to export results');
    }
  };

  

  return (
    <div className="app">
      <header className="app-header">
        <h1>Name Matcher</h1>
      </header>

      <main className="app-main">
        {/* Error Message */}
        <ErrorMessage 
          message={error} 
          onClose={() => setError('')} 
        />

        {/* File Upload Section */}
        <section className="upload-section">
          <h2>Upload Files</h2>
          <div className="upload-grid">
            <FileUploader
              label="Query Names File (CSV)"
              onFileSelect={setFile1}
              file={file1}
            />
            <FileUploader
              label="Candidate Names File (CSV)"
              onFileSelect={setFile2}
              file={file2}
            />
          </div>
        </section>

        {/* Settings Section */}
        <section className="settings-section">
          <MatchSettings
            threshold={threshold}
            setThreshold={setThreshold}
            maxResults={maxResults}
            setMaxResults={setMaxResults}
            onProcess={handleProcess}
            isProcessing={isProcessing}
            hasFiles={file1 && file2}
          />
        </section>

        {/* Results Section */}
        {matches.length > 0 && (
          <section className="results-section">
            <div className="results-actions">
              <div className="filter-controls">
                <label htmlFor="name-filter">Filter by Query Name:</label>
                <select 
                  id="name-filter"
                  value={selectedQueryName || ''} 
                  onChange={(e) => setSelectedQueryName(e.target.value || null)}
                  className="name-filter-select"
                >
                  <option value="">Show All Names </option>
                  {uniqueQueryNames.map(name => {
                    const count = matches.filter(m => m.queryName === name).length;
                    return (
                      <option key={name} value={name}>
                        {name} 
                      </option>
                    );
                  })}
                </select>
              </div>
              
            </div>
            
            <StatsPanel 
              matches={displayMatches} 
              totalQueries={selectedQueryName ? 1 : queryNames.length}
              selectedQueryName={selectedQueryName}
            />
            
            <MatchTable 
              matches={displayMatches} 
              onExport={() => exportToCSV(displayMatches)}
              selectedQueryName={selectedQueryName}
            />
          </section>
        )}

       
      </main>

      
    </div>
  );
}

export default App;