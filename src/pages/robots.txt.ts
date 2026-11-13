import type { APIRoute } from 'astro';
import { site, siteUrl } from '../lib/config';
export const GET: APIRoute = () =>
  new Response(
    [
      'User-agent: *',
      site.demoMode || (process.env.CF_PAGES_BRANCH && process.env.CF_PAGES_BRANCH !== 'main')
        ? 'Disallow: /'
        : 'Allow: /',
      `Sitemap: ${siteUrl}/sitemap-index.xml`,
      '',
    ].join('\n'),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
