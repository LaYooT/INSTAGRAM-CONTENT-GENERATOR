
import { fal } from '@fal-ai/client';
import * as dotenv from 'dotenv';

dotenv.config();

const FAL_API_KEY = process.env.FAL_API_KEY || '';

// Initialize FAL client
fal.config({
  credentials: FAL_API_KEY,
});

async function testMinimalImageToImage() {
  console.log('Testing FAL.ai image-to-image with minimal parameters...');
  
  // Using a public test image
  const testImageUrl = 'https://i.pinimg.com/736x/4a/6d/d9/4a6dd939ab313b85bd0ad41339ce28f5.jpg';
  const testPrompt = 'A beautiful sunset landscape';
  
  try {
    console.log('Test 1: Only required parameters');
    const result1 = await fal.subscribe('fal-ai/flux/dev/image-to-image', {
      input: {
        image_url: testImageUrl,
        prompt: testPrompt,
      },
      logs: true,
    });
    console.log('✅ Test 1 passed:', result1);
  } catch (error: any) {
    console.error('❌ Test 1 failed:', error.message);
    if (error.body) {
      console.error('Error body:', JSON.stringify(error.body, null, 2));
    }
  }
  
  try {
    console.log('\nTest 2: With optional parameters (current setup)');
    const result2 = await fal.subscribe('fal-ai/flux/dev/image-to-image', {
      input: {
        prompt: testPrompt,
        image_url: testImageUrl,
        strength: 0.8,
        num_inference_steps: 40,
        guidance_scale: 3.5,
        num_images: 1,
        output_format: 'jpeg',
      },
      logs: true,
    });
    console.log('✅ Test 2 passed:', result2);
  } catch (error: any) {
    console.error('❌ Test 2 failed:', error.message);
    if (error.body) {
      console.error('Error body:', JSON.stringify(error.body, null, 2));
    }
  }
  
  try {
    console.log('\nTest 3: Different parameter order');
    const result3 = await fal.subscribe('fal-ai/flux/dev/image-to-image', {
      input: {
        image_url: testImageUrl,
        prompt: testPrompt,
        strength: 0.8,
        num_inference_steps: 40,
        guidance_scale: 3.5,
      },
      logs: true,
    });
    console.log('✅ Test 3 passed:', result3);
  } catch (error: any) {
    console.error('❌ Test 3 failed:', error.message);
    if (error.body) {
      console.error('Error body:', JSON.stringify(error.body, null, 2));
    }
  }
}

testMinimalImageToImage()
  .then(() => {
    console.log('\n✅ All tests completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Test suite failed:', error);
    process.exit(1);
  });
