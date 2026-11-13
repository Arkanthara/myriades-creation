# Gérer Myriade Création

Ce guide s’adresse à la personne qui ajoute les créations, remplace les images et fait vivre les textes du site. Vous n’avez pas besoin de modifier le code Astro.

## 1. Comprendre les fichiers

Le site fonctionne comme un petit carnet : chaque création est une page dans un fichier **Markdown**, reconnaissable à son extension `.md`. Les réglages communs sont écrits en **YAML**, dans des fichiers `.yaml`.

Une modification n’est visible sur le site public qu’après sa compilation et son déploiement. Avec GitHub Actions configuré, cette étape est automatique.

| Ce que vous souhaitez faire                                | Où aller                             |
| ---------------------------------------------------------- | ------------------------------------ |
| Modifier l’introduction de l’accueil                       | `src/data/site.yaml` → `home`        |
| Modifier un bouton, un menu ou un texte de formulaire      | `src/data/site.yaml`                 |
| Modifier le titre et le texte de la page couture ou dessin | `src/data/site.yaml` → `collections` |
| Écrire votre présentation                                  | `src/content/pages/atelier.md`       |
| Ajouter une création cousue                                | `src/content/couture/`               |
| Ajouter un dessin                                          | `src/content/dessin/`                |
| Ajouter les fichiers images                                | `public/images/`                     |
| Changer l’ambiance des couleurs                            | `src/data/theme.yaml`                |
| Changer les options de demande sur mesure                  | `src/data/custom-order.yaml`         |

## 2. Modifier un texte directement dans GitHub

1. Ouvrez le dépôt dans GitHub, puis le fichier concerné.
2. Cliquez sur le crayon **Edit**.
3. Modifiez le texte en conservant les clés et les espaces du YAML.
4. Cliquez sur **Commit changes**. Choisissez une nouvelle branche et créez une pull request pour bénéficier d’un aperçu avant publication.
5. Dans la pull request, attendez que les vérifications soient vertes. Si Cloudflare est configuré, ouvrez le lien d’aperçu dans les journaux du job de déploiement.
6. Relisez sur ordinateur et téléphone. Cliquez sur **Merge pull request** quand le résultat vous convient.

Un changement sur `main` déclenche la publication de production. Pour un brouillon, préférez une branche ou utilisez `draft: true` sur une création.

Pour envoyer une image : ouvrez `public/images/`, choisissez **Add file → Upload files**, puis validez sur la même branche que le texte. Vous pouvez créer un dossier par projet, par exemple `public/images/robe-printemps/`.

## 3. Ajouter une création couture

Dupliquez une fiche existante, ou créez `src/content/couture/ma-nouvelle-robe.md`. Un nom simple, en minuscules, sans accent ni espace, donne une adresse facile à partager : `/couture/ma-nouvelle-robe/`.

Voici une fiche couture **minimale**. Seuls le titre, la technique, la coupe, au moins un matériau et au moins une image sont obligatoires :

```markdown
---
title: Ma nouvelle robe
technique: Couture & broderie
cut: Robe évasée, taille froncée
materials: [Lin, Fil de coton]
images:
  - src: /images/robe-printemps/vue-ensemble.webp
---
```

`cut` signifie **coupe**. Le fichier image doit réellement exister dans `public/images/robe-printemps/vue-ensemble.webp`. Chaque image exige uniquement `src`, son chemin sur le site. Il ne s’agit pas d’un crédit photographique ; un crédit éventuel peut être ajouté dans la légende `caption`.

Tout le reste est facultatif, y compris le récit sous le deuxième `---`. Une fiche sans `demo` ni `draft` utilise **`demo: false` et `draft: false`** : elle apparaît dès la prochaine compilation et publication. Ajoutez `draft: true` pour la masquer volontairement.

Un modèle copiable se trouve dans [`src/content/couture/_exemple-minimal.md`](../src/content/couture/_exemple-minimal.md). Son nom commence par `_` : il n’est pas publié. Dupliquez-le sous un nouveau nom et remplacez son image de démonstration par la vôtre.

| Champ facultatif | Effet et valeur par défaut                                                                                     |
| ---------------- | -------------------------------------------------------------------------------------------------------------- |
| `description`    | Résumé de 300 caractères maximum ; absent : aucun résumé visible, description générale du site pour le partage |
| `category`       | Libellé éditorial ; absent : aucun libellé de catégorie ; aucun filtre                                         |
| `date`           | Date de création ; absente : aucune année affichée                                                             |
| `order`          | Priorité d’affichage ; défaut : `100`, les plus petits nombres en premier                                      |
| `featured`       | Priorité dans la sélection couture de l’accueil ; défaut : `false`                                             |
| `draft`          | `true` masque la fiche, sa route et son entrée de sitemap ; défaut : `false`                                   |
| `demo`           | `true` affiche le badge Exemple ; défaut : `false`                                                             |

Le tri suit `order`, puis la date décroissante si elle est renseignée, puis le nom du fichier. À ordre égal, les fiches sans date suivent celles qui en ont une. Aucun jour de création n’est inventé.

Pour enrichir une fiche, ajoutez par exemple ces champs **dans son en-tête YAML**, avant le second `---` :

```yaml
description: Une robe légère ornée de petites fleurs.
category: Vêtements
date: 2026-11-13
order: 1
featured: true
```

Après le second `---`, vous pouvez écrire un récit Markdown, mais il peut rester entièrement vide :

```markdown
## Mon inspiration

Une promenade et un coupon de **lin bleu**.
```

### Créer le fichier avec une commande

```bash
npm run content:new -- couture ma-nouvelle-robe "Ma nouvelle robe"
```

La commande crée uniquement les champs obligatoires, avec des valeurs à personnaliser et le chemin `/images/ma-nouvelle-robe.webp`. Ajoutez cette image dans `public/images/`, ou changez son chemin, avant de compiler. `demo` et `draft` valent `false` par défaut. La commande refuse d’écraser un fichier existant.

## 4. Ajouter un dessin

Dans `src/content/dessin/mes-fleurs.md`, seuls **le titre, la technique et au moins une image** sont obligatoires :

```markdown
---
title: Mes fleurs de printemps
technique: Aquarelle
images:
  - src: /images/mes-fleurs.webp
---
```

Les matériaux (`materials`), la coupe (`cut`) et tous les champs facultatifs décrits pour la couture peuvent être omis. Un dessin n’exige ni matériaux ni coupe. Le modèle [`src/content/dessin/_exemple-minimal.md`](../src/content/dessin/_exemple-minimal.md) illustre exactement ce minimum et n’est pas publié.

```bash
npm run content:new -- dessin mes-fleurs "Mes fleurs de printemps"
```

Le dessin apparaît dans la galerie et possède sa propre page. Les trois premiers dessins apparaissent sur l’accueil selon le tri décrit ci-dessus. Les visiteurs peuvent agrandir l’image dans la galerie, ouvrir la fiche et partager son adresse.

Deux fiches de démonstration publiées montrent également le rendu minimal : `couture/carnet-de-matieres.md` et `dessin/feuilles-vagabondes.md`. Elles ajoutent seulement `demo: true` pour identifier explicitement leurs visuels d’exemple.

## 5. Préparer les images

**Seul `src` est obligatoire pour chaque image**, dans les deux collections. Il faut au moins une image par fiche. La première sert de couverture et d’image de partage. Vous pouvez en ajouter plusieurs en répétant `- src:`.

```yaml
images:
  - src: /images/robe-printemps/vue-ensemble.webp
  - src: /images/robe-printemps/detail-col.webp
    alt: Gros plan de petites fleurs brodées au bord du col.
    caption: Les finitions à la main.
    width: 1200
    height: 900
    position: top
```

| Champ d’image     | Obligatoire ? | Si absent                                                                   |
| ----------------- | ------------- | --------------------------------------------------------------------------- |
| `src`             | Oui           | La validation refuse la fiche                                               |
| `alt`             | Non           | Le titre de la création décrit l’image dans la fiche et la galerie agrandie |
| `caption`         | Non           | Aucune légende visible sous l’image ; le titre accompagne l’agrandissement  |
| `width`, `height` | Non           | Les dimensions naturelles de l’image sont utilisées                         |
| `position`        | Non           | Cadrage centré (`center`)                                                   |

- Utilisez vos propres photos et dessins, avec l’accord nécessaire pour les publier.
- Préférez WebP, JPEG ou PNG. SVG est accepté pour votre logo et vos illustrations vectorielles.
- Une largeur de 1200 à 1800 pixels convient généralement. Compressez les fichiers avant l’ajout.
- Utilisez des noms simples, par exemple `robe-detail-01.webp`.
- Si vous renseignez `width` et `height`, utilisez les dimensions réelles en pixels, entières et positives, pour stabiliser la page au chargement. Aucune dimension fictive n’est ajoutée par défaut.
- `alt` reste conseillé pour décrire les détails propres à chaque image. Un `alt: ""` explicite est accepté et conservé.

Un fichier dans `public/images/mon-image.webp` s’utilise avec **`/images/mon-image.webp`**. Le mot `public` ne figure jamais dans ce chemin. Les sources externes ne sont pas acceptées.

`position` accepte `center`, `top`, `bottom`, `left`, `right`, ou une paire comme `50% 30%`. Les vignettes recadrent l’image ; l’agrandissement montre l’image entière.

Pour remplacer une image déjà publiée, un nouveau nom de fichier permet d’éviter d’attendre le renouvellement de son cache. Les images sont conservées jusqu’à 24 heures dans le cache Cloudflare.

## 6. Personnaliser le logo de la créatrice

Un monogramme M couronné de démonstration est fourni dans `public/images/logo-myriade.svg`. Pour le remplacer :

1. Ajoutez le logo dans `public/images/logo.svg` ou `public/images/logo.png`.
2. Dans `src/data/site.yaml`, remplissez :

```yaml
logo:
  src: /images/logo.svg
  alt: Myriade Création, couture et illustration
  tagline: Couture & illustration
```

Le logo apparaît à côté du nom et de la signature dans l’en-tête et le pied de page, sur toutes les pages. Un symbole ou un monogramme carré convient bien ; les logos d’autres proportions sont contenus sans déformation. `alt` décrit votre logo. Pour conserver uniquement le nom et la signature, laissez `src: ""`. Si vous souhaitez également changer le petit symbole de l’onglet du navigateur, remplacez `public/favicon.svg`.

## 7. Modifier les textes et couleurs

Les clés YAML donnent le sens des réglages. Modifiez les valeurs à droite du `:`, en gardant les clés.

```yaml
home:
  title: Il était un fil,
  titleAccent: un éclat de magie.
  description: 'Votre nouvelle introduction.'
```

Les images de l’accueil se trouvent dans `home.image` et `home.atelierImage`, avec leurs descriptions `imageAlt` et `atelierImageAlt`.

L’adresse de contact sera ajoutée ici :

```yaml
contact:
  email: bonjour@votre-domaine.ch
```

Il s’agit d’un extrait : **ne supprimez pas les autres champs** de `contact`. Sans adresse, les visiteurs peuvent préparer et copier le texte. Avec l’adresse, le bouton ouvre leur application e-mail. Si aucune application n’est configurée sur leur appareil, le récapitulatif reste copiable et votre adresse est affichée sur la page.

Pour les réseaux sociaux, remplacez `socials: []` par :

```yaml
socials:
  - label: Instagram
    url: https://www.instagram.com/votre-compte/
```

Le thème associe un fond ivoire à un matériau or poli : ombres ambrées, reflets champagne et lumière douce. Les ornements représentent des fleurs et des papillons. Dans `src/data/theme.yaml`, changez les codes de couleurs (extrait, conservez les autres clés) :

```yaml
colors:
  background: '#fffaf0'
  primary: '#73500d'
  rose: '#f7ecd9'
  accent: '#79520c'
  gold: '#d4a52e'
  goldLight: '#f6df94'
  goldShadow: '#91600d'
  goldHighlight: '#fff5cf'
```

`accent` est l’or foncé des liens et des textes. `gold`, `goldLight`, `goldShadow` et `goldHighlight` composent les dégradés métalliques des cadres, boutons, médaillon et ornements SVG. Le reflet des boutons se déplace au survol ; la préférence de réduction des animations est respectée. Les catalogues couture et dessin montrent toutes les créations publiées, sans filtres. Les catégories restent des libellés descriptifs.

Conservez suffisamment de contraste entre le texte et le fond. Les tests d’accessibilité détectent une partie des problèmes de contraste. Les polices actuelles sont incluses avec le site. Pour changer de famille, consultez le guide technique ; changer seulement le nom ne télécharge pas une nouvelle police.

## 8. Écrire en Markdown

Markdown permet de donner une structure au texte avec quelques signes simples.

| Vous écrivez                            | Résultat                              |
| --------------------------------------- | ------------------------------------- |
| `## Mon inspiration`                    | Un sous-titre principal dans le récit |
| `### Les finitions`                     | Un sous-titre de niveau inférieur     |
| `**un mot important**`                  | **un mot important**                  |
| `*une touche de poésie*`                | _une touche de poésie_                |
| `[Me contacter](/contact/)`             | Un lien vers la page contact          |
| `![Une fleur rose](/images/fleur.webp)` | Une image dans le récit               |
| `> Une pensée à mettre en avant.`       | Une citation mise en forme            |

Le titre principal de la page est créé automatiquement à partir de `title`. Commencez donc vos sous-titres par **`##`** et non par `#`.

### Paragraphes

Laissez une ligne vide entre deux paragraphes :

```markdown
Voici le premier paragraphe, qui présente l’idée.

Voici le deuxième paragraphe, consacré aux matières.
```

Un simple retour à la ligne au milieu d’un paragraphe ne crée généralement pas de nouveau paragraphe.

### Listes

```markdown
- Lin naturel
- Fil de coton
- Boutons en bois
```

Pour des étapes numérotées :

```markdown
1. Préparer le tissu.
2. Découper les pièces.
3. Assembler et repasser.
```

### Liens et images

```markdown
[Découvrir la galerie de dessins](/dessin/)

![Le détail des pétales brodés](/images/fleur-detail.webp)
```

Les images ajoutées dans `images` en haut du fichier bénéficient de la fenêtre d’agrandissement. Les images insérées dans le récit Markdown s’affichent simplement dans le texte.

### Séparation

Une ligne contenant `---` dans le récit crée une ligne de séparation. Les deux lignes `---` tout au début du fichier délimitent l’en-tête YAML : ne les effacez pas.

Vous n’avez pas besoin d’écrire du HTML. Gardez uniquement du Markdown dans vos récits.

## 9. Lire et écrire le YAML

### Espaces et hiérarchie

Le YAML utilise les espaces pour indiquer l’organisation. **Deux espaces par niveau**, jamais de tabulations :

```yaml
images:
  - src: /images/ma-creation.webp
    alt: Une description de l’image.
    caption: Ma légende.
```

Chaque nouvelle image commence par `- src:`. Les lignes `alt`, `caption`, `width` et `height` sont alignées avec `src`.

### Guillemets et caractères spéciaux

Si votre phrase contient `: ` ou `#`, mettez-la entre guillemets :

```yaml
title: 'Un trésor : la pochette des fées'
description: 'Une nuance #1 dans mon carnet.'
```

Les apostrophes françaises peuvent être utilisées normalement à l’intérieur de guillemets doubles. Pour inclure un guillemet double, écrivez `\"` ou utilisez un bloc de texte :

```yaml
description: >-
  Une création inspirée par "le jardin secret",
  entre fleurs brodées et lin naturel.
```

`>-` rassemble les lignes en une phrase. `|` conserve les retours à la ligne dans la valeur, mais la présentation HTML d’un paragraphe ne les affiche pas nécessairement.

### Vrai, faux, vide et nombres

```yaml
draft: true
featured: false
order: 5
materials: [Lin]
```

`true` et `false` s’écrivent en minuscules, sans guillemets. Pour un texte vide autorisé, utilisez `""` ; évitez de laisser simplement une clé sans valeur.

## 10. Modifier, masquer ou supprimer

- Pour corriger une création, modifiez son fichier `.md`.
- Pour la masquer, passez `draft: true`. Sa page ne sera plus générée au prochain déploiement.
- Pour la supprimer définitivement du site, supprimez son fichier `.md`. Les images devenues inutiles peuvent aussi être supprimées après vérification.
- Renommer le fichier change l’adresse partagée. Pour préserver un ancien lien, demandez l’ajout d’une redirection Cloudflare dans `public/_redirects` : `/ancienne-adresse/ /nouvelle-adresse/ 301`.

La suppression ou le masquage prend effet au déploiement. Un lien déjà partagé peut alors mener à une page 404.

## 11. Une erreur de publication ?

Ouvrez l’onglet **Actions** du dépôt, puis la dernière exécution. Cliquez sur le contrôle rouge. Les causes les plus fréquentes sont :

| Message / symptôme                     | Correction                                                                                                                                                             |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Image introuvable                      | Vérifiez le nom, l’extension, les majuscules et le chemin `/images/...`                                                                                                |
| Erreur YAML                            | Vérifiez l’alignement des espaces et les guillemets                                                                                                                    |
| Champ obligatoire manquant             | Comparez la fiche au modèle ; couture : `title`, `technique`, `cut`, `materials` ; dessin : `title`, `technique` ; dans les deux cas : `images` avec au moins un `src` |
| Nom de fichier invalide                | Utilisez des minuscules sans accent, avec des tirets                                                                                                                   |
| Contraste insuffisant                  | Assombrissez le texte ou éclaircissez le fond dans le thème                                                                                                            |
| Configuration de production incomplète | Renseignez URL et e-mail, puis passez `demoMode` à `false`                                                                                                             |

Une vérification échouée empêche la nouvelle version de remplacer la version publique. Corrigez le fichier et validez à nouveau. Pour revenir en arrière, utilisez **Revert** sur la pull request ou le retour arrière Cloudflare décrit dans le guide de déploiement.

## 12. Préparer le lancement

1. Remplacez les six exemples par vos créations et vérifiez les descriptions d’images.
2. Ajoutez votre logo et personnalisez l’atelier.
3. Définissez votre adresse e-mail, votre URL et vos réseaux éventuels.
4. Complétez les mentions légales et adaptez la page confidentialité à votre activité.
5. Vérifiez `demoMode: false` dans `src/data/site.yaml` (valeur livrée et valeur par défaut). `true` ajoute un bandeau et interdit l’indexation. Les fiches d’exemple restent identifiées par leur propre `demo: true`.
6. Vérifiez les pages, les images et le contact sur votre téléphone.

Le partage utilise un lien unique par création. L’image et le titre viennent de la fiche. Certains réseaux sociaux conservent les aperçus en cache ; une modification peut prendre du temps à apparaître sur une ancienne publication.
