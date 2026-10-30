import { defineConfig } from 'astro/config';

// Old Hugo URLs keep working after the redesign.
const legacy = {};
for (const lang of ['en', 'zh']) {
  Object.assign(legacy, {
    [`/${lang}/about`]: `/${lang}/`,
    [`/${lang}/projects`]: `/${lang}/publications/`,
    [`/${lang}/resume`]: `/${lang}/cv/`,
    [`/${lang}/blog`]: `/${lang}/life/`,
    [`/${lang}/blog/travel`]: `/${lang}/life/#travel`,
    [`/${lang}/blog/show`]: `/${lang}/life/#shows`,
  });
}

export default defineConfig({
  site: 'https://zhouyibin8.github.io',
  trailingSlash: 'ignore',
  redirects: legacy,
});
