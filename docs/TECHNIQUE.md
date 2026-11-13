# Architecture et maintenance

## Stack et choix d’hébergement

Astro 7, TypeScript strict, CSS natif, collections de contenu et compilation statique. Les interactions sont des modules JavaScript légers compilés par Astro : aucun framework client n’est nécessaire. Cloudflare Pages sert `dist/` ; il n’y a ni API serveur, ni fonction Cloudflare, ni base de données.

Le déploiement statique est suffisant pour les pages, galeries et demandes via e-mail prérempli. Une vraie réception de formulaire côté serveur ou une commande avec paiement constituerait une évolution distincte.

Références : [collections Astro](https://docs.astro.build/en/guides/content-collections/), [Astro sur Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/).

## Structure

```text
.devcontainer/          Environnement VS Code et Codespaces, Node 24
.github/               CI/CD et mises à jour Dependabot
docs/                  Guides en français
public/                Images, favicon et en-têtes Cloudflare
scripts/               Validation, création de fiche minimale, contrôle du build
src/
  components/          Cartes, galerie, formulaires et sections réutilisables
  content/
    couture/           Fiches couture Markdown
    dessin/            Fiches dessin Markdown
    pages/             Pages éditoriales Markdown
  data/                Textes, thème et configurateur YAML
  layouts/Base.astro   En-tête, pied de page, SEO et polices locales
  lib/                 Schémas, chargement du contenu, génération des messages
  pages/               Routes Astro, 404 et robots.txt
  styles/global.css    Styles, responsive et réduction des animations
tests/
  unit/                Fonctions de mail et schémas
  e2e/                 Parcours généraux, desktop et mobile Chromium
  order/               Parcours du configurateur activé temporairement
```

`src/content.config.ts` déclare les collections avec le loader `glob`. Le schéma couture `creationSchema` exige `title`, `technique`, `cut`, `materials` non vide et `images` non vide. Le schéma dessin `drawingSchema` exige seulement `title`, `technique` et `images` non vide. Chaque image exige uniquement `src` local ; `alt`, `caption`, `width`, `height` et `position` sont facultatifs. Les dates sont validées seulement si elles sont fournies. Description, catégorie et récit sont facultatifs ; les sections absentes ne produisent aucun bloc vide. Sans `alt`, le titre sert de texte alternatif ; une valeur vide explicite est conservée. Aucune dimension ou année fictive n’est générée. Le tri suit `order`, date décroissante (sans date après les fiches datées), puis identifiant. `draft: true` exclut une œuvre des listes, des routes et du sitemap. `draft` et `demo` valent `false` par défaut, y compris dans les fiches générées par `content:new`. Les modèles `_exemple-minimal.md` sont ignorés par les loaders et le validateur ; les tests unitaires vérifient leur conformité. Les exemples publiés restent repérables grâce à `demo: true`. `site.demoMode` est livré à `false` et utilise aussi ce défaut si la clé est omise.

Les fichiers dont le nom commence par `_` sont ignorés ; ils peuvent servir de modèles. Les slugs utilisent des noms de fichiers sans espaces ni accents. Les sous-dossiers sont possibles dans `couture` et `dessin` et produisent des URL avec plusieurs segments.

## Textes, styles et pages

`src/lib/config.ts` charge et valide les trois fichiers YAML au moment de la compilation. Les textes visibles, les libellés de formulaire, les messages de statut et les libellés d’accessibilité viennent de `site.yaml`. Le texte des récits et des pages d’information vient des fichiers Markdown. Les textes de démonstration ne doivent pas être confondus avec la biographie ou les œuvres réelles de l’artiste.

`theme.yaml` alimente des variables CSS : fonds ivoire, or foncé `accent` pour les textes et quatre nuances `gold` / `goldLight` / `goldShadow` / `goldHighlight`. Les variables CSS `--gold-metal` et `--gold-satin` composent un or poli avec ombres ambrées et reflets champagne, utilisé sur les cadres, le ruban, le médaillon et les boutons. Les SVG de `Ornament.astro` et les icônes florales ou papillons utilisent un dégradé aux identifiants uniques ; ces décorations sont masquées aux technologies d’assistance. Les anciens éclats à quatre branches et losanges décoratifs sont remplacés par des fleurs et des papillons, y compris dans les dessins vectoriels de lune et de feuillages et le logo. Les reflets des boutons se déplacent au survol et respectent `prefers-reduced-motion`. `Brand.astro` affiche le logo configuré dans `site.logo` avec le nom et la signature, dans l’en-tête et le pied de page ; `src: ""` conserve le nom seul. Les fichiers locaux du logo sont contrôlés par la validation de contenu. Les polices sont incluses avec Fontsource ; seules les fontes nécessaires sont téléchargées par le navigateur depuis le site. Pour changer de famille :

1. Installer le paquet Fontsource de la nouvelle police.
2. Modifier ses imports dans `Base.astro`.
3. Modifier `fonts.heading` ou `fonts.body` dans `theme.yaml`.
4. Relancer le build et les tests d’accessibilité.

Pour modifier la composition, intervenir dans les composants et `global.css`. Les classes sont séparées en couches CSS `base` et `components` et les points de rupture se trouvent en bas du fichier. Les largeurs principales et arrondis sont configurables en YAML ; des changements structurels demandent de modifier les composants.

Les pages de `src/content/pages/` créent automatiquement une route simple : `ma-page.md` devient `/ma-page/`. Elles exigent `title` et `description`, et acceptent `eyebrow`. Ajouter leur lien dans `navigation` si nécessaire. Les noms `contact`, `couture`, `dessin`, `sur-mesure`, `404` et `index` sont réservés.

Les éditeurs sont considérés comme des personnes de confiance : Markdown peut contenir du HTML. Ne pas utiliser ce pipeline directement pour du contenu soumis par des visiteurs non authentifiés.

## Galerie et partage

La galerie utilise l’élément natif `<dialog>` : confinement du focus par le navigateur, fermeture avec Échap, retour au déclencheur, boutons précédent/suivant et touches fléchées. Le compteur d’images et les libellés viennent du YAML. Les images d’une fiche restent des liens directs sans JavaScript. Les catalogues affichent toutes les créations publiées, avec ou sans JavaScript, directement après leur introduction, sans bandeau annonçant leur nombre. Aucun contrôle ni script de filtrage par catégorie n’est présent. `category` reste un libellé éditorial facultatif affiché uniquement s’il est renseigné sur les cartes et les fiches. Les anciennes clés d’interface `filters`, `filterAll` et `results` ont été supprimées du YAML et du schéma.

Chaque fiche contient un titre, une URL canonique, Open Graph et une image de partage. Sans résumé propre à la fiche, la description SEO et sociale reprend celle du site. Le bouton de partage utilise l’API Web Share lorsqu’elle existe, puis la copie dans le presse-papiers. En dernier recours, le champ URL reste sélectionnable. Le lien partagé utilise l’adresse courante sans paramètres ni fragment, ce qui rend aussi les aperçus partageables.

Le partage natif et le presse-papiers dépendent du navigateur et du contexte sécurisé HTTPS. Les liens restent utilisables si ces API sont absentes.

## Contact et confidentialité

`src/lib/mail.ts` contient les fonctions pures de génération du corps et du lien `mailto:`. Les caractères accentués, `&`, `?` et les retours de ligne sont encodés avec `encodeURIComponent`. Le destinataire ne peut pas contenir d’injection de paramètres ou de nouvelle ligne.

`InquiryForm.astro` construit le récapitulatif en mémoire. Le bouton est désactivé jusqu’à l’initialisation du script ; aucun envoi de formulaire classique n’est effectué. Il n’y a pas de `localStorage`, cookie, service de formulaire tiers ni requête réseau de collecte. Si aucun destinataire n’est configuré, le message est simplement copiable. Si une messagerie est configurée, son ouverture laisse le récapitulatif sur la page.

Les liens `mailto:` dépendent de l’application de messagerie de chaque visiteur. Les très longs messages peuvent dépasser les limites de certains clients. Le champ copiable permet de récupérer le texte sans le tronquer. Le formulaire limite les messages à 3000 caractères. Aucune réception réelle d’e-mail n’est simulée par les tests.

## Prochaine étape : sur mesure

Le socle fonctionne déjà. Pour activer la page `/sur-mesure/` et son lien de navigation :

```yaml
# src/data/custom-order.yaml
enabled: true
```

Recompiler le site après activation. Tant que `enabled` vaut `false`, aucune route sur mesure n’est générée.

Les champs `measurements` décrivent des mesures en centimètres :

```yaml
measurements:
  - id: longueur-manche
    label: Longueur de manche
    min: 5
    max: 120
    required: false
```

Les mesures utilisent un pas de 0,5 cm. Les contraintes HTML imposent le minimum, le maximum et les champs obligatoires. Les identifiants doivent être uniques, en minuscules sans accents, et commencer par une lettre.

Les listes `options` décrivent tissus, matériaux, boutons ou tout autre choix :

```yaml
options:
  - id: boutons
    label: Les boutons
    choices:
      - À définir ensemble
      - Bois
      - Nacre
```

Les libellés sont repris dans le message avec les mesures renseignées, les choix et les précisions. La demande contient aussi le nom et l’adresse de réponse du visiteur. Elle ouvre un e-mail et **ne constitue pas une commande confirmée**. Aucun calcul de prix, stock ou paiement n’est implémenté.

Avant de rendre cette page publique, définir avec l’artiste les modèles proposés, les mesures utiles, les choix réellement disponibles et les explications de prise de mesures. Le catalogue YAML évite une réécriture du parcours lors de cette étape.

## Vérifications et maintenance

`npm run test:all` enchaîne :

1. Types Astro et validation des fichiers de contenu.
2. Tests unitaires des schémas, de l’encodage et des demandes.
3. Compilation, puis vérification des liens locaux, des ancres de la page courante et des ressources référencées par le HTML.
4. Tests Chromium sur ordinateur et mobile, navigation sans JavaScript et règles axe WCAG A/AA.
5. Compilation distincte avec le configurateur activé et parcours de saisie sur mesure.

Le contrôle des liens est local : il n’effectue pas de requête vers les sites externes et ne contrôle pas les fragments d’une autre page. Les fichiers CSS et SVG ne font pas l’objet d’un crawl de leurs références internes. La vraie configuration DNS, les secrets et la publication Cloudflare doivent être vérifiés dans leur environnement.

Le test sur mesure sauvegarde `custom-order.yaml`, l’active pendant son exécution puis restaure le fichier dans un bloc `finally`. Sa compilation est isolée dans `.test-order-dist/`, supprimé à la fin. En cas d’arrêt forcé du processus avant le nettoyage, remettre `enabled` à sa valeur précédente et supprimer ce dossier. Éviter d’éditer le YAML pendant ce test.

Les rapports Playwright et traces en échec sont conservés par la CI. Les tests de galerie ignorent explicitement les collections vides ; ils se basent sur les créations publiées pour rester utiles après remplacement des exemples. Une revue visuelle et une navigation au clavier complètent les contrôles automatisés.

Dependabot propose les mises à jour npm et GitHub Actions chaque semaine. Le lockfile est versionné ; utiliser `npm ci` en CI et après un changement de branche. Les actions GitHub sont épinglées par SHA. Vérifier et fusionner les mises à jour après passage de la CI.

Les en-têtes Cloudflare sont dans `public/_headers`. Ils contrôlent notamment le type MIME, la politique de référent, les permissions navigateur, l’intégration en iframe et le cache. La CSP autorise les styles et scripts inline nécessaires au document Astro et aux métadonnées JSON-LD ; aucun domaine tiers n’est autorisé par défaut. Si un nouveau service est ajouté, mettre à jour sa politique et la page confidentialité.

## Dev container

L’image `.devcontainer/Dockerfile` fournit Node 24 et les dépendances système de Chromium. `postCreateCommand` installe le lockfile et le navigateur Playwright sous l’utilisateur `node`. Aucun secret Cloudflare n’y est intégré. Les extensions Astro, YAML et Markdown sont proposées dans VS Code ; le port 4321 est transféré.

Pour contrôler l’image seule :

```bash
docker build -t myriade-devcontainer -f .devcontainer/Dockerfile .devcontainer
```

La commande `npm run dev` démarre le serveur sur les interfaces du conteneur pour permettre le transfert du port. `npm run preview` sert le site déjà compilé. Sous Astro 7, les outils de test utilisent `--ignore-lock` pour obtenir un serveur au premier plan et le fermer à la fin des tests.
