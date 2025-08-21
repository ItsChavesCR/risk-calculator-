import { describe, it, expect, vi, beforeEach } from 'vitest';
import { listRisks, createRisk, updateRisk, deleteRisk } from './risk-service';

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    risk: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

import { prisma } from '@/lib/prisma';

const mockPrisma = vi.mocked(prisma);

describe('Risk Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('listRisks', () => {
    it('should return risks ordered by score desc', async () => {
      const mockRisks = [
        { id: '1', score: 15, hazard: 'High Risk', likelihood: 5, severity: 3, level: 'High', createdAt: new Date(), updatedAt: new Date() },
        { id: '2', score: 8, hazard: 'Medium Risk', likelihood: 4, severity: 2, level: 'Medium', createdAt: new Date(), updatedAt: new Date() },
      ];

      mockPrisma.risk.findMany.mockResolvedValue(mockRisks);

      const result = await listRisks();

      expect(mockPrisma.risk.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: { score: 'desc' },
      });
      expect(result).toEqual(mockRisks);
    });

    it('should apply filters correctly', async () => {
      const mockRisks = [{ id: '1', score: 8, hazard: 'Filtered Risk', likelihood: 4, severity: 2, level: 'Medium', createdAt: new Date(), updatedAt: new Date() }];

      mockPrisma.risk.findMany.mockResolvedValue(mockRisks);

      await listRisks({ q: 'Filtered', level: 'Medium' });

      expect(mockPrisma.risk.findMany).toHaveBeenCalledWith({
        where: {
          hazard: { contains: 'Filtered', mode: 'insensitive' },
          level: 'Medium',
        },
        orderBy: { score: 'desc' },
      });
    });
  });

  describe('createRisk', () => {
    it('should create risk with computed score and level', async () => {
      const input = { hazard: 'Test Risk', likelihood: 3, severity: 4 };
      const expectedRisk = { ...input, id: '1', score: 12, level: 'High', createdAt: new Date(), updatedAt: new Date() };

      mockPrisma.risk.create.mockResolvedValue(expectedRisk);

      const result = await createRisk(input);

      expect(mockPrisma.risk.create).toHaveBeenCalledWith({
        data: {
          ...input,
          score: 12,
          level: 'High',
        },
      });
      expect(result).toEqual(expectedRisk);
    });
  });

  describe('updateRisk', () => {
    it('should update risk and recompute score/level when likelihood changes', async () => {
      const existingRisk = { id: '1', hazard: 'Test', likelihood: 2, severity: 3, score: 6, level: 'Medium', createdAt: new Date(), updatedAt: new Date() };
      const updateData = { likelihood: 4 };
      const expectedRisk = { ...existingRisk, ...updateData, score: 12, level: 'High' };

      mockPrisma.risk.findUnique.mockResolvedValue(existingRisk);
      mockPrisma.risk.update.mockResolvedValue(expectedRisk);

      const result = await updateRisk('1', updateData);

      expect(mockPrisma.risk.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { likelihood: 4, score: 12, level: 'High' },
      });
      expect(result).toEqual(expectedRisk);
    });

    it('should throw error for non-existent risk', async () => {
      mockPrisma.risk.findUnique.mockResolvedValue(null);

      await expect(updateRisk('999', { hazard: 'New' })).rejects.toThrow('Risk not found');
    });
  });

  describe('deleteRisk', () => {
    it('should delete risk successfully', async () => {
      mockPrisma.risk.delete.mockResolvedValue({} as any);

      await deleteRisk('1');

      expect(mockPrisma.risk.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });
});
