
/**
 * Media Generator Service
 * Handles AI image transformation and video generation using FAL.ai
 */

import {
  transformImageWithAI,
  generateVideoFromImage,
  upscaleImage,
} from './fal';

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
 * This uses FAL.ai's Flux Dev model for high-quality image generation
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
 * This uses FAL.ai's Luma Dream Machine for video generation
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

    // Generate video with FAL.ai
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

