import React from 'react';
import { calculatePiecewiseAPY } from '@/utils/tzFormulas';

const APYTestComponent = () => {
  // Test key boundary points
  const testPoints = [
    { segment: 0, tier: "Safe Start" },
    { segment: 9, tier: "Safe End" },
    { segment: 10, tier: "Conservative Start" },
    { segment: 29, tier: "Conservative End" },
    { segment: 30, tier: "Balanced Start" },
    { segment: 59, tier: "Balanced End" },
    { segment: 60, tier: "Hero Start" },
    { segment: 99, tier: "Hero End" }
  ];

  return (
    <div className="p-4 bg-card rounded-lg">
      <h3 className="text-lg font-semibold mb-4">APY Test Results</h3>
      <div className="space-y-2">
        {testPoints.map(point => {
          const apy = calculatePiecewiseAPY(point.segment);
          return (
            <div key={point.segment} className="flex justify-between">
              <span>{point.tier} (Segment {point.segment}):</span>
              <span className="font-mono">{(apy * 100).toFixed(4)}%</span>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6">
        <h4 className="font-medium mb-2">Continuity Check:</h4>
        <div className="text-sm space-y-1">
          <div>Conservative boundary: {(calculatePiecewiseAPY(29) * 100).toFixed(6)}% → {(calculatePiecewiseAPY(30) * 100).toFixed(6)}%</div>
          <div>Balanced boundary: {(calculatePiecewiseAPY(59) * 100).toFixed(6)}% → {(calculatePiecewiseAPY(60) * 100).toFixed(6)}%</div>
        </div>
      </div>
    </div>
  );
};

export default APYTestComponent;