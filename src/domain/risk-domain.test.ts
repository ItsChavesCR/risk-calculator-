import { describe, it, expect } from 'vitest';
import { computeScore, computeLevel, RISK_THRESHOLDS } from './risk-domain';

describe('Risk Domain', () => {
  describe('computeScore', () => {
    it('should multiply likelihood and severity correctly', () => {
      expect(computeScore(1, 1)).toBe(1);
      expect(computeScore(2, 3)).toBe(6);
      expect(computeScore(5, 5)).toBe(25);
    });
  });

  describe('computeLevel', () => {
    it('should return Low for scores <= 4', () => {
      expect(computeLevel(1)).toBe('Low');
      expect(computeLevel(2)).toBe('Low');
      expect(computeLevel(4)).toBe('Low');
    });

    it('should return Medium for scores 5-9', () => {
      expect(computeLevel(5)).toBe('Medium');
      expect(computeLevel(7)).toBe('Medium');
      expect(computeLevel(9)).toBe('Medium');
    });

    it('should return High for scores 10-16', () => {
      expect(computeLevel(10)).toBe('High');
      expect(computeLevel(13)).toBe('High');
      expect(computeLevel(16)).toBe('High');
    });

    it('should return Critical for scores > 16', () => {
      expect(computeLevel(17)).toBe('Critical');
      expect(computeLevel(20)).toBe('Critical');
      expect(computeLevel(25)).toBe('Critical');
    });
  });

  describe('RISK_THRESHOLDS', () => {
    it('should have correct threshold values', () => {
      expect(RISK_THRESHOLDS.LOW_MAX).toBe(4);
      expect(RISK_THRESHOLDS.MEDIUM_MAX).toBe(9);
      expect(RISK_THRESHOLDS.HIGH_MAX).toBe(16);
    });
  });
});
