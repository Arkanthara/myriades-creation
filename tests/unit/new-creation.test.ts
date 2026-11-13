import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { parse } from 'yaml';
import { expect, it } from 'vitest';
import { creationSchema, drawingSchema } from '../../src/lib/content-schema';

const script = resolve('scripts/new-creation.ts');
const tsx = resolve('node_modules/tsx/dist/cli.mjs');

it.each(['couture', 'dessin'] as const)(
  'génère une fiche %s minimale sans démo ni brouillon et protège les fichiers existants',
  (kind) => {
    const cwd = mkdtempSync(join(tmpdir(), 'myriade-content-'));
    const run = (...args: string[]) =>
      execFileSync(process.execPath, [tsx, script, ...args], { cwd, stdio: 'pipe' });
    try {
      run(kind, 'une-fleur', 'Une fleur');
      const path = join(cwd, 'src/content', kind, 'une-fleur.md');
      const content = readFileSync(path, 'utf8');
      const input = parse(/^---\n([\s\S]*?)\n---/.exec(content)![1]);
      const schema = kind === 'couture' ? creationSchema : drawingSchema;
      const data = schema.parse(input);
      expect(data.title).toBe('Une fleur');
      expect(data.demo).toBe(false);
      expect(data.draft).toBe(false);
      expect(data.images).toEqual([{ src: '/images/une-fleur.webp', position: 'center' }]);
      expect(Object.keys(input).sort()).toEqual(
        (kind === 'couture'
          ? ['title', 'technique', 'cut', 'materials', 'images']
          : ['title', 'technique', 'images']
        ).sort(),
      );
      expect(() => run(kind, 'une-fleur', 'Autre titre')).toThrow();
      expect(readFileSync(path, 'utf8')).toBe(content);
      expect(() => run(kind, '../invalide')).toThrow();
      expect(() => run('autre', 'une-fleur')).toThrow();
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  },
);
