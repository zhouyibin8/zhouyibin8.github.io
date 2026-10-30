import { getCollection, getEntry } from 'astro:content';
import { byLooseDateDesc } from './format';

export async function getProfile() {
  return (await getEntry('profile', 'profile'))!.data;
}

export async function getCv() {
  return (await getEntry('cv', 'cv'))?.data.sections ?? [];
}

export async function getPublications() {
  const all = await getCollection('publications');
  const rank = { accepted: 0, 'in-press': 0, published: 1, 'under-review': 2, 'working-paper': 3 };
  return all.sort(
    (a, b) =>
      b.data.year - a.data.year ||
      rank[a.data.status] - rank[b.data.status] ||
      a.data.title.localeCompare(b.data.title),
  );
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
