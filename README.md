# Dernier Service

Prototype web d'un jeu d'horreur de poursuite, hébergé dans `zytraxion-web/esquive-game`.

## Structure actuelle

```text
.
├── index.html          # Prototype 3D jouable existant
├── menu.html           # Nouveau menu principal
└── src/
    ├── main.js         # Navigation du menu et événements de l'interface
    ├── menu.css        # Mise en page responsive et habillage du menu
    └── settings.js     # Lecture/validation/sauvegarde des préférences locales
```

## Lancer le prototype

Le projet ne nécessite pas de compilation. Pour essayer les modules JavaScript, servez le dépôt avec un serveur HTTP local (les navigateurs bloquent parfois les modules depuis `file://`). Depuis la racine du dépôt :

```bash
python -m http.server 8000
```

Puis ouvrez `http://localhost:8000/menu.html` pour le menu, ou `http://localhost:8000/` pour le prototype 3D actuel. GitHub Pages peut aussi servir `menu.html` directement à l'adresse `/menu.html`.

## État de cette étape

- Menu principal responsive, avec un accès au prototype solo déjà présent.
- Fenêtre des paramètres : qualité visuelle du menu appliquée immédiatement et préférences conservées dans `localStorage`.
- Le niveau du volume est enregistré comme préférence, mais ne modifie pas encore le son : l'audio du jeu sera intégré dans une étape dédiée.
- Boutique, progression, monnaie, multijoueur, quêtes et sauvegardes serveur ne sont pas encore implémentés. Les entrées non disponibles l'indiquent au lieu de simuler ces systèmes.

Le dépôt est actuellement une application HTML statique. Un véritable multijoueur PC nécessitera ensuite de choisir une cible (par exemple Unity/Unreal pour un jeu natif ou un serveur dédié pour une version web), puis de mettre en place une autorité serveur; le navigateur seul ne peut pas fournir des parties réseau sécurisées.
