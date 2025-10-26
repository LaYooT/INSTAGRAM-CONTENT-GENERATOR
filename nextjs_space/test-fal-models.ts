/**
 * Test script pour vérifier les modèles FAL.ai disponibles
 * et les paramètres corrects selon la documentation MCP
 */

import { fal } from '@fal-ai/client';

// Configure FAL
fal.config({
  credentials: process.env.FAL_API_KEY!
});

async function testModels() {
  console.log('=== Test des modèles FAL.ai ===\n');

  try {
    console.log('1. Test transformation d\'image (Flux)...');
    console.log('   Modèle utilisé: fal-ai/flux/dev/image-to-image');
    console.log('   Image test: https://storage.googleapis.com/falserverless/model_tests/flux/image-to-image/ski-goat.png\n');
    
    const imageResult = await fal.subscribe('fal-ai/flux/dev/image-to-image', {
      input: {
        prompt: 'a white cat',
        image_url: 'https://storage.googleapis.com/falserverless/model_tests/flux/image-to-image/ski-goat.png',
        strength: 0.8,
        num_inference_steps: 28,
        guidance_scale: 3.5
      },
      logs: true
    });

    console.log('✓ Transformation d\'image réussie!');
    console.log('  URL de l\'image générée:', (imageResult as any).data.images[0].url);
    console.log('');

    console.log('2. Test génération de vidéo (Luma Dream Machine)...');
    console.log('   Modèle utilisé: fal-ai/luma-dream-machine/image-to-video');
    console.log('   Utilisation de l\'image générée précédemment\n');
    
    const videoResult = await fal.subscribe('fal-ai/luma-dream-machine/image-to-video', {
      input: {
        prompt: 'a white cat moving gracefully',
        image_url: (imageResult as any).data.images[0].url,
        aspect_ratio: '9:16'  // Format Instagram Reels
      },
      logs: true
    });

    console.log('✓ Génération de vidéo réussie!');
    console.log('  URL de la vidéo générée:', (videoResult as any).data.video.url);
    console.log('');
    
    console.log('=== Tests terminés avec succès! ===\n');
    console.log('DIAGNOSTIC:');
    console.log('- ✓ API FAL.ai fonctionnelle');
    console.log('- ✓ Modèle image-to-image fonctionnel');
    console.log('- ✓ Modèle image-to-video fonctionnel');
    console.log('- ✓ Paramètres corrects');
    
  } catch (error: any) {
    console.error('✗ Erreur détectée:', error);
    
    if (error.body) {
      console.error('\nDétails de l\'erreur API:');
      console.error(JSON.stringify(error.body, null, 2));
    }
    
    console.error('\n=== DIAGNOSTIC ===');
    console.error('Problème identifié avec l\'API FAL.ai');
    console.error('Vérifier:');
    console.error('1. La clé API FAL_API_KEY');
    console.error('2. Les noms de modèles');
    console.error('3. Les paramètres envoyés');
  }
}

testModels();
