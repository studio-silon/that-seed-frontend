<script lang="ts">
	import { goto } from '$app/navigation';
	import { dataStore, type DataStoreType } from '$lib/stores/data';
	import { urlEncoding } from '$lib/utils/wiki';

	let siteData: DataStoreType;

	dataStore.subscribe((data) => {
		siteData = data;

		if (!siteData) {
			console.error('Site data is not loaded yet.');
			return;
		}

		goto('/w/' + urlEncoding(siteData.site.frontPage));
	});
</script>
