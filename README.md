# Myriade Création

Site vitrine Astro pour une couturière et dessinatrice. Univers **vert sauge, ivoire et rose**, galeries, récits de fabrication, partage des créations et contact par e-mail prérempli. Le site est statique, sans base de données, sans compte visiteur et sans dépendance à un CMS.

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
- Un fichier Markdown par création : images multiples, légendes, matières, technique, ordre, sélection d’accueil et brouillon.
- Filtres par catégorie, images agrandies dans une fenêtre navigable au clavier et liens individuels de partage avec métadonnées sociales.
- Textes d’interface en YAML, pages et récits en Markdown, couleurs et typographies configurables. Emplacement prévu pour le logo existant de l’artiste.
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

La version initiale contient **six créations d’exemple**, signalées comme telles. Les quatre visuels bitmap sont des démonstrations générées par IA ; les deux dessins SVG sont des exemples graphiques. Le vrai logo n’a pas été fourni : un nom composé en typographie est utilisé en attendant. Voir [les visuels](docs/VISUELS.md).

## Tester

```bash
npx playwright install --with-deps chromium
npm run test:all
```

| Commande                      | Contrôle                                                                                                |
| ----------------------------- | ------------------------------------------------------------------------------------------------------- |
| `npm run check`               | Types Astro/TypeScript, YAML, Markdown, navigation, images locales                                      |
| `npm test`                    | Encodage des e-mails, schémas et demandes sur mesure                                                    |
| `npm run build`               | Compilation + liens internes, ancres et ressources du site généré                                       |
| `npm run test:e2e`            | Chromium ordinateur et mobile : navigation, filtres, galeries, partage, formulaires, 404, accessibilité |
| `npm run test:order`          | Active temporairement le configurateur dans une compilation distincte et teste le parcours complet      |
| `npm run validate:production` | URL, adresse de contact et sortie du mode démo                                                          |

Le test sur mesure restaure automatiquement le YAML à la fin et ne modifie pas le site compilé dans `dist/`. Éviter de modifier `custom-order.yaml` pendant ce test. Les tests d’accessibilité automatisés couvrent les règles WCAG A/AA prises en charge par axe ; ils ne remplacent pas une revue humaine exhaustive.

## Déployer

La cible est **Cloudflare Pages**, avec upload direct par GitHub Actions. Le site reste en fichiers statiques : aucun adaptateur serveur Astro ni secret côté navigateur n’est nécessaire.

Suivre le [guide Cloudflare et CI/CD](docs/DEPLOIEMENT.md) pour créer le projet, renseigner les secrets et activer la publication. Tant que `CLOUDFLARE_PROJECT_NAME` n’est pas configuré dans GitHub, les vérifications fonctionnent et la publication est ignorée. Une pull request du même dépôt peut produire un aperçu ; `main` produit la version de production après validation.

Avant le lancement : intégrer les œuvres et le logo, compléter les pages d’information, définir l’URL et l’e-mail, puis passer `demoMode` à `false`. Le mode démo empêche l’indexation par les moteurs de recherche.

## Documentation

- [Guide de la créatrice et apprentissage Markdown/YAML](docs/GUIDE-CREATRICE.md)
- [Déploiement Cloudflare, GitHub Actions et retour arrière](docs/DEPLOIEMENT.md)
- [Architecture, maintenance et évolution du sur mesure](docs/TECHNIQUE.md)
- [Origine et remplacement des visuels](docs/VISUELS.md)
- [Résultats des vérifications de livraison](docs/VALIDATION.md)

Les fichiers de code suivent la [licence du dépôt](LICENSE). Les créations et le logo ajoutés par l’artiste restent soumis à ses propres droits.
