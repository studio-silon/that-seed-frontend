<script lang="ts">
	import { Backend } from '$lib/backend';
	import { formatRelativeDate } from '$lib/utils/date';

	const backend = new Backend(fetch);

	async function getData() {
		return await backend.getRecentChanges();
	}

	let getDataPromise = getData();
</script>

<div class="liberty-content-header"><div class="title"><h1>최근 변경내역</h1></div></div>
<div class="liberty-content-main wiki-article">
	<div class="change-history-list">
		<div class="header-row">
			<div class="change-column">문서</div>
			<div class="change-column">기능</div>
			<div class="change-column">수정자</div>
			<div class="change-column">수정 시간</div>
		</div>

		{#await getDataPromise}
			<div class="change-column">Loading...</div>
		{:then data}
			{#each data.changes as change}
				<div class="change-row">
					<div class="change-column">
						<a href="/w/{change.title}">{change.title}</a>
						{#if change.versions && change.versions[0]}
							<span
								class="version-type-indicator {change.versions[0].type > 0
									? 'positive-change'
									: 'negative-change'}"
							>
								{change.versions[0].type}
							</span>
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
		border-bottom-width: 2px;
		font-weight: 600;
		display: grid;
		grid-template-columns: 1fr 10rem 11rem 13rem;
	}

	.change-row {
		border-bottom: 1px solid #e0e0e0;
		display: grid;
		grid-template-columns: 1fr 10rem 11rem 13rem;
	}

	.change-column {
		padding: 0.5rem 0.75rem;
	}

	.version-type-indicator {
		font-size: 0.8rem;
		margin: 0 0 0 0.35rem;
		vertical-align: bottom;
	}

	.positive-change {
		color: green;
	}

	.negative-change {
		color: red;
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
		height: 1.3rem;
		justify-content: center;
		text-decoration: none;
		transition: background-color 0.1s ease-in;
		width: 2rem;
	}

	.action-link:hover {
		background-color: #ededed;
	}

	.change-log {
		font-size: 0.9rem;
	}

	@media screen and (max-width: 1023.98px) {
		.change-row {
			gap: 0.1rem;
			grid-template-columns: 1fr 1fr;
			padding: 0.5rem;
		}

		.header-row {
			display: none;
		}

		.change-column {
			margin: 0 !important;
			padding: 0 !important;
		}
	}
</style>
