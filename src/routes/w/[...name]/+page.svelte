<script lang="ts">
	import { page } from '$app/stores';
	import { Backend } from '$lib/backend';
	import { urlEncoding } from '$lib/utils/wiki';
	import ContentHeader from '../../../component/ContentHeader.svelte';
	import ContentTools from '../../../component/ContentTools.svelte';

	const backend = new Backend(fetch);

	const name = $page.params.name;
	const url = urlEncoding(name);

	async function getData() {
		return await backend.getDocs(name);
	}

	let getDataPromise = getData();

	/*main.push({
    to: doc_action_link(data.document, 'backlink'),
    title: "역링크"
  });
  main.push({
    to: doc_action_link(data.document, 'discuss'),
    class: data.discuss_progress ? 'btn-discuss-progress' : null,
    title: "토론"
  });*/
</script>

{#await getDataPromise}
	loading...
{:then data}
	<ContentHeader wiki={data.wiki}>
		<ContentTools
			tools={[
				{
					to: '/edit/' + url,
					title: '편집'
				},
				{
					to: '/discuss/' + url,
					class:
						data.wiki?.discussions && data.wiki.discussions.length > 0
							? 'btn-discuss-progress'
							: '',
					title: '토론'
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
		<div class="wiki">
			{@html data.parse?.value}
		</div>
	</div>
{:catch someError}
	System error: {someError.message}.
{/await}
