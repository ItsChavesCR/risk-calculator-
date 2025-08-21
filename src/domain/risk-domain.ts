/**
 * Risk assessment domain logic
 */

export type Likelihood = 1 | 2 | 3 | 4 | 5;
export type Severity = 1 | 2 | 3 | 4 | 5;
export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export const RISK_THRESHOLDS = { 
  LOW_MAX: 4, 
  MEDIUM_MAX: 9, 
  HIGH_MAX: 16 
} as const;

/**
 * Computes risk score by multiplying likelihood and severity
 */
export function computeScore(likelihood: Likelihood, severity: Severity): number {
  return likelihood * severity;
}

/**
 * Determines risk level based on computed score
 */
export function computeLevel(score: number): RiskLevel {
  if (score <= RISK_THRESHOLDS.LOW_MAX) {
    return 'Low';
  }
  
  if (score <= RISK_THRESHOLDS.MEDIUM_MAX) {
    return 'Medium';
  }
  
  if (score <= RISK_THRESHOLDS.HIGH_MAX) {
    return 'High';
  }
  
  return 'Critical';
}

/**
 * Maps likelihood labels to numeric values
 */
export const LIKELIHOOD_OPTIONS = [
  { label: 'Impossible', value: 1, group: 'Rare' },
  { label: 'Remote', value: 2, group: 'Rare' },
  { label: 'Unlikely', value: 2, group: 'Rare' },
  { label: 'Possible', value: 3, group: 'Occasional' },
  { label: 'Unusual', value: 3, group: 'Occasional' },
  { label: 'Known', value: 4, group: 'Occasional' },
  { label: 'Likely', value: 4, group: 'Frequent' },
  { label: 'Usual', value: 5, group: 'Frequent' },
  { label: 'Certain', value: 5, group: 'Frequent' },
] as const;

/**
 * Maps severity labels to numeric values
 */
export const SEVERITY_OPTIONS = [
  { label: 'Insignificant', value: 1, group: 'Slight' },
  { label: 'Minor incident', value: 2, group: 'Slight' },
  { label: 'Minor injury', value: 2, group: 'Slight' },
  { label: 'Health damage', value: 3, group: 'Moderate' },
  { label: 'Injury', value: 3, group: 'Moderate' },
  { label: 'Multiple injuries', value: 4, group: 'Moderate' },
  { label: 'Serious injury', value: 4, group: 'Extreme' },
  { label: 'Fatal', value: 5, group: 'Extreme' },
  { label: 'Multiple fatalities', value: 5, group: 'Extreme' },
] as const;

/**
 * Maps likelihood label to numeric value
 */
export function mapLikelihoodLabelToValue(label: string): Likelihood | undefined {
  const option = LIKELIHOOD_OPTIONS.find(opt => opt.label === label);
  return option?.value;
}

/**
 * Maps severity label to numeric value
 */
export function mapSeverityLabelToValue(label: string): Severity | undefined {
  const option = SEVERITY_OPTIONS.find(opt => opt.label === label);
  return option?.value;
}

/**
 * Gets default likelihood value
 */
export function getDefaultLikelihood(): Likelihood {
  return 1; // Impossible
}

/**
 * Gets default severity value
 */
export function getDefaultSeverity(): Severity {
  return 1; // Insignificant
}
