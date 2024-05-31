# Système de Gestion des Assignments - Backend

Ce projet représente la partie backend du Système de Gestion des Assignments, développé avec Node.js et Express. Il fournit des API pour gérer les assignments, les matières, les professeurs et les élèves.

## Table des matières
- [Structure Projet](#structure-projet)
- [Fonctionnalités](#fonctionnalités)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Déploiement](#déploiement)
- [Endpoints de l'API](#endpoints-de-lapi)
- [Contributions](#contributions)

## Structure Projet

    AssignEasy-BackEnd /
    .   / config/
    .   / node_modules/
    .   / uploads/
    .   src
        .   . / controllers/
        .   . / database/
        .   . / models/
        .   . / routes/
        .   . / services/
    .   / views/
    .   server.js
    .   .env
    .   .env.example
    .   .gitignore
    .   package.json
    .   README.md



## Fonctionnalités
- **Assignments**
  - Opérations CRUD pour les assignments.
  - Pagination et recherche.
  - Marquer les assignments comme rendus avec des notes et des remarques.
- **Matières**
  - Opérations CRUD pour les matières.
- **Professeurs**
  - Opérations CRUD pour les professeurs.
- **Auteurs (élèves)**
  - Opérations CRUD pour les auteurs.
- **Authentification**
  - Seul un administrateur authentifié peut ajouter, modifier ou supprimer des éléments.

## Installation
1. Cloner le dépôt :
   ```bash
   git clone https://github.com/votre-utilisateur/assignment-management-backend.git
   cd assignment-management-backend
    ```

2. Installer les dépendances :
    ```bash
    npm install
   ```

## Utilisation
1. Démarrer le serveur :
  ```bash
  npm start
  ```

3. L'API sera disponible à http://localhost:3000/.

## Déploiement
1. Déployer sur Render.com.
2. Lien back deployement https://assignease-backend-b8rt.onrender.com/
3. Branche stable et final `features/release-prod`
4. Lien front :
  - Git (Readme) https://github.com/Claud-mja/AssignEase-FrontApp/blob/features/preprod/README.md
  - deployement https://assignease-frontapp.onrender.com/

## Endpoints de l'API
- Lien postman pour les API https://www.postman.com/speeding-desert-678485/workspace/assigne-easy

## Contributions

### TOMBOANJARA Claudio

#### Assignments :
- Création des fonctions d'ajout d'une nouvelle assignment (Controller, Route et Service).
- Création des fonctions de modification d'une assignment (Controller, Route et Service).
- Création des fonctions de suppression d'une assignment (Controller, Route et Service).
- Création des fonctions pour lister les assignments avec pagination et filtre ou recherche (Controller, Route et Service).

#### Matières :
- Création des fonctions d'ajout d'une nouvelle matière (Controller, Route et Service).
- Création des fonctions de modification d'une matière (Controller, Route et Service).
- Création des fonctions de suppression d'une matière et suppression des relations et de l'image associée (Controller, Route et Service).
- Création des fonctions pour lister les matières (Controller, Route et Service).

#### Upload d'image :
- Création de la fonction générique pour uploader une image.

### ANTOENJARA Noam Francisco

#### Auteurs :
- Création des fonctions d'ajout d'un nouvel auteur (Controller, Route et Service).
- Création des fonctions de modification d'un auteur (Controller, Route et Service).
- Création des fonctions de suppression d'un auteur et suppression des relations et de l'image associée (Controller, Route et Service).
- Création des fonctions pour lister les auteurs (Controller, Route et Service).

#### Professeurs :
- Création des fonctions d'ajout d'un nouveau professeur (Controller, Route et Service).
- Création des fonctions de modification d'un professeur (Controller, Route et Service).
- Création des fonctions de suppression d'un professeur et suppression des relations et de l'image associée (Controller, Route et Service).
- Création des fonctions pour lister les professeurs (Controller, Route et Service).

#### Authentification (gestion de JWT token) :
- Création des fonctions pour vérifier le token.
- Création des fonctions pour hasher le mot de passe.
- Création des fonctions pour gérer l'authentification (Controller, Route et Service).
