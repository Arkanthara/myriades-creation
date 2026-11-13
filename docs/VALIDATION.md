# Vérifications de livraison

Vérifications effectuées le **13 novembre 2026** sur la version livrée de Myriade Création.

| Contrôle                               | Résultat                                                                                               |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Astro / TypeScript strict              | 0 erreur, 0 avertissement                                                                              |
| Configuration YAML et contenu Markdown | Validation des 9 fichiers Markdown, de la navigation et des chemins d’images                           |
| Tests unitaires                        | 10 tests réussis                                                                                       |
| Tests Chromium ordinateur et mobile    | 28 tests réussis                                                                                       |
| Configurateur sur mesure activé        | 1 test navigateur réussi, avec validation des limites de mesure et récapitulatif                       |
| Compilation statique                   | 14 pages HTML, sitemap et robots.txt générés                                                           |
| Liens locaux du HTML généré            | Ressources, liens internes et ancres de la page vérifiés                                               |
| Accessibilité automatisée              | Règles axe WCAG A/AA sur les pages représentatives et le configurateur                                 |
| Dev container                          | Image Docker construite, Node 24 vérifié, dépendances installées et suites exécutées dans le conteneur |
| GitHub Actions                         | Workflow vérifié avec actionlint                                                                       |
| Cloudflare Pages local                 | En-têtes CSP, scripts, filtre couture, préparation du contact et réponse 404 vérifiés avec Wrangler    |
| Générateur de brouillon                | Création du fichier, brouillon par défaut, refus d’écrasement et rejet d’un nom invalide vérifiés      |
| Configuration de production            | Configuration incomplète refusée, configuration renseignée acceptée ; fichiers restaurés après essai   |
| Revue visuelle                         | Accueil vérifié sur ordinateur et mobile, avec chargement des images                                   |

Les captures locales se trouvent dans `.artifacts/accueil-ordinateur.png` et `.artifacts/accueil-mobile.png`. Ce dossier est ignoré par Git et ne fait pas partie du site déployé.

La page sur mesure reste désactivée dans la configuration livrée. Le test l’active dans une compilation distincte, puis restaure le fichier YAML. Le mode de démonstration reste actif et l’adresse e-mail reste vide, conformément au souhait de la renseigner plus tard.

La publication réelle GitHub/Cloudflare, le domaine personnalisé et la réception d’un e-mail n’ont pas été exécutés : le projet Cloudflare et ses secrets restent à configurer. Les tests mobiles utilisent une émulation Chromium ; ils ne constituent pas une validation sur tous les appareils ou une certification complète d’accessibilité.
