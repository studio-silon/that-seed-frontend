<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { writable } from 'svelte/store';

	const show = writable(false);

	const toggle = (): void => {
		show.update((state) => !state);
	};

	const hide = (): void => {
		show.set(false);
	};

	const backdrop = (e: MouseEvent): void => {
		if ($show && dropdown && !dropdown.contains(e.target as Node)) {
			show.set(false);
		}
	};

	let dropdown: HTMLDivElement | null;

	export let className = '';

	onMount(() => {
		document.addEventListener('click', backdrop);
		return () => {
			document.removeEventListener('click', backdrop);
		};
	});
</script>

<div bind:this={dropdown} class="dropdown {className}">
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div on:click={toggle}>
		<slot name="toggle"></slot>
	</div>
	{#if $show}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class:open={$show} on:click={hide}>
			<slot></slot>
		</div>
	{/if}
</div>
