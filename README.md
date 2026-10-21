# Gestion des demandes d’attestations

Application web permettant aux employés et stagiaires de demander des attestations, puis aux validateurs et administrateurs de suivre et traiter ces demandes.

## Organisation du dépôt

- `my-project/` : interface web en React. Elle fournit les espaces de connexion, employé, validateur et administrateur.
- `api/` : API et application serveur Laravel. Elle gère notamment les utilisateurs, rôles, demandes et validations d’attestations, notifications et téléchargements de documents.

## Technologies

- Frontend : React, React Router, Axios et Tailwind CSS.
- Backend : PHP, Laravel 10, Laravel Sanctum, Composer.

## Prérequis

- Node.js et npm
- PHP 8.1 ou plus récent
- Composer
- Une base de données configurée pour Laravel

## Installation

### 1. Backend Laravel

```powershell
cd api
composer install
Copy-Item .env.example .env
php artisan key:generate
```

Configurez ensuite les paramètres de base de données et de messagerie dans `api/.env`, puis exécutez les migrations si nécessaire :

```powershell
php artisan migrate
php artisan serve
```

L’API démarre par défaut à `http://127.0.0.1:8000`.

### 2. Frontend React

Dans un autre terminal :

```powershell
cd my-project
npm install
npm start
```

Le frontend démarre généralement à `http://localhost:3000`. Vérifiez la configuration de l’URL de l’API dans le code du frontend si votre backend utilise une adresse différente.

## Sécurité et fichiers locaux

Ne partagez pas le fichier `api/.env` : il contient la configuration locale et peut contenir des secrets. Il est ignoré par Git. Les répertoires de dépendances (`api/vendor` et `my-project/node_modules`) sont également exclus ; ils se reconstruisent avec Composer et npm.
