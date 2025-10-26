
/**
 * Script de seed pour le catalogue de modèles fal.ai
 * Peuple la base de données avec les modèles disponibles
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Modèles de génération d'images (Image-to-Image)
const imageModels = [
  {
    endpoint: 'fal-ai/flux/dev/image-to-image',
    name: 'FLUX.1 [dev] Image-to-Image',
    category: 'image',
    provider: 'fal-ai',
    pricePerUnit: 0.03,
    priceUnit: 'megapixel',
    maxResolution: '2048x2048',
    hasAudio: false,
    avgSpeed: 8,
    qualityRating: 5,
    description: 'Modèle de transformation d\'images de haute qualité, excellent rapport qualité/prix',
    features: {
      strengths: ['Haute qualité', 'Rapide', 'Économique'],
      use_cases: ['Transformation d\'images', 'Style transfer', 'Image enhancement']
    },
    isActive: true
  },
  {
    endpoint: 'fal-ai/flux/schnell/image-to-image',
    name: 'FLUX.1 [schnell] Image-to-Image',
    category: 'image',
    provider: 'fal-ai',
    pricePerUnit: 0.015,
    priceUnit: 'megapixel',
    maxResolution: '2048x2048',
    hasAudio: false,
    avgSpeed: 4,
    qualityRating: 4,
    description: 'Version rapide de FLUX, idéal pour prototypage (40% moins cher)',
    features: {
      strengths: ['Très rapide', 'Économique', 'Bonne qualité'],
      use_cases: ['Prototypage rapide', 'Tests', 'Production à volume élevé']
    },
    isActive: true
  },
  {
    endpoint: 'fal-ai/qwen-image',
    name: 'Qwen Image Edit',
    category: 'image',
    provider: 'qwen',
    pricePerUnit: 0.02,
    priceUnit: 'megapixel',
    maxResolution: '2048x2048',
    hasAudio: false,
    avgSpeed: 6,
    qualityRating: 4,
    description: 'Excellent pour le rendu de texte et éditions précises',
    features: {
      strengths: ['Rendu de texte supérieur', 'Édition précise', 'Économique'],
      use_cases: ['Édition avec texte', 'Modifications précises', 'Design graphique']
    },
    isActive: true
  }
];

// Modèles de génération vidéo (Image-to-Video)
const videoModels = [
  {
    endpoint: 'fal-ai/luma-dream-machine/image-to-video',
    name: 'Luma Dream Machine',
    category: 'video',
    provider: 'luma',
    pricePerUnit: 0.50,
    priceUnit: 'video',
    maxResolution: '1920x1920',
    hasAudio: false,
    avgSpeed: 25,
    qualityRating: 5,
    description: 'Qualité supérieure pour génération vidéo, excellent pour Instagram Reels',
    features: {
      strengths: ['Qualité exceptionnelle', 'Motion naturel', 'Idéal Instagram'],
      use_cases: ['Contenu premium', 'Haute qualité requise', 'Projets professionnels']
    },
    isActive: true
  },
  {
    endpoint: 'fal-ai/wan/v2.5/image-to-video',
    name: 'Wan 2.5',
    category: 'video',
    provider: 'bytedance',
    pricePerUnit: 0.25,
    priceUnit: 'video',
    maxResolution: '1080p',
    hasAudio: true,
    avgSpeed: 20,
    qualityRating: 4,
    description: 'Excellent rapport qualité/prix avec audio natif (50% moins cher que Luma)',
    features: {
      strengths: ['Audio natif', 'Économique', 'Motion diversity', 'Open-source'],
      use_cases: ['Production à budget', 'Contenu avec son', 'Volume élevé']
    },
    isActive: true
  },
  {
    endpoint: 'fal-ai/kling/v2.5/turbo/pro/image-to-video',
    name: 'Kling 2.5 Turbo Pro',
    category: 'video',
    provider: 'kuaishou',
    pricePerUnit: 0.30,
    priceUnit: 'video',
    maxResolution: '1080p',
    hasAudio: false,
    avgSpeed: 18,
    qualityRating: 5,
    description: 'Fluidité motion exceptionnelle, visuel cinématique',
    features: {
      strengths: ['Motion fluide', 'Visuel cinématique', 'Prompt précision'],
      use_cases: ['Contenu cinématique', 'Animations fluides', 'High-end production']
    },
    isActive: true
  },
  {
    endpoint: 'fal-ai/ltx-2/fast/image-to-video',
    name: 'LTX-2 Fast',
    category: 'video',
    provider: 'fal-ai',
    pricePerUnit: 0.18,
    priceUnit: 'video',
    maxResolution: '720p',
    hasAudio: false,
    avgSpeed: 12,
    qualityRating: 3,
    description: 'Option la plus économique (64% moins cher que Luma), rapide',
    features: {
      strengths: ['Très économique', 'Rapide', 'Haute fidélité motion'],
      use_cases: ['Production à budget serré', 'Tests rapides', 'Volume très élevé']
    },
    isActive: true
  },
  {
    endpoint: 'fal-ai/bytedance/seedance/v1/pro/image-to-video',
    name: 'Seedance 1.0 Pro',
    category: 'video',
    provider: 'bytedance',
    pricePerUnit: 0.62,
    priceUnit: 'video',
    maxResolution: '1080p',
    hasAudio: false,
    avgSpeed: 30,
    qualityRating: 5,
    description: 'Mouvement naturel et cohérence temporelle exceptionnels',
    features: {
      strengths: ['Mouvement naturel', 'Cohérence temporelle', 'Haute qualité'],
      use_cases: ['Projets premium', 'Mouvements complexes', 'Quality-first']
    },
    isActive: true
  },
  {
    endpoint: 'fal-ai/veo3/image-to-video',
    name: 'Veo 3.1 (Google)',
    category: 'video',
    provider: 'google',
    pricePerUnit: 0.30,
    priceUnit: 'second',
    maxResolution: '1080p',
    hasAudio: true,
    avgSpeed: 35,
    qualityRating: 5,
    description: 'Audio natif avec dialogue, physique réaliste, cinématique',
    features: {
      strengths: ['Audio + dialogue', 'Physique réaliste', 'Cinématique'],
      use_cases: ['Vidéos avec narration', 'Effets sonores', 'Production complète']
    },
    isActive: true
  }
];

async function main() {
  console.log('🌱 Seeding model catalog...');

  // Nettoyer les données existantes
  await prisma.modelCatalog.deleteMany({});
  console.log('✅ Existing models cleared');

  // Ajouter les modèles d'images
  for (const model of imageModels) {
    await prisma.modelCatalog.create({
      data: model
    });
  }
  console.log(`✅ ${imageModels.length} image models seeded`);

  // Ajouter les modèles vidéo
  for (const model of videoModels) {
    await prisma.modelCatalog.create({
      data: model
    });
  }
  console.log(`✅ ${videoModels.length} video models seeded`);

  console.log('🎉 Model catalog seeding completed successfully!');
  console.log(`   Total models: ${imageModels.length + videoModels.length}`);
}

main()
  .catch((error) => {
    console.error('❌ Error seeding model catalog:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
