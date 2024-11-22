import { Backend } from '$lib/backend.js';

export async function load({ fetch }) {
	const backend = new Backend(fetch);

	return await backend.getData();
}
