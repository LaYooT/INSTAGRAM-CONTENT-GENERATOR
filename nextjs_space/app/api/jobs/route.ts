
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const jobs = await prisma.contentJob.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50 // Limit to last 50 jobs
    });

    // Convert dates to strings to avoid serialization issues
    const serializedJobs = jobs.map(job => ({
      ...job,
      createdAt: job.createdAt.toISOString(),
      updatedAt: job.updatedAt.toISOString(),
      completedAt: job.completedAt?.toISOString() || null
    }));

    return NextResponse.json(serializedJobs);

  } catch (error) {
    console.error('Failed to fetch jobs:', error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" }, 
      { status: 500 }
    );
  }
}
