# Plateforme d'Investissement Immobilier

Une application web full-stack pour la gestion de biens immobiliers, d'investissements et de transactions. La plateforme met en relation les promoteurs immobiliers avec les investisseurs et acheteurs potentiels.

## Structure du Projet

Le projet est divisé en deux parties principales :

```
├── backend/          # Application backend NestJS
├── frontend/         # Application frontend React
```

## Fonctionnalités

- 👤 **Gestion des Utilisateurs**
  - Plusieurs rôles utilisateurs (admin, promoteur, acheteur)
  - Authentification par JWT
  - Gestion des profils utilisateurs

- 🏠 **Gestion Immobilière**
  - Liste et détails des biens
  - Upload et gestion des images
  - Suivi du statut des biens (disponible, réservé, vendu)
  - Filtrage et recherche de biens

- 💰 **Fonctionnalités d'Investissement**
  - Création et gestion de projets
  - Suivi des investissements
  - Gestion des transactions
  - Simulation de prêts

- 💬 **Communication**
  - Système de messagerie entre utilisateurs
  - Réservations de biens
  - Mises à jour des projets

## Stack Technologique

### Backend (NestJS)
- **Framework**: NestJS
- **Base de données**: MongoDB avec Mongoose
- **Stockage de fichiers**: MinIO
- **Authentification**: JWT
- **Documentation API**: Swagger/OpenAPI

### Frontend (React)
- **Framework**: React avec TypeScript
- **Style**: Tailwind CSS
- **Gestion d'état**: React Context
- **Routage**: React Router
- **Client HTTP**: Axios
- **Outil de build**: Vite

## Prérequis

- Node.js (v18 ou supérieur)
- MongoDB
- Serveur MinIO
- npm ou yarn

## Installation

1. **Cloner le dépôt**
   ```bash
   git clone <url-du-depot>
   cd Groupe3
   ```

2. **Configuration du Backend**
   ```bash
   cd backend
   npm install
   # Configurer les variables d'environnement
   cp .env.example .env
   # Démarrer le serveur backend
   npm run start:dev
   ```

3. **Configuration du Frontend**
   ```bash
   cd frontend
   npm install
   # Démarrer le serveur de développement frontend
   npm run dev
   ```

4. **Configuration de MinIO**
   - Installer et démarrer le serveur MinIO
   - Créer les buckets requis :
     - `avatars` pour les photos de profil
     - `projets` pour les documents de projet
     - `biens` pour les images des biens immobiliers

## Configuration de l'Environnement

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/real-estate
JWT_SECRET=votre-clé-secrète
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
```

## Rôles et Permissions des Utilisateurs

1. **Administrateur**
   - Gestion de tous les utilisateurs
   - Gestion de tous les biens
   - Accès à toutes les fonctionnalités

2. **Promoteur**
   - Création et gestion des biens
   - Gestion de leurs projets
   - Consultation des réservations

3. **Acheteur**
   - Consultation des biens
   - Réalisation de réservations
   - Simulation de prêts
   - Envoi de messages

## Documentation API

La documentation de l'API est générée automatiquement avec Swagger/OpenAPI et est disponible à l'adresse `/api/docs` lors de l'exécution du serveur backend. 

### Fonctionnalités de la Documentation
- Interface interactive Swagger UI
- Documentation complète de tous les endpoints
- Schémas détaillés des requêtes et réponses
- Support de l'authentification Bearer Token
- Tests des endpoints directement depuis l'interface
- Description des modèles de données
- Exemples de requêtes et réponses

Pour accéder à la documentation :
1. Démarrer le serveur backend (`npm run start:dev`)
2. Ouvrir un navigateur et aller à `http://localhost:3000/api/docs`
3. Explorer l'interface interactive de Swagger UI

La documentation est automatiquement mise à jour grâce aux décorateurs NestJS/Swagger dans le code, assurant ainsi une synchronisation permanente entre le code et la documentation.

## Contribuer

1. Forker le dépôt
2. Créer votre branche de fonctionnalité (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commiter vos changements (`git commit -m 'Ajout d'une nouvelle fonctionnalité'`)
4. Pousser vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

