import type { Backend } from '$lib/backend';
import { writable, type Writable } from 'svelte/store';

export type DataStoreType = null | Awaited<ReturnType<Backend['getData']>>;
export const dataStore: Writable<DataStoreType> = writable(null);
