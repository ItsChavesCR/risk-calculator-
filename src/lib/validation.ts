import { z } from 'zod';
import type { Likelihood, Severity } from '@/domain/risk-domain';

export const createRiskSchema = z.object({
  hazard: z.string().min(1, 'Hazard is required'),
  likelihood: z.number().int().min(1).max(5) as z.ZodType<Likelihood>,
  severity: z.number().int().min(1).max(5) as z.ZodType<Severity>,
});

export const updateRiskSchema = z.object({
  hazard: z.string().min(1, 'Hazard is required').optional(),
  likelihood: z.number().int().min(1).max(5).optional() as z.ZodType<Likelihood | undefined>,
  severity: z.number().int().min(1).max(5).optional() as z.ZodType<Severity | undefined>,
});

export type CreateRiskInput = z.infer<typeof createRiskSchema>;
export type UpdateRiskInput = z.infer<typeof updateRiskSchema>;
