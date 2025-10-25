
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
        userId: session.user.id,
        status: 'COMPLETED'
      }
    });

    if (!job || !job.finalVideoUrl) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // In a real implementation, you would:
    // 1. Generate a signed URL from S3 for the video
    // 2. Return the signed URL for client-side download
    // 3. Or stream the file directly through this endpoint

    // For demo purposes, we'll redirect to the video URL
    return NextResponse.redirect(job.finalVideoUrl);

  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: "Failed to download file" }, 
      { status: 500 }
    );
  }
}
