import React, { useMemo } from 'react';
import { BarChart3, Target, TrendingUp, Users } from 'lucide-react';

const StatsPanel = ({ matches, totalQueries, selectedQueryName }) => {
  const stats = useMemo(() => {
    if (!matches || matches.length === 0) return null;
    
    const scores = matches.map(m => m.score);
    const uniqueQueries = new Set(matches.map(m => m.queryName)).size;
    
    // Calculate score distribution
    const scoreRanges = {
      excellent: scores.filter(s => s >= 95).length,
      high: scores.filter(s => s >= 90 && s < 95).length,
      medium: scores.filter(s => s >= 80 && s < 90).length,
      low: scores.filter(s => s < 80).length
    };
    
    return {
      totalMatches: matches.length,
      averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      minScore: Math.min(...scores),
      maxScore: Math.max(...scores),
      queriesWithMatches: uniqueQueries,
      queriesWithoutMatches: totalQueries - uniqueQueries,
      matchRate: Math.round((uniqueQueries / totalQueries) * 100),
      scoreRanges,
      medianScore: Math.round(scores.sort((a, b) => a - b)[Math.floor(scores.length / 2)])
    };
  }, [matches, totalQueries]);

  if (!stats) return null;

  return (
    <div className="stats-panel">
      <div className="stats-header">
        <BarChart3 size={20} />
        <h3>
          {selectedQueryName 
            ? `Statistics for "${selectedQueryName}"` 
            : 'Overall Statistics'
          }
        </h3>
      </div>

      <div className="stats-grid">
        <div className="stat-item primary">
          <div className="stat-icon">
            <Target size={18} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Total Matches</span>
            <span className="stat-value">{stats.totalMatches}</span>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon">
            <TrendingUp size={18} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Average Score</span>
            <span className="stat-value">{stats.averageScore}%</span>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon">
            <Users size={18} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Match Rate</span>
            <span className="stat-value">{stats.matchRate}%</span>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-content">
            <span className="stat-label">Score Range</span>
            <span className="stat-value">{stats.minScore}% - {stats.maxScore}%</span>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-content">
            <span className="stat-label">Median Score</span>
            <span className="stat-value">{stats.medianScore}%</span>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-content">
            <span className="stat-label">Queries Matched</span>
            <span className="stat-value">{stats.queriesWithMatches}/{totalQueries}</span>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default StatsPanel;