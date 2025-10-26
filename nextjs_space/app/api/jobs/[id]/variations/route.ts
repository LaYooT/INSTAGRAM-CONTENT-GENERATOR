
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * GET /api/jobs/[id]/variations
 * Get all variations for a job
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    // Get all variations
    const variations = await prisma.jobVariation.findMany({
      where: { jobId: params.id },
      orderBy: { createdAt: 'desc' }
    });

    // Serialize dates
    const serializedVariations = variations.map(v => ({
      ...v,
      createdAt: v.createdAt.toISOString(),
    }));

    return NextResponse.json(serializedVariations);

  } catch (error) {
    console.error('Failed to fetch variations:', error);
    return NextResponse.json(
      { error: "Failed to fetch variations" }, 
      { status: 500 }
    );
  }
}
