
/**
 * Runware.ai API Integration
 * Handles image transformation and video generation using Runware API
 */

const RUNWARE_API_KEY = process.env.RUNWARE_API_KEY || '';
const RUNWARE_API_URL = 'https://api.runware.ai/v1';

interface RunwareRequestOptions {
  positivePrompt: string;
  model?: string;
  numberResults?: number;
  outputFormat?: string;
  outputType?: string;
  taskType?: string;
  taskUUID?: string;
  includeCost?: boolean;
  [key: string]: any;
}

interface RunwareImageToImageOptions extends RunwareRequestOptions {
  inputImage: string;
  strength?: number;
  height?: number;
  width?: number;
}

interface RunwareImageToVideoOptions extends RunwareRequestOptions {
  inputImage: string;
  duration?: number;
  height?: number;
  width?: number;
}

interface RunwareResponse {
  taskType: string;
  taskUUID: string;
  imageURL?: string;
  videoURL?: string;
  cost?: number;
  error?: string;
}

/**
 * Load API key from environment variables
 */
function loadApiKey(): string {
  return RUNWARE_API_KEY || '';
}

/**
 * Make a request to Runware API
 */
async function makeRunwareRequest(
  payload: RunwareRequestOptions | RunwareImageToVideoOptions
): Promise<RunwareResponse[]> {
  const apiKey = loadApiKey();

  if (!apiKey) {
    throw new Error('Runware API key not configured');
  }

  console.log('Making Runware API request:', {
    taskType: payload.taskType,
    model: payload.model,
  });

  const response = await fetch(RUNWARE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify([payload]),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Runware API error:', {
      status: response.status,
      statusText: response.statusText,
      body: errorText,
    });
    throw new Error(
      `Runware API error: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  console.log('Runware API response received');

  if (data.error) {
    throw new Error(`Runware API error: ${data.error}`);
  }

  return data;
}

/**
 * Transform an image using AI (image-to-image)
 * Uses Flux Schnell model for fast, cost-effective generation
 */
export async function transformImageWithAI(
  imageUrl: string,
  prompt: string
): Promise<string> {
  console.log('Transforming image with Runware AI:', { imageUrl, prompt });

  const payload: RunwareImageToImageOptions = {
    taskType: 'imageInference',
    taskUUID: `transform-${Date.now()}`,
    positivePrompt: prompt,
    model: 'runware:100@1',
    inputImage: imageUrl,
    strength: 0.8,
    height: 1920,
    width: 1080,
    numberResults: 1,
    outputType: 'URL',
    outputFormat: 'PNG',
    includeCost: true,
  };

  const response = await makeRunwareRequest(payload);

  if (!response || response.length === 0 || !response[0].imageURL) {
    throw new Error('No image URL returned from Runware');
  }

  console.log('Image transformation completed:', {
    cost: response[0].cost,
    url: response[0].imageURL,
  });

  return response[0].imageURL;
}

/**
 * Generate animated video from image using AI
 * Uses Hailuo AI model for video generation
 */
export async function generateVideoFromImage(
  imageUrl: string,
  prompt: string,
  duration: number = 5
): Promise<string> {
  console.log('Generating video with Runware AI:', {
    imageUrl,
    prompt,
    duration,
  });

  const payload: RunwareImageToVideoOptions = {
    taskType: 'imageToVideo',
    taskUUID: `video-${Date.now()}`,
    inputImage: imageUrl,
    positivePrompt: prompt,
    model: 'hailuo:v2@1',
    duration: duration,
    height: 1920,
    width: 1080,
  };

  const response = await makeRunwareRequest(payload);

  if (!response || response.length === 0 || !response[0].videoURL) {
    throw new Error('No video URL returned from Runware');
  }

  console.log('Video generation completed:', {
    cost: response[0].cost,
    url: response[0].videoURL,
  });

  return response[0].videoURL;
}

/**
 * Upscale an image for better quality
 * Optional step before video generation
 */
export async function upscaleImage(imageUrl: string): Promise<string> {
  console.log('Upscaling image with Runware:', imageUrl);

  const payload: RunwareRequestOptions = {
    taskType: 'upscale',
    taskUUID: `upscale-${Date.now()}`,
    positivePrompt: '', // Not needed for upscaling
    inputImage: imageUrl,
    upscaleFactor: 2,
    outputType: 'URL',
    outputFormat: 'PNG',
  };

  const response = await makeRunwareRequest(payload);

  if (!response || response.length === 0 || !response[0].imageURL) {
    throw new Error('No image URL returned from upscaling');
  }

  console.log('Image upscaling completed');

  return response[0].imageURL;
}

/**
 * Estimate cost for operations
 */
export function estimateCost(operations: {
  images?: number;
  videos?: number;
  videoDuration?: number;
}): number {
  const imageCost = 0.0013; // $0.0013 per image
  const videoCostPerSecond = 0.01336; // ~$0.0668 per 5 seconds

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

