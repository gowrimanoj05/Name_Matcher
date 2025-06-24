import React from 'react';
import { Settings, Search } from 'lucide-react';

const MatchSettings = ({ 
  threshold, 
  setThreshold,  
  onProcess, 
  isProcessing, 
  hasFiles 
}) => {
  return (
    <div className="match-settings">
      <div className="settings-header">
        <Settings size={20} />
        <h3>Matching Settings</h3>
      </div>
      
      <div className="settings-controls">
        <div className="setting-item">
          <label>Match Threshold: {threshold}%</label>
          <input 
            type="range" 
            min="50" 
            max="100" 
            value={threshold} 
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="threshold-slider"
          />
        </div>
        
        
        
        <button 
          onClick={onProcess}
          disabled={!hasFiles || isProcessing}
          className="process-button"
        >
          {isProcessing ? (
            <>
              <div className="spinner"></div>
              Processing...
            </>
          ) : (
            <>
              <Search size={20} />
              Find Matches
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default MatchSettings;