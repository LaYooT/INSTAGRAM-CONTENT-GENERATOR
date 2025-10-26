
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { uploadFile, downloadFile } from "@/lib/s3";
import {
  generateTransformedImage,
  generateAnimatedVideo,
  formatForInstagram,
} from "@/lib/media-generator";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const imagePrompt = formData.get("imagePrompt") as string;
    const videoPrompt = formData.get("videoPrompt") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!imagePrompt || !videoPrompt) {
      return NextResponse.json(
        { error: "Image and video prompts are required" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
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
        imagePrompt: imagePrompt,
        videoPrompt: videoPrompt,
        status: "PENDING",
        progress: 0,
        currentStage: "TRANSFORM",
      },
    });

    // Start processing asynchronously
    processJobAsync(job.id, cloudStoragePath, imagePrompt, videoPrompt);

    return NextResponse.json({
      jobId: job.id,
      message: "File uploaded successfully",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}

async function processJobAsync(
  jobId: string,
  originalImageUrl: string,
  imagePrompt: string,
  videoPrompt: string
) {
  try {
    // Stage 1: Transform Image with AI
    await updateJob(jobId, "PROCESSING", 10, "TRANSFORM");

    console.log(`[Job ${jobId}] Starting image transformation...`);
    const transformedImageUrl = await generateTransformedImage({
      sourceImageUrl: originalImageUrl,
      prompt: imagePrompt,
    });

    await updateJob(jobId, "PROCESSING", 40, "TRANSFORM", {
      transformedImageUrl,
    });

    // Stage 2: Animate - Generate Video from Image
    await updateJob(jobId, "PROCESSING", 50, "ANIMATE");

    console.log(`[Job ${jobId}] Starting video animation...`);
    const animatedVideoUrl = await generateAnimatedVideo({
      imageUrl: transformedImageUrl,
      prompt: videoPrompt,
      duration: 15,
    });

    await updateJob(jobId, "PROCESSING", 80, "ANIMATE", {
      animatedVideoUrl,
    });

    // Stage 3: Format for Instagram Reels
    await updateJob(jobId, "PROCESSING", 90, "FORMAT");

    console.log(`[Job ${jobId}] Formatting for Instagram...`);
    const finalVideoUrl = await formatForInstagram(animatedVideoUrl);

    await updateJob(jobId, "PROCESSING", 95, "FORMAT");

    // Calculate total cost (Image: ~$0.025, Video: ~$0.05)
    const imageCost = 0.025; // Flux Dev image transformation
    const videoCost = 0.05;  // Luma Dream Machine video generation
    const totalCost = imageCost + videoCost;

    // Complete with cost tracking
    await updateJobWithCost(jobId, "COMPLETED", 100, "COMPLETED", {
      finalVideoUrl,
    }, totalCost);

    console.log(`[Job ${jobId}] Processing completed successfully! Total cost: $${totalCost}`);
  } catch (error) {
    console.error(`[Job ${jobId}] Processing error:`, error);
    await updateJob(
      jobId,
      "FAILED",
      0,
      "TRANSFORM",
      {},
      error instanceof Error ? error.message : "Processing failed"
    );
  }
}

async function updateJob(
  jobId: string,
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED",
  progress: number,
  currentStage: "TRANSFORM" | "ANIMATE" | "FORMAT" | "COMPLETED",
  urls: {
    transformedImageUrl?: string;
    animatedVideoUrl?: string;
    finalVideoUrl?: string;
  } = {},
  errorMessage?: string
) {
  const updateData: any = {
    status,
    progress,
    currentStage,
    updatedAt: new Date(),
  };

  if (urls.transformedImageUrl)
    updateData.transformedImageUrl = urls.transformedImageUrl;
  if (urls.animatedVideoUrl)
    updateData.animatedVideoUrl = urls.animatedVideoUrl;
  if (urls.finalVideoUrl) updateData.finalVideoUrl = urls.finalVideoUrl;
  if (errorMessage) updateData.errorMessage = errorMessage;
  if (status === "COMPLETED") updateData.completedAt = new Date();

  await prisma.contentJob.update({
    where: { id: jobId },
    data: updateData,
  });
}

async function updateJobWithCost(
  jobId: string,
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED",
  progress: number,
  currentStage: "TRANSFORM" | "ANIMATE" | "FORMAT" | "COMPLETED",
  urls: {
    transformedImageUrl?: string;
    animatedVideoUrl?: string;
    finalVideoUrl?: string;
  } = {},
  cost: number
) {
  const updateData: any = {
    status,
    progress,
    currentStage,
    updatedAt: new Date(),
    cost, // Add cost tracking
  };

  if (urls.transformedImageUrl)
    updateData.transformedImageUrl = urls.transformedImageUrl;
  if (urls.animatedVideoUrl)
    updateData.animatedVideoUrl = urls.animatedVideoUrl;
  if (urls.finalVideoUrl) updateData.finalVideoUrl = urls.finalVideoUrl;
  if (status === "COMPLETED") updateData.completedAt = new Date();

  await prisma.contentJob.update({
    where: { id: jobId },
    data: updateData,
  });
}
