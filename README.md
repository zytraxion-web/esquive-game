# Dernier Service

## Lancer

Depuis la racine du dépôt, lancez `python -m http.server 8000`, puis ouvrez `http://localhost:8000/menu.html`. Le prototype de jeu est `index.html`. Une connexion Internet est nécessaire au chargement du module Three.js et des polices hébergés sur CDN. L'application doit être servie via HTTP, pas ouverte en `file://`.

## Jouable dans cette version

- Jeu solo 3D à la première personne, objectif de récupération de 3 dossiers et échappée.
- IA de poursuite, lampe torche avec batterie, course avec endurance, éclairage, ambiance et effets sonores synthétisés.
- Trois variantes de carte sélectionnables : aile des patients, sous-sol clinique et morgue.
- Résultats reliés au profil : pièces, XP, niveaux, quêtes, succès et sauvegarde locale automatique.
- Menu d'accueil, boutique cosmétique locale, progression et préférences conservées dans le navigateur.

## Commandes

- `W A S D` : déplacement ; souris : regarder (cliquer dans le jeu pour reprendre le contrôle de la souris).
- `Maj` : courir ; `F` : activer/désactiver la lampe ; `Échap` : pause et réglages.
- Récupérez les trois dossiers puis atteignez la porte de sortie. Le monstre poursuit le joueur.

## Limites / suite nécessaire

Cette version est un prototype solo web, pas encore un jeu PC multijoueur complet. Les cartes sont procédurales et partagent une même géométrie de couloir avec des variantes visuelles. Les données `localStorage` ne sont pas un stockage sécurisé, ne sont pas synchronisées entre appareils et peuvent être effacées. Les réglages de volume sont mémorisés ; l'ambiance synthétisée est basique. Les cosmétiques achetés dans le menu ne sont pas encore appliqués au rendu du joueur.

Le multijoueur ne peut pas être activé de manière fiable ou sécurisée par GitHub Pages et du JavaScript client seul. Il reste à choisir une plateforme de production (moteur PC, ou serveur web temps réel) puis à créer un serveur autoritaire, des salons, une identité joueur et une persistance côté serveur. Les prototypes Web ne doivent pas être considérés comme une version publiée ni comme une économie sécurisée.
