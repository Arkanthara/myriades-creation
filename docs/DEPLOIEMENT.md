# Cloudflare Pages et GitHub Actions

Le site est compilé en fichiers statiques dans `dist/`. GitHub Actions vérifie le code et le contenu, teste le site puis envoie **le même dossier compilé et testé** à Cloudflare Pages. Les clés Cloudflare ne sont jamais intégrées au site.

## 1. Créer le projet Pages

Dans un terminal disposant des accès à votre compte Cloudflare :

```bash
npm ci
npx wrangler login
npx wrangler pages project create myriade-creation --production-branch main
```

Vous pouvez également créer un projet **Pages en Direct Upload** dans Cloudflare. Le nom peut être changé ; utilisez alors ce même nom dans `wrangler.jsonc` et dans la variable GitHub `CLOUDFLARE_PROJECT_NAME`.

Cette configuration utilise l’upload direct depuis GitHub Actions. Si le projet Pages est déjà connecté à GitHub avec des compilations automatiques Cloudflare, désactivez celles-ci pour que la publication passe par les tests de cette CI et pour éviter les doubles publications.

Référence : [Cloudflare — upload direct avec intégration continue](https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/).

## 2. Configurer les accès dans GitHub

Dans le dépôt, ouvrez **Settings → Secrets and variables → Actions**.

Ajoutez ces **secrets** :

| Nom                     | Valeur                                                                 |
| ----------------------- | ---------------------------------------------------------------------- |
| `CLOUDFLARE_API_TOKEN`  | Jeton API autorisé à modifier Cloudflare Pages dans le compte concerné |
| `CLOUDFLARE_ACCOUNT_ID` | Identifiant du compte Cloudflare                                       |

Pour le jeton, créez un token personnalisé dans Cloudflare avec la permission **Account → Cloudflare Pages → Edit**, limitée au compte qui héberge le projet. Le service n’a besoin d’aucun accès à votre boîte e-mail.

Ajoutez ces **variables de dépôt** :

| Nom                       | Valeur                                                                                         |
| ------------------------- | ---------------------------------------------------------------------------------------------- |
| `CLOUDFLARE_PROJECT_NAME` | `myriade-creation`, ou le nom réel du projet Pages                                             |
| `SITE_URL`                | Facultatif si `url` est déjà correct dans `site.yaml` ; par exemple `https://votre-domaine.ch` |

`SITE_URL` contrôle les URL canoniques, les images sociales et le sitemap. Utilisez l’adresse publique définitive, sans sous-chemin. Le site est conçu pour être installé à la racine d’un domaine.

Créez les environnements GitHub **preview** et **production** dans **Settings → Environments** si vous souhaitez y appliquer des règles particulières. Les secrets de dépôt fonctionnent pour les deux environnements. La CI n’impose pas de validation manuelle supplémentaire ; vous pouvez en ajouter une dans GitHub si votre organisation le souhaite.

Ne copiez jamais les jetons dans un fichier YAML, dans `.env.example` ou dans un commit.

## 3. Renseigner les contenus avant production

Dans `src/data/site.yaml` :

```yaml
url: https://votre-domaine.ch
demoMode: false
```

Dans la section `contact`, remplissez `email`. Conservez les autres champs de cette section. Ajoutez le logo, remplacez les œuvres de démonstration et complétez les pages d’information. Voir le guide de la créatrice.

Vérifiez :

```bash
npm run validate:production
```

Cette vérification refuse une URL d’exemple, une adresse e-mail manquante ou d’exemple, et un site encore en mode démo. Elle ne vérifie pas la propriété du domaine ni la réception réelle des e-mails. Ces vérifications restent à effectuer avec les accès de l’artiste.

Tant que l’e-mail doit être renseigné plus tard, vous pouvez garder le mode démo et consulter la version locale ou une version d’aperçu de pull request. Le bouton du formulaire prépare alors un récapitulatif copiable.

## 4. Le cycle d’une modification

Le workflow `.github/workflows/ci-cd.yml` se déclenche sur :

- Une pull request vers `main` : vérifications, puis aperçu Cloudflare pour les branches du même dépôt.
- Un changement sur `main` : vérifications, validation de lancement, puis publication de production.
- Un lancement manuel **Actions → Vérifier et déployer Myriade Création → Run workflow**. La publication n’est possible que depuis `main`.

Les contributions venant d’un fork exécutent les tests sans recevoir les secrets et sans publier. Le workflow utilise `pull_request`, jamais `pull_request_target`.

Les étapes de vérification sont : installation avec le lockfile, types et contenu, tests unitaires, compilation et liens locaux, tests navigateur sur ordinateur et mobile, puis test du configurateur sur mesure. Les fichiers compilés sont conservés sept jours comme artefact GitHub.

Le job `Cloudflare Pages` télécharge cet artefact et utilise Wrangler. Pour une pull request, la branche de déploiement est `preview-pr-<numéro>`. Pour la production, elle est `main`. Le lien de la version apparaît dans les journaux Wrangler et dans le tableau de bord Pages. Une erreur de test empêche le job de publication de démarrer.

Les aperçus sont exclus des moteurs par `robots.txt` et une balise `noindex`. Leur URL peut néanmoins être consultable par les personnes qui la connaissent. Pour des brouillons confidentiels, configurez [Cloudflare Access pour les aperçus Pages](https://developers.cloudflare.com/pages/configuration/preview-deployments/).

Dans les règles de branche GitHub, il est conseillé de protéger `main` et d’exiger le contrôle **Contenu, types, tests et site compilé** avant fusion. Cela permet à la créatrice de relire un aperçu avant la mise en ligne.

## 5. Premier déploiement et domaine

Après un premier passage réussi du workflow, ouvrez l’adresse `pages.dev` retournée par Cloudflare. Dans **Workers & Pages → votre projet → Custom domains**, ajoutez le domaine public et suivez les instructions DNS de Cloudflare.

Ajoutez ensuite cette adresse dans `url` ou dans `SITE_URL` et relancez le workflow pour actualiser les liens de partage et le sitemap. Si vous commencez sans domaine personnalisé, une URL réelle `https://votre-projet.pages.dev` convient aussi à `SITE_URL`.

Référence : [Cloudflare Pages — domaines personnalisés](https://developers.cloudflare.com/pages/configuration/custom-domains/).

## 6. Publier depuis son poste

Avec une session `wrangler login` ouverte, et une configuration prête :

```bash
npm run test:all
npm run deploy
```

`npm run deploy` vérifie la configuration de production puis compile le site avant de publier avec le nom de `wrangler.jsonc`. Cette commande locale ne relance pas les tests navigateur : exécutez-les comme ci-dessus avant une publication manuelle.

Pour publier volontairement une démonstration comme aperçu :

```bash
npm run build
npx wrangler pages deploy dist --project-name=myriade-creation --branch=demonstration
```

`demoMode` est livré à `false` et vaut `false` par défaut. Pour un aperçu volontairement en démonstration, utilisez `demoMode: true`. Un aperçu ne remplace pas la production de la branche `main`.

## 7. Revenir à une version précédente

Deux possibilités :

1. **Code et contenu** : dans GitHub, utilisez **Revert** sur la pull request concernée et fusionnez le retour arrière. La CI recompile et republie la version corrigée. C’est la solution durable, puisque GitHub reste la source de référence.
2. **Retour public rapide** : dans les déploiements Cloudflare Pages, choisissez une ancienne version de production et utilisez la fonction de rollback. Répercutez ensuite la correction dans GitHub ; le prochain push sur `main` republiera l’état du dépôt.

Référence : [Cloudflare Pages — rollbacks](https://developers.cloudflare.com/pages/configuration/rollbacks/).

## 8. En cas de problème

| Problème                               | À vérifier                                                                                                                      |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Le job de déploiement est ignoré       | La variable de dépôt `CLOUDFLARE_PROJECT_NAME` est-elle renseignée ? S’agit-il d’un fork ou d’un lancement manuel hors `main` ? |
| Erreur d’authentification Wrangler     | Jeton API, compte et permission Pages Edit                                                                                      |
| Projet introuvable                     | Nom exact du projet et compte sélectionné                                                                                       |
| Production refusée                     | E-mail, URL réelle et `demoMode: false`                                                                                         |
| Le partage contient example.com        | Renseigner l’URL réelle et recompiler                                                                                           |
| Les changements sont publiés deux fois | Désactiver la compilation Git intégrée de Cloudflare pour ce projet                                                             |
| Une image reste ancienne               | Utiliser un nouveau nom de fichier ou purger le cache Cloudflare                                                                |

Les accès Cloudflare et les secrets GitHub doivent être fournis par le propriétaire du compte. Les fichiers de CI livrés ne créent pas eux-mêmes le compte, le projet ou les secrets.
