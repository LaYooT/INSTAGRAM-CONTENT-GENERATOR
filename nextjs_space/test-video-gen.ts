
import { fal } from '@fal-ai/client';
import * as dotenv from 'dotenv';

dotenv.config();

const FAL_API_KEY = process.env.FAL_API_KEY || '';

async function testVideoGeneration() {
  console.log('Initializing FAL.ai client...');
  fal.config({
    credentials: FAL_API_KEY,
  });

  // Test with a known working FAL.ai image URL
  const testImageUrl = 'https://images.pexels.com/photos/32156840/pexels-photo-32156840/free-photo-of-majestic-lion-walking-in-african-savannah.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
  const prompt = 'A majestic lion walking through the savannah';

  try {
    console.log('\n=== Testing Video Generation ===');
    console.log('Image URL:', testImageUrl);
    console.log('Prompt:', prompt);

    const input = {
      prompt: prompt,
      image_url: testImageUrl,
      aspect_ratio: '9:16' as '9:16',
      loop: false,
    };

    console.log('\nInput parameters:', JSON.stringify(input, null, 2));

    const result = await fal.subscribe('fal-ai/luma-dream-machine/image-to-video', {
      input,
      logs: true,
      onQueueUpdate: (update) => {
        console.log('Queue update:', update.status);
      },
    });

    console.log('\n✅ Success! Video generated:', result);
  } catch (error: any) {
    console.error('\n❌ Error:', error);
    if (error.body) {
      console.error('Error body:', JSON.stringify(error.body, null, 2));
    }
    if (error.status) {
      console.error('Status:', error.status);
    }
  }
}

testVideoGeneration().catch(console.error);
