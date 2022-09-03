# Projet 7 Développeur Web OpenClassrooms

### Créez un réseau social d'entreprise
- - - -
## Mise en place du Back-End:

Pour installer les dépendances, entrer dans le répertoire back et taper depuis un terminal : `npm install`

Créer un fichier `.env` à la racine du répertoire back et ajouter les données suivantes :

`DB='mettre les informations de connexion à votre base de données Atlas MongoDB'`

`TOKEN='Votre clé secrète pour le token JWT'`

`ADMIN_ID='Mettre l'ID de l'utilisateur qui aura les droits d'administration, l'ID peut être récupéré depuis la base de données après l'avoir créé depuis l'application'`

`PORT='4000 ou le port de votre choix à savoir que l'application Front-End tourne sur le port 3000'`

Créer un répertoire `images` à la racine du dossier back pour pouvoir enregistrer les images provenants du Front-End.

Par défaut le Back-end fonctionne sur le port TCP 4000, cela peut être modifié depuis le fichier `server.js` à la

## Mise en place du Front-End :

Pour installer les dépendances, entrer dans le répertoire front et taper depuis un terminal : `npm install`

Créer un fichier `.env` à la racine du répertoire front et ajouter les données suivantes :

`REACT_APP_ADMIN_ID='Mettre l'ID de l'utilisateur qui aura les droits d'administration, l'ID peut être récupéré depuis la base de données après l'avoir créé depuis l'application ou le récupérer depuis le fichier .env du Back-End'`

Par défaut le Front-End fonctionne sur le port TCP 3000

## Démarrage de l'application

Pour lancer le Back-End de l'application, aller dans le répertoire back et taper depuis un terminal `npm start`, attendre le message dans le terminal qui indique que la connexion à la base de données est fonctionnelle

Et pour lancer le Front-End, aller dans le répertoire front et taper depuis un terminal `npm start`
