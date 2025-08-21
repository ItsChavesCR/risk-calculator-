import { NextRequest, NextResponse } from 'next/server';
import { listRisks, createRisk } from '@/services/risk-service';
import { createRiskSchema } from '@/lib/validation';
import { createApiError } from '@/lib/errors';

/**
 * GET /api/risks - List risks with optional filtering
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || undefined;
    const level = searchParams.get('level') || undefined;
    
    const risks = await listRisks({ q, level });
    
    return NextResponse.json(risks);
  } catch (error) {
    console.error('Error listing risks:', error);
    const apiError = createApiError(500, 'Internal server error');
    return NextResponse.json(apiError, { status: 500 });
  }
}

/**
 * POST /api/risks - Create a new risk
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    
    const validationResult = createRiskSchema.safeParse(body);
    if (!validationResult.success) {
      const apiError = createApiError(400, 'Invalid request data');
      return NextResponse.json(apiError, { status: 400 });
    }
    
    const risk = await createRisk(validationResult.data);
    
    return NextResponse.json(risk, { status: 201 });
  } catch (error) {
    console.error('Error creating risk:', error);
    const apiError = createApiError(500, 'Internal server error');
    return NextResponse.json(apiError, { status: 500 });
  }
}
