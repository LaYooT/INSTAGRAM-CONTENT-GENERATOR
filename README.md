
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

### 🤖 Génération IA avec Runware.ai

#### Images (Transformation)
- Modèle : **Flux Schnell** (rapide et économique)
- Input : Photo originale + prompt
- Output : Image transformée 1080x1920
- Coût : ~$0.0013 par image

#### Vidéos (Animation)
- Modèle : **Hailuo AI v2**
- Input : Image + prompt vidéo
- Output : Vidéo animée 1080x1920 (format Instagram Reels)
- Durée : 5 secondes
- Coût : ~$0.0668 par vidéo

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
- Image transformée : $0.0013
- Vidéo (5 sec) : $0.0668
- **Total : ~$0.07 par Reel**

### Budget Mensuel 20€
Avec votre budget de 20€/mois, vous pouvez générer :
- **~285 Reels complets** (image + vidéo)
- OU ~16,500 images seules
- OU ~322 vidéos seules

### Exemple d'Utilisation
- 10 Reels/jour = 300/mois = ~$21
- 5 Reels/jour = 150/mois = ~$10.50
- 3 Reels/jour = 90/mois = ~$6.30

## 🚀 Démarrage

### Prérequis
- Node.js 18+
- Yarn
- Compte Runware.ai (clé API configurée ✅)

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
- ✅ `RUNWARE_API_KEY` - Génération IA
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
│   │   ├── runware.ts          # 🆕 Intégration Runware API
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
  transformedImageUrl  String?  // Runware URL
  animatedVideoUrl     String?  // Runware URL
  finalVideoUrl        String?  // Runware URL
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

#### "Runware API key not configured"
- Vérifier que `RUNWARE_API_KEY` est dans `.env`
- Redémarrer le serveur

#### "Failed to upload file"
- Vérifier la taille (<10MB)
- Vérifier le format (JPEG, PNG, WebP)

#### "Processing failed"
- Vérifier les logs console
- Vérifier le crédit Runware
- Vérifier la connectivité réseau

## 📈 Monitoring

### Métriques à Surveiller
- Nombre de générations/jour
- Coût total mensuel
- Taux de succès des jobs
- Temps moyen de traitement

### Runware Dashboard
Consultez votre usage sur : https://my.runware.ai/
- Crédits restants
- Historique des requêtes
- Statistiques de coûts

## 🎨 Personnalisation

### Modèles Runware
Vous pouvez changer les modèles dans `lib/runware.ts` :

```typescript
// Images
model: 'runware:100@1'  // Flux Schnell (défaut)
// Autres options : SDXL, Flux Pro, etc.

// Vidéos
model: 'hailuo:v2@1'    // Hailuo AI (défaut)
// Autres options : Kling AI, etc.
```

### Durée Vidéo
Modifier dans `lib/runware.ts` :
```typescript
duration: 5  // secondes (défaut)
// Max : 10 secondes
```

### Résolution
Actuellement : 1080x1920 (Instagram Reels)
Modifiable dans `lib/runware.ts`

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
- `RUNWARE_API_KEY`
- `ABACUSAI_API_KEY`

## 🤝 Support

### Runware.ai
- Documentation : https://runware.ai/docs
- Support : https://my.runware.ai/support
- Essai gratuit : ~1000 images

### Problèmes avec l'App
- Vérifier les logs console
- Vérifier la configuration `.env`
- Vérifier les crédits API

## 📝 Changelog

### v2.0 (Current) - Runware.ai Integration ✅
- ✅ Intégration complète Runware.ai
- ✅ Génération réelle d'images (Flux Schnell)
- ✅ Génération réelle de vidéos (Hailuo AI)
- ✅ Amélioration de prompts avec LLM
- ✅ Format Instagram Reels natif
- ✅ Coûts optimisés (7-8x moins cher)

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
- Surveillez vos crédits Runware

---

**Made with ❤️ using Runware.ai, Next.js, and Abacus.AI**
