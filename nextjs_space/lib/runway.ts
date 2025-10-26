
/**
 * Runway ML API Integration
 * Handles image generation and video animation using Runway ML API
 * Documentation: https://docs.dev.runwayml.com
 */

const RUNWAY_API_KEY = process.env.RUNWAY_API_KEY || '';
const RUNWAY_API_URL = 'https://api.dev.runwayml.com';
const RUNWAY_API_VERSION = '2024-11-06';

interface RunwayTaskResponse {
  id: string;
  status?: 'PENDING' | 'RUNNING' | 'SUCCEEDED' | 'FAILED';
  output?: string[] | { url: string }[] | string;
  failure?: string;
  failureCode?: string;
}

/**
 * Load API key from environment variables
 */
function loadApiKey(): string {
  const apiKey = RUNWAY_API_KEY;
  if (!apiKey) {
    throw new Error('Runway ML API key not configured. Please set RUNWAY_API_KEY in environment variables.');
  }
  return apiKey;
}

/**
 * Make a request to Runway ML API
 */
async function makeRunwayRequest(
  endpoint: string,
  method: 'GET' | 'POST' = 'POST',
  body?: any
): Promise<any> {
  const apiKey = loadApiKey();

  console.log(`Making Runway ML ${method} request to ${endpoint}`);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
    'X-Runway-Version': RUNWAY_API_VERSION,
  };

  const options: RequestInit = {
    method,
    headers,
  };

  if (body && method === 'POST') {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${RUNWAY_API_URL}${endpoint}`, options);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Runway ML API error:', {
      status: response.status,
      statusText: response.statusText,
      body: errorText,
    });
    throw new Error(
      `Runway ML API error: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  const data = await response.json();
  return data;
}

/**
 * Poll task status until completion
 */
async function pollTaskStatus(
  taskId: string,
  maxAttempts: number = 60,
  delayMs: number = 5000
): Promise<RunwayTaskResponse> {
  console.log(`Polling task ${taskId} for completion...`);

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const task = await makeRunwayRequest(`/v1/tasks/${taskId}`, 'GET');

    console.log(`Task ${taskId} status (attempt ${attempt}/${maxAttempts}):`, task.status);

    if (task.status === 'SUCCEEDED') {
      console.log(`Task ${taskId} completed successfully`);
      return task;
    }

    if (task.status === 'FAILED') {
      const error = task.failure || task.failureCode || 'Unknown error';
      throw new Error(`Task failed: ${error}`);
    }

    // Wait before next poll
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  throw new Error(`Task ${taskId} timed out after ${maxAttempts} attempts`);
}

/**
 * Extract URL from Runway ML output
 */
function extractUrl(output: any): string {
  if (typeof output === 'string') {
    return output;
  }

  if (Array.isArray(output)) {
    if (output.length === 0) {
      throw new Error('No output returned from Runway ML');
    }

    const first = output[0];
    if (typeof first === 'string') {
      return first;
    }
    if (typeof first === 'object' && first.url) {
      return first.url;
    }
  }

  if (typeof output === 'object' && output.url) {
    return output.url;
  }

  throw new Error('Unable to extract URL from Runway ML output');
}

/**
 * Transform an image using AI (text-to-image or image-to-image)
 * Uses Gen-4 Image Turbo model for fast generation
 */
export async function transformImageWithAI(
  imageUrl: string,
  prompt: string
): Promise<string> {
  console.log('Transforming image with Runway ML:', { imageUrl, prompt });

  const payload = {
    promptText: prompt,
    ratio: '1080:1920', // Instagram Reels format (9:16)
    model: 'gen4_image_turbo',
    referenceImage: {
      url: imageUrl,
    },
  };

  // Start the task
  const taskResponse = await makeRunwayRequest('/v1/text_to_image', 'POST', payload);
  
  if (!taskResponse.id) {
    throw new Error('No task ID returned from Runway ML');
  }

  console.log(`Image transformation task created: ${taskResponse.id}`);

  // Poll for completion
  const completedTask = await pollTaskStatus(taskResponse.id);

  // Extract URL from output
  const imageUrlResult = extractUrl(completedTask.output);
  
  console.log('Image transformation completed:', imageUrlResult);

  return imageUrlResult;
}

/**
 * Generate animated video from image using AI
 * Uses Gen-4 Turbo model for video generation
 */
export async function generateVideoFromImage(
  imageUrl: string,
  prompt: string,
  duration: number = 5
): Promise<string> {
  console.log('Generating video with Runway ML:', {
    imageUrl,
    prompt,
    duration,
  });

  const payload = {
    promptImage: imageUrl,
    promptText: prompt,
    model: 'gen4_turbo',
    duration: duration,
    ratio: '1080:1920', // Instagram Reels format (9:16)
  };

  // Start the task
  const taskResponse = await makeRunwayRequest('/v1/image_to_video', 'POST', payload);
  
  if (!taskResponse.id) {
    throw new Error('No task ID returned from Runway ML');
  }

  console.log(`Video generation task created: ${taskResponse.id}`);

  // Poll for completion (video takes longer, so more attempts)
  const completedTask = await pollTaskStatus(taskResponse.id, 120, 5000);

  // Extract URL from output
  const videoUrl = extractUrl(completedTask.output);
  
  console.log('Video generation completed:', videoUrl);

  return videoUrl;
}

/**
 * Upscale an image for better quality
 * Note: Runway ML doesn't have a dedicated upscale endpoint
 * This function regenerates the image with higher quality settings
 */
export async function upscaleImage(imageUrl: string): Promise<string> {
  console.log('Upscaling image with Runway ML:', imageUrl);

  const payload = {
    promptText: 'high quality, detailed, sharp',
    ratio: '1080:1920',
    model: 'gen4_image_turbo',
    referenceImage: {
      url: imageUrl,
    },
  };

  const taskResponse = await makeRunwayRequest('/v1/text_to_image', 'POST', payload);
  
  if (!taskResponse.id) {
    throw new Error('No task ID returned from Runway ML');
  }

  const completedTask = await pollTaskStatus(taskResponse.id);
  const upscaledUrl = extractUrl(completedTask.output);
  
  console.log('Image upscaling completed:', upscaledUrl);

  return upscaledUrl;
}

/**
 * Estimate cost for operations
 * Runway ML pricing (approximate):
 * - Gen-4 Image: ~$0.005 per image
 * - Gen-4 Video: ~$0.05 per 5 seconds
 */
export function estimateCost(operations: {
  images?: number;
  videos?: number;
  videoDuration?: number;
}): number {
  const imageCost = 0.005; // $0.005 per image
  const videoCostPerSecond = 0.01; // ~$0.05 per 5 seconds

  let total = 0;

  if (operations.images) {
    total += operations.images * imageCost;
  }

  if (operations.videos) {
    const duration = operations.videoDuration || 5;
    total += operations.videos * (videoCostPerSecond * duration);
  }

  return total;
}
