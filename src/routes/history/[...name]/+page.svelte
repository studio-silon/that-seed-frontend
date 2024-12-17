<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Backend } from '$lib/backend';
	import { formatDate } from '$lib/utils/date';
	import { urlEncoding } from '$lib/utils/wiki';
	import ContentHeader from '../../../component/ContentHeader.svelte';
	import ContentTools from '../../../component/ContentTools.svelte';
	import NavButton from '../../../component/NavButton.svelte';
	import ReverMiniDiff from '../../../component/ReverMiniDiff.svelte';

	const backend = new Backend(fetch);

	const name = $page.params.name;
	const url = urlEncoding(name);

	let selectedRevisions: [null | number, null | number] = $state([null, null]);

	const index = +($page.url.searchParams.get('page') ?? '1');

	async function getData() {
		return await backend.getDocs(name);
	}

	async function getHistory() {
		return await backend.getHistory(name, index);
	}

	let getDataPromise = getData();
	let getHistoryPromise = getHistory();
</script>

{#await getDataPromise}
	loading...
{:then data}
	<ContentHeader wiki={data.wiki} viewName="history" {name}>
		<ContentTools
			tools={[
				{
					to: '/discuss/' + url,
					class:
						data.wiki?.discussions && data.wiki.discussions.length > 0
							? 'btn-discuss-progress'
							: '',
					title: '토론'
				},
				{
					to: '/edit/' + url,
					title: '편집'
				},
				{
					to: '/acl/' + url,
					title: 'ACL'
				}
			]}
		/>
	</ContentHeader>
	<div class="liberty-content-main wiki-article">
		{#await getHistoryPromise}
			loading...
		{:then history}
			<NavButton
				prevURL={index > 1 ? '?page=' + (index - 1) : undefined}
				nextURL={index < history.data.totalPages ? '?page=' + (index + 1) : undefined}
			/>

			<p>
				<button
					onclick={() => {
						if (selectedRevisions[0] && selectedRevisions[1]) {
							const [first, second] = selectedRevisions;
							goto(`/diff/${url}?rev=${first}&oldrev=${second}`);
						}
					}}
					class="btn btn-secondary btn-sm"
				>
					선택한 리버전 비교
				</button>
			</p>

			<ul>
				{#each history.data.wiki.versions as version}
					<li>
						{formatDate(new Date(version.createdAt))}
						<span style="font-size: 8pt;">
							(<a rel="nofollow" href="/w/{url}?rev={version.rever}">보기</a>
							|
							<a rel="nofollow" href="/raw/{url}?rev={version.rever}">RAW</a>
							|
							<a rel="nofollow" href="/revert/{url}?rev={version.rever}">이 리비전으로 되돌리기</a>
							{#if version.rever > 1}
								| <a
									rel="nofollow"
									href="/diff/{url}?rev={version.rever}&oldrev={version.rever - 1}">비교</a
								>
							{/if})
						</span>

						{#if !selectedRevisions[1] || version.rever < selectedRevisions[1]}<input
								type="radio"
								name="first"
								checked={selectedRevisions[0] === version.rever}
								onchange={() => (selectedRevisions[0] = version.rever)}
							/>{:else}<span style="display: inline-block; width: 21px;"></span>
						{/if}{#if !selectedRevisions[0] || version.rever > selectedRevisions[0]}<input
								type="radio"
								name="second"
								checked={selectedRevisions[1] === version.rever}
								onchange={() => (selectedRevisions[1] = version.rever)}
							/>
						{:else}
							<span style="display: inline-block; width: 21px;"></span>
						{/if}

						<b>r{version.rever}</b>
						<span>(<ReverMiniDiff {version} className="rever-mini-diff" />)</span>
						{#if version.user}
							{version.user.username}
						{:else}
							{version.ipAddress}
						{/if}
						{#if version.log}
							({version.log})
						{/if}
					</li>
				{/each}
			</ul>

			<NavButton
				prevURL={index > 1 ? '?page=' + (index - 1) : undefined}
				nextURL={index < history.data.totalPages ? '?page=' + (index + 1) : undefined}
			/>
		{:catch someError}
			System error: {someError.message}.
		{/await}
	</div>
{:catch someError}
	System error: {someError.message}.
{/await}

<style>
	:global(.rever-mini-diff) {
		margin: 0 !important;
		font-size: 1em !important;
	}
</style>
