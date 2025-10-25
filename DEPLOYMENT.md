
# 🚀 Guide de Déploiement - Instagram Content Generator

## ✅ État Actuel

### Application
- ✅ **Build réussi** : Pas d'erreurs TypeScript
- ✅ **Tests passés** : Tous les tests de validation OK
- ✅ **Checkpoint créé** : Version sécurisée sauvegardée
- ✅ **Production ready** : Prêt pour déploiement

### Intégrations
- ✅ Runware.ai configuré
- ✅ Base de données PostgreSQL
- ✅ Stockage cloud AWS S3
- ✅ LLM APIs Abacus.AI
- ✅ Authentification NextAuth

## 🎯 Options de Déploiement

### Option 1 : Déploiement via UI (Recommandé) ⭐

**Le plus simple et rapide !**

1. Dans l'interface DeepAgent, cliquez sur le bouton **"Deploy"**
2. L'app sera automatiquement déployée
3. Vous recevrez une URL publique (ex: `your-app.abacusai.app`)
4. **C'est tout !** 🎉

**Avantages :**
- Déploiement en 1 clic
- URL publique instantanée
- Variables d'environnement automatiquement configurées
- SSL/HTTPS inclus
- Monitoring intégré

### Option 2 : Déploiement Vercel

1. **Connecter le projet à Git**
```bash
cd /home/ubuntu/instagram_content_generator
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

2. **Sur Vercel**
- Aller sur https://vercel.com
- Cliquer "New Project"
- Importer votre repo
- Framework Preset : **Next.js**
- Root Directory : `nextjs_space`

3. **Configurer les Variables d'Environnement**

Dans Vercel > Project > Settings > Environment Variables :

```env
DATABASE_URL=postgresql://role_1061a6bb27:je7XDlcer9s2uBxqwATF7_UKt_TrS4Pj@db-1061a6bb27.db002.hosteddb.reai.io:5432/1061a6bb27?connect_timeout=15

NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=hkDUvvfbRlmW8ObN3N0QYa5OOM8EbIwc

AWS_PROFILE=hosted_storage
AWS_REGION=us-west-2
AWS_BUCKET_NAME=abacusai-apps-aec1f5057b2188913e9c0913-us-west-2
AWS_FOLDER_PREFIX=7587/

RUNWARE_API_KEY=key_6169e674188eae8e614c341f51e0d2b9996b9f3dacc4b1093813256a66c1f056903e42dea00b0388709033f00d37917cbf0dd1c389c4a4eb2f2d62dcddac30c6

ABACUSAI_API_KEY=b96b7daae80c40e899b3b4adad9adfcb
```

4. **Déployer**
- Cliquer "Deploy"
- Attendre 2-3 minutes
- Votre app sera live !

### Option 3 : Déploiement Netlify

1. **Sur Netlify**
- Aller sur https://netlify.com
- Cliquer "Add new site" > "Import an existing project"
- Connecter votre repo Git

2. **Build Settings**
```
Base directory: nextjs_space
Build command: yarn build
Publish directory: nextjs_space/.next
```

3. **Configurer les Variables d'Environnement**
(Mêmes variables que Vercel ci-dessus)

4. **Déployer**
- Cliquer "Deploy site"
- Votre app sera live en quelques minutes

## 🔐 Sécurité Avant Déploiement

### ⚠️ IMPORTANT : Changez ces valeurs

#### 1. NEXTAUTH_SECRET
```bash
# Générer une nouvelle clé secrète
openssl rand -base64 32
```
Mettez cette valeur dans `NEXTAUTH_SECRET`

#### 2. NEXTAUTH_URL
Changez pour votre URL de production :
```env
NEXTAUTH_URL=https://your-actual-domain.com
```

#### 3. Vérifier les Clés API
- ✅ `RUNWARE_API_KEY` : Déjà configurée
- ✅ `ABACUSAI_API_KEY` : Déjà configurée
- ✅ `AWS_*` : Déjà configurées

## 🗄️ Base de Données

### PostgreSQL Existante
Votre base de données est déjà configurée et hébergée :
```
Host: db-1061a6bb27.db002.hosteddb.reai.io
Port: 5432
Database: 1061a6bb27
```

**Rien à faire !** ✅

### Migrations Prisma
Si vous modifiez le schéma plus tard :
```bash
cd nextjs_space
yarn prisma migrate deploy
```

## 📦 Checklist Pré-Déploiement

### Configuration ✅
- [x] Variables d'environnement configurées
- [x] Base de données connectée
- [x] Stockage S3 configuré
- [x] APIs intégrées (Runware, Abacus.AI)
- [x] Authentification configurée

### Tests ✅
- [x] Build réussi (0 erreurs)
- [x] TypeScript validation passée
- [x] Pages principales testées
- [x] APIs testées

### Sécurité ⚠️
- [ ] **CHANGEZ `NEXTAUTH_SECRET`** (Important !)
- [ ] **CHANGEZ `NEXTAUTH_URL`** pour prod
- [ ] Vérifier que les clés API ne sont PAS dans le code client

### Performance ✅
- [x] Images optimisées
- [x] Code splitté
- [x] CSS minifié
- [x] Build optimisé pour production

## 🎛️ Configuration Post-Déploiement

### 1. Tester l'Application
```bash
# Remplacez par votre URL de prod
curl https://your-app.vercel.app/api/auth/providers
```
Devrait retourner HTTP 200

### 2. Créer le Premier Compte
1. Aller sur `https://your-app/auth/signup`
2. Créer votre compte admin
3. Se connecter

### 3. Tester une Génération
1. Upload une image
2. Entrer des prompts
3. Vérifier que la génération fonctionne
4. Télécharger le résultat

### 4. Vérifier les Coûts
- Aller sur https://my.runware.ai/
- Vérifier les crédits utilisés
- Surveiller les coûts

## 📊 Monitoring

### Logs Vercel/Netlify
- Dashboard > Project > Logs
- Voir les erreurs en temps réel
- Alertes automatiques

### Runware Dashboard
- https://my.runware.ai/
- Usage quotidien/mensuel
- Coûts par API call
- Historique des requêtes

### Database
- Prisma Studio (local) :
```bash
cd nextjs_space
yarn prisma studio
```

## 🐛 Troubleshooting

### Build Failed
```bash
# Vérifier les logs
yarn build

# Vérifier TypeScript
yarn tsc --noEmit
```

### Runtime Errors

#### "Runware API key not configured"
- Vérifier `RUNWARE_API_KEY` dans env vars
- Redéployer

#### "Database connection failed"
- Vérifier `DATABASE_URL`
- Vérifier que la DB est accessible depuis internet

#### "S3 upload failed"
- Vérifier les credentials AWS
- Vérifier les permissions du bucket

### CORS Issues
Si problèmes CORS, ajouter dans `next.config.js` :
```javascript
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: '*' },
      ],
    },
  ];
}
```

## 🔄 Mises à Jour

### Déployer une Nouvelle Version
1. Faire vos modifications localement
2. Tester avec `yarn dev`
3. Build : `yarn build`
4. Commit : `git commit -am "Update"`
5. Push : `git push`
6. Auto-déployé par Vercel/Netlify !

### Rollback
Sur Vercel/Netlify :
- Dashboard > Deployments
- Cliquer sur une version précédente
- "Promote to Production"

## 💰 Coûts Estimés

### Hébergement

**Option UI Deploy (Abacus.AI)**
- Inclus dans votre abonnement
- Pas de coût supplémentaire

**Vercel**
- Free tier : Suffisant pour commencer
- Pro : $20/mois si besoin de plus

**Netlify**
- Free tier : Suffisant pour commencer
- Pro : $19/mois si besoin de plus

### APIs

**Runware.ai**
- Pay-as-you-go
- ~$0.07 par Reel complet
- Budget 20€ = ~285 Reels/mois

**Autres**
- PostgreSQL : Déjà inclus
- S3 Storage : Déjà inclus
- Abacus.AI LLM : Déjà inclus

## 📈 Scaling

### Si Trafic Augmente

**Base de Données**
- La DB actuelle peut gérer des milliers d'utilisateurs
- Si besoin, migrer vers un plan supérieur

**APIs**
- Runware.ai scale automatiquement
- Ajouter des crédits selon besoin

**Storage**
- S3 scale automatiquement
- Coût selon usage

## 🎉 Prêt à Déployer !

### Commande Rapide (Option UI)
1. Cliquez sur **"Deploy"** dans l'interface
2. C'est tout ! 🚀

### Commande Vercel
```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
cd /home/ubuntu/instagram_content_generator/nextjs_space
vercel --prod
```

---

**Besoin d'aide ?** Vérifiez les logs ou consultez la documentation de votre plateforme de déploiement.

**Succès !** 🎊 Votre app de génération de contenu viral Instagram est maintenant live !
