<script lang="ts">
	let {
		version,
		className = ''
	}: {
		version: {
			type: number;
			added: number;
			removed: number;
		};
		className?: string;
	} = $props();
</script>

<span class="version-type-indicator {className}">
	{#if version.type === 2}
		<span class="negative-change">-all</span>
	{:else if version.added === 0 && version.removed === 0}
		0
	{:else if version.added !== 0 && version.removed !== 0}
		<span class="positive-change">+{version.added}</span>&nbsp;
		<span class="negative-change">-{version.removed}</span>
	{:else if version.added !== 0}
		<span class="positive-change">+{version.added}</span>
	{:else}
		<span class="negative-change">-{version.removed}</span>
	{/if}
</span>

<style>
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
</style>
