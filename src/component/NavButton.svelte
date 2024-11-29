<script lang="ts">
	let {
		prevURL = '',
		nextURL = ''
	}: {
		prevURL?: string;
		nextURL?: string;
	} = $props();
</script>

<ul class="btn-group nav-button">
	<button
		type="button"
		class="btn btn-secondary btn-sm seed-flex"
		onclick={() => prevURL && (window.location.href = prevURL)}
		disabled={!prevURL}
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="14"
			height="14"
			fill="currentColor"
			class="seed-center -seed-ml-5"
			viewBox="0 0 16 16"
		>
			<path
				fill-rule="evenodd"
				d="m11.354 14.154a.5.5 180 01-.708 0l-6-6a.5.5 180 01-0-.708l6-6a.5.5 180 011.354 1.354l-5.373 5.012 5.373 4.988a.5.5 180 010 .708"
			/>
		</svg>
		&nbsp;이전
	</button>

	<button
		type="button"
		class="btn btn-secondary btn-sm seed-flex"
		onclick={() => nextURL && (window.location.href = nextURL)}
		disabled={!nextURL}
	>
		다음&nbsp;
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="14"
			height="14"
			fill="currentColor"
			class="seed-center -seed-mr-5"
			viewBox="0 0 16 16"
		>
			<path
				fill-rule="evenodd"
				d="M4.646 1.646a.5.5 0 01.708 0l6 6a.5.5 0 010 .708l-6 6a.5.5 0 01-1.354-1.354L9.373 7.988 4 3a.5.5 0 010-.708"
			/>
		</svg>
	</button>
</ul>

<style>
	@import '$lib/css/seed.css';

	.nav-button {
		margin-left: -2.2rem;
	}
</style>
