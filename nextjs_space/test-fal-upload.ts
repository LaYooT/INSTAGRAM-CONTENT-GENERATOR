
import { fal } from '@fal-ai/client';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as https from 'https';

dotenv.config();

const FAL_API_KEY = process.env.FAL_API_KEY || '';

// Initialize FAL client
fal.config({
  credentials: FAL_API_KEY,
});

async function downloadTestImage(): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const url = 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Test.svg';
    https.get(url, (response) => {
      const chunks: Buffer[] = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
      response.on('error', reject);
    }).on('error', reject);
  });
}

async function testFalStorageUpload() {
  console.log('Testing FAL.ai storage upload workflow...\n');
  
  try {
    // Step 1: Download a test image
    console.log('Step 1: Downloading test image...');
    const imageBuffer = await downloadTestImage();
    console.log(`✅ Downloaded ${imageBuffer.length} bytes`);
    
    // Step 2: Upload to FAL.ai storage
    console.log('\nStep 2: Uploading to FAL.ai storage...');
    const blob = new Blob([imageBuffer], { type: 'image/png' });
    const falStorageUrl = await fal.storage.upload(blob);
    console.log('✅ Uploaded to FAL.ai storage:', falStorageUrl);
    
    // Step 3: Verify the URL is accessible
    console.log('\nStep 3: Testing image transformation with uploaded URL...');
    const result = await fal.subscribe('fal-ai/flux/dev/image-to-image', {
      input: {
        image_url: falStorageUrl,
        prompt: 'A beautiful sunset landscape with vibrant colors',
        strength: 0.8,
        num_inference_steps: 40,
        guidance_scale: 3.5,
      },
      logs: true,
    });
    
    console.log('✅ Transformation successful!');
    console.log('Result:', JSON.stringify(result.data, null, 2));
    
  } catch (error: any) {
    console.error('❌ Test failed:', error.message);
    if (error.body) {
      console.error('Error body:', JSON.stringify(error.body, null, 2));
    }
    if (error.stack) {
      console.error('Stack:', error.stack);
    }
  }
}

testFalStorageUpload()
  .then(() => {
    console.log('\n✅ Test completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Test suite failed:', error);
    process.exit(1);
  });
