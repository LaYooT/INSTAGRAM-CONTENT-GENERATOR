
/**
 * Script de test pour l'API FAL.ai
 * Permet de vérifier que l'API fonctionne correctement
 */

import { fal } from '@fal-ai/client';
import * as dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config({ path: '.env' });

const FAL_API_KEY = process.env.FAL_API_KEY;

async function testFalAPI() {
  console.log('🔍 Test de l\'API FAL.ai...\n');
  
  // Vérifier la clé API
  if (!FAL_API_KEY) {
    console.error('❌ Erreur: FAL_API_KEY non définie dans .env');
    process.exit(1);
  }
  
  console.log('✅ Clé API trouvée:', FAL_API_KEY.substring(0, 10) + '...\n');
  
  // Configurer le client
  fal.config({
    credentials: FAL_API_KEY,
  });
  
  console.log('📋 Test 1: Génération d\'image simple (text-to-image)');
  try {
    const result = await fal.subscribe('fal-ai/flux/dev', {
      input: {
        prompt: 'A beautiful sunset over mountains',
        image_size: 'square_hd',
        num_inference_steps: 28,
        num_images: 1,
      },
      logs: true,
      onQueueUpdate: (update) => {
        console.log('   Status:', update.status);
      },
    });
    
    console.log('✅ Test 1 réussi!');
    console.log('   Image URL:', result.data.images[0].url, '\n');
  } catch (error: any) {
    console.error('❌ Test 1 échoué:', error.message);
    console.error('   Détails:', error, '\n');
  }
  
  console.log('📋 Test 2: Transformation d\'image (image-to-image)');
  try {
    // Utiliser une image de test publique
    const testImageUrl = 'https://i.ytimg.com/vi/xOu06l_CHrI/maxresdefault.jpg';
    
    const result = await fal.subscribe('fal-ai/flux/dev/image-to-image', {
      input: {
        image_url: testImageUrl,
        prompt: 'Transform into a watercolor painting style',
        strength: 0.8,
        num_inference_steps: 40,
        guidance_scale: 3.5,
        num_images: 1,
      },
      logs: true,
      onQueueUpdate: (update) => {
        console.log('   Status:', update.status);
      },
    });
    
    console.log('✅ Test 2 réussi!');
    console.log('   Image URL:', result.data.images[0].url, '\n');
  } catch (error: any) {
    console.error('❌ Test 2 échoué:', error.message);
    if (error.body) {
      console.error('   Body:', JSON.stringify(error.body, null, 2));
    }
    if (error.status) {
      console.error('   Status:', error.status);
    }
    console.error('   Détails complets:', error, '\n');
  }
  
  console.log('🏁 Tests terminés');
}

testFalAPI().catch((error) => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
});
