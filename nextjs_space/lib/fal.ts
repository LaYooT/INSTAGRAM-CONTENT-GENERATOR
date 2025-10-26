

/**
 * FAL.ai API Integration
 * Handles image generation and video animation using FAL.ai API
 * Documentation: https://fal.ai/docs
 * MCP Documentation: https://docs.fal.ai/compute/mcp
 */

import { fal } from '@fal-ai/client';
import sharp from 'sharp';

const FAL_API_KEY = process.env.FAL_API_KEY || '';

// Type definitions for FAL.ai responses
interface FalImageOutput {
  images: Array<{ url: string; content_type?: string; width?: number; height?: number }>;
}

interface FalVideoOutput {
  video: { url: string; content_type?: string };
}

/**
 * Configure FAL.ai client globally once
 * This ensures the API key is properly set for all requests
 */
if (!FAL_API_KEY) {
  console.error('❌ ERREUR CRITIQUE: FAL_API_KEY manquante dans .env');
  console.error('   L\'application ne pourra pas générer de contenu.');
} else {
  console.log('✅ Configuration FAL.ai:', {
    hasApiKey: true,
    apiKeyLength: FAL_API_KEY.length,
    apiKeyFormat: FAL_API_KEY.includes(':') ? 'KEY:SECRET' : 'KEY'
  });
  
  // Configuration globale unique au chargement du module
  fal.config({
    credentials: FAL_API_KEY,
  });
}

/**
 * Upload an image buffer to FAL.ai storage
 * This ensures the image is accessible by FAL.ai APIs
 */
export async function uploadToFalStorage(imageBuffer: Buffer): Promise<string> {
  try {
    // Convert Buffer to Blob for FAL.ai
    const blob = new Blob([imageBuffer], { type: 'image/jpeg' });
    const url = await fal.storage.upload(blob);
    console.log('Image uploaded to FAL.ai storage:', url);
    return url;
  } catch (error) {
    console.error('Failed to upload to FAL.ai storage:', error);
    
    if (error && typeof error === 'object' && 'status' in error) {
      const apiError = error as any;
      if (apiError.status === 401) {
        throw new Error('FAL.ai Authentication failed. Check FAL_API_KEY in .env');
      }
    }
    
    throw new Error(
      `Failed to upload to FAL.ai storage: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}

/**
 * Resize an image to fit within FAL.ai video generation limits (1920x1920)
 * Downloads the image, resizes it while maintaining aspect ratio, and re-uploads
 */
export async function resizeImageForVideo(imageUrl: string): Promise<string> {
  const MAX_DIMENSION = 1920;
  
  console.log('Checking image dimensions for video generation:', imageUrl);
  
  try {
    // Download the image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Get image metadata to check dimensions
    const metadata = await sharp(buffer).metadata();
    const { width = 0, height = 0 } = metadata;
    
    console.log(`Original image dimensions: ${width}x${height}`);
    
    // Check if resizing is needed
    if (width <= MAX_DIMENSION && height <= MAX_DIMENSION) {
      console.log('✅ Image dimensions are within limits, no resizing needed');
      return imageUrl;
    }
    
    console.log(`⚠️ Image exceeds ${MAX_DIMENSION}x${MAX_DIMENSION}, resizing...`);
    
    // Resize image to fit within MAX_DIMENSION while maintaining aspect ratio
    const resizedBuffer = await sharp(buffer)
      .resize(MAX_DIMENSION, MAX_DIMENSION, {
        fit: 'inside', // Maintains aspect ratio
        withoutEnlargement: true, // Don't upscale smaller images
      })
      .jpeg({ quality: 90 }) // High quality JPEG output
      .toBuffer();
    
    const resizedMetadata = await sharp(resizedBuffer).metadata();
    console.log(`Resized dimensions: ${resizedMetadata.width}x${resizedMetadata.height}`);
    
    // Upload resized image to FAL.ai storage
    const resizedUrl = await uploadToFalStorage(resizedBuffer);
    console.log('✅ Resized image uploaded:', resizedUrl);
    
    return resizedUrl;
  } catch (error) {
    console.error('Failed to resize image:', error);
    throw new Error(
      `Failed to resize image: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}

/**
 * Transform an image using AI (image-to-image with Flux)
 * Uses Flux Dev model for high-quality image generation
 * Documentation: https://fal.ai/models/fal-ai/flux/dev/image-to-image/api
 */
export async function transformImageWithAI(
  imageUrl: string,
  prompt: string
): Promise<string> {
  console.log('Transforming image with FAL.ai Flux:', { imageUrl, prompt });

  try {
    const result = (await fal.subscribe('fal-ai/flux/dev/image-to-image', {
      input: {
        prompt: prompt,
        image_url: imageUrl,
        strength: 0.8, // Controls transformation intensity (0.1 = minimal, 1.0 = maximum)
        num_inference_steps: 28, // Recommended value per FAL.ai docs (was 40)
        guidance_scale: 3.5, // Adherence to the prompt
        num_images: 1,
        // REMOVED: output_format - not supported by flux/dev/image-to-image
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
    
    console.log('✅ Image transformation completed:', imageUrlResult);

    return imageUrlResult;
  } catch (error: any) {
    console.error('❌ FAL.ai image transformation error:', {
      status: error.status,
      message: error.message,
      body: error.body,
    });
    
    // Handle specific error cases
    if (error.status === 401) {
      throw new Error('FAL.ai Authentication failed. Check FAL_API_KEY in .env');
    }
    if (error.status === 422) {
      throw new Error(`FAL.ai Invalid parameters: ${JSON.stringify(error.body)}`);
    }
    
    throw new Error(
      `FAL.ai API error: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Generate animated video from image using AI
 * Uses Luma Dream Machine for video generation
 * Documentation: https://fal.ai/models/fal-ai/luma-dream-machine/image-to-video/api
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
    // Resize image to fit within FAL.ai limits (1920x1920)
    const resizedImageUrl = await resizeImageForVideo(imageUrl);
    
    const input = {
      prompt: prompt,
      image_url: resizedImageUrl,
      aspect_ratio: '9:16' as const, // Instagram Reels format (type-safe literal)
      loop: false,
    };
    
    console.log('Video generation input parameters:', JSON.stringify(input, null, 2));

    const result = (await fal.subscribe('fal-ai/luma-dream-machine/image-to-video', {
      input,
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
    
    console.log('✅ Video generation completed:', videoUrl);

    return videoUrl;
  } catch (error: any) {
    console.error('❌ FAL.ai video generation error:', {
      status: error.status,
      message: error.message,
      body: error.body,
    });
    
    // Handle specific error cases
    if (error.status === 401) {
      throw new Error('FAL.ai Authentication failed. Check FAL_API_KEY in .env');
    }
    if (error.status === 422) {
      throw new Error(`FAL.ai Invalid parameters: ${JSON.stringify(error.body)}`);
    }
    
    throw new Error(
      `FAL.ai API error: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Upscale an image for better quality using Flux Pro
 * Documentation: https://fal.ai/models/fal-ai/flux-pro/v1.1/image-to-image/api
 */
export async function upscaleImage(imageUrl: string): Promise<string> {
  console.log('Upscaling image with FAL.ai:', imageUrl);

  try {
    const result = (await fal.subscribe('fal-ai/flux-pro/v1.1/image-to-image', {
      input: {
        prompt: 'high quality, detailed, sharp, professional photography',
        image_url: imageUrl,
        strength: 0.5, // Lower strength to preserve more of the original
        num_inference_steps: 28, // Recommended value per FAL.ai docs (was 50)
        guidance_scale: 4.0,
        num_images: 1,
        // REMOVED: output_format - check if supported
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
    
    console.log('✅ Image upscaling completed:', upscaledUrl);

    return upscaledUrl;
  } catch (error: any) {
    console.error('❌ FAL.ai upscaling error:', {
      status: error.status,
      message: error.message,
      body: error.body,
    });
    
    // Handle specific error cases
    if (error.status === 401) {
      throw new Error('FAL.ai Authentication failed. Check FAL_API_KEY in .env');
    }
    if (error.status === 422) {
      throw new Error(`FAL.ai Invalid parameters: ${JSON.stringify(error.body)}`);
    }
    
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
