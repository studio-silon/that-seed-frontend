<script lang="ts">
	import { goto } from '$app/navigation';
	import { Backend } from '$lib/backend';
	import { urlEncoding } from '$lib/utils/wiki';

	async function run() {
		const backend = new Backend(fetch);

		const data = await backend.getData();

		goto('/w/' + urlEncoding(data.site.frontPage));
	}

	run();
</script>
