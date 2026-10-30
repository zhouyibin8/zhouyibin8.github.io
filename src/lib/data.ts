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
  return all.sort((a, b) => b.data.year - a.data.year || a.data.title.localeCompare(b.data.title));
}

export async function getTalks() {
  const all = await getCollection('talks');
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export async function getNews() {
  const all = await getCollection('news');
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export async function getTravel() {
  return (await getCollection('travel')).sort(byLooseDateDesc);
}

export async function getShows() {
  return (await getCollection('shows')).sort(byLooseDateDesc);
}
