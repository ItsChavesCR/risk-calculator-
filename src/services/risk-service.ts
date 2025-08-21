import { prisma } from '@/lib/prisma';
import { computeScore, computeLevel } from '@/domain/risk-domain';
import type { CreateRiskInput, UpdateRiskInput } from '@/lib/validation';
import type { Likelihood, Severity } from '@/domain/risk-domain';

export interface ListRisksParams {
  q?: string;
  level?: string;
}

export interface Risk {
  id: string;
  hazard: string;
  likelihood: number;
  severity: number;
  score: number;
  level: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Lists risks with optional filtering and ordering
 */
export async function listRisks({ q, level }: ListRisksParams = {}): Promise<Risk[]> {
  const where: any = {};
  
  if (q) {
    where.hazard = { contains: q, mode: 'insensitive' };
  }
  
  if (level) {
    where.level = level;
  }
  
  return prisma.risk.findMany({
    where,
    orderBy: { score: 'desc' },
  });
}

/**
 * Creates a new risk with computed score and level
 */
export async function createRisk(data: CreateRiskInput): Promise<Risk> {
  const score = computeScore(data.likelihood, data.severity);
  const level = computeLevel(score);
  
  return prisma.risk.create({
    data: {
      ...data,
      score,
      level,
    },
  });
}

/**
 * Updates an existing risk, recomputing score and level if needed
 */
export async function updateRisk(id: string, data: UpdateRiskInput): Promise<Risk> {
  const existing = await prisma.risk.findUnique({ where: { id } });
  
  if (!existing) {
    throw new Error('Risk not found');
  }
  
  const updatedData: any = { ...data };
  
  // Recompute score and level if likelihood or severity changed
  if (data.likelihood !== undefined || data.severity !== undefined) {
    const likelihood: Likelihood = data.likelihood ?? existing.likelihood as Likelihood;
    const severity: Severity = data.severity ?? existing.severity as Severity;
    updatedData.score = computeScore(likelihood, severity);
    updatedData.level = computeLevel(updatedData.score);
  }
  
  return prisma.risk.update({
    where: { id },
    data: updatedData,
  });
}

/**
 * Deletes a risk by ID
 */
export async function deleteRisk(id: string): Promise<void> {
  await prisma.risk.delete({ where: { id } });
}

/**
 * Gets a risk by ID
 */
export async function getRisk(id: string): Promise<Risk | null> {
  return prisma.risk.findUnique({ where: { id } });
}
