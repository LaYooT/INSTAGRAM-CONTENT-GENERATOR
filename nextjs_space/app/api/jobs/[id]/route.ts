
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { deleteFile } from "@/lib/s3";
import { getBucketConfig } from "@/lib/aws-config";

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

    // Get folder prefix for S3 file identification
    const { folderPrefix } = getBucketConfig();

    // Fetch all variations before deletion
    const variations = await prisma.jobVariation.findMany({
      where: { jobId: params.id },
      select: { videoUrl: true, thumbnailUrl: true }
    });

    // Delete associated files from S3
    try {
      // Delete job files
      if (job.originalImageUrl?.startsWith(folderPrefix || '')) {
        await deleteFile(job.originalImageUrl);
        console.log(`Deleted S3 file: ${job.originalImageUrl}`);
      }
      if (job.transformedImageUrl?.startsWith(folderPrefix || '')) {
        await deleteFile(job.transformedImageUrl);
        console.log(`Deleted S3 file: ${job.transformedImageUrl}`);
      }
      if (job.animatedVideoUrl?.startsWith(folderPrefix || '')) {
        await deleteFile(job.animatedVideoUrl);
        console.log(`Deleted S3 file: ${job.animatedVideoUrl}`);
      }
      if (job.finalVideoUrl?.startsWith(folderPrefix || '')) {
        await deleteFile(job.finalVideoUrl);
        console.log(`Deleted S3 file: ${job.finalVideoUrl}`);
      }

      // Delete variation files
      for (const variation of variations) {
        if (variation.videoUrl?.startsWith(folderPrefix || '')) {
          await deleteFile(variation.videoUrl);
          console.log(`Deleted S3 variation video: ${variation.videoUrl}`);
        }
        if (variation.thumbnailUrl?.startsWith(folderPrefix || '')) {
          await deleteFile(variation.thumbnailUrl);
          console.log(`Deleted S3 variation thumbnail: ${variation.thumbnailUrl}`);
        }
      }
    } catch (s3Error) {
      console.error('Failed to cleanup S3 files:', s3Error);
      // Continue with DB deletion even if S3 cleanup fails
      // This prevents orphaned DB records if S3 is unavailable
    }

    // Delete the job (cascades to variations via Prisma schema)
    await prisma.contentJob.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: "Job deleted successfully" });

  } catch (error) {
    console.error('Failed to delete job:', error);
    return NextResponse.json(
      { error: "Failed to delete job" }, 
      { status: 500 }
    );
  }
}
