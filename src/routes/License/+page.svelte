<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let skin_name = 'Liberty';
</script>

<h1>that seed</h1>
<h2>Version: v{data.engine_v}</h2>
<ul>
	<li>Backend: v{data.back_v}</li>
	<li>Frontend: v{data.front_v}</li>
	<li>Skin: {skin_name}</li>
</ul>
<h1>Contributors</h1>
<ul>
	<li><a href="//github.com/1ongames">iongames</a> (frontend)</li>
	<li><a href="//github.com/uiovasot">uiovasot</a> (frontend & backend & render)</li>
</ul>
<h2>Super Thanks</h2>
<h1>Open Source License</h1>
