
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateAnimatedVideo } from "@/lib/media-generator";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 minutes

/**
 * POST /api/jobs/[id]/regenerate
 * Regenerate video with same parameters
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the original job
    const originalJob = await prisma.contentJob.findFirst({
      where: { 
        id: params.id,
        userId: session.user.id 
      }
    });

    if (!originalJob) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    if (!originalJob.transformedImageUrl || !originalJob.videoPrompt) {
      return NextResponse.json({ 
        error: "Cannot regenerate: Original job incomplete" 
      }, { status: 400 });
    }

    console.log(`Regenerating video for job ${params.id}`);

    // Generate new video with same parameters
    const newVideoUrl = await generateAnimatedVideo({
      imageUrl: originalJob.transformedImageUrl,
      prompt: originalJob.videoPrompt,
      duration: 5,
    });

    // Calculate cost (approximate)
    const cost = 0.035; // Approximate cost for video generation

    // Create a new variation
    const variation = await prisma.jobVariation.create({
      data: {
        jobId: originalJob.id,
        videoUrl: newVideoUrl,
        thumbnailUrl: originalJob.transformedImageUrl,
        cost: cost,
      }
    });

    console.log(`Created variation ${variation.id} for job ${params.id}`);

    return NextResponse.json({
      success: true,
      variation: {
        ...variation,
        createdAt: variation.createdAt.toISOString(),
      }
    });

  } catch (error) {
    console.error('Regeneration failed:', error);
    return NextResponse.json(
      { 
        error: "Regeneration failed",
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}
