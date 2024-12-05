<script lang="ts">
	import { page } from '$app/stores';
	import { Backend } from '$lib/backend';
	import { formatRelativeDate } from '$lib/utils/date';
	import NavButton from '../../component/NavButton.svelte';
	import ReverMiniDiff from '../../component/ReverMiniDiff.svelte';

	const backend = new Backend(fetch);

	const index = +($page.url.searchParams.get('page') ?? '1');

	async function getData() {
		return await backend.getRecentChanges(index);
	}

	let getDataPromise = getData();
</script>

<div class="liberty-content-header"><div class="title"><h1>최근 변경내역</h1></div></div>
<div class="liberty-content-main wiki-article">
	<div class="change-history-list">
		{#await getDataPromise}
			<div class="change-column">Loading...</div>
		{:then data}
			<NavButton
				prevURL={index > 1 ? '?page=' + (index - 1) : undefined}
				nextURL={index < data.totalPages ? '?page=' + (index + 1) : undefined}
			/>

			<div class="header-row">
				<div class="change-column">문서</div>
				<div class="change-column">기능</div>
				<div class="change-column">수정자</div>
				<div class="change-column">수정 시간</div>
			</div>
			{#each data.changes as change}
				<div class="change-row">
					<div class="change-column">
						<a href="/w/{change.title}">{change.title}</a>
						{#if change.versions && change.versions[0]}
							<ReverMiniDiff version={change.versions[0]} />
						{/if}
					</div>

					<div class="change-column">
						<div class="action-links">
							<a class="action-link" title="역사" href="/history/{change.title}">역사</a>
							{#if change.rever > 1}
								<a
									class="action-link"
									title="비교"
									href="/diff/{change.title}?rev={change.rever}&oldrev={change.rever - 1}">비교</a
								>
							{/if}
							<a class="action-link" title="토론" href="/discuss/{change.title}">토론</a>
						</div>
					</div>

					<div class="change-column">
						{#if change.versions && change.versions[0] && change.versions[0].user}
							{change.versions[0].user.username}
						{:else}
							{change.versions?.[0]?.ipAddress || 'Unknown'}
						{/if}
					</div>

					<div class="change-column">
						{formatRelativeDate(change.updatedAt)}
					</div>

					{#if change.versions && change.versions[0] && change.versions[0].log}
						<div class="change-column change-log">
							<span>{change.versions[0].log}</span>
						</div>
					{/if}
				</div>
			{/each}
		{:catch error}
			<div class="change-column">Error loading changes: {error.message}</div>
		{/await}
	</div>
</div>

<style>
	.change-history-list {
		display: flex;
		flex-direction: column;
	}

	.header-row {
		margin-top: 1rem;
		border-bottom: 2px solid #e0e0e0;
		font-weight: 600;
		display: grid;
		grid-template-columns: 1fr 10rem 11rem 13rem;
	}

	.change-row {
		border-top: 1px solid #e0e0e0;
		display: grid;
		grid-template-columns: 1fr 10rem 11rem 13rem;
	}

	.change-column {
		padding: 0.5rem 0.75rem;
	}

	.action-links {
		display: flex;
		gap: 0.25rem;
	}

	.action-link {
		align-items: center;
		border: 1px solid #e0e0e0;
		border-radius: 3px;
		color: #555;
		cursor: pointer;
		display: flex;
		font-size: 0.8rem;
		justify-content: center;
		text-decoration: none;
		transition: background-color 0.1s ease-in;
		padding: 0.1rem 0.3rem;
	}

	.action-link:hover {
		background-color: #ededed;
	}

	.change-log {
		font-size: 0.9rem;
		padding-top: 0;
		padding-left: 1.5rem;
		color: #787878;
	}

	@media screen and (max-width: 1023.98px) {
		.header-row {
			display: none;
		}

		.wiki-article > div > div:nth-child(3) {
			margin-top: 1rem;
		}

		.change-row {
			display: flex;
			flex-direction: column;
			margin-bottom: 0.75rem;
			padding: 0.5rem;
			padding-bottom: 0.5rem;
			background-color: #fff;
		}

		.change-row:hover {
			background-color: #fafafa;
		}

		:global(.theseed-dark-mode) .change-row {
			background-color: #000;
		}

		:global(.theseed-dark-mode) .change-row:hover {
			background-color: #2e2e2e;
		}

		.change-column:nth-child(4) {
			order: -1;
			font-size: 0.9rem;
			color: #888;
			padding: 0;
		}

		.change-column:nth-child(1) {
			order: 0;
			font-size: 1.15rem;
			margin: 0;
			margin-bottom: 0.3rem;
			padding: 0;
		}

		.change-column:nth-child(2),
		.change-column:nth-child(3) {
			order: 1;
			margin: 0.1rem 0;
			padding: 0;
		}

		.change-column:nth-child(3) {
			margin-left: auto;
			margin-top: -1.65rem;
		}

		.change-log {
			order: 1;
			padding: 0;
		}

		.action-links {
			order: 2;
			display: flex;
			gap: 0.5rem;
			margin: 0.1rem 0;
			padding: 0;
		}
	}
</style>
