<script lang="ts">
	import { goto } from '$app/navigation';
	import { Backend } from '$lib/backend';
	import { reloadData } from '$lib/stores/data';

	const backend = new Backend(fetch);

	backend.logout().then(() => {
		reloadData(fetch);
		goto('/');
	});
</script>
