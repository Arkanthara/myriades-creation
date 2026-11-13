# Vérifications de livraison

Vérifications mises à jour le **13 novembre 2026** après simplification des fiches couture et dessin et refonte du thème or poli.

| Contrôle                               | Résultat                                                                                                                                   |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Astro / TypeScript strict              | 0 erreur, 0 avertissement, 0 remarque sur 40 fichiers                                                                                      |
| Configuration YAML et contenu Markdown | 9 fichiers publiables validés, navigation et chemins d’images contrôlés                                                                    |
| Tests unitaires                        | **28 tests réussis** dans 3 fichiers                                                                                                       |
| Tests Chromium ordinateur et mobile    | **40 tests réussis**                                                                                                                       |
| Configurateur sur mesure activé        | **1 test navigateur réussi**, compilation isolée puis restauration du YAML                                                                 |
| Compilation statique                   | 14 pages HTML, sitemap et robots.txt générés                                                                                               |
| Liens locaux du HTML généré            | Ressources, liens internes et ancres vérifiés                                                                                              |
| Accessibilité automatisée              | Règles axe WCAG A/AA sur les pages représentatives, les deux fiches minimales et le configurateur                                          |
| Générateur de fiche minimale           | Minima distincts couture/dessin, `demo: false` et `draft: false` par défaut, refus d’écrasement et rejet des noms invalides                |
| Modèles minimaux                       | Deux fichiers `_exemple-minimal.md` validés par les tests et exclus des pages générées                                                     |
| Images sans métadonnées                | Sources seules acceptées ; titre utilisé comme alternative ; absence de légende, année et dimensions inventées vérifiée dans le navigateur |
| Thème or poli                          | Reflets métalliques, fleurs et papillons, préférence de réduction des animations et affichage à 320 pixels vérifiés                        |
| Revue visuelle                         | Captures d’accueil sur ordinateur et mobile, images chargées                                                                               |

Les contrôles ont été exécutés avec **Node.js 24.11.1**. Le Node.js 22.23.1 présent par défaut dans cet environnement est inférieur au minimum Astro ; les vérifications utilisent donc une installation Node 24 sans modifier les dépendances du projet.

Les 69 tests couvrent notamment les champs obligatoires manquants ou vides, les galeries sans image, l’obligation de `src` sur chaque image, les métadonnées facultatives, les défauts éditoriaux, le générateur et ses protections, les galeries au clavier, le partage, les formulaires, les catalogues sans filtres et les pages 404. Les fiches minimales publiées sont testées dans les deux collections ; leurs contrôles sont ignorés si ces exemples sont supprimés ou enrichis par la créatrice.

Les captures locales à jour se trouvent dans `.artifacts/accueil-ordinateur.png` et `.artifacts/accueil-mobile.png`, ainsi que dans `test-results/` après exécution de la suite générale. Ces dossiers sont ignorés par Git et ne font pas partie du site déployé.

La page sur mesure reste désactivée dans la configuration livrée. Le test l’active dans une compilation distincte, puis restaure le fichier YAML. Le mode global `demoMode` est maintenant **désactivé**, ainsi que `demo` et `draft` par défaut sur les nouvelles fiches. Les six exemples existants conservent explicitement `demo: true`. L’adresse e-mail reste vide et peut être renseignée plus tard.

Les contrôles Docker, actionlint, Wrangler local et configuration de production consignés lors de la livraison initiale n’ont pas été rejoués pour cette modification. La publication GitHub/Cloudflare, le domaine personnalisé et la réception réelle d’un e-mail restent à vérifier dans leur environnement. Les tests mobiles utilisent une émulation Chromium ; les tests axe ne constituent pas une certification complète d’accessibilité.
