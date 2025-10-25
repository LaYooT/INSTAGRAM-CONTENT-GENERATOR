
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const job = await prisma.contentJob.findFirst({
      where: { 
        id: params.id,
        userId: session.user.id 
      }
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Convert dates to strings
    const serializedJob = {
      ...job,
      createdAt: job.createdAt.toISOString(),
      updatedAt: job.updatedAt.toISOString(),
      completedAt: job.completedAt?.toISOString() || null
    };

    return NextResponse.json(serializedJob);

  } catch (error) {
    console.error('Failed to fetch job:', error);
    return NextResponse.json(
      { error: "Failed to fetch job" }, 
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const job = await prisma.contentJob.findFirst({
      where: { 
        id: params.id,
        userId: session.user.id 
      }
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Delete the job
    await prisma.contentJob.delete({
      where: { id: params.id }
    });

    // In a real app, you would also delete files from S3 here
    // await deleteFile(job.originalImageUrl);
    // if (job.finalVideoUrl) await deleteFile(job.finalVideoUrl);

    return NextResponse.json({ message: "Job deleted successfully" });

  } catch (error) {
    console.error('Failed to delete job:', error);
    return NextResponse.json(
      { error: "Failed to delete job" }, 
      { status: 500 }
    );
  }
}
