# Dernier Service

Prototype web d'un jeu d'horreur de poursuite, hébergé dans `zytraxion-web/esquive-game`.

## Structure du projet

```text
.
├── index.html          # Prototype 3D solo de l'hôpital
├── menu.html           # Menu principal
├── README.md
└── src/
    ├── main.js         # Menu, boutique, progression et paramètres
    ├── menu.css        # Habillage responsive
    ├── settings.js     # Préférences locales audio/vidéo
    └── profile.js      # Profil, monnaie, XP, niveaux, quêtes, succès, inventaire
```

## Lancer le jeu

Depuis la racine du dépôt, lancez un serveur HTTP local :

```bash
python -m http.server 8000
```

Ouvrez `http://localhost:8000/menu.html` pour le menu principal. Cliquez sur **Jouer** pour ouvrir `index.html`, le prototype 3D. Les modules JavaScript ES doivent être servis en HTTP et peuvent ne pas fonctionner en ouvrant directement un fichier `file://`.

## Fonctionnalités présentes

- Menu principal et prototype 3D solo existant.
- Paramètres de volume et qualité conservés dans le navigateur. Le volume est une préférence enregistrée ; il ne contrôle pas encore une piste audio du jeu.
- Profil local avec niveau, XP, monnaie, inventaire, parties, échappées, dossiers récupérés et meilleur temps.
- Sauvegarde automatique dans `localStorage`, avec validation des données et migration par version.
- Boutique locale d'apparences pour le menu. Le profil de départ reçoit 250 pièces ; les apparences ne modifient pas encore les objets 3D du jeu.
- Quêtes quotidiennes, réclamables lorsque leurs critères sont remplis, et succès suivis dans le profil.

## Limites importantes

Le jeu n'est pas encore « complet » au sens de la demande initiale. La boucle du prototype 3D n'est pas encore connectée au profil : les appels `recordRun()` de `src/profile.js` doivent être raccordés à l'écran de fin de partie de `index.html` pour accorder les récompenses et faire progresser les quêtes. Les quêtes restent donc à 0 tant que cette intégration n'est pas faite.

Les sauvegardes sont locales à un navigateur et un appareil ; elles ne sont ni sécurisées ni synchronisées. La boutique locale est une première ébauche de progression, pas une économie multijoueur sécurisée. Il n'y a pas encore de serveur multijoueur, matchmaking, authentification, serveur faisant autorité, ni système anti-triche. Une version PC multijoueur publiée nécessite de choisir une plateforme et d'héberger un serveur (la structure HTML seule ne peut pas fournir ces services).

## Prochaine étape

Relier la fin d'une partie du prototype au profil pour que victoire/défaite, dossiers trouvés, monnaie, XP et quêtes soient réellement mis à jour. Ensuite : choisir le moteur et l'architecture réseau cible avant d'ajouter des parties multijoueur persistantes.
