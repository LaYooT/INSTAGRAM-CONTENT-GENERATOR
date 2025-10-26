/**
 * Test avec upload direct à FAL.ai storage
 */

import * as dotenv from 'dotenv';
dotenv.config();

import { fal } from '@fal-ai/client';
import * as fs from 'fs';
import * as https from 'https';

const FAL_API_KEY = process.env.FAL_API_KEY || '';

if (!FAL_API_KEY) {
  console.error('❌ Clé API non trouvée!');
  process.exit(1);
}

fal.config({
  credentials: FAL_API_KEY,
});

console.log('=== Test Upload FAL.ai Storage ===\n');

async function test() {
  try {
    // 1. Télécharger une image test depuis une URL publique
    console.log('1. Téléchargement image test...');
    const testImageUrl = 'https://picsum.photos/512/512';
    
    const imageBuffer = await new Promise<Buffer>((resolve, reject) => {
      https.get(testImageUrl, (response) => {
        const chunks: Buffer[] = [];
        response.on('data', (chunk) => chunks.push(chunk));
        response.on('end', () => resolve(Buffer.concat(chunks)));
        response.on('error', reject);
      });
    });
    
    console.log('   ✓ Image téléchargée:', imageBuffer.length, 'bytes\n');

    // 2. Upload vers FAL.ai storage
    console.log('2. Upload vers FAL.ai storage...');
    const blob = new Blob([imageBuffer], { type: 'image/jpeg' });
    const falImageUrl = await fal.storage.upload(blob);
    console.log('   ✓ Image uploadée:', falImageUrl, '\n');

    // 3. Utiliser cette URL pour la transformation
    console.log('3. Transformation avec FAL.ai Flux...');
    const result = await fal.subscribe('fal-ai/flux/dev/image-to-image', {
      input: {
        prompt: 'a beautiful sunset landscape with mountains',
        image_url: falImageUrl,
        strength: 0.8,
        num_inference_steps: 28,
        guidance_scale: 3.5,
      },
      logs: true
    });

    console.log('\n✅ SUCCÈS COMPLET! Workflow fonctionne!');
    console.log('Image transformée:', (result as any).data.images[0].url);
    
  } catch (error: any) {
    console.error('\n❌ ÉCHEC:', error.message);
    if (error.status) console.error('Status:', error.status);
    if (error.body) console.error('Body:', JSON.stringify(error.body, null, 2));
  }
}

test();
