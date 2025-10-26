

/**
 * FAL.ai API Integration
 * Handles image generation and video animation using FAL.ai API
 * Documentation: https://fal.ai/docs
 */

const FAL_API_KEY = process.env.FAL_API_KEY || '';
const FAL_API_URL = 'https://queue.fal.run';

interface FalResponse {
  request_id?: string;
  status?: 'IN_QUEUE' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  images?: Array<{ url: string; content_type?: string }>;
  video?: { url: string };
  error?: string;
}

/**
 * Load API key from environment variables
 */
function loadApiKey(): string {
  const apiKey = FAL_API_KEY;
  if (!apiKey) {
    throw new Error('FAL.ai API key not configured. Please set FAL_API_KEY in environment variables.');
  }
  return apiKey;
}

/**
 * Make a request to FAL.ai API
 */
async function makeFalRequest(
  endpoint: string,
  method: 'GET' | 'POST' = 'POST',
  body?: any
): Promise<any> {
  const apiKey = loadApiKey();

  console.log(`Making FAL.ai ${method} request to ${endpoint}`);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Key ${apiKey}`,
  };

  const options: RequestInit = {
    method,
    headers,
  };

  if (body && method === 'POST') {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${FAL_API_URL}${endpoint}`, options);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('FAL.ai API error:', {
      status: response.status,
      statusText: response.statusText,
      body: errorText,
    });
    throw new Error(
      `FAL.ai API error: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  const data = await response.json();
  return data;
}

/**
 * Poll request status until completion
 */
async function pollRequestStatus(
  endpoint: string,
  requestId: string,
  maxAttempts: number = 60,
  delayMs: number = 3000
): Promise<any> {
  console.log(`Polling request ${requestId} for completion...`);

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const statusUrl = `${endpoint}/requests/${requestId}/status`;
    const status = await makeFalRequest(statusUrl, 'GET');

    console.log(`Request ${requestId} status (attempt ${attempt}/${maxAttempts}):`, status.status);

    if (status.status === 'COMPLETED') {
      console.log(`Request ${requestId} completed successfully`);
      // Get the final result
      const resultUrl = `${endpoint}/requests/${requestId}`;
      const result = await makeFalRequest(resultUrl, 'GET');
      return result;
    }

    if (status.status === 'FAILED') {
      const error = status.error || 'Unknown error';
      throw new Error(`Request failed: ${error}`);
    }

    // Wait before next poll
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  throw new Error(`Request ${requestId} timed out after ${maxAttempts} attempts`);
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

  const payload = {
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
  };

  // Start the task
  const taskResponse = await makeFalRequest('/fal-ai/flux/dev/image-to-image', 'POST', payload);
  
  if (!taskResponse.request_id) {
    // If completed immediately, return the result
    if (taskResponse.images && taskResponse.images.length > 0) {
      return taskResponse.images[0].url;
    }
    throw new Error('No request ID or images returned from FAL.ai');
  }

  console.log(`Image transformation task created: ${taskResponse.request_id}`);

  // Poll for completion
  const completedTask = await pollRequestStatus('/fal-ai/flux/dev/image-to-image', taskResponse.request_id);

  // Extract URL from output
  if (!completedTask.images || completedTask.images.length === 0) {
    throw new Error('No images returned from FAL.ai');
  }

  const imageUrlResult = completedTask.images[0].url;
  
  console.log('Image transformation completed:', imageUrlResult);

  return imageUrlResult;
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

  const payload = {
    prompt: prompt,
    keyframes: {
      frame0: {
        type: 'image',
        url: imageUrl
      }
    },
    aspect_ratio: '9:16', // Instagram Reels format
    loop: false,
  };

  // Start the task
  const taskResponse = await makeFalRequest('/fal-ai/luma-dream-machine/image-to-video', 'POST', payload);
  
  if (!taskResponse.request_id) {
    // If completed immediately, return the result
    if (taskResponse.video && taskResponse.video.url) {
      return taskResponse.video.url;
    }
    throw new Error('No request ID or video returned from FAL.ai');
  }

  console.log(`Video generation task created: ${taskResponse.request_id}`);

  // Poll for completion (video takes longer, so more attempts and longer delays)
  const completedTask = await pollRequestStatus('/fal-ai/luma-dream-machine/image-to-video', taskResponse.request_id, 120, 5000);

  // Extract URL from output
  if (!completedTask.video || !completedTask.video.url) {
    throw new Error('No video returned from FAL.ai');
  }

  const videoUrl = completedTask.video.url;
  
  console.log('Video generation completed:', videoUrl);

  return videoUrl;
}

/**
 * Upscale an image for better quality using Flux Pro
 */
export async function upscaleImage(imageUrl: string): Promise<string> {
  console.log('Upscaling image with FAL.ai:', imageUrl);

  const payload = {
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
  };

  const taskResponse = await makeFalRequest('/fal-ai/flux-pro', 'POST', payload);
  
  if (!taskResponse.request_id) {
    if (taskResponse.images && taskResponse.images.length > 0) {
      return taskResponse.images[0].url;
    }
    throw new Error('No request ID or images returned from FAL.ai');
  }

  const completedTask = await pollRequestStatus('/fal-ai/flux-pro', taskResponse.request_id);

  if (!completedTask.images || completedTask.images.length === 0) {
    throw new Error('No images returned from FAL.ai');
  }

  const upscaledUrl = completedTask.images[0].url;
  
  console.log('Image upscaling completed:', upscaledUrl);

  return upscaledUrl;
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
