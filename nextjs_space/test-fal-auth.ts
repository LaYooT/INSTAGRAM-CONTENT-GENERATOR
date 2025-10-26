/**
 * Test d'authentification FAL.ai
 */

import { fal } from '@fal-ai/client';

const FAL_API_KEY = process.env.FAL_API_KEY || '';

console.log('=== Diagnostic FAL.ai Authentication ===\n');

console.log('1. Vérification clé API:');
console.log('   - Clé présente:', !!FAL_API_KEY);
console.log('   - Longueur:', FAL_API_KEY.length);
console.log('   - Format:', FAL_API_KEY.includes(':') ? 'KEY:SECRET' : 'KEY');
console.log('   - Premier caractère:', FAL_API_KEY[0]);
console.log('   - Dernier caractère:', FAL_API_KEY[FAL_API_KEY.length - 1]);
console.log('');

// Test 1: Configuration avec la clé complète
console.log('2. Test configuration avec clé complète...');
try {
  fal.config({
    credentials: FAL_API_KEY,
  });
  console.log('   ✓ Configuration appliquée\n');
} catch (error) {
  console.error('   ✗ Erreur configuration:', error);
}

// Test 2: Vérifier l'accès à un modèle simple
console.log('3. Test accès API avec un simple appel...');
const testImageUrl = 'https://storage.googleapis.com/falserverless/model_tests/flux/image-to-image/ski-goat.png';

fal.subscribe('fal-ai/flux/dev/image-to-image', {
  input: {
    prompt: 'test',
    image_url: testImageUrl,
    num_inference_steps: 1, // Minimal pour tester rapidement
  },
  logs: true
}).then((result: any) => {
  console.log('   ✓ API accessible! La clé fonctionne.');
  console.log('   Résultat:', result);
}).catch((error: any) => {
  console.error('   ✗ Erreur API:');
  console.error('   - Status:', error.status);
  console.error('   - Message:', error.message);
  console.error('   - Body:', JSON.stringify(error.body, null, 2));
  
  if (error.status === 401) {
    console.error('\n❌ PROBLÈME IDENTIFIÉ: Clé API invalide ou expirée');
    console.error('   Solutions:');
    console.error('   1. Vérifier que FAL_API_KEY dans .env est correcte');
    console.error('   2. Regénérer une nouvelle clé sur https://fal.ai/dashboard/keys');
    console.error('   3. S\'assurer qu\'il n\'y a pas d\'espaces avant/après la clé');
  }
  
  process.exit(1);
});
