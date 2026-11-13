import { readFile, readdir, access } from 'node:fs/promises';
import { resolve, relative } from 'node:path';
import { parse } from 'yaml';
import { site, siteUrl, customOrder } from '../src/lib/config';
import { creationSchema, pageSchema } from '../src/lib/content-schema';

const publicRoot = resolve('public');
async function checkAsset(src: string) {
  const path = resolve(publicRoot, `.${src}`);
  if (relative(publicRoot, path).startsWith('..'))
    throw new Error(`Chemin d’image interdit : ${src}`);
  await access(path).catch(() => {
    throw new Error(`Image introuvable : public${src}`);
  });
}
async function files(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((entry) =>
        entry.isDirectory() ? files(`${dir}/${entry.name}`) : [`${dir}/${entry.name}`],
      ),
    )
  ).flat();
}
let count = 0;
const pageIds: string[] = [];
for (const kind of ['couture', 'dessin', 'pages']) {
  for (const file of await files(`src/content/${kind}`)) {
    if (!file.endsWith('.md') || file.split('/').at(-1)!.startsWith('_')) continue;
    const content = await readFile(file, 'utf8');
    const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(content);
    if (!frontmatter) throw new Error(`En-tête YAML manquant dans ${file}`);
    const id = file.replace(`src/content/${kind}/`, '').replace(/\.md$/, '');
    if (!/^[a-z0-9]+(?:[/-][a-z0-9]+)*$/.test(id))
      throw new Error(`Nom de fichier invalide : ${file}. Utiliser des minuscules sans accents.`);
    if (kind === 'pages') {
      pageSchema.parse(parse(frontmatter[1]));
      if (
        ['contact', 'couture', 'dessin', 'sur-mesure', '404', 'index'].includes(id) ||
        id.includes('/')
      )
        throw new Error(`Nom de page réservé : ${id}`);
      pageIds.push(id);
    } else {
      const data = creationSchema.parse(parse(frontmatter[1]));
      for (const image of data.images) await checkAsset(image.src);
    }
    count++;
  }
}
await checkAsset(site.home.image);
await checkAsset(site.home.atelierImage);
if (site.logo.src) await checkAsset(site.logo.src);
const routes = [
  '/',
  '/couture/',
  '/dessin/',
  '/contact/',
  ...pageIds.map((id) => `/${id}/`),
  ...(customOrder.enabled ? ['/sur-mesure/'] : []),
];
for (const link of site.navigation)
  if (!routes.includes(link.href)) throw new Error(`Lien de navigation inconnu : ${link.href}`);
if (process.argv.includes('--production')) {
  const problems = [];
  const url = new URL(siteUrl);
  if (url.protocol !== 'https:' || /(^|\.)(example\.(com|org|net)|localhost)$/.test(url.hostname))
    problems.push('renseigner une URL HTTPS réelle dans src/data/site.yaml ou SITE_URL');
  if (!site.contact.email || /@example\.(com|org|net)$/.test(site.contact.email))
    problems.push('renseigner contact.email dans src/data/site.yaml');
  if (site.demoMode) problems.push('passer demoMode à false après personnalisation');
  if (problems.length)
    throw new Error(`Configuration de production incomplète :\n- ${problems.join('\n- ')}`);
}
console.log(`${count} fichiers Markdown, configuration YAML, navigation et images : OK.`);
