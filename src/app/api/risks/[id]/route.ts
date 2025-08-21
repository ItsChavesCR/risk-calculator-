import { NextRequest, NextResponse } from 'next/server';
import { updateRisk, deleteRisk, getRisk } from '@/services/risk-service';
import { updateRiskSchema } from '@/lib/validation';
import { createApiError } from '@/lib/errors';

/**
 * PATCH /api/risks/[id] - Update a risk
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  // Skip during build time
  if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
    const apiError = createApiError(503, 'Service temporarily unavailable');
    return NextResponse.json(apiError, { status: 503 });
  }

  try {
    const { id } = params;
    
    if (!id) {
      const apiError = createApiError(400, 'Risk ID is required');
      return NextResponse.json(apiError, { status: 400 });
    }
    
    const body = await request.json();
    
    const validationResult = updateRiskSchema.safeParse(body);
    if (!validationResult.success) {
      const apiError = createApiError(400, 'Invalid request data');
      return NextResponse.json(apiError, { status: 400 });
    }
    
    const risk = await updateRisk(id, validationResult.data);
    
    return NextResponse.json(risk);
  } catch (error) {
    console.error('Error updating risk:', error);
    
    if (error instanceof Error && error.message === 'Risk not found') {
      const apiError = createApiError(404, 'Risk not found');
      return NextResponse.json(apiError, { status: 404 });
    }
    
    const apiError = createApiError(500, 'Internal server error');
    return NextResponse.json(apiError, { status: 500 });
  }
}

/**
 * DELETE /api/risks/[id] - Delete a risk
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  // Skip during build time
  if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
    const apiError = createApiError(503, 'Service temporarily unavailable');
    return NextResponse.json(apiError, { status: 503 });
  }

  try {
    const { id } = params;
    
    if (!id) {
      const apiError = createApiError(400, 'Risk ID is required');
      return NextResponse.json(apiError, { status: 400 });
    }
    
    await deleteRisk(id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting risk:', error);
    
    if (error instanceof Error && error.message === 'Risk not found') {
      const apiError = createApiError(404, 'Risk not found');
      return NextResponse.json(apiError, { status: 404 });
    }
    
    const apiError = createApiError(500, 'Internal server error');
    return NextResponse.json(apiError, { status: 500 });
  }
}
