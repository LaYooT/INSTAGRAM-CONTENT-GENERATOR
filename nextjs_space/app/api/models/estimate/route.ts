
/**
 * API Route : Estimation du coût
 * POST /api/models/estimate
 * Body: { imageModel, videoModel, variations }
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { imageModel, videoModel, variations = 3 } = await request.json();

    // Récupérer les modèles depuis la base
    const imgModel = await prisma.modelCatalog.findUnique({
      where: { endpoint: imageModel }
    });

    const vidModel = await prisma.modelCatalog.findUnique({
      where: { endpoint: videoModel }
    });

    if (!imgModel || !vidModel) {
      return NextResponse.json(
        { error: 'Model not found' },
        { status: 404 }
      );
    }

    // Calcul du coût
    const imageCost = imgModel.pricePerUnit * (imgModel.priceUnit === 'megapixel' ? 1 : 1);
    const videoCost = vidModel.pricePerUnit * variations;
    const totalCost = imageCost + videoCost;

    const estimate = {
      imageCost,
      videoCost,
      totalCost,
      breakdown: {
        image: {
          model: imgModel.name,
          cost: imageCost,
          priceUnit: imgModel.priceUnit
        },
        video: {
          model: vidModel.name,
          cost: videoCost,
          count: variations,
          pricePerVideo: vidModel.pricePerUnit,
          priceUnit: vidModel.priceUnit
        }
      }
    };

    return NextResponse.json({ estimate });
  } catch (error) {
    console.error('Error estimating cost:', error);
    return NextResponse.json(
      { error: 'Failed to estimate cost' },
      { status: 500 }
    );
  }
}
