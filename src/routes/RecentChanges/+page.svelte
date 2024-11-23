<script lang="ts">
	import { Backend } from '$lib/backend';
	const backend = new Backend(fetch);

	async function getData() {
		return await backend.getRecentChanges();
	}

	let getDataPromise = getData();

	function formatRelativeDate(date: string) {
		const d = new Date(date);
		const now = new Date();
		const diff = now.getTime() - d.getTime();
		const days = Math.floor(diff / (1000 * 60 * 60 * 24));
		const hours = Math.floor(diff / (1000 * 60 * 60));
		const minutes = Math.floor(diff / (1000 * 60));

		if (days > 0) return `${days}일 전`;
		if (hours > 0) return `${hours}시간 전`;
		return `${minutes}분 전`;
	}
</script>

<div class="liberty-content-header"><div class="title"><h1>최근 변경내역</h1></div></div>

<div class="GWlp0pYF bVOFUIj+">
	<div class="cTz-hF-R"><div class="bV8gNdAl">
		<ul class="It31s+gh">
			<li><a href="/RecentChanges?logtype=all" class="WdVBByw4 KabYxB0R">전체</a></li>
			<li><a href="/RecentChanges?logtype=create" class="WdVBByw4">새 문서</a></li>
			<li><a href="/RecentChanges?logtype=delete" class="WdVBByw4">삭제</a></li>
			<li><a href="/RecentChanges?logtype=move" class="WdVBByw4">이동</a></li>
			<li><a href="/RecentChanges?logtype=revert" class="WdVBByw4">되돌림</a></li>
		</ul>
	</div>
</div>
<div class="cXjPkFdN _2ubH0qo7" style="opacity: 0;"></div><div class="cXjPkFdN" style="opacity: 0; display: none;"></div></div>

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
