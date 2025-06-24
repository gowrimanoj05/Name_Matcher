import React from 'react';
import { Download, AlertCircle, ArrowDown, Filter } from 'lucide-react';

const MatchTable = ({ matches, onExport, selectedQueryName }) => {
  if (!matches || matches.length === 0) {
    return (
      <div className="no-matches">
        <AlertCircle size={48} />
        <h3>No matches found</h3>
        <p>
          {selectedQueryName 
            ? `No matches found for "${selectedQueryName}". Try selecting a different name or clearing the filter.`
            : 'Try lowering the similarity threshold or check your input files.'
          }
        </p>
      </div>
    );
  }

  const getScoreClass = (score) => {
    if (score >= 95) return 'score-excellent';
    if (score >= 90) return 'score-high';
    if (score >= 80) return 'score-medium';
    return 'score-low';
  };

  

  return (
    <div className="match-results">
      <div className="results-header">
        <div className="results-title">
          <h3>
            {selectedQueryName ? (
              <>
                <Filter size={20} />
                Matches for "{selectedQueryName}" ({matches.length} found)
              </>
            ) : (
              <>
                Match Results ({matches.length} matches found)
                <ArrowDown size={16} className="sort-indicator" />
                <span className="sort-label">Sorted by similarity</span>
              </>
            )}
          </h3>
        </div>
        <button onClick={onExport} className="export-button">
          <Download size={16} />
          Export {selectedQueryName ? 'Filtered' : 'All'} Results
        </button>
      </div>
      
      <div className="table-container">
        <table className="match-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Query Name</th>
              <th>Matched Name</th>
              <th className="score-header">
                Similarity Score
                <ArrowDown size={14} className="sort-icon" />
              </th>
              <th>Query (Normalized)</th>
              <th>Match (Normalized)</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match, idx) => (
              <tr key={idx} className="match-row">
                <td className="rank-cell">
                  <span className="rank-number">#{idx + 1}</span>
                </td>
                <td className="name-cell query-name">
                  <div className="name-container">
                    <span className="name-text">{match.queryName}</span>
                    {!selectedQueryName && (
                      <span className="name-badge">Query</span>
                    )}
                  </div>
                </td>
                <td className="name-cell match-name">
                  <div className="name-container">
                    <span className="name-text">{match.matchName}</span>
                    <span className="name-badge match-badge">Match</span>
                  </div>
                </td>
                <td className={`score-cell ${getScoreClass(match.score)}`}>
                  <div className="score-container">
                    <span className="score-value">{match.score}%</span>
                  </div>
                </td>
                <td className="normalized-cell">{match.queryNormalized}</td>
                <td className="normalized-cell">{match.matchNormalized}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {matches.length > 10 && (
        <div className="table-footer">
          <p className="results-summary">
            Showing {matches.length} matches
            {selectedQueryName && (
              <> for <strong>"{selectedQueryName}"</strong></>
            )}
            {' '}• Sorted by similarity score (highest first)
          </p>
        </div>
      )}
    </div>
  );
};

export default MatchTable;