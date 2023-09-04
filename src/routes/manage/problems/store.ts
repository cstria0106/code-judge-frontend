import { writable } from 'svelte/store';

export const showEnded = writable(false);
export const showDrafts = writable(false);
export const searchString = writable('');
