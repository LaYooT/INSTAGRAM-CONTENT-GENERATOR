
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateAnimatedVideo } from "@/lib/media-generator";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 minutes

/**
 * POST /api/jobs/[id]/generate-variations
 * Generate multiple variations (2-4) with same parameters
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

    const body = await request.json();
    const count = Math.min(Math.max(body.count || 2, 1), 4); // Between 1 and 4

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
        error: "Cannot generate variations: Original job incomplete" 
      }, { status: 400 });
    }

    console.log(`Generating ${count} variations for job ${params.id}`);

    const variations = [];
    const cost = 0.035; // Approximate cost per video generation

    // Generate variations in parallel
    const promises = Array(count).fill(null).map(async () => {
      const videoUrl = await generateAnimatedVideo({
        imageUrl: originalJob.transformedImageUrl!,
        prompt: originalJob.videoPrompt!,
        duration: 5,
      });

      return prisma.jobVariation.create({
        data: {
          jobId: originalJob.id,
          videoUrl: videoUrl,
          thumbnailUrl: originalJob.transformedImageUrl,
          cost: cost,
        }
      });
    });

    const results = await Promise.all(promises);
    variations.push(...results);

    console.log(`Created ${variations.length} variations for job ${params.id}`);

    // Serialize dates
    const serializedVariations = variations.map(v => ({
      ...v,
      createdAt: v.createdAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      count: variations.length,
      variations: serializedVariations,
      totalCost: cost * variations.length,
    });

  } catch (error) {
    console.error('Variation generation failed:', error);
    return NextResponse.json(
      { 
        error: "Variation generation failed",
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}
