
/**
 * API Route : Préférences de modèles utilisateur
 * GET /api/models/preferences - Récupérer les préférences
 * PUT /api/models/preferences - Mettre à jour les préférences
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    let preferences = await prisma.modelPreferences.findUnique({
      where: { userId: session.user.id }
    });

    // Créer les préférences par défaut si elles n'existent pas
    if (!preferences) {
      preferences = await prisma.modelPreferences.create({
        data: {
          userId: session.user.id,
          imageModel: 'fal-ai/flux/dev/image-to-image',
          imageToVideoModel: 'fal-ai/luma-dream-machine/image-to-video',
          prioritizeQuality: true,
          prioritizeCost: false,
          prioritizeSpeed: false
        }
      });
    }

    return NextResponse.json({ preferences });
  } catch (error) {
    console.error('Error fetching preferences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch preferences' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();

    const preferences = await prisma.modelPreferences.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        ...data
      },
      update: data
    });

    return NextResponse.json({ preferences });
  } catch (error) {
    console.error('Error updating preferences:', error);
    return NextResponse.json(
      { error: 'Failed to update preferences' },
      { status: 500 }
    );
  }
}
