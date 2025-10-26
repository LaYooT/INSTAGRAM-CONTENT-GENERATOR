
# Instagram Content Generator 🎬

Application Next.js pour générer du contenu viral pour Instagram avec IA.

## 🌟 Fonctionnalités

- **Génération de contenu IA** : Images et vidéos optimisées pour Instagram
- **Multi-modèles** : Support de plusieurs modèles d'IA (fal.ai)
- **Gestion du budget** : Suivi en temps réel de la consommation
- **Design responsive** : Interface fluide et moderne (mobile-first)
- **Authentification sécurisée** : Système d'authentification avec NextAuth.js
- **Administration** : Gestion des utilisateurs et des modèles

## 🚀 Technologies

- **Frontend** : Next.js 14, React 18, TypeScript
- **Styling** : Tailwind CSS avec système de design fluide
- **UI Components** : Radix UI, Shadcn/ui
- **Backend** : Next.js API Routes
- **Base de données** : PostgreSQL avec Prisma ORM
- **Authentification** : NextAuth.js
- **IA** : fal.ai API

## 📦 Installation

1. Cloner le repository :
```bash
git clone https://github.com/VOTRE_USERNAME/instagram-content-generator.git
cd instagram-content-generator/nextjs_space
```

2. Installer les dépendances :
```bash
yarn install
```

3. Configurer les variables d'environnement :
```bash
cp .env.example .env
```

Remplir les variables suivantes dans `.env` :
- `DATABASE_URL` : URL de connexion PostgreSQL
- `NEXTAUTH_SECRET` : Clé secrète pour NextAuth
- `NEXTAUTH_URL` : URL de l'application
- `FAL_KEY` : Clé API fal.ai

4. Initialiser la base de données :
```bash
yarn prisma generate
yarn prisma db push
yarn prisma db seed
```

5. Lancer le serveur de développement :
```bash
yarn dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 📚 Documentation

- [Responsive Implementation](/RESPONSIVE_IMPLEMENTATION_COMPLETE.md)
- [Budget Integration](/INTEGRATION_BUDGET_FALAI.md)
- [Model Selection](/IMPLEMENTATION_SELECTION_MODELES.md)
- [Security & Administration](/SECURITE_ADMINISTRATION.md)
- [UX Improvements](/CORRECTIONS_APPLIQUEES.md)

## 🔧 Configuration

### Modèles IA disponibles

L'application supporte plusieurs modèles d'IA configurables :
- Génération d'images (Flux, SDXL, etc.)
- Génération de vidéos (AnimateDiff, etc.)
- Amélioration de prompts

Les modèles peuvent être configurés dans l'interface d'administration.

### Budget

Le système de budget permet de :
- Définir un budget mensuel personnalisé
- Suivre la consommation en temps réel
- Estimer les coûts avant génération
- Accéder directement au dashboard fal.ai

## 🛠️ Scripts disponibles

- `yarn dev` : Lancer le serveur de développement
- `yarn build` : Construire l'application pour la production
- `yarn start` : Lancer l'application en production
- `yarn lint` : Vérifier le code avec ESLint
- `yarn prisma:generate` : Générer le client Prisma
- `yarn prisma:push` : Synchroniser le schéma avec la base de données
- `yarn prisma:seed` : Alimenter la base de données avec des données de test

## 📱 Design System

L'application utilise un système de design fluide basé sur :
- Typographie fluide avec `clamp()`
- Espacement fluide et réactif
- Grille responsive
- Approche mobile-first

Voir [RESPONSIVE_IMPLEMENTATION_COMPLETE.md](/RESPONSIVE_IMPLEMENTATION_COMPLETE.md) pour plus de détails.

## 🔒 Sécurité

- Authentification sécurisée avec NextAuth.js
- Gestion des rôles (admin/user)
- Protection des routes et API
- Variables d'environnement pour les secrets

## 👤 Compte administrateur

Le compte administrateur par défaut est configuré lors du seed initial.
Pour plus d'informations, voir [UTILISATEUR_UNIQUE.md](/UTILISATEUR_UNIQUE.md).

## 📄 Licence

Ce projet est privé et destiné à un usage personnel.

## 🤝 Support

Pour toute question ou problème, créer une issue sur GitHub.

---

Développé avec ❤️ pour créer du contenu viral sur Instagram
