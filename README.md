
# 🎬 Instagram Content Generator - Production Ready

Application complète de génération de contenu viral pour Instagram Reels avec IA.

## ✨ Fonctionnalités

### 🔐 Authentification
- Inscription et connexion sécurisées
- Gestion de sessions avec NextAuth.js
- Protection des routes API et pages

### 📤 Upload & Storage
- Upload d'images vers le cloud (AWS S3)
- Support des formats : JPEG, PNG, WebP
- Taille max : 10 MB par image
- URLs sécurisées avec expiration

### 🤖 Génération IA avec FAL.ai

**⚠️ Important :** Cette application utilise le SDK officiel `@fal-ai/serverless-client` pour une intégration fiable et optimisée avec FAL.ai.

#### Images (Transformation)
- Modèle : **Flux Dev** (haute qualité)
- Input : Photo originale + prompt
- Output : Image transformée 1080x1920
- Coût : ~$0.025 par image
- SDK : `fal.subscribe('fal-ai/flux/dev/image-to-image')`

#### Vidéos (Animation)
- Modèle : **Luma Dream Machine**
- Input : Image + prompt vidéo
- Output : Vidéo animée format 9:16 (Instagram Reels)
- Durée : 5 secondes
- Coût : ~$0.05 par vidéo
- SDK : `fal.subscribe('fal-ai/luma-dream-machine/image-to-video')`

### 💬 Amélioration de Prompts
- Utilise Abacus.AI LLM APIs
- Améliore automatiquement vos prompts
- Suggestions créatives en temps réel
- Gratuit (pas de coût supplémentaire)

### 📊 Dashboard
- Suivi en temps réel des jobs
- Progression par étapes :
  1. **TRANSFORM** : Transformation de l'image (0-40%)
  2. **ANIMATE** : Génération de la vidéo (40-80%)
  3. **FORMAT** : Optimisation Instagram (80-100%)
- Téléchargement des vidéos finales
- Historique des générations

## 💰 Coûts Estimés

### Par Génération Complète
- Image transformée : $0.025
- Vidéo (5 sec) : $0.05
- **Total : ~$0.075 par Reel**

### Budget Mensuel 20€
Avec votre budget de 20€/mois, vous pouvez générer :
- **~266 Reels complets** (image + vidéo)
- OU ~800 images seules
- OU ~400 vidéos seules

### Exemple d'Utilisation
- 10 Reels/jour = 300/mois = ~$22.50
- 8 Reels/jour = 240/mois = ~$18
- 5 Reels/jour = 150/mois = ~$11.25

## 🚀 Démarrage

### Prérequis
- Node.js 18+
- Yarn
- Compte FAL.ai (clé API configurée ✅)

### Installation
```bash
cd nextjs_space
yarn install
```

### Configuration
Les variables d'environnement sont déjà configurées dans `.env` :
- ✅ `DATABASE_URL` - PostgreSQL
- ✅ `NEXTAUTH_SECRET` - Auth sécurisée
- ✅ `AWS_BUCKET_NAME` - Stockage cloud
- ✅ `FAL_API_KEY` - Génération IA
- ✅ `ABACUSAI_API_KEY` - Amélioration prompts

### Développement
```bash
yarn dev
```
Ouvrir http://localhost:3000

### Production
```bash
yarn build
yarn start
```

## 📱 Utilisation

### 1. Inscription/Connexion
- Créez un compte sur `/auth/signup`
- Ou connectez-vous sur `/auth/login`

### 2. Créer un Reel
1. Allez sur le Dashboard (`/dashboard`)
2. Cliquez sur "Upload Photo"
3. Sélectionnez votre image
4. Entrez vos prompts :
   - **Prompt Image** : Comment transformer l'image
   - **Prompt Vidéo** : Quel type d'animation
5. Optionnel : Cliquez sur "✨ Enhance" pour améliorer vos prompts
6. Cliquez sur "Generate Content"

### 3. Suivi de la Progression
- Suivez l'avancement en temps réel
- 3 étapes : Transform → Animate → Format
- Temps estimé : 15-30 secondes

### 4. Téléchargement
- Une fois terminé, cliquez sur "Download Video"
- Format : MP4, 1080x1920 (Instagram Reels)
- Prêt à publier !

## 🏗️ Architecture

```
instagram_content_generator/
├── nextjs_space/
│   ├── app/
│   │   ├── api/
│   │   │   ├── upload/         # Upload & traitement
│   │   │   ├── jobs/           # Suivi des jobs
│   │   │   ├── enhance-prompt/ # Amélioration prompts
│   │   │   ├── auth/           # Authentication
│   │   │   └── download/       # Téléchargement
│   │   ├── dashboard/          # Dashboard principal
│   │   ├── auth/               # Pages auth
│   │   └── page.tsx            # Landing page
│   ├── lib/
│   │   ├── fal.ts              # 🆕 Intégration FAL.ai API
│   │   ├── media-generator.ts  # 🆕 Génération média
│   │   ├── s3.ts               # Gestion S3
│   │   ├── auth.ts             # Configuration auth
│   │   └── db.ts               # Prisma client
│   └── prisma/
│       └── schema.prisma       # Schéma DB
```

## 🔒 Sécurité

### Variables d'Environnement
- ✅ Toutes les clés API sont dans `.env`
- ✅ Jamais exposées côté client
- ✅ Chargées uniquement côté serveur

### Authentification
- ✅ Sessions sécurisées avec NextAuth
- ✅ Protection des routes API
- ✅ Validation des permissions

### Stockage
- ✅ Fichiers uploadés vers S3
- ✅ URLs signées avec expiration
- ✅ Pas de stockage local

## 🎯 Optimisations

### Coûts
- Utilise **Flux Schnell** (7.7x moins cher que les alternatives)
- Utilise **Hailuo AI** (7.5x moins cher que les alternatives)
- Format Instagram natif (pas de retraitement)

### Performance
- Génération ultra-rapide (~15-30 sec)
- API asynchrone (pas de blocage)
- Polling intelligent pour le suivi

### UX
- Interface moderne et intuitive
- Feedback en temps réel
- Messages d'erreur clairs

## 📊 Base de Données

### Schema
```prisma
model User {
  id            String        @id @default(cuid())
  email         String        @unique
  password      String
  name          String?
  contentJobs   ContentJob[]
}

model ContentJob {
  id                   String   @id @default(cuid())
  userId               String
  originalImageUrl     String   // S3 key
  imagePrompt          String
  videoPrompt          String
  transformedImageUrl  String?  // FAL.ai URL
  animatedVideoUrl     String?  // FAL.ai URL
  finalVideoUrl        String?  // FAL.ai URL
  status               String   // PENDING|PROCESSING|COMPLETED|FAILED
  progress             Int      // 0-100
  currentStage         String   // TRANSFORM|ANIMATE|FORMAT|COMPLETED
  errorMessage         String?
  createdAt            DateTime
  updatedAt            DateTime
  completedAt          DateTime?
}
```

## 🔧 API Endpoints

### POST /api/upload
Upload une image et lance la génération
```json
{
  "file": File,
  "imagePrompt": "string",
  "videoPrompt": "string"
}
```

### GET /api/jobs
Liste tous les jobs de l'utilisateur
```json
[
  {
    "id": "...",
    "status": "PROCESSING",
    "progress": 45,
    ...
  }
]
```

### GET /api/jobs/[id]
Détails d'un job spécifique

### DELETE /api/jobs/[id]
Supprime un job

### POST /api/enhance-prompt
Améliore un prompt avec IA
```json
{
  "prompt": "string",
  "type": "image" | "video"
}
```

### GET /api/download/[id]
Télécharge la vidéo finale

## 🐛 Debugging

### Logs
Les logs sont disponibles dans la console :
```
[Job abc123] Starting image transformation...
[Job abc123] Starting video animation...
[Job abc123] Formatting for Instagram...
[Job abc123] Processing completed successfully!
```

### Erreurs Courantes

#### "FAL.ai API key not configured"
- Vérifier que `FAL_API_KEY` est dans `.env`
- Redémarrer le serveur

#### "Failed to upload file"
- Vérifier la taille (<10MB)
- Vérifier le format (JPEG, PNG, WebP)

#### "Processing failed"
- Vérifier les logs console
- Vérifier le crédit FAL.ai
- Vérifier la connectivité réseau

## 📈 Monitoring

### Métriques à Surveiller
- Nombre de générations/jour
- Coût total mensuel
- Taux de succès des jobs
- Temps moyen de traitement

### FAL.ai Dashboard
Consultez votre usage sur : https://fal.ai/dashboard
- Crédits restants
- Historique des requêtes
- Statistiques de coûts

## 🎨 Personnalisation

### Modèles FAL.ai
Vous pouvez changer les modèles dans `lib/fal.ts` :

```typescript
// Images
'/fal-ai/flux/dev/image-to-image'  // Flux Dev (défaut)
// Autres options : flux-pro, flux/schnell, etc.

// Vidéos
'/fal-ai/luma-dream-machine/image-to-video'  // Luma (défaut)
// Autres options : minimax/video-01, etc.
```

### Durée Vidéo
Modifier dans `lib/fal.ts` :
```typescript
duration: 5  // secondes (défaut)
// Max : variable selon le modèle
```

### Résolution
Actuellement : 1080x1920 (Instagram Reels)
Modifiable dans `lib/fal.ts`

## 🚢 Déploiement

### Option 1 : Bouton Deploy (UI)
- Cliquez sur le bouton "Deploy" dans l'interface
- URL publique générée automatiquement

### Option 2 : Vercel/Netlify
1. Connecter le repo Git
2. Configurer les variables d'environnement
3. Déployer

### Variables d'Environnement Requises
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (URL de prod)
- `AWS_BUCKET_NAME`
- `AWS_REGION`
- `AWS_PROFILE`
- `FAL_API_KEY`
- `ABACUSAI_API_KEY`

## 🤝 Support

### FAL.ai
- Documentation : https://fal.ai/docs
- Support : https://fal.ai/dashboard
- Crédits gratuits pour tester

### Problèmes avec l'App
- Vérifier les logs console
- Vérifier la configuration `.env`
- Vérifier les crédits API

## 📝 Changelog

### v3.0 (Current) - FAL.ai Integration ✅
- ✅ Migration vers FAL.ai (plus stable)
- ✅ Génération d'images haute qualité (Flux Dev)
- ✅ Génération de vidéos (Luma Dream Machine)
- ✅ Amélioration de prompts avec LLM
- ✅ Format Instagram Reels natif
- ✅ Coûts compétitifs et qualité supérieure

### v2.0 - Runware.ai Integration
- Première intégration IA pour génération réelle

### v1.0 - Initial Release
- Interface utilisateur complète
- Authentification
- Upload vers S3
- Simulation de génération

## 🎯 Roadmap

### Prochaines Fonctionnalités
- [ ] Batch processing (plusieurs images)
- [ ] Templates de prompts prédéfinis
- [ ] Historique avec preview
- [ ] Export vers Instagram direct
- [ ] Analytics de performance
- [ ] Support de musique (audio)
- [ ] Effets et transitions

## 💡 Conseils d'Utilisation

### Pour de Meilleurs Résultats

**Prompts Image :**
- Soyez spécifique : "Portrait cinématique avec éclairage dramatique"
- Mentionnez le style : "Style film noir", "Aesthetic vaporwave"
- Utilisez "✨ Enhance" pour des suggestions

**Prompts Vidéo :**
- Décrivez le mouvement : "Zoom avant lent", "Rotation 360°"
- Ajoutez l'ambiance : "Éthéré", "Énergique", "Mystérieux"
- Testez différentes variations

### Optimisation Budget
- Utilisez l'amélioration de prompts pour éviter les ratés
- Testez avec 1-2 générations avant batch
- Surveillez vos crédits FAL.ai

---

**Made with ❤️ using FAL.ai, Next.js, and Abacus.AI**
