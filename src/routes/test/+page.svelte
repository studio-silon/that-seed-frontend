<script lang="ts">
	import { Backend } from '$lib/backend';

	const backend = new Backend(fetch);

	async function getData() {
		return await backend.getData();
	}
	let getDataPromise = getData();
</script>

<div>
	{#await getDataPromise}
		Loading planet...
	{:then data}
		<h1>데이터</h1>
		<pre>{JSON.stringify(data, null, 2)}</pre>
	{:catch someError}
		System error: {someError.message}.
	{/await}
</div>
