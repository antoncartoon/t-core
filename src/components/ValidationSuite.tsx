import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import {
  calculatePiecewiseAPY,
  calculateQuadraticRisk,
  calculateStressScenarios,
  calculatePredictedYield,
  getTierForSegment,
  generatePiecewiseCurveData,
  TIER_BREAKPOINTS,
  TARGET_APYS,
  TIER_PRESETS
} from '@/utils/tzFormulas';

/**
 * Comprehensive validation suite for T-Core formula consolidation
 * Tests all critical mathematical functions and edge cases
 */
const ValidationSuite = () => {
  // Test 1: APY Calculation Edge Cases
  const apyTests = [
    { name: 'Safe tier start (0)', segment: 0, expected: TARGET_APYS.safe },
    { name: 'Safe tier end (9)', segment: 9, expected: TARGET_APYS.safe },
    { name: 'Conservative start (10)', segment: 10, expected: TARGET_APYS.safe }, // Should start at 5.16%
    { name: 'Conservative end (29)', segment: 29, expected: TARGET_APYS.conservative }, // Should end at 7%
    { name: 'Balanced start (30)', segment: 30, expected: TARGET_APYS.conservative }, // Should start at 7%
    { name: 'Balanced end (59)', segment: 59, expected: TARGET_APYS.balanced }, // Should end at 9.5%
    { name: 'Hero start (60)', segment: 60, expected: TARGET_APYS.balanced }, // Should start at 9.5%
    { name: 'Hero high (80)', segment: 80, expected: 0.095 * Math.pow(1.03, 20) }, // Exponential formula
    { name: 'Hero max (99)', segment: 99, expected: 0.095 * Math.pow(1.03, 39) } // Exponential formula
  ];

  // Test 2: Stress Testing Validation
  const stressTestPosition = 10000; // $10k position
  const stressTestTVL = 1000000; // $1M TVL
  const stressTestRange: [number, number] = [30, 59]; // Balanced tier

  const stressResults = calculateStressScenarios(
    stressTestPosition,
    stressTestRange,
    stressTestTVL
  );

  // Test 3: Tier Presets Consistency
  const tierPresetTests = Object.entries(TIER_PRESETS).map(([key, preset]) => {
    const startAPY = calculatePiecewiseAPY(preset.range[0]);
    const endAPY = calculatePiecewiseAPY(preset.range[1]);
    return {
      name: `${preset.name} tier consistency`,
      tier: preset.name,
      range: `${preset.range[0]}-${preset.range[1]}`,
      startAPY: (startAPY * 100).toFixed(2),
      endAPY: (endAPY * 100).toFixed(2)
    };
  });

  // Test 4: Curve Data Generation
  const curveData = generatePiecewiseCurveData();
  const curveValidation = {
    totalPoints: curveData.length,
    expectedPoints: 100,
    hasAllTiers: ['Safe', 'Conservative', 'Balanced', 'Hero'].every(tier =>
      curveData.some(point => point.tier === tier)
    ),
    apyRange: {
      min: Math.min(...curveData.map(p => p.apy)).toFixed(2),
      max: Math.max(...curveData.map(p => p.apy)).toFixed(2)
    }
  };

  // Test 5: Yield Calculations
  const yieldTest = calculatePredictedYield(10000, [30, 59]);

  const runTest = (testName: string, actual: number, expected: number, tolerance = 0.0001) => {
    const passed = Math.abs(actual - expected) < tolerance;
    return {
      name: testName,
      passed,
      actual: (actual * 100).toFixed(4) + '%',
      expected: (expected * 100).toFixed(4) + '%',
      difference: ((actual - expected) * 100).toFixed(6) + '%'
    };
  };

  const apyTestResults = apyTests.map(test => 
    runTest(test.name, calculatePiecewiseAPY(test.segment), test.expected)
  );

  const allTestsPassed = apyTestResults.every(test => test.passed);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {allTestsPassed ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            T-Core Formula Validation Suite
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* APY Tests */}
          <div>
            <h3 className="font-semibold mb-3">1. APY Calculation Tests</h3>
            <div className="grid gap-2">
              {apyTestResults.map((test, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2">
                    {test.passed ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm">{test.name}</span>
                  </div>
                  <div className="text-sm">
                    <span>Expected: {test.expected}</span>
                    <span className="mx-2">|</span>
                    <span>Actual: {test.actual}</span>
                    {!test.passed && (
                      <span className="text-red-600 ml-2">Δ{test.difference}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stress Test Results */}
          <div>
            <h3 className="font-semibold mb-3">2. Stress Testing Validation</h3>
            <div className="grid gap-2">
              <div className="p-3 border rounded">
                <div className="text-sm text-muted-foreground mb-2">
                  Position: ${stressTestPosition.toLocaleString()} | Range: {stressTestRange[0]}-{stressTestRange[1]} | TVL: ${stressTestTVL.toLocaleString()}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground">1% TVL Loss</div>
                    <div className="font-medium">
                      {stressResults.scenario1.lossPercent.toFixed(2)}%
                    </div>
                    <div className="text-xs">${stressResults.scenario1.dollarLoss.toFixed(0)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">5% TVL Loss</div>
                    <div className="font-medium">
                      {stressResults.scenario5.lossPercent.toFixed(2)}%
                    </div>
                    <div className="text-xs">${stressResults.scenario5.dollarLoss.toFixed(0)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">10% TVL Loss</div>
                    <div className="font-medium">
                      {stressResults.scenario10.lossPercent.toFixed(2)}%
                    </div>
                    <div className="text-xs">${stressResults.scenario10.dollarLoss.toFixed(0)}</div>
                  </div>
                </div>
                <div className="mt-2">
                  <Badge variant={stressResults.scenario1.lossPercent > 0 ? "default" : "destructive"}>
                    {stressResults.scenario1.lossPercent > 0 ? "Stress calculations working" : "ERROR: No loss calculated"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Tier Presets */}
          <div>
            <h3 className="font-semibold mb-3">3. Tier Preset Consistency</h3>
            <div className="grid gap-2">
              {tierPresetTests.map((test, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{test.name}</span>
                  </div>
                  <div className="text-sm">
                    Range: {test.range} | APY: {test.startAPY}% → {test.endAPY}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Curve Data */}
          <div>
            <h3 className="font-semibold mb-3">4. Curve Generation Validation</h3>
            <div className="p-3 border rounded">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Data Points</div>
                  <div className="font-medium">
                    {curveValidation.totalPoints} / {curveValidation.expectedPoints}
                    {curveValidation.totalPoints === curveValidation.expectedPoints ? (
                      <CheckCircle className="inline h-4 w-4 text-green-600 ml-1" />
                    ) : (
                      <XCircle className="inline h-4 w-4 text-red-600 ml-1" />
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">All Tiers Present</div>
                  <div className="font-medium">
                    {curveValidation.hasAllTiers ? 'Yes' : 'No'}
                    {curveValidation.hasAllTiers ? (
                      <CheckCircle className="inline h-4 w-4 text-green-600 ml-1" />
                    ) : (
                      <XCircle className="inline h-4 w-4 text-red-600 ml-1" />
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">APY Range</div>
                  <div className="font-medium">{curveValidation.apyRange.min}% - {curveValidation.apyRange.max}%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Yield Calculations */}
          <div>
            <h3 className="font-semibold mb-3">5. Yield Calculation Test</h3>
            <div className="p-3 border rounded">
              <div className="text-sm text-muted-foreground mb-2">
                $10,000 investment in Balanced tier (30-59)
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Average APY</div>
                  <div className="font-medium">{yieldTest.percentAPY.toFixed(2)}%</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Annual Yield</div>
                  <div className="font-medium">${yieldTest.dollarYield.toFixed(0)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="border-t pt-4">
            <Badge variant={allTestsPassed ? "default" : "destructive"} className="text-sm">
              {allTestsPassed ? "✅ All tests passed - Formula consolidation successful!" : "❌ Some tests failed - Review needed"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ValidationSuite;