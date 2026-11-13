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

Copiez ce modèle puis personnalisez chaque valeur :

```markdown
---
title: Ma nouvelle robe
description: Une robe légère en lin bleu, ornée de petits boutons en bois.
category: Vêtements
date: 2026-11-13
order: 1
featured: true
draft: true
demo: false
technique: Couture & broderie
materials:
  - Lin
  - Fil de coton
  - Boutons en bois
images:
  - src: /images/robe-printemps/vue-ensemble.webp
    alt: Robe en lin bleu vue de face, avec un col arrondi et trois boutons en bois.
    caption: La silhouette terminée.
    width: 1200
    height: 1600
  - src: /images/robe-printemps/detail-col.webp
    alt: Gros plan du col et de ses petites fleurs brodées.
    caption: Les finitions brodées à la main.
    width: 1200
    height: 900
---

## L’idée de départ

Cette robe est née d’une promenade printanière et d’un coupon de **lin bleu**.

## La confection

J’ai commencé par dessiner le patron, puis préparé les pièces avant l’assemblage.

- Un tissu lavé avant la coupe.
- Des coutures renforcées.
- Une broderie réalisée à la main.

> Mon détail préféré : les petites fleurs au bord du col.
```

Les fichiers d’images du modèle doivent réellement exister. Remplacez ces chemins par les vôtres avant de lancer les vérifications.

| Champ         | Effet                                                                                                    |
| ------------- | -------------------------------------------------------------------------------------------------------- |
| `title`       | Nom de la création et titre du partage                                                                   |
| `description` | Court résumé, limité à 300 caractères                                                                    |
| `category`    | Crée automatiquement un bouton de filtre                                                                 |
| `date`        | Année affichée et tri en cas d’égalité d’ordre                                                           |
| `order`       | Les plus petits nombres apparaissent en premier ; valeur par défaut : 100                                |
| `featured`    | Met la création couture en priorité dans les trois emplacements de l’accueil                             |
| `draft`       | `true` : invisible partout, sans page publique ; `false` : publiée                                       |
| `demo`        | `true` : affiche le petit badge Exemple ; mettez `false` pour vos œuvres                                 |
| `technique`   | Texte de la technique, visible sous la vignette et sur la fiche                                          |
| `materials`   | Liste des matières ou des outils ; `[]` si vous ne voulez rien afficher                                  |
| `images`      | Une ou plusieurs images, dans l’ordre d’affichage ; la première sert de couverture et d’image de partage |

Le texte sous le deuxième `---` forme le récit de la création. Il peut rester court. Vous pouvez ajouter autant de paragraphes et de sous-titres que nécessaire.

### Créer le fichier avec une commande

Dans le terminal du projet :

```bash
npm run content:new -- couture ma-nouvelle-robe "Ma nouvelle robe"
```

Cette commande crée un **brouillon** et refuse d’écraser un fichier existant. Ajoutez vos images, écrivez le texte puis passez `draft` à `false`.

## 4. Ajouter un dessin

Suivez les mêmes étapes dans `src/content/dessin/`. Tous les champs fonctionnent de la même manière. Par exemple :

```bash
npm run content:new -- dessin mes-fleurs "Mes fleurs de printemps"
```

Le dessin apparaît dans la galerie et possède aussi sa propre page. Les trois premiers dessins apparaissent sur l’accueil, selon `order` puis `date`. Les visiteurs peuvent agrandir l’image dans la galerie, ouvrir la fiche ou partager son adresse.

## 5. Préparer les images

- Utilisez vos propres photos et dessins, avec l’accord nécessaire pour les publier.
- Préférez WebP, JPEG ou PNG. SVG est accepté pour votre logo et vos illustrations vectorielles.
- Une largeur de 1200 à 1800 pixels convient à la plupart des images. Compressez-les avant l’ajout ; visez quelques centaines de kilo-octets.
- Utilisez des noms simples : `robe-detail-01.webp`, plutôt que `Photo finale été (2).JPG`.
- Renseignez les dimensions réelles en pixels dans `width` et `height`. Elles évitent que la page saute au chargement.
- Rédigez `alt` pour une personne qui ne voit pas l’image : le sujet, les couleurs et les détails utiles. Évitez « image de… » si cela n’apporte rien.
- `caption` est une légende visible facultative. Les images peuvent être ajoutées sans légende.

Un fichier dans `public/images/mon-image.webp` s’utilise avec le chemin **`/images/mon-image.webp`**. Le mot `public` ne figure jamais dans ce chemin.

Les vignettes recadrent l’image pour maintenir une galerie régulière. Pour ajuster le cadrage :

```yaml
position: top
```

Valeurs possibles : `center`, `top`, `bottom`, `left`, `right`, ou une paire telle que `50% 30%`. La fenêtre d’agrandissement affiche l’image entière.

Pour remplacer une image déjà publiée, un nouveau nom de fichier permet d’éviter d’attendre le renouvellement de son cache. Les images sont conservées jusqu’à 24 heures dans le cache Cloudflare.

## 6. Installer le logo existant

1. Ajoutez le logo dans `public/images/logo.svg` ou `public/images/logo.png`.
2. Dans `src/data/site.yaml`, remplissez :

```yaml
logo:
  src: /images/logo.svg
  alt: Myriade Création, couture et illustration
  tagline: Couture & illustration
```

Le logo remplace le nom composé en typographie dans l’en-tête. Sans logo, laissez `src: ""`. Le logo est contenu dans son emplacement, sans déformation. Si vous souhaitez également changer le petit symbole de l’onglet du navigateur, remplacez `public/favicon.svg`.

## 7. Modifier les textes et couleurs

Les clés YAML donnent le sens des réglages. Modifiez les valeurs à droite du `:`, en gardant les clés.

```yaml
home:
  title: Un fil, un trait,
  titleAccent: un peu de magie.
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

Dans `src/data/theme.yaml`, changez les codes de couleurs :

```yaml
colors:
  background: '#f8f6ef'
  primary: '#435d46'
  rose: '#ecdfd8'
```

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
materials: []
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

| Message / symptôme                     | Correction                                                                                          |
| -------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Image introuvable                      | Vérifiez le nom, l’extension, les majuscules et le chemin `/images/...`                             |
| Erreur YAML                            | Vérifiez l’alignement des espaces et les guillemets                                                 |
| Champ obligatoire manquant             | Comparez la fiche au modèle ; `alt`, `title`, `description`, `date` et `technique` sont nécessaires |
| Nom de fichier invalide                | Utilisez des minuscules sans accent, avec des tirets                                                |
| Contraste insuffisant                  | Assombrissez le texte ou éclaircissez le fond dans le thème                                         |
| Configuration de production incomplète | Renseignez URL et e-mail, puis passez `demoMode` à `false`                                          |

Une vérification échouée empêche la nouvelle version de remplacer la version publique. Corrigez le fichier et validez à nouveau. Pour revenir en arrière, utilisez **Revert** sur la pull request ou le retour arrière Cloudflare décrit dans le guide de déploiement.

## 12. Préparer le lancement

1. Remplacez les six exemples par vos créations et vérifiez les descriptions d’images.
2. Ajoutez votre logo et personnalisez l’atelier.
3. Définissez votre adresse e-mail, votre URL et vos réseaux éventuels.
4. Complétez les mentions légales et adaptez la page confidentialité à votre activité.
5. Passez `demoMode: false` dans `src/data/site.yaml` pour retirer le bandeau et permettre l’indexation.
6. Vérifiez les pages, les images et le contact sur votre téléphone.

Le partage utilise un lien unique par création. L’image et le titre viennent de la fiche. Certains réseaux sociaux conservent les aperçus en cache ; une modification peut prendre du temps à apparaître sur une ancienne publication.
