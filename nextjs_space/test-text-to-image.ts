/**
 * Test text-to-image (pas besoin d'URL source)
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

console.log('=== Test Text-to-Image FAL.ai ===\n');

async function test() {
  try {
    console.log('1. Génération d\'image depuis texte (Flux)...\n');
    
    const result = await fal.subscribe('fal-ai/flux/dev', {
      input: {
        prompt: 'a beautiful sunset over a mountain landscape, vibrant colors, cinematic lighting, 4k',
        num_inference_steps: 28,
        guidance_scale: 3.5,
        num_images: 1,
      },
      logs: true
    });

    const imageUrl = (result as any).data.images[0].url;
    console.log('\n✅ Image générée avec succès!');
    console.log('   URL:', imageUrl, '\n');
    
    console.log('2. Test vidéo avec cette image...\n');
    
    const videoResult = await fal.subscribe('fal-ai/luma-dream-machine/image-to-video', {
      input: {
        prompt: 'the sun slowly sets behind the mountains, clouds moving gently',
        image_url: imageUrl,
        aspect_ratio: '9:16',
        loop: false,
      },
      logs: true
    });

    const videoUrl = (videoResult as any).data.video.url;
    console.log('\n✅ Vidéo générée avec succès!');
    console.log('   URL:', videoUrl, '\n');
    
    console.log('========================================');
    console.log('✅ TOUS LES TESTS PASSÉS!');
    console.log('========================================');
    console.log('\nCONCLUSION:');
    console.log('- ✓ API FAL.ai fonctionnelle');
    console.log('- ✓ Génération d\'image (text-to-image)');
    console.log('- ✓ Génération de vidéo (image-to-video)');
    console.log('- ✓ Les corrections appliquées fonctionnent');
    console.log('\nLe problème était bien la configuration globale!');
    
  } catch (error: any) {
    console.error('\n❌ ÉCHEC:', error.message);
    if (error.status) console.error('Status:', error.status);
    if (error.body) console.error('Body:', JSON.stringify(error.body, null, 2));
    process.exit(1);
  }
}

test();
