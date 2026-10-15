# CampusRate API

API REST pour consulter les lieux du campus et publier
des avis.

## Installation

Prérequis : Node.js compatible avec package.json, npm, Git,
MongoDB accessible et OpenSSL.

```bash
git clone https://github.com/dvlya/CompusRate.git
cd CompusRate
git switch feature/TP2
npm ci
```

## Configuration

Créer le fichier `.env` :

```powershell
Copy-Item .env.example .env
```

Remplir les variables :
| --- | --- |
| Variable | Description |
| PORT | Port HTTPS, par exemple 3000 |
| MONGO_URI | URI de connexion à MongoDB |
| JWT_SECRET | Secret aléatoire d’au moins 32 caractères |

Pour Atlas, utiliser son URI, créer un utilisateur de base de données
et autoriser l’adresse IP de l’ordinateur.

Ne pas publier `.env`, les mots de passe, les jetons ou les clés privées.

## HTTPS

Créer le dossier des certificats :

```bash
mkdir certs
```

Générer le certificat :

```bash
openssl req -nodes -new -x509 -keyout certs/server.key -out certs/server.cert -days 365 -subj "/CN=localhost" -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
```

Sous Windows, si `openssl` n’est pas reconnu, remplacer la commande
`openssl` par :

```powershell
& "C:\Program Files\OpenSSL-Win64\bin\openssl.exe"
```

Le dossier `certs/` est exclu de Git. Chaque personne doit générer
son certificat localement.

HTTPS chiffre les échanges et protège leur intégrité. Un certificat
reconnu permet de vérifier l’identité du serveur. Notre certificat étant
autosigné, il faut accepter l’avertissement du navigateur pour localhost.

## Démarrage

```bash
npm run start:dev
```

Avec `PORT=3000` :

- Swagger : https://localhost:3000/docs
- Lieux : https://localhost:3000/api/v1/places
- Redirection : http://localhost:3001/docs → HTTPS, statut 308

Utiliser directement HTTPS pour envoyer les identifiants et les jetons.

## Fonctionnement et validation

Les lieux, les avis et les utilisateurs sont enregistrés dans MongoDB.
Les données sont conservées après le redémarrage de l’API.

| Donnée | Validation |
| --- | --- |
| Nom du lieu | 2 à 100 caractères |
| Description | 10 à 500 caractères |
| Adresse | 5 à 200 caractères |
| Catégorie et statut | Valeurs autorisées dans les énumérations |
| Services | Maximum 20 chaînes distinctes de 1 à 50 caractères |
| Auteur d’un avis | 2 à 100 caractères |
| Commentaire | 5 à 1000 caractères |
| Note | Entier de 1 à 5 |
| Page | Entier à partir de 1 |
| Limite | Entier de 1 à 100 |
| Nom d’utilisateur | 3 à 50 caractères : lettres, chiffres, tirets ou underscores |
| Mot de passe | 8 à 72 caractères, avec au moins un chiffre |

Le ValidationPipe global refuse les propriétés inconnues.
Les identifiants, dates, moyennes et nombres d’avis sont gérés
par le serveur.

Un lieu possédant des avis ne peut pas être supprimé : réponse 409.

## Sécurité et connexion

Helmet ajoute des en-têtes de sécurité.
CORS autorise les origines définies dans `src/configure-app.ts`.
Il contrôle les accès des navigateurs, mais ne remplace pas
l’authentification.

- `POST /api/v1/users` : créer un compte USER.
- `POST /api/v1/auth/login` : obtenir un JWT valable une heure.
- `GET /api/v1/auth/profile` : consulter son profil avec le JWT.

Les mots de passe sont hachés avec bcrypt et un sel.

Dans Swagger, coller le jeton dans Authorize.
Dans Postman, utiliser Authorization → Bearer Token.

Seul ADMIN peut créer, modifier ou supprimer un lieu.
Pour préparer un ADMIN de démonstration, modifier son rôle dans
MongoDB Compass, puis se reconnecter.

## Tests manuels

Importer `postman/CampusRate.postman_collection.json`.
Utiliser HTTPS et un jeton ADMIN pour modifier les lieux.
Pour le certificat autosigné local, désactiver la vérification SSL
dans la requête Postman si nécessaire.

| Scénario obligatoire | Résultat attendu |
| --- | --- |
| Créer un lieu valide | 201 |
| Consulter le lieu enregistré | 200 |
| Redémarrer l’API et consulter le même lieu | 200, données conservées |
| Omettre une propriété obligatoire | 400 |
| Envoyer une catégorie invalide | 400 |
| Envoyer une propriété inconnue ou interdite | 400 |
| Modifier une propriété autorisée | 200 |
| Modifier averageRating avec PATCH | 400, moyenne inchangée |

Tests supplémentaires : profil avec jeton valide → 200,
sans jeton ou avec faux jeton → 401,
création d’un lieu avec USER → 403, avec ADMIN → 201.

Retirer les vrais mots de passe et jetons avant de publier la collection.

## Options réalisées

- A1 : authentification JWT et Swagger Bearer.
- A2 : rôles USER/ADMIN pour la gestion des lieux.
- P1 : filtres MongoDB explicitement autorisés.
- P2 : sélection des propriétés modifiables.
- T1 : explication de HTTPS.
- T2 : HTTPS local.
- T4 : redirection HTTP vers HTTPS.

## Limites

Le certificat autosigné sert au développement local.
Le serveur de redirection utilise le port 3001.

La restriction permettant de gérer uniquement ses propres avis
n’est pas implémentée. Le rôle ADMIN est attribué manuellement
dans MongoDB pour la démonstration.

