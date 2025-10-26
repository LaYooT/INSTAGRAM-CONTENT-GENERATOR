/**
 * Test minimal FAL.ai avec dotenv
 */

// IMPORTANT: Charger dotenv EN PREMIER
import * as dotenv from 'dotenv';
dotenv.config();

import { fal } from '@fal-ai/client';

const FAL_API_KEY = process.env.FAL_API_KEY || '';

console.log('=== Test FAL.ai avec dotenv ===\n');

console.log('1. Clé API chargée:', !!FAL_API_KEY);
console.log('2. Longueur:', FAL_API_KEY.length);
console.log('3. Format:', FAL_API_KEY.includes(':') ? 'KEY:SECRET ✓' : 'KEY');
console.log('');

if (!FAL_API_KEY) {
  console.error('❌ Clé API non trouvée!');
  process.exit(1);
}

// Configuration
fal.config({
  credentials: FAL_API_KEY,
});

console.log('4. Test transformation d\'image...\n');

async function test() {
  try {
    const result = await fal.subscribe('fal-ai/flux/dev/image-to-image', {
      input: {
        prompt: 'a white cat',
        image_url: 'https://storage.googleapis.com/falserverless/model_tests/flux/image-to-image/ski-goat.png',
        strength: 0.8,
        num_inference_steps: 28,
        guidance_scale: 3.5,
      },
      logs: true
    });

    console.log('\n✅ SUCCÈS! API FAL.ai fonctionne correctement!');
    console.log('Image générée:', (result as any).data.images[0].url);
    
  } catch (error: any) {
    console.error('\n❌ ÉCHEC:', error.message);
    console.error('Status:', error.status);
    console.error('Body:', error.body);
  }
}

test();
