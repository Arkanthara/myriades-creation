import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve, dirname, relative } from 'node:path';
import { parse } from 'parse5';
import type { DefaultTreeAdapterMap } from 'parse5';
type Node = DefaultTreeAdapterMap['node'];
const root = resolve('dist');
async function files(dir: string): Promise<string[]> {
  return (
    await Promise.all(
      (await readdir(dir, { withFileTypes: true })).map((entry) =>
        entry.isDirectory() ? files(resolve(dir, entry.name)) : [resolve(dir, entry.name)],
      ),
    )
  ).flat();
}
const pages = (await files(root)).filter((file) => file.endsWith('.html'));
const failures: string[] = [];
for (const page of pages) {
  const tree = parse(await readFile(page, 'utf8'));
  const references: { url: string; attribute: string }[] = [];
  const ids = new Set<string>();
  function walk(node: Node) {
    if ('attrs' in node)
      for (const attribute of node.attrs) {
        if (attribute.name === 'id') ids.add(attribute.value);
        if (['href', 'src', 'poster'].includes(attribute.name))
          references.push({ url: attribute.value, attribute: attribute.name });
      }
    if ('childNodes' in node) node.childNodes.forEach(walk);
  }
  walk(tree);
  for (const { url } of references) {
    if (!url || /^(?:[a-z]+:|\/\/)/i.test(url)) continue;
    if (url.startsWith('#')) {
      if (url.length > 1 && !ids.has(decodeURIComponent(url.slice(1))))
        failures.push(`${relative(root, page)} → ancre absente ${url}`);
      continue;
    }
    const target = decodeURIComponent(url.split(/[?#]/)[0]);
    let path = target.startsWith('/')
      ? resolve(root, `.${target}`)
      : resolve(dirname(page), target);
    if (relative(root, path).startsWith('..')) {
      failures.push(`Chemin hors site : ${url}`);
      continue;
    }
    try {
      if ((await stat(path)).isDirectory()) path = resolve(path, 'index.html');
      await stat(path);
    } catch {
      failures.push(`${relative(root, page)} → lien ou fichier absent ${url}`);
    }
  }
}
if (failures.length) throw new Error(failures.join('\n'));
console.log(`${pages.length} pages HTML : liens internes, ancres et ressources locales vérifiés.`);
