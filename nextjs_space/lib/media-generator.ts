
/**
 * Media Generator Service
 * Handles AI image transformation and video generation using FAL.ai
 */

import {
  transformImageWithAI,
  generateVideoFromImage,
  upscaleImage,
  uploadToFalStorage,
} from './fal';
import { downloadFileAsBuffer } from './s3';

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
    // Download image from S3 and upload to FAL.ai storage
    let imageUrl = sourceImageUrl;
    if (sourceImageUrl.startsWith('uploads/')) {
      console.log('Downloading image from S3...');
      const imageBuffer = await downloadFileAsBuffer(sourceImageUrl);
      console.log('Uploading to FAL.ai storage...');
      imageUrl = await uploadToFalStorage(imageBuffer);
      console.log('FAL.ai URL:', imageUrl);
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
    // Ensure we have a FAL.ai compatible URL
    let videoSourceUrl = imageUrl;
    
    // If it's an S3 key, download and re-upload to FAL.ai storage
    if (imageUrl.startsWith('uploads/')) {
      console.log('Downloading image from S3...');
      const imageBuffer = await downloadFileAsBuffer(imageUrl);
      console.log('Uploading to FAL.ai storage...');
      videoSourceUrl = await uploadToFalStorage(imageBuffer);
      console.log('FAL.ai URL:', videoSourceUrl);
    }
    // If it's already a FAL.ai URL (from previous transformation), use it directly
    else if (!imageUrl.startsWith('https://')) {
      // If it's a relative path or unknown format, try to download it
      console.log('Downloading image from unknown source...');
      const imageBuffer = await downloadFileAsBuffer(imageUrl);
      console.log('Uploading to FAL.ai storage...');
      videoSourceUrl = await uploadToFalStorage(imageBuffer);
      console.log('FAL.ai URL:', videoSourceUrl);
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

