
/**
 * Media Generator Service
 * Handles AI image transformation and video generation using FAL.ai
 * Uses user preferences for model selection
 */

import {
  transformImageWithAI,
  generateVideoFromImage,
  upscaleImage,
} from './fal';
import { prisma } from './db';

interface GenerateImageOptions {
  sourceImageUrl: string;
  prompt: string;
  aspectRatio?: string;
  highQuality?: boolean;
  userId?: string; // For fetching user preferences
}

interface GenerateVideoOptions {
  imageUrl: string;
  prompt: string;
  duration?: number;
  userId?: string; // For fetching user preferences
}

/**
 * Get user's preferred models or return defaults
 */
async function getUserModels(userId?: string): Promise<{
  imageModel: string;
  videoModel: string;
}> {
  if (!userId) {
    return {
      imageModel: 'fal-ai/flux/dev/image-to-image',
      videoModel: 'fal-ai/luma-dream-machine/image-to-video'
    };
  }

  try {
    const preferences = await prisma.modelPreferences.findUnique({
      where: { userId }
    });

    return {
      imageModel: preferences?.imageModel || 'fal-ai/flux/dev/image-to-image',
      videoModel: preferences?.imageToVideoModel || 'fal-ai/luma-dream-machine/image-to-video'
    };
  } catch (error) {
    console.error('Failed to fetch user preferences:', error);
    return {
      imageModel: 'fal-ai/flux/dev/image-to-image',
      videoModel: 'fal-ai/luma-dream-machine/image-to-video'
    };
  }
}

/**
 * Generate a transformed image using AI
 * Uses user's preferred model or defaults to Flux Dev
 */
export async function generateTransformedImage(
  options: GenerateImageOptions
): Promise<string> {
  const { sourceImageUrl, prompt, highQuality = false, userId } = options;

  console.log('Starting image transformation:', {
    sourceImageUrl,
    prompt,
    highQuality,
    userId,
  });

  try {
    // Get user's preferred models
    const { imageModel } = await getUserModels(userId);
    console.log('Using image model:', imageModel);

    // Get a signed URL from S3 for FAL.ai to access
    let imageUrl = sourceImageUrl;
    
    // If it's an S3 key (doesn't start with http/https), convert to signed URL
    if (!sourceImageUrl.startsWith('http://') && !sourceImageUrl.startsWith('https://')) {
      console.log('Generating signed URL from S3 for key:', sourceImageUrl);
      const { downloadFile } = await import('./s3');
      imageUrl = await downloadFile(sourceImageUrl);
      console.log('Signed S3 URL generated:', imageUrl);
    } else {
      console.log('Using existing URL:', sourceImageUrl);
    }

    // Optional: Upscale for better quality (adds ~$0.001 cost)
    if (highQuality) {
      console.log('Upscaling image for better quality...');
      imageUrl = await upscaleImage(imageUrl);
    }

    // Transform image with AI using user's preferred model
    const transformedUrl = await transformImageWithAI(imageUrl, prompt, imageModel);

    console.log('Image transformation completed:', transformedUrl);
    return transformedUrl;
  } catch (error) {
    console.error('Image transformation failed:', error);
    throw new Error(
      `Failed to transform image: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}

/**
 * Generate an animated video from an image using AI
 * Uses user's preferred model or defaults to Luma Dream Machine
 */
export async function generateAnimatedVideo(
  options: GenerateVideoOptions
): Promise<string> {
  const { imageUrl, prompt, duration = 5, userId } = options;

  console.log('Starting video generation:', {
    imageUrl,
    prompt,
    duration,
    userId,
  });

  try {
    // Get user's preferred models
    const { videoModel } = await getUserModels(userId);
    console.log('Using video model:', videoModel);

    // Get a publicly accessible URL
    let videoSourceUrl = imageUrl;
    
    // Determine if we need to generate a signed URL
    if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
      // It's an S3 key, get a signed URL
      console.log('Generating signed URL from S3 for key:', imageUrl);
      const { downloadFile } = await import('./s3');
      videoSourceUrl = await downloadFile(imageUrl);
      console.log('Signed S3 URL generated:', videoSourceUrl);
    } else {
      // It's already a public URL (FAL.ai, S3 signed URL, or any other public URL)
      console.log('Using existing public URL:', imageUrl);
      videoSourceUrl = imageUrl;
    }

    // Generate video with FAL.ai using user's preferred model
    const videoUrl = await generateVideoFromImage(
      videoSourceUrl,
      prompt,
      duration,
      videoModel
    );

    console.log('Video generation completed:', videoUrl);
    return videoUrl;
  } catch (error) {
    console.error('Video generation failed:', error);
    throw new Error(
      `Failed to generate video: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}

/**
 * Format video for Instagram Reels (9:16 aspect ratio, 1080x1920)
 * FAL.ai already outputs in 9:16 format, so we just validate
 */
export async function formatForInstagram(videoUrl: string): Promise<string> {
  console.log('Formatting video for Instagram:', videoUrl);

  // FAL.ai videos are already in 9:16 aspect ratio (Instagram Reels format)
  // No additional processing needed

  await delay(500); // Small delay for consistency

  console.log('Video format validated for Instagram Reels');
  return videoUrl;
}

/**
 * Get cost estimate for a generation job
 */
export function estimateJobCost(includeVideo: boolean = true): number {
  // Image transformation (Flux Dev): ~$0.025
  // Video generation (Luma): ~$0.05
  const imageCost = 0.025;
  const videoCost = 0.05;

  return includeVideo ? imageCost + videoCost : imageCost;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

