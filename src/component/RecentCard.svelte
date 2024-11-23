<script lang="ts">
	import { Backend } from '$lib/backend';
	import { formatRelativeDate } from '$lib/utils/date';
	import { joinName, urlEncoding } from '$lib/utils/wiki';

	const backend = new Backend(fetch);

	export let limit = 15;

	async function getData() {
		const response = await backend.getRecentChanges();
		return response.changes;
	}

	let recentChangesPromise = getData();
</script>

<div class="live-recent-content">
	<ul class="live-recent-list" id="live-recent-list">
		{#await recentChangesPromise}
			{#each Array(10) as _}
				<li><span class="recent-item">&nbsp;</span></li>
			{/each}
		{:then recent}
			{#each recent.slice(0, limit) as change}
				<li>
					<a
						href="/w/{urlEncoding(joinName(change.namespace, change.title))}"
						class="recent-item"
						class:removed={change.versions[0].type === 2}
					>
						[{formatRelativeDate(change.createdAt)}] {joinName(change.namespace, change.title)}
					</a>
				</li>
			{/each}
		{:catch error}
			<li>
				<span class="recent-item error">Error loading recent changes: {error.message}</span>
			</li>
		{/await}
	</ul>
</div>

<style>
	.live-recent-content {
		background-color: #fff;
		border: 1px solid #e1e8ed;
		border-top: 0;
	}

	.live-recent-list {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.live-recent-list li {
		border-bottom: 1px solid #e1e8ed;
		padding: 0.2rem 0.6rem;
	}

	:global(.theseed-dark-mode) .live-recent-list li {
		border-color: #777;
	}

	.live-recent-list li:last-child {
		border-bottom: none;
	}

	.recent-item {
		font-size: 0.8rem;
		color: #373a3c;
		text-decoration: none;
		display: block;
	}

	:global(.theseed-dark-mode) .recent-item {
		color: #ddd;
	}

	.recent-item :global(.new) {
		font-size: 0.8rem;
		color: #b73333;
	}

	.recent-item.removed {
		text-decoration: line-through;
	}

	.recent-item.removed:hover {
		text-decoration: underline;
	}

	.error {
		color: #b73333;
	}
</style>
