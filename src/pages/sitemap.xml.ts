import type { APIRoute } from 'astro';
import { getProfile } from '../lib/data';
import { languages } from '../lib/i18n';

export const GET: APIRoute = async ({ site }) => {
  const pages = ['', 'publications/', 'cv/', ...((await getProfile()).show_life ? ['life/'] : [])];
  const urls = languages.flatMap((lang) =>
    pages.map((p) => `  <url><loc>${new URL(`/${lang}/${p}`, site).href}</loc></url>`),
  );
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
};
