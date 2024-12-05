<script lang="ts">
	import { page } from '$app/stores';
	import { Backend } from '$lib/backend';
	import { splitName, urlEncoding } from '$lib/utils/wiki';
	import ContentHeader from '../../../component/ContentHeader.svelte';
	import ContentTools from '../../../component/ContentTools.svelte';
	import { diff } from '$lib/utils/diff/jsdiff';

	const backend = new Backend(fetch);

	const name = $page.params.name;
	const url = urlEncoding(name);

	const [namespace, title] = splitName(name);

	const wiki = {
		namespace,
		title
	};

	const rever = $page.url.searchParams.get('rev');
	const oldrever = $page.url.searchParams.get('oldrev');

	async function getData() {
		const data = await backend.getDiff(name, +(oldrever || '1'), +(rever || '1'));

		return data;
	}

	let getDataPromise = getData();
</script>

{#await getDataPromise}
	loading...
{:then data}
	<ContentHeader {wiki} {name} viewName="diff">
		<ContentTools
			tools={[
				{
					to: '/edit/' + url,
					title: '편집'
				},
				{
					to: '/history/' + url,
					title: '역사'
				},
				{
					to: '/backlink/' + url,
					title: '역링크'
				},
				{
					to: '/acl/' + url,
					title: 'ACL'
				}
			]}
		/>
	</ContentHeader>
	<div class="liberty-content-main wiki-article">
		{@html diff(data.original, data.modified, 'r' + oldrever, 'r' + rever)}
	</div>
{:catch someError}
	System error: {someError.message}.
{/await}
