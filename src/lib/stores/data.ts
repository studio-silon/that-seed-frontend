import { Backend } from '$lib/backend';
import { writable, type Writable } from 'svelte/store';

export type DataStoreType = null | Awaited<ReturnType<Backend['getData']>>;
export const dataStore: Writable<DataStoreType> = writable(null);

export const reloadData = async (fetchFn: typeof fetch) => {
	const backend = new Backend(fetchFn);

	dataStore.set(await backend.getData());
};
