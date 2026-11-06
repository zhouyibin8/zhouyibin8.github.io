import { getCollection, getEntry } from 'astro:content';
import { byLooseDateDesc } from './format';

export async function getProfile() {
  return (await getEntry('profile', 'profile'))!.data;
}

/** Name → homepage for author lists. You link to your own Google Scholar page. */
export async function getAuthorLinks() {
  const profile = await getProfile();
  const people = (await getEntry('coauthors', 'coauthors'))?.data.people ?? [];
  const links = new Map(people.map((p) => [p.name, p.url]));
  if (profile.scholar && !links.has(profile.highlight_author)) links.set(profile.highlight_author, profile.scholar);
  return links;
}

export async function getCv() {
  return (await getEntry('cv', 'cv'))?.data.sections ?? [];
}

/**
 * Publications in the order set in /admin → Publication order. Papers not yet in that list
 * come first (newest year first), so a new paper is easy to spot until it is placed.
 */
export async function getPublications() {
  const all = await getCollection('publications');
  const order = (await getEntry('publicationOrder', 'publication-order'))?.data.order ?? [];
  const position = new Map(order.map((id, i) => [id, i]));
  const rank = { accepted: 0, 'in-press': 0, published: 1, 'under-review': 2, 'working-paper': 3 };
  return all.sort((a, b) => {
    const pa = position.get(a.id) ?? -1;
    const pb = position.get(b.id) ?? -1;
    if (pa !== pb) return pa - pb;
    return (
      b.data.year - a.data.year ||
      rank[a.data.status] - rank[b.data.status] ||
      a.data.title.localeCompare(b.data.title)
    );
  });
}

/** Publications chosen in /admin → Home page, in the order listed there. Unknown names are skipped. */
export async function getSelectedPublications() {
  const ids = (await getEntry('home', 'home'))?.data.selected_publications ?? [];
  const byId = new Map((await getPublications()).map((p) => [p.id, p]));
  return ids.map((id) => byId.get(id)).filter((p) => p !== undefined);
}

export async function getTalks() {
  const all = await getCollection('talks');
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export async function getTravel() {
  return (await getCollection('travel')).sort(byLooseDateDesc);
}

export async function getShows() {
  return (await getCollection('shows')).sort(byLooseDateDesc);
}
