# Dernier Service

## Tester le jeu

Ouvre le menu et le jeu dans la même page : **https://zytraxion-web.github.io/esquive-game/play.html**. Clique sur **Jouer**, choisis une carte, puis clique sur **Entrer**. Le bouton « Menu principal » en haut à gauche permet de revenir à l’accueil.

En local, depuis la racine du dépôt :

```bash
python -m http.server 8000
```

Puis visite `http://localhost:8000/play.html`. Utilise WASD pour te déplacer, la souris pour regarder, Maj pour courir, F pour la lampe et Échap pour mettre en pause. Récupère les trois dossiers puis atteins la sortie.

## Structure

```text
.
├── index.html          # Jeu 3D jouable
├── menu.html           # Menu avec boutique et progression
├── play.html           # Écran d’accueil intégré au jeu
└── src/
    ├── main.js         # Interface du menu détaillé
    ├── menu.css        # Styles du menu détaillé
    ├── profile.js      # Profil, monnaie, niveaux, quêtes, succès, sauvegarde locale
    └── settings.js     # Préférences locales
```

Le prototype est solo et les sauvegardes sont locales au navigateur. Les cartes sont des variantes visuelles d'un niveau de couloir; le multijoueur et un serveur de sauvegarde ne sont pas inclus.
