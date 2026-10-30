# Yibin Zhou — personal academic website

Live site: <https://zhouyibin8.github.io/en/> · 中文：<https://zhouyibin8.github.io/zh/>

## Updating content (no code needed) · 更新内容（无需改代码）

1. Open **<https://zhouyibin8.github.io/admin/>** and choose **Sign In with Token**
   (使用访问令牌登录). The dialog links to GitHub with the right permissions
   pre-selected; create the token, paste it in, and the browser remembers it.
2. Pick a section on the left — Profile & CV, News, Publications, Presentations,
   Travel, Shows — edit or add an entry, upload photos, then click **Save**.
3. Each save is a commit to `main`. GitHub Actions rebuilds the site and it is
   live in about 1–2 minutes (progress: the repository's **Actions** tab).

Every field has an English box and an optional Chinese box (…\_zh). If a Chinese
box is empty, the Chinese site shows the English text.

Images can be any size: uploaded photos go to `src/assets/…`, and the build
converts them to small WebP files in several sizes.

## How it is built

- [Astro](https://astro.build) static site. Pages: `src/pages/[lang]/` (`en`, `zh`).
- Content lives in YAML files under `src/content/` and is checked against the
  schemas in `src/content.config.ts` — a malformed entry fails the build with a
  clear message instead of breaking the live site.
- Editor: [Sveltia CMS](https://sveltiacms.app), configured in `public/admin/config.yml`.
- Deployment: `.github/workflows/deploy.yml` → GitHub Pages
  (Settings → Pages → Source: **GitHub Actions**).
- Old Hugo URLs (`/en/projects/`, `/zh/resume/`, `/en/blog/travel/`, …) redirect to
  the new pages (see `astro.config.mjs`).

## Local development

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to dist/
```

To use the editor against your local files, open `http://localhost:4321/admin/index.html`
in Chrome or Edge and choose **Work with Local Repository**.

## Archive

The previous Hugo-generated site is preserved on the branch
`archive/hugo-site-2026` and the tag `archive-hugo-2026-10-31`.
