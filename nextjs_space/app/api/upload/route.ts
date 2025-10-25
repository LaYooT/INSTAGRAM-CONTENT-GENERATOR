
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { uploadFile } from "@/lib/s3";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 });
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large" }, { status: 400 });
    }

    // Upload to S3
    const buffer = Buffer.from(await file.arrayBuffer());
    const cloudStoragePath = await uploadFile(buffer, file.name);

    // Create job in database
    const job = await prisma.contentJob.create({
      data: {
        userId: session.user.id,
        originalImageUrl: cloudStoragePath,
        status: 'PENDING',
        progress: 0,
        currentStage: 'TRANSFORM'
      }
    });

    // Start processing (in a real app, this would be queued)
    // For demo purposes, we'll simulate the processing
    processJobAsync(job.id);

    return NextResponse.json({ 
      jobId: job.id,
      message: "File uploaded successfully" 
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: "Failed to upload file" }, 
      { status: 500 }
    );
  }
}

// Simulate AI processing pipeline
async function processJobAsync(jobId: string) {
  try {
    // Stage 1: Transform (simulate AI image transformation)
    await updateJob(jobId, 'PROCESSING', 10, 'TRANSFORM');
    await delay(5000); // Simulate processing time
    
    await updateJob(jobId, 'PROCESSING', 40, 'TRANSFORM');
    await delay(3000);

    // Stage 2: Animate (simulate video generation)
    await updateJob(jobId, 'PROCESSING', 50, 'ANIMATE');
    await delay(8000);
    
    await updateJob(jobId, 'PROCESSING', 80, 'ANIMATE');
    await delay(5000);

    // Stage 3: Format (simulate Instagram optimization)
    await updateJob(jobId, 'PROCESSING', 90, 'FORMAT');
    await delay(3000);

    // Complete (in a real app, this would have actual video URLs)
    await updateJob(jobId, 'COMPLETED', 100, 'COMPLETED', {
      transformedImageUrl: 'demo-transformed-image.jpg',
      animatedVideoUrl: 'demo-animated-video.mp4',
      finalVideoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1080x1920_30fps_2MB.mp4' // Demo video
    });

  } catch (error) {
    console.error('Processing error:', error);
    await updateJob(jobId, 'FAILED', 0, 'TRANSFORM', {}, 'Processing failed');
  }
}

async function updateJob(
  jobId: string, 
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED',
  progress: number,
  currentStage: 'TRANSFORM' | 'ANIMATE' | 'FORMAT' | 'COMPLETED',
  urls: any = {},
  errorMessage?: string
) {
  const updateData: any = {
    status,
    progress,
    currentStage,
    updatedAt: new Date()
  };

  if (urls.transformedImageUrl) updateData.transformedImageUrl = urls.transformedImageUrl;
  if (urls.animatedVideoUrl) updateData.animatedVideoUrl = urls.animatedVideoUrl;
  if (urls.finalVideoUrl) updateData.finalVideoUrl = urls.finalVideoUrl;
  if (errorMessage) updateData.errorMessage = errorMessage;
  if (status === 'COMPLETED') updateData.completedAt = new Date();

  await prisma.contentJob.update({
    where: { id: jobId },
    data: updateData
  });
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
