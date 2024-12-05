<script lang="ts">
	import { page } from '$app/stores';
	import { Backend } from '$lib/backend';
	import { urlEncoding } from '$lib/utils/wiki';
	import { onDestroy } from 'svelte';
	import ContentHeader from '../../../component/ContentHeader.svelte';
	import ContentTools from '../../../component/ContentTools.svelte';

	const backend = new Backend(fetch);

	let name = $state($page.params.name);
	let url = $state((() => urlEncoding(name))());

	let rever = $state($page.url.searchParams.get('rev'));

	let isStared = $state(false);

	async function getData() {
		const data = await backend.getDocs(name, rever);
		isStared = data.isStared;

		return data;
	}

	let getDataPromise: ReturnType<typeof getData> = $state(getData());

	let unsubscribe = page.subscribe(($page) => {
		name = $page.params.name;
		url = urlEncoding(name);
		rever = $page.url.searchParams.get('rev');
		getDataPromise = getData();
	});

	onDestroy(() => unsubscribe());
</script>

{#await getDataPromise}
	loading...
{:then data}
	<ContentHeader
		wiki={data.wiki}
		{name}
		{...data.wiki && rever && data.wiki.rever > +rever ? { rev: rever } : {}}
	>
		<ContentTools
			tools={[
				{
					onclick: async () => {
						if (await backend.toggleStar(name)) isStared = !isStared;
					},
					html: `<span class="fa fa-star${isStared ? '' : '-o'}"></span>${data.wiki ? ` <span class="star-count">${data.wiki.stars.length + (data.isStared ? (isStared ? 0 : -1) : isStared ? 1 : 0)}</span>` : ''}`
				},
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
		{#if data.wiki && rever && data.wiki.rever > +rever}
			<div class="alert alert-danger">
				<b>[주의!]</b> 문서의 이전 버전(<b>r{rever}</b>)을 보고 있습니다.
				<a href={'/w/' + url} class="alert-link">최신 버전으로 이동</a>
			</div>
		{/if}
		<div class="wiki">
			{@html data.parse?.value}
		</div>
	</div>
{:catch someError}
	System error: {someError.message}.
{/await}
