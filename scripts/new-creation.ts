import { mkdir, writeFile } from 'node:fs/promises';
import { stringify } from 'yaml';
const [kind, slug, ...words] = process.argv.slice(2);
if (!['couture', 'dessin'].includes(kind) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug || '')) {
  console.error(
    'Usage : npm run content:new -- couture|dessin nom-sans-accents "Titre de la création"',
  );
  process.exit(1);
}
const title = words.join(' ') || slug;
const dir = `src/content/${kind}`;
await mkdir(dir, { recursive: true });
const content = {
  title,
  technique: 'À personnaliser',
  ...(kind === 'couture' ? { cut: 'À personnaliser', materials: ['À personnaliser'] } : {}),
  images: [{ src: `/images/${slug}.webp` }],
};
try {
  await writeFile(`${dir}/${slug}.md`, `---\n${stringify(content)}---\n`, { flag: 'wx' });
  console.log(
    `Fiche créée : ${dir}/${slug}.md (demo: false et draft: false par défaut). Personnalisez les champs et ajoutez public/images/${slug}.webp avant compilation. Pour la masquer, ajoutez draft: true.`,
  );
} catch (error) {
  if ((error as NodeJS.ErrnoException).code === 'EEXIST')
    throw new Error('Cette création existe déjà. Aucun fichier n’a été remplacé.');
  throw error;
}
