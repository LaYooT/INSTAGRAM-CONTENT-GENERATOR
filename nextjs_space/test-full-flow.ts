import { fal } from '@fal-ai/client';
import * as dotenv from 'dotenv';

dotenv.config();

const FAL_API_KEY = process.env.FAL_API_KEY || '';

async function testFullFlow() {
  console.log('Initializing FAL.ai client...');
  fal.config({
    credentials: FAL_API_KEY,
  });

  // Step 1: Transform image
  const testImageUrl = 'https://images.pexels.com/photos/32156840/pexels-photo-32156840/free-photo-of-majestic-lion-walking-in-african-savannah.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
  const imagePrompt = 'A futuristic cyberpunk lion with neon lights';

  try {
    console.log('\n=== Step 1: Transform Image ===');
    console.log('Source image:', testImageUrl);
    console.log('Prompt:', imagePrompt);

    const transformResult: any = await fal.subscribe('fal-ai/flux/dev/image-to-image', {
      input: {
        prompt: imagePrompt,
        image_url: testImageUrl,
        strength: 0.8,
        num_inference_steps: 40,
        guidance_scale: 3.5,
        num_images: 1,
        output_format: 'jpeg',
      },
      logs: true,
      onQueueUpdate: (update) => {
        console.log('Image transformation:', update.status);
      },
    });

    const transformedImageUrl = transformResult.data.images[0].url;
    console.log('\n✅ Image transformed successfully!');
    console.log('Transformed image URL:', transformedImageUrl);
    console.log('URL type:', typeof transformedImageUrl);
    console.log('URL starts with https:', transformedImageUrl.startsWith('https://'));

    // Step 2: Generate video from transformed image
    console.log('\n=== Step 2: Generate Video ===');
    const videoPrompt = 'The lion walking majestically through a neon-lit cyberpunk city';

    const input = {
      prompt: videoPrompt,
      image_url: transformedImageUrl,
      aspect_ratio: '9:16' as '9:16',
      loop: false,
    };

    console.log('Video input parameters:', JSON.stringify(input, null, 2));

    const videoResult = await fal.subscribe('fal-ai/luma-dream-machine/image-to-video', {
      input,
      logs: true,
      onQueueUpdate: (update) => {
        console.log('Video generation:', update.status);
      },
    });

    console.log('\n✅ Full flow completed successfully!');
    console.log('Final video URL:', videoResult.data.video.url);

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    if (error.body) {
      console.error('Error body:', JSON.stringify(error.body, null, 2));
    }
    if (error.status) {
      console.error('Status:', error.status);
    }
  }
}

testFullFlow().catch(console.error);
