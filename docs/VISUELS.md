# Visuels de démonstration

Les œuvres et le logo de l’artiste n’ont pas encore été fournis. Les visuels livrés servent à rendre la mise en page consultable et sont identifiés comme exemples. Ils ne doivent pas être présentés comme des réalisations réelles de la créatrice.

## Images générées

Ces images ont été produites avec l’outil intégré **imagegen**, puis encodées en WebP avec Sharp pour réduire leur poids, sans modifier leur composition.

| Fichier final                      | Usage                                             |
| ---------------------------------- | ------------------------------------------------- |
| `public/images/demo/atelier.webp`  | Ambiance d’atelier, accueil et carnet de matières |
| `public/images/demo/robe.webp`     | Exemple de fiche couture                          |
| `public/images/demo/pochette.webp` | Exemple d’accessoire brodé                        |
| `public/images/demo/herbier.webp`  | Exemple de dessin et section de présentation      |

### Prompts utilisés

**Atelier**

> Use case: photorealistic-natural. Asset type: editorial hero photograph for a French fairy-inspired seamstress and illustrator portfolio. A beautiful quiet artisan worktable beside a soft daylight window: a vintage cream sewing machine, folded sage green linen and ivory embroidered gauze with delicate wildflowers, antique brass scissors, wooden thread spools, an open botanical watercolor sketchbook, a tiny vase of meadow flowers. Warm natural wood table, softly blurred deep green garden behind, subtle woodland fairy atmosphere expressed through real natural materials, no literal fairies. Composition: landscape 3:2 photograph, close editorial still life, layered lush details, no people. Colors warm ivory, soft sage, muted rose, warm brown. Fine film grain, tactile linen textures, nostalgic authentic handmade atelier, gentle sunlight. No text, no lettering, no logos, no watermark, no graphic frames.

**Robe**

> Use case: product-mockup. Asset type: portrait example image for a French seamstress portfolio, demonstration content. Editorial photograph of a romantic sage green linen pinafore dress on a simple cream dressmaker mannequin, delicate tiny embroidered white wildflowers at the hem and bodice. Beautiful handcrafted details, warm ivory plaster wall in a sunlit artisan atelier, dried flowers out of focus. No person, no face, no words, no logos, no watermark. Muted sage green, cream, natural linen, tactile premium editorial photography, portrait composition.

**Pochette**

> Use case: product-mockup. Asset type: example image for a French seamstress portfolio, demonstration content. Editorial closeup photograph of a handmade ivory linen drawstring pouch embroidered with tiny botanical stems and pink meadow flowers, sage green ribbon. On a natural wooden desk with antique brass scissors, a spool of thread, a few dried daisies. Soft natural window light, poetic woodland atmosphere, tactile linen weave, muted sage cream dusty rose, portrait composition. No text, no letters, no logos, no watermark.

**Herbier**

> Use case: illustration-story. Asset type: demonstration drawing for a French fairy illustrator portfolio. A delicate handpainted watercolor botanical plate on warm textured ivory paper, a large elegant luna moth with soft sage green wings surrounded by fine wild meadow flowers, ferns, small berries and tiny gold stars. Airy balanced portrait composition, precise pencil outlines and transparent watercolor washes, muted green, ochre, dusty rose. Charming naturalist fairy woodland mood. No text, no lettering, no frame, no watermark, no signature.

## Illustrations vectorielles

`public/images/demo/lune.svg` et `public/images/demo/fougeres.svg` sont des compositions graphiques d’exemple écrites en SVG pour ce projet. Les anciens éclats à quatre branches ont été remplacés par des fleurs dans `lune.svg` et `fougeres.svg`. Le motif botanique d’interface est dans `src/components/Botanical.astro`. Le monogramme M couronné (`public/images/logo-myriade.svg`) et le favicon assorti sont des repères de démonstration écrits en SVG, à remplacer par le vrai logo. Le composant `Ornament.astro` fournit les papillons, fleurs et arabesques en or poli décoratifs. Le logo se configure via `logo.src` et `logo.alt` dans `src/data/site.yaml`, pour l’en-tête et le pied de page. Ces SVG restent nets sur tous les écrans. Les photographies et illustrations de démonstration conservent leurs couleurs d’origine ; le thème chaud s’applique à l’interface et à ses ornements.

## Remplacer les visuels

Ajoutez les œuvres dans `public/images/`, puis renseignez leur chemin `src` obligatoire ; dimensions, textes alternatifs et légendes sont facultatifs et peuvent être ajoutés dans les fichiers Markdown. Modifiez aussi `home.image`, `home.imageAlt`, `home.atelierImage` et `home.atelierImageAlt` pour les images d’accueil. Omettez `demo` ou utilisez `demo: false` sur les fiches réelles ; `draft` vaut également `false` par défaut.

Après remplacement de toutes les références, les images du dossier `demo/` peuvent être supprimées. `npm run check` et `npm run build` signaleront toute référence oubliée. Le générateur de fiche minimale indique `/images/<nom-du-fichier>.webp` : ajoutez votre fichier à ce chemin ou corrigez `src` avant la vérification. Les modèles `_exemple-minimal.md` utilisent des images de démonstration uniquement pour illustrer la syntaxe ; ils sont exclus du site et doivent être personnalisés lors de leur duplication.
