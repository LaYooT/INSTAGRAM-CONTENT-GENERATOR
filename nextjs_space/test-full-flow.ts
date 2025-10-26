/**
 * Test complet du workflow FAL.ai
 */

import * as dotenv from 'dotenv';
dotenv.config();

import { fal } from '@fal-ai/client';

const FAL_API_KEY = process.env.FAL_API_KEY || '';

if (!FAL_API_KEY) {
  console.error('❌ Clé API non trouvée!');
  process.exit(1);
}

fal.config({
  credentials: FAL_API_KEY,
});

console.log('=== Test Workflow Complet FAL.ai ===\n');

async function test() {
  try {
    // Utiliser une URL publique directe et simple
    const publicImageUrl = 'https://fal.media/files/elephant/lO7frOBmhmbOyH6S5nGnI.png';
    
    console.log('1. Test transformation d\'image...');
    console.log('   URL source:', publicImageUrl, '\n');
    
    const imageResult = await fal.subscribe('fal-ai/flux/dev/image-to-image', {
      input: {
        prompt: 'a majestic lion in the savanna at sunset, cinematic lighting, 4k',
        image_url: publicImageUrl,
        strength: 0.8,
        num_inference_steps: 28,
        guidance_scale: 3.5,
      },
      logs: true
    });

    const transformedImageUrl = (imageResult as any).data.images[0].url;
    console.log('\n✅ Transformation réussie!');
    console.log('   Image transformée:', transformedImageUrl, '\n');

    // Test vidéo
    console.log('2. Test génération de vidéo...\n');
    
    const videoResult = await fal.subscribe('fal-ai/luma-dream-machine/image-to-video', {
      input: {
        prompt: 'the lion roars majestically, camera slowly zooms in',
        image_url: transformedImageUrl,
        aspect_ratio: '9:16',
        loop: false,
      },
      logs: true
    });

    const videoUrl = (videoResult as any).data.video.url;
    console.log('\n✅ Vidéo générée!');
    console.log('   Vidéo:', videoUrl, '\n');
    
    console.log('========================================');
    console.log('✅ WORKFLOW COMPLET FONCTIONNEL!');
    console.log('========================================');
    console.log('\nRÉSUMÉ:');
    console.log('- ✓ Authentification FAL.ai');
    console.log('- ✓ Transformation d\'image (Flux)');
    console.log('- ✓ Génération de vidéo (Luma)');
    console.log('- ✓ Format Instagram Reels (9:16)');
    console.log('\nL\'application est prête à être utilisée! 🎉');
    
  } catch (error: any) {
    console.error('\n❌ ÉCHEC:', error.message);
    if (error.status) console.error('Status:', error.status);
    if (error.body) console.error('Body:', JSON.stringify(error.body, null, 2));
    process.exit(1);
  }
}

test();
