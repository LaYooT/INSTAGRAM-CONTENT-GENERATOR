

/**
 * FAL.ai API Integration
 * Handles image generation and video animation using FAL.ai API
 * Documentation: https://fal.ai/docs
 */

import * as fal from '@fal-ai/serverless-client';

const FAL_API_KEY = process.env.FAL_API_KEY || '';

// Type definitions for FAL.ai responses
interface FalImageOutput {
  images: Array<{ url: string; content_type?: string; width?: number; height?: number }>;
}

interface FalVideoOutput {
  video: { url: string; content_type?: string };
}

/**
 * Initialize FAL.ai client
 */
function initializeFalClient(): void {
  const apiKey = FAL_API_KEY;
  if (!apiKey) {
    throw new Error('FAL.ai API key not configured. Please set FAL_API_KEY in environment variables.');
  }
  
  fal.config({
    credentials: apiKey,
  });
}

/**
 * Transform an image using AI (image-to-image with Flux)
 * Uses Flux Dev model for high-quality image generation
 */
export async function transformImageWithAI(
  imageUrl: string,
  prompt: string
): Promise<string> {
  console.log('Transforming image with FAL.ai Flux:', { imageUrl, prompt });

  try {
    initializeFalClient();

    const result = (await fal.subscribe('fal-ai/flux/dev/image-to-image', {
      input: {
        prompt: prompt,
        image_url: imageUrl,
        image_size: {
          width: 1080,
          height: 1920
        },
        num_inference_steps: 28,
        guidance_scale: 3.5,
        num_images: 1,
        enable_safety_checker: true,
        output_format: 'jpeg',
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === 'IN_PROGRESS') {
          console.log('Image transformation in progress...');
        }
      },
    })) as { data: FalImageOutput };

    const data = result.data;
    
    // Extract URL from output
    if (!data || !data.images || data.images.length === 0) {
      throw new Error('No images returned from FAL.ai');
    }

    const imageUrlResult = data.images[0].url;
    
    console.log('Image transformation completed:', imageUrlResult);

    return imageUrlResult;
  } catch (error) {
    console.error('FAL.ai image transformation error:', error);
    throw new Error(
      `FAL.ai API error: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Generate animated video from image using AI
 * Uses Luma Dream Machine for video generation
 */
export async function generateVideoFromImage(
  imageUrl: string,
  prompt: string,
  duration: number = 5
): Promise<string> {
  console.log('Generating video with FAL.ai Luma:', {
    imageUrl,
    prompt,
    duration,
  });

  try {
    initializeFalClient();

    const result = (await fal.subscribe('fal-ai/luma-dream-machine/image-to-video', {
      input: {
        prompt: prompt,
        keyframes: {
          frame0: {
            type: 'image',
            url: imageUrl
          }
        },
        aspect_ratio: '9:16', // Instagram Reels format
        loop: false,
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === 'IN_PROGRESS') {
          console.log('Video generation in progress...');
        }
      },
    })) as { data: FalVideoOutput };

    const data = result.data;
    
    // Extract URL from output
    if (!data || !data.video || !data.video.url) {
      throw new Error('No video returned from FAL.ai');
    }

    const videoUrl = data.video.url;
    
    console.log('Video generation completed:', videoUrl);

    return videoUrl;
  } catch (error) {
    console.error('FAL.ai video generation error:', error);
    throw new Error(
      `FAL.ai API error: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Upscale an image for better quality using Flux Pro
 */
export async function upscaleImage(imageUrl: string): Promise<string> {
  console.log('Upscaling image with FAL.ai:', imageUrl);

  try {
    initializeFalClient();

    const result = (await fal.subscribe('fal-ai/flux-pro', {
      input: {
        prompt: 'high quality, detailed, sharp, professional photography',
        image_url: imageUrl,
        image_size: {
          width: 1080,
          height: 1920
        },
        num_inference_steps: 50,
        guidance_scale: 4.0,
        num_images: 1,
        enable_safety_checker: true,
        output_format: 'jpeg',
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === 'IN_PROGRESS') {
          console.log('Image upscaling in progress...');
        }
      },
    })) as { data: FalImageOutput };

    const data = result.data;
    
    if (!data || !data.images || data.images.length === 0) {
      throw new Error('No images returned from FAL.ai');
    }

    const upscaledUrl = data.images[0].url;
    
    console.log('Image upscaling completed:', upscaledUrl);

    return upscaledUrl;
  } catch (error) {
    console.error('FAL.ai upscaling error:', error);
    throw new Error(
      `FAL.ai API error: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Estimate cost for operations
 * FAL.ai pricing (approximate):
 * - Flux Dev: ~$0.025 per image
 * - Luma Dream Machine: ~$0.05 per video
 */
export function estimateCost(operations: {
  images?: number;
  videos?: number;
  videoDuration?: number;
}): number {
  const imageCost = 0.025; // $0.025 per image
  const videoCost = 0.05; // ~$0.05 per video

  let total = 0;

  if (operations.images) {
    total += operations.images * imageCost;
  }

  if (operations.videos) {
    total += operations.videos * videoCost;
  }

  return total;
}
