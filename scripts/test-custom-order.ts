import { readFile, writeFile, rm } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { parse, stringify } from 'yaml';
const file = 'src/data/custom-order.yaml';
const original = await readFile(file, 'utf8');
try {
  const config = parse(original);
  config.enabled = true;
  await writeFile(file, stringify(config));
  const build = spawnSync('npm', ['exec', '--', 'astro', 'build', '--outDir', '.test-order-dist'], {
    stdio: 'inherit',
  });
  if (build.status !== 0) throw new Error('Échec de compilation du scénario sur mesure.');
  const tests = spawnSync(
    'npm',
    ['exec', '--', 'playwright', 'test', '--config', 'playwright.order.config.ts'],
    { stdio: 'inherit' },
  );
  if (tests.status !== 0) throw new Error('Échec des tests du scénario sur mesure.');
} finally {
  await writeFile(file, original);
  await rm('.test-order-dist', { recursive: true, force: true });
}
