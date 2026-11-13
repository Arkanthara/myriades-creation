# Myriade Création

Site vitrine Astro pour une couturière et dessinatrice. Univers **féerique, ivoire et or poli aux reflets champagne, fleurs et papillons**, galeries, récits de fabrication, partage des créations et contact par e-mail prérempli. Le site est statique, sans base de données, sans compte visiteur et sans dépendance à un CMS.

**Pour la créatrice : commencez par le [guide de gestion du site](docs/GUIDE-CREATRICE.md).** Vous pouvez gérer le contenu avec l’éditeur de fichiers GitHub, sans installer de logiciel.

## Démarrer

Node.js **24 LTS** et npm sont recommandés. Le minimum demandé par cette version d’Astro est Node 22.23.4. Le fichier `.nvmrc` et le dev container utilisent Node 24.

```bash
npm ci
npm run dev
```

Ouvrir <http://localhost:4321>. Les modifications des fichiers sont visibles immédiatement en développement.

Avec VS Code et Docker : installer l’extension **Dev Containers**, ouvrir le dossier et choisir **Dev Containers: Reopen in Container**. L’installation des dépendances et du navigateur de test est automatique. Lancer ensuite `npm run dev`. Le port 4321 est transféré. Les mêmes fichiers fonctionnent avec GitHub Codespaces.

## Ce qui est livré

- Accueil, collection couture, galerie dessin, atelier, contact, confidentialité, mentions légales et page 404.
- Un fichier Markdown par création : titre, technique, coupe, matériaux et au moins une image en couture ; titre, technique et image pour les dessins. Tous les autres champs sont facultatifs.
- Catalogues complets sans filtres par catégorie, images agrandies dans une fenêtre navigable au clavier et liens individuels de partage avec métadonnées sociales.
- Textes d’interface en YAML, pages et récits en Markdown, couleurs et typographies configurables. Logo personnalisable dans l’en-tête et le pied de page, accompagné du nom de l’artiste.
- Formulaire qui prépare un e-mail, conserve un récapitulatif copiable et ne transmet rien automatiquement.
- Configurateur sur mesure déjà implémenté et testé, désactivé par défaut : mesures, tissus, couleurs et boutons configurables en YAML.
- Polices et images locales, mise en page responsive, prise en compte de la réduction des animations.
- Dev container, tests unitaires, tests navigateur sur ordinateur et mobile, contrôles d’accessibilité et CI/CD vers Cloudflare Pages.

## Personnaliser

| Besoin                                                            | Fichier / dossier                                          |
| ----------------------------------------------------------------- | ---------------------------------------------------------- |
| Nom, textes, contact, logo, navigation, réseaux, images d’accueil | `src/data/site.yaml`                                       |
| Couleurs, polices, largeur, arrondi des images                    | `src/data/theme.yaml`                                      |
| Une création couture                                              | `src/content/couture/*.md`                                 |
| Un dessin                                                         | `src/content/dessin/*.md`                                  |
| Atelier et pages d’information                                    | `src/content/pages/*.md`                                   |
| Photos, dessins et logo                                           | `public/images/`                                           |
| Options et activation du sur mesure                               | `src/data/custom-order.yaml`                               |
| Mise en page et styles avancés                                    | `src/components/`, `src/layouts/`, `src/styles/global.css` |

L’adresse de contact est volontairement vide, conformément au besoin de la renseigner plus tard. Le site permet de préparer et copier un message tant qu’elle manque. Aucun e-mail fictif ne reçoit les demandes.

La version initiale contient **six créations d’exemple**, signalées comme telles. Les quatre visuels bitmap sont des démonstrations générées par IA ; les deux dessins SVG sont des exemples graphiques. Le vrai logo n’a pas été fourni : un monogramme M couronné de démonstration est utilisé en attendant. Remplacez `logo.src` et `logo.alt` dans `src/data/site.yaml` ; un chemin vide conserve le nom seul. Voir [les visuels](docs/VISUELS.md).

## Ajouter une fiche minimale

- **Couture** : `title`, `technique`, `cut` (coupe), `materials` (au moins un matériau), `images` (au moins une image).
- **Dessin** : `title`, `technique`, `images` (au moins une image).
- **Chaque image** : uniquement `src`, le chemin local `/images/...`. `alt`, légende, dimensions et cadrage sont facultatifs. Sans `alt`, le titre sert de description accessible.
- Description, catégorie, date, récit et réglages éditoriaux sont facultatifs. `demo` et `draft` valent **`false` par défaut**.

Les modèles [`couture/_exemple-minimal.md`](src/content/couture/_exemple-minimal.md) et [`dessin/_exemple-minimal.md`](src/content/dessin/_exemple-minimal.md) contiennent exactement ces minima. Leur préfixe `_` les exclut du site. Le [guide](docs/GUIDE-CREATRICE.md) détaille les champs et les exemples enrichis.

```bash
npm run content:new -- couture ma-pochette "Ma pochette"
npm run content:new -- dessin mes-fleurs "Mes fleurs"
```

Personnalisez les champs générés et ajoutez l’image au chemin indiqué avant compilation. Pour masquer volontairement une fiche, ajoutez `draft: true`.

## Tester

```bash
npx playwright install --with-deps chromium
npm run test:all
```

| Commande                      | Contrôle                                                                                                                      |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `npm run check`               | Types Astro/TypeScript, YAML, Markdown, navigation, images locales                                                            |
| `npm test`                    | Encodage des e-mails, minima couture/dessin, générateur, schémas et demandes sur mesure                                       |
| `npm run build`               | Compilation + liens internes, ancres et ressources du site généré                                                             |
| `npm run test:e2e`            | Chromium ordinateur et mobile : navigation, logo, catalogues sans filtres, galeries, partage, formulaires, 404, accessibilité |
| `npm run test:order`          | Active temporairement le configurateur dans une compilation distincte et teste le parcours complet                            |
| `npm run validate:production` | URL, adresse de contact et sortie du mode démo                                                                                |

Le test sur mesure restaure automatiquement le YAML à la fin et ne modifie pas le site compilé dans `dist/`. Éviter de modifier `custom-order.yaml` pendant ce test. Les tests d’accessibilité automatisés couvrent les règles WCAG A/AA prises en charge par axe ; ils ne remplacent pas une revue humaine exhaustive.

## Déployer

La cible est **Cloudflare Pages**, avec upload direct par GitHub Actions. Le site reste en fichiers statiques : aucun adaptateur serveur Astro ni secret côté navigateur n’est nécessaire.

Suivre le [guide Cloudflare et CI/CD](docs/DEPLOIEMENT.md) pour créer le projet, renseigner les secrets et activer la publication. Tant que `CLOUDFLARE_PROJECT_NAME` n’est pas configuré dans GitHub, les vérifications fonctionnent et la publication est ignorée. Une pull request du même dépôt peut produire un aperçu ; `main` produit la version de production après validation.

Avant le lancement : intégrer les œuvres et le logo, compléter les pages d’information et définir l’URL et l’e-mail. `demoMode` vaut `false` dans la configuration livrée et par défaut ; `true` active un bandeau de démonstration et empêche l’indexation. Les fiches d’exemple conservent explicitement `demo: true`.

## Documentation

- [Guide de la créatrice et apprentissage Markdown/YAML](docs/GUIDE-CREATRICE.md)
- [Déploiement Cloudflare, GitHub Actions et retour arrière](docs/DEPLOIEMENT.md)
- [Architecture, maintenance et évolution du sur mesure](docs/TECHNIQUE.md)
- [Origine et remplacement des visuels](docs/VISUELS.md)
- [Résultats des vérifications de livraison](docs/VALIDATION.md)

Les fichiers de code suivent la [licence du dépôt](LICENSE). Les créations et le logo ajoutés par l’artiste restent soumis à ses propres droits.
