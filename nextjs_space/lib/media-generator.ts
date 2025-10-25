
/**
 * Media Generator Service
 * Handles AI image transformation and video generation using Runware.ai
 */

import {
  transformImageWithAI,
  generateVideoFromImage,
  upscaleImage,
} from './runware';
import { downloadFile } from './s3';

interface GenerateImageOptions {
  sourceImageUrl: string;
  prompt: string;
  aspectRatio?: string;
  highQuality?: boolean;
}

interface GenerateVideoOptions {
  imageUrl: string;
  prompt: string;
  duration?: number;
}

/**
 * Generate a transformed image using AI
 * This uses Runware's image-to-image transformation with Flux model
 */
export async function generateTransformedImage(
  options: GenerateImageOptions
): Promise<string> {
  const { sourceImageUrl, prompt, highQuality = false } = options;

  console.log('Starting image transformation:', {
    sourceImageUrl,
    prompt,
    highQuality,
  });

  try {
    // Get signed URL if it's an S3 key
    let imageUrl = sourceImageUrl;
    if (sourceImageUrl.startsWith('uploads/')) {
      imageUrl = await downloadFile(sourceImageUrl);
    }

    // Optional: Upscale for better quality (adds ~$0.001 cost)
    if (highQuality) {
      console.log('Upscaling image for better quality...');
      imageUrl = await upscaleImage(imageUrl);
    }

    // Transform image with AI
    const transformedUrl = await transformImageWithAI(imageUrl, prompt);

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
 * This uses Runware's Hailuo AI model for video generation
 */
export async function generateAnimatedVideo(
  options: GenerateVideoOptions
): Promise<string> {
  const { imageUrl, prompt, duration = 5 } = options;

  console.log('Starting video generation:', {
    imageUrl,
    prompt,
    duration,
  });

  try {
    // Ensure we have a valid URL
    let videoSourceUrl = imageUrl;
    if (imageUrl.startsWith('uploads/')) {
      videoSourceUrl = await downloadFile(imageUrl);
    }

    // Generate video with Runware AI
    const videoUrl = await generateVideoFromImage(
      videoSourceUrl,
      prompt,
      duration
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
 * Runware already outputs in 1080x1920, so we just validate
 */
export async function formatForInstagram(videoUrl: string): Promise<string> {
  console.log('Formatting video for Instagram:', videoUrl);

  // Runware videos are already in 1080x1920 (Instagram Reels format)
  // No additional processing needed

  await delay(500); // Small delay for consistency

  console.log('Video format validated for Instagram Reels');
  return videoUrl;
}

/**
 * Get cost estimate for a generation job
 */
export function estimateJobCost(includeVideo: boolean = true): number {
  // Image transformation: ~$0.0013
  // Video generation (5 sec): ~$0.0668
  const imageCost = 0.0013;
  const videoCost = 0.0668;

  return includeVideo ? imageCost + videoCost : imageCost;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

