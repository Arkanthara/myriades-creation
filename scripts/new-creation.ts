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
  description: 'Décrivez votre création en une ou deux phrases.',
  category: kind === 'couture' ? 'Accessoires' : 'Dessin',
  date: new Date().toISOString().slice(0, 10),
  order: 100,
  featured: false,
  draft: true,
  demo: false,
  technique: 'À personnaliser',
  materials: [],
  images: [
    {
      src: '/images/demo/atelier.webp',
      alt: 'À remplacer par une description de votre image.',
      width: 1536,
      height: 1024,
    },
  ],
};
try {
  await writeFile(
    `${dir}/${slug}.md`,
    `---\n${stringify(content)}---\n\n## L’histoire de cette création\n\nRacontez ici votre inspiration et votre démarche.\n`,
    { flag: 'wx' },
  );
  console.log(
    `Brouillon créé : ${dir}/${slug}.md. Ajoutez vos images, puis passez draft à false pour le publier.`,
  );
} catch (error) {
  if ((error as NodeJS.ErrnoException).code === 'EEXIST')
    throw new Error('Cette création existe déjà. Aucun fichier n’a été remplacé.');
  throw error;
}
