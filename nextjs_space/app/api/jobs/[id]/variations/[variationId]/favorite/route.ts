
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * POST /api/jobs/[id]/variations/[variationId]/favorite
 * Toggle favorite status of a variation
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; variationId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { isFavorite } = body;

    // Verify job ownership
    const job = await prisma.contentJob.findFirst({
      where: { 
        id: params.id,
        userId: session.user.id 
      }
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Update variation
    const variation = await prisma.jobVariation.update({
      where: { 
        id: params.variationId,
        jobId: params.id,
      },
      data: { isFavorite }
    });

    return NextResponse.json({
      success: true,
      variation: {
        ...variation,
        createdAt: variation.createdAt.toISOString(),
      }
    });

  } catch (error) {
    console.error('Failed to update favorite:', error);
    return NextResponse.json(
      { error: "Failed to update favorite" }, 
      { status: 500 }
    );
  }
}
