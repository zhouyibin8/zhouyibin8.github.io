import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { themes } from './lib/themes';

// The editor at /admin may write an empty string or null for a field left blank.
// These helpers treat all of those as "not set" so a blank field never breaks the build.
const blank = (v: unknown) => v === '' || v === null;
// Numbers are accepted too: YAML reads an unquoted 2025.04 as a number.
const text = () =>
  z
    .union([z.string(), z.number()])
    .nullish()
    .transform((v) => (v === null || v === undefined || v === '' ? undefined : String(v)));
const list = <T extends z.ZodType>(item: T) =>
  z.preprocess((v) => (blank(v) ? undefined : v), z.array(item).optional()).transform((v) => v ?? []);
const optImage = (image: () => z.ZodType) =>
  z.preprocess((v) => (blank(v) ? undefined : v), image().optional());

// "2024.12", "2024", or a range such as "2019-2023".
const looseDate = z.coerce.string().regex(/^\d{4}(\.\d{1,2})?(\s*[-–]\s*\d{4}(\.\d{1,2})?)?$/, {
  message: 'Use a date like 2024.12, 2024, or 2019-2023',
});

const link = z.object({ label: z.string(), label_zh: text(), url: z.string() });

const profile = defineCollection({
  loader: glob({ pattern: 'profile.yml', base: './src/content/settings' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      name_zh: text(),
      preferred_name: text(),
      highlight_author: z.string(),
      position: z.string(),
      position_zh: text(),
      department: z.string(),
      department_zh: text(),
      university: z.string(),
      university_zh: text(),
      location: text(),
      location_zh: text(),
      photo: optImage(image),
      email: text(),
      scholar: text(),
      linkedin: text(),
      cv_pdf: text(),
      tagline: text(),
      tagline_zh: text(),
      bio: z.string(),
      bio_zh: text(),
      interests: list(z.object({ en: z.string(), zh: text() })),
      theme: z.enum(themes).catch('night').default('night'),
      show_life: z.boolean().nullish().transform((v) => v ?? true),
    }),
});

// Homepages for co-authors' names in author lists, matched by the name exactly as written there.
const coauthors = defineCollection({
  loader: glob({ pattern: 'coauthors.yml', base: './src/content/settings' }),
  schema: z.object({
    people: list(z.object({ name: z.string(), url: z.string() })),
  }),
});

const cv = defineCollection({
  loader: glob({ pattern: 'cv.yml', base: './src/content/settings' }),
  schema: ({ image }) =>
    z.object({
      sections: list(
        z.object({
          title: z.string(),
          title_zh: text(),
          entries: list(
            z.object({
              heading: z.string(),
              heading_zh: text(),
              subheading: text(),
              subheading_zh: text(),
              period: text(),
              period_zh: text(),
              logo: optImage(image),
              description: text(),
              description_zh: text(),
              links: list(link),
            }),
          ),
        }),
      ),
    }),
});

const publications = defineCollection({
  loader: glob({ pattern: '**/*.{yml,yaml}', base: './src/content/publications' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      authors: list(z.string()),
      year: z.coerce.number().int(),
      status: z.enum(['published', 'in-press', 'accepted', 'under-review', 'working-paper']).default('published'),
      venue: z.string(),
      volume: text(),
      issue: text(),
      pages: text(),
      doi: text(),
      url: text(),
      pdf: text(),
      badge: text(),
      keywords: list(z.string()),
      abstract: text(),
      figure: optImage(image),
      citation: text(),
      selected: z.boolean().default(false),
    }),
});

const talks = defineCollection({
  loader: glob({ pattern: '**/*.{yml,yaml}', base: './src/content/talks' }),
  schema: z.object({
    title: z.string(),
    authors: list(z.string()),
    kind: z.enum(['presentation', 'invited', 'poster', 'panel']).default('presentation'),
    event: z.string(),
    date: z.coerce.date(),
    date_text: text(),
    location: text(),
    url: text(),
  }),
});

const travel = defineCollection({
  loader: glob({ pattern: '**/*.{yml,yaml}', base: './src/content/travel' }),
  schema: ({ image }) =>
    z.object({
      place: z.string(),
      place_zh: text(),
      region: text(),
      region_zh: text(),
      date: looseDate,
      photo: image(),
    }),
});

const shows = defineCollection({
  loader: glob({ pattern: '**/*.{yml,yaml}', base: './src/content/shows' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      name_zh: text(),
      date: looseDate,
      photo: image(),
    }),
});

export const collections = { profile, coauthors, cv, publications, talks, travel, shows };
