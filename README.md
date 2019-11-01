# P7-Openclassrooms - Lancez votre propre site d'avis de restaurants

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/3e8b57f9f2184b3285987b2de9c4b31c)](https://www.codacy.com/manual/thomas-claireau/P7-Openclassrooms?utm_source=github.com&utm_medium=referral&utm_content=thomas-claireau/P7-Openclassrooms&utm_campaign=Badge_Grade)

## Utilisation du projet

Commencez par cloner le projet :

```text
git clone https://github.com/thomas-claireau/P7-Openclassrooms.git
```

Installez ensuite les dépendances du projet. A la racine du projet cloné :

```text
npm install
```

Le projet fonctionne avec l'api de Google Maps et fait fonctionner plusieurs librairies telles que Search, Places...

Pour celà, le projet nécessite pour fonctionner une clé API que vous allez devoir renseigner.

Créez un fichier `key.json` dans `./src/assets/data` avec la structure suivante :

```json
{
	"key": "API_KEY",
	"keyGeocodingPlaces": "API_KEY_NO_RESTRICTED",
	"host": "HOST_URL"
}
```

-   key : votre clé API, utilisée ensuite dans le projet pour charger les librairies Google
-   keyGeocodingPlaces : utilisée pour charger l'API de Geocoding qui nécessite une clé non restreinte
-   host : l'url de votre projet (pensez à bien restreinte votre clé API à cette url pour éviter les clés compromises). Cette url est utilisé pour lancer le webpack-dev-server de la configuration Webpack.

## Brief du projet

Vous avez choisi de vous lancer dans le business des avis de restaurants. Votre objectif : créer un service simple et utile qui permet d'avoir des avis sur des restaurants autour de soi.

Pour ce projet, vous allez devoir apprendre à utiliser des API externes, telles que celles de Google Maps et de Google Places (votre plus gros concurrent). Et ce n'est pas tout : vous allez devoir orchestrer toutes ces informations de manière cohérente dans votre application !

### Etape 1 : la carte des restaurants ([lien](https://github.com/thomas-claireau/P7-Openclassrooms/tree/etape-1))

## Utilisation du projet

Commencez par cloner le projet :

```text
git clone https://github.com/thomas-claireau/P7-Openclassrooms.git
```

Le projet fonctionne avec l'api de Google Maps et fait fonctionner plusieurs librairies telles que Search, Places...

Pour celà, le projet nécessite pour fonctionner une clé API que vous allez devoir renseigner.

Créez un fichier `key.json` dans `./src/assets/data` avec la structure suivante :

```json
{
	"key": "API_KEY",
	"keyGeocodingPlaces": "API_KEY_NO_RESTRICTED",
	"host": "HOST_URL"
}
```

-   key : votre clé API, utilisée ensuite dans le projet pour charger les librairies Google
-   keyGeocodingPlaces : utilisée pour charger l'API de Geocoding qui nécessite une clé non restreinte
-   host : l'url de votre projet (pensez à bien restreinte votre clé API à cette url pour éviter les clés compromises). Cette url est utilisé pour lancer le webpack-dev-server de la configuration Webpack.

### Etape 2 : ajoutez des restaurants et des avis ! ([lien](https://github.com/thomas-claireau/P7-Openclassrooms/tree/etape-2))

Vous avez choisi de vous lancer dans le business des avis de restaurants. Votre objectif : créer un service simple et utile qui permet d'avoir des avis sur des restaurants autour de soi.

Pour ce projet, vous allez devoir apprendre à utiliser des API externes, telles que celles de Google Maps et de Google Places (votre plus gros concurrent). Et ce n'est pas tout : vous allez devoir orchestrer toutes ces informations de manière cohérente dans votre application !

### <- Etape 1 : la carte des restaurants ([lien](https://github.com/thomas-claireau/P7-Openclassrooms/tree/etape-1))

### <- Etape 2 : ajoutez des restaurants et des avis ! ([lien](https://github.com/thomas-claireau/P7-Openclassrooms/tree/etape-2))

### Etape 3 : intégration avec l'API de Google Places ([lien](https://github.com/thomas-claireau/P7-Openclassrooms/tree/etape-3))

Pour l'instant, il n'y a pas beaucoup de restaurants et pas beaucoup d'avis. Heureusement, Google Places propose une API pour récupérer des restaurants et des avis. Servez-vous en pour afficher des restaurants et avis supplémentaires sur votre carte ! Ici la documentation : https://developers.google.com/places/

![google places](https://user.oc-static.com/upload/2017/09/11/15051445963709_Screen%20Shot%202017-09-11%20at%205.34.49%20PM.png)

Vous utiliserez la search api pour trouver des restaurants dans la zone affichée.

Lisez bien la documentation pour savoir comment accéder aux données de Google Places et n'hésitez pas à faire autant de recherches Google que nécessaire quand vous butez sur un problème.

### ✔️ Projet validé

Commentaires de l'évaluateur :

1. Évaluation globale du travail réalisé par l’étudiant (en spécifiant les critères non-validés si le projet est à retravailler) :

Un très bon projet dans son ensemble. Le rendu est soigné, tout comme le code et la présentation

2. Évaluation des livrables selon les critères du projet :

Le code est de bonne qualité, développé en ES6 avec la présence du processus de transpilation en ES5. Il n'ya pas l'usage de libraires externes, tout est fait en vanilla JS

3. Évaluation de la présentation orale et sa conformité aux attentes :

Une présentation orale complète avec un timing globalement bon. Tout est bien présenté. La présentation du code en même temps que le rendu et le support est une très bonne idée. Attention à ne pas être trop rapide dans le ton de voix

4. Évaluation des nouvelles compétences acquises par l'étudiant :

Développer une Single Page Application (SPA) en JavaScript
Intéragir avec une API en JavaScript
Rendre compatible du code ES6 en ES5
5. Points positifs (au moins 1) :

Un code propre en ES6
La présence du processus de transpilation
6. Axes d'amélioration (au moins 1) :

Le responsive est à améliorer bien que présent


### 🎬 Cliquez sur l'image ci-dessous pour voir la vidéo de soutenance 👇

[![Regarder la vidéo de soutenance](https://img.youtube.com/vi/dbv1vxErEjw/maxresdefault.jpg)](https://youtu.be/dbv1vxErEjw)
