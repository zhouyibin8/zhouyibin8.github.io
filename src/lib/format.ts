import { marked } from 'marked';
import type { Lang } from './i18n';

export const md = (s?: string) => (s ? (marked.parse(s, { async: false }) as string) : '');
export const mdInline = (s?: string) => (s ? (marked.parseInline(s, { async: false }) as string) : '');

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function monthYear(d: Date, lang: Lang) {
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth();
  return lang === 'zh' ? `${y}年${m + 1}月` : `${MONTHS[m]} ${y}`;
}

export function fullDate(d: Date, lang: Lang) {
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth();
  const day = d.getUTCDate();
  return lang === 'zh' ? `${y}年${m + 1}月${day}日` : `${day} ${MONTHS[m]} ${y}`;
}

/** Sort key for loose dates such as "2024.12", "2024" or "2019-2023" (newest first by start). */
export function looseDateKey(s: string) {
  const m = s.match(/^(\d{4})(?:\.(\d{1,2}))?/);
  return m ? Number(m[1]) * 100 + Number(m[2] ?? 0) : 0;
}

export function byLooseDateDesc<T extends { data: { date: string } }>(a: T, b: T) {
  return looseDateKey(b.data.date) - looseDateKey(a.data.date);
}

/** Splits an author string into name and trailing markers such as # (corresponding) or * (equal contribution). */
export function splitAuthor(raw: string) {
  const m = raw.trim().match(/^(.*?)([#*†]+)?$/);
  return { name: (m?.[1] ?? raw).trim(), marks: m?.[2] ?? '' };
}

export function doiUrl(doi?: string) {
  if (!doi) return undefined;
  return doi.startsWith('http') ? doi : `https://doi.org/${doi}`;
}

interface PubForCite {
  title: string;
  authors: string[];
  year: number;
  venue: string;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  citation?: string;
}

function apaName(full: string) {
  const parts = splitAuthor(full).name.split(/\s+/);
  const last = parts.pop() ?? '';
  const initials = parts.map((p) => `${p[0]}.`).join(' ');
  return initials ? `${last}, ${initials}` : last;
}

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * APA 7 reference as plain text and as HTML with the journal name and volume in italics.
 * A hand-written citation may mark italics with *asterisks*.
 */
export function apaCitation(p: PubForCite) {
  if (p.citation) return { text: p.citation.replace(/\*/g, ''), html: mdInline(p.citation) };
  const names = p.authors.map(apaName);
  const authors =
    names.length <= 1 ? names.join('') : `${names.slice(0, -1).join(', ')}, & ${names[names.length - 1]}`;
  const parts: [string, boolean][] = [[`${authors} (${p.year}). ${p.title}. `, false], [p.venue, true]];
  if (p.volume) parts.push([', ', false], [p.volume, true]);
  if (p.issue) parts.push([`(${p.issue})`, false]);
  if (p.pages) parts.push([`, ${p.pages}`, false]);
  parts.push(['.', false]);
  if (p.doi) parts.push([` ${doiUrl(p.doi)}`, false]);
  return {
    text: parts.map(([s]) => s).join(''),
    html: parts.map(([s, italic]) => (italic ? `<em>${escapeHtml(s)}</em>` : escapeHtml(s))).join(''),
  };
}

export function bibtex(p: PubForCite, id: string) {
  const key = `${splitAuthor(p.authors[0] ?? 'anon').name.split(/\s+/).pop()?.toLowerCase()}${p.year}${
    p.title.split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, '') ?? ''
  }`;
  const fields: [string, string | undefined][] = [
    ['title', p.title],
    ['author', p.authors.map((a) => splitAuthor(a).name).join(' and ')],
    ['journal', p.venue],
    ['year', String(p.year)],
    ['volume', p.volume],
    ['number', p.issue],
    ['pages', p.pages],
    ['doi', p.doi],
  ];
  const body = fields
    .filter(([, v]) => v)
    .map(([k, v]) => `  ${k} = {${v!.replace(/([&%$#_])/g, '\\$1')}}`)
    .join(',\n');
  return `@article{${key || id},\n${body}\n}`;
}
