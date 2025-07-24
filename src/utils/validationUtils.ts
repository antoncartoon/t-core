/**
 * T-Core Protocol Validation Utilities
 * 
 * This file contains validation functions to ensure consistency across the protocol.
 * It validates constants, formulas, and distribution parameters to prevent drift.
 */

import { 
  T_BILLS_RATE, 
  SAFE_MULTIPLIER, 
  FIXED_BASE_APY,
  TARGET_DISTRIBUTION,
  CURRENT_LIQUIDITY_DISTRIBUTION,
  TIER_TDD_DISTRIBUTION,
  TARGET_APYS,
  TIER_BREAKPOINTS
} from '@/utils/protocolConstants';
import { calculatePiecewiseAPY } from '@/utils/tzFormulas';

/**
 * Validation result structure
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate that T-Bills rate calculation is correct
 */
export const validateTBillsCalculation = (): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  const expectedSafeAPY = T_BILLS_RATE * SAFE_MULTIPLIER;
  
  if (Math.abs(FIXED_BASE_APY - expectedSafeAPY) > 0.0001) {
    errors.push(`FIXED_BASE_APY (${FIXED_BASE_APY}) does not match T_BILLS_RATE × SAFE_MULTIPLIER (${expectedSafeAPY})`);
  }
  
  if (Math.abs(FIXED_BASE_APY - 0.0516) > 0.0001) {
    errors.push(`FIXED_BASE_APY should be exactly 0.0516 (5.16%), got ${FIXED_BASE_APY}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Validate that all distribution percentages sum to 1.0
 */
export const validateDistributions = (): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  const distributions = [
    { name: 'TARGET_DISTRIBUTION', values: TARGET_DISTRIBUTION },
    { name: 'CURRENT_LIQUIDITY_DISTRIBUTION', values: CURRENT_LIQUIDITY_DISTRIBUTION },
    { name: 'TIER_TDD_DISTRIBUTION', values: TIER_TDD_DISTRIBUTION }
  ];
  
  distributions.forEach(({ name, values }) => {
    const sum = Object.values(values).reduce((acc, val) => acc + val, 0);
    if (Math.abs(sum - 1.0) > 0.01) {
      errors.push(`${name} does not sum to 1.0: ${sum}`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Validate APY calculation continuity at tier boundaries
 */
export const validateAPYContinuity = (): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Test continuity at tier boundaries
  const boundaries = [9, 29, 59]; // End of Safe, Conservative, Balanced tiers
  
  boundaries.forEach(boundary => {
    const beforeAPY = calculatePiecewiseAPY(boundary);
    const afterAPY = calculatePiecewiseAPY(boundary + 1);
    
    // Allow small tolerance for rounding
    const tolerance = 0.005; // 0.5% tolerance
    if (Math.abs(beforeAPY - afterAPY) > tolerance) {
      warnings.push(`Large APY jump at boundary ${boundary}: ${beforeAPY.toFixed(4)} → ${afterAPY.toFixed(4)}`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Validate Safe tier APY consistency
 */
export const validateSafeTierAPY = (): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Test all segments in Safe tier should return the same APY
  for (let i = 0; i <= 9; i++) {
    const apy = calculatePiecewiseAPY(i);
    if (Math.abs(apy - FIXED_BASE_APY) > 0.0001) {
      errors.push(`Safe tier segment ${i} returns ${apy}, expected ${FIXED_BASE_APY}`);
    }
  }
  
  // Validate against TARGET_APYS.safe
  if (Math.abs(TARGET_APYS.safe - FIXED_BASE_APY) > 0.0001) {
    errors.push(`TARGET_APYS.safe (${TARGET_APYS.safe}) does not match FIXED_BASE_APY (${FIXED_BASE_APY})`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Validate tier breakpoints consistency
 */
export const validateTierBreakpoints = (): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  const expectedBreakpoints = {
    safe: [0, 9],
    conservative: [10, 29],
    balanced: [30, 59],
    hero: [60, 99]
  };
  
  Object.entries(expectedBreakpoints).forEach(([tier, [start, end]]) => {
    const actual = TIER_BREAKPOINTS[tier as keyof typeof TIER_BREAKPOINTS];
    if (!actual || actual[0] !== start || actual[1] !== end) {
      errors.push(`TIER_BREAKPOINTS.${tier} should be [${start}, ${end}], got [${actual?.[0]}, ${actual?.[1]}]`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Run comprehensive validation of all protocol constants and formulas
 */
export const validateProtocolConstants = (): ValidationResult => {
  const validations = [
    validateTBillsCalculation(),
    validateDistributions(),
    validateAPYContinuity(),
    validateSafeTierAPY(),
    validateTierBreakpoints()
  ];
  
  const allErrors = validations.flatMap(v => v.errors);
  const allWarnings = validations.flatMap(v => v.warnings);
  
  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings
  };
};

/**
 * Log validation results to console (for development)
 */
export const logValidationResults = (result: ValidationResult): void => {
  if (result.isValid) {
    console.log('✅ T-Core Protocol validation passed');
  } else {
    console.error('❌ T-Core Protocol validation failed:');
    result.errors.forEach(error => console.error(`  - ${error}`));
  }
  
  if (result.warnings.length > 0) {
    console.warn('⚠️ T-Core Protocol validation warnings:');
    result.warnings.forEach(warning => console.warn(`  - ${warning}`));
  }
};

/**
 * Run validation in development mode
 */
if (import.meta.env.DEV) {
  const result = validateProtocolConstants();
  logValidationResults(result);
}