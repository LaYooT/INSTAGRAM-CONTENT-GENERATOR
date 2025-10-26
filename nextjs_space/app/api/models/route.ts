
/**
 * API Route : Liste des modèles disponibles
 * GET /api/models?category=image|video
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const models = await prisma.modelCatalog.findMany({
      where: {
        ...(category && { category }),
        isActive: true
      },
      orderBy: [
        { qualityRating: 'desc' },
        { pricePerUnit: 'asc' }
      ]
    });

    return NextResponse.json({ models });
  } catch (error) {
    console.error('Error fetching models:', error);
    return NextResponse.json(
      { error: 'Failed to fetch models' },
      { status: 500 }
    );
  }
}
