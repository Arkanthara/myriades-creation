import { getCollection, type CollectionEntry } from 'astro:content';
export type Creation = CollectionEntry<'couture'> | CollectionEntry<'dessin'>;
export type Kind = 'couture' | 'dessin';
export async function creations(kind: Kind): Promise<Creation[]> {
  return (await getCollection(kind, ({ data }) => !data.draft)).sort(
    (a, b) =>
      a.data.order - b.data.order ||
      b.data.date.getTime() - a.data.date.getTime() ||
      a.id.localeCompare(b.id),
  );
}
export function creationUrl(entry: Creation) {
  return `/${entry.collection}/${entry.id}/`;
}
