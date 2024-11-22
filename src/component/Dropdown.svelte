<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	let show = false;
	let dropdownRef: HTMLDivElement;

	function toggle() {
		show = !show;
	}

	function hide() {
		show = false;
	}

	function handleClickOutside(event: Event) {
		if (show && dropdownRef && !dropdownRef.contains(event.target as Node)) {
			hide();
		}
	}

	onMount(() => {
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});

	export let className = '';
</script>

<div bind:this={dropdownRef} class="dropdown {className}">
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div on:click={toggle}>
		<slot name="toggle"></slot>
	</div>
	{#if show}
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div class="dropdown-menu {className}" on:click={hide}>
			<slot name="dropdown"></slot>
		</div>
	{/if}
</div>

<style>
	@import '../lib/css/bootstrap.min.css';
	@import '../lib/css/font-awesome.min.css';
	@import '../lib/css/font/Noto Sans KR.css';
	@import '../lib/css/default.css';
	@import '../lib/css/default_mobile.css';
	@import '../lib/css/dark.css';

	.dropdown-menu {
		display: block;
	}
</style>
