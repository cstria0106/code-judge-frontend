import { persisted } from 'svelte-local-storage-store';
import { writable } from 'svelte/store';
import type { User } from './api';

type LoadState =
  | { type: 'should_be_loaded' }
  | {
      type: 'loading';
    }
  | {
      type: 'loaded';
    }
  | {
      type: 'error';
      reason: string;
    };

export const load = writable<LoadState>({ type: 'should_be_loaded' });

export const loginToken = persisted<string | null>('loginToken', null);

export const currentUser = writable<User | null>(null);
