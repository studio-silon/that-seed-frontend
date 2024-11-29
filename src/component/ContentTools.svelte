<script lang="ts">
	import Dropdown from './Dropdown.svelte';

	let {
		tools = [],
		menuItems = []
	}: {
		tools?: Array<{
			to?: string;
			onclick?: () => void;
			class?: string;
			tooltip?: string;
			title?: string;
			html?: string;
		}>;
		menuItems?: Array<{
			to?: string;
			onclick?: () => void;
			class?: string;
			title: string;
		}>;
	} = $props();

	let dropdownOpen = $state(false);

	function toggleDropdown() {
		dropdownOpen = !dropdownOpen;
	}

	function handleClickOutside(event: MouseEvent) {
		const dropdown = document.querySelector('.dropdown');
		if (dropdown && !dropdown.contains(event.target as Node)) {
			dropdownOpen = false;
		}
	}
</script>

<svelte:window on:click={handleClickOutside} />

{#if tools.length}
	<div class="content-tools">
		<div class="btn-group">
			{#each tools as tool (tool.to)}
				<a
					href={tool.to}
					class="btn btn-secondary tools-btn {tool.class || ''}"
					title={tool.tooltip}
					onclick={tool.onclick}
				>
					{#if tool.html}
						{@html tool.html}
					{:else}
						{tool.title}
					{/if}
				</a>
			{/each}

			{#if menuItems.length}
				<Dropdown className="btn btn-secondary tools-btn">
					<!-- svelte-ignore a11y_consider_explicit_label -->
					<div slot="toggle">
						<div class="dropdown-toggle">
							<span class="caret"></span>
						</div>
					</div>

					{#if dropdownOpen}
						<div class="dropdown-menu dropdown-menu-right" role="menu">
							{#each menuItems as item (item.to)}
								{#if item.onclick}
									<button
										class="dropdown-item {item.class || ''}"
										onclick={(e) => {
											e.preventDefault();

											item.onclick?.();
											dropdownOpen = false;
										}}
									>
										{item.title}
									</button>
								{:else}
									<a
										href={item.to}
										class="dropdown-item {item.class || ''}"
										onclick={() => (dropdownOpen = false)}
									>
										{item.title}
									</a>
								{/if}
							{/each}
						</div>
					{/if}
				</Dropdown>
			{/if}
		</div>
	</div>
{/if}

<style>
	.content-tools {
		padding-right: 1rem;
		padding-top: 1rem;
		float: right;
	}

	.content-tools .tools-btn {
		font-size: 0.9rem;
		padding: 0.4rem 0.8rem;
	}

	.content-tools .tools-btn :global(.fa-star),
	.content-tools .tools-btn :global(.fa-star-o) {
		color: #ff6200;
		margin-right: 0.1em;
	}

	.content-tools .dropdown.btn.tools-btn {
		padding: 0;
	}

	.content-tools .dropdown-toggle {
		padding: 0.4rem 0.3rem;
		margin-left: -1px;
	}

	.content-tools .tools-btn:hover,
	.content-tools .tools-btn:focus,
	.content-tools .tools-btn:active {
		background-color: #e6e6e6;
		border-color: #adadad;
		color: #000;
		outline: 0;
		transition: 0s;
	}

	:global(.theseed-dark-mode) .content-tools .tools-btn:active,
	:global(.theseed-dark-mode) .content-tools .tools-btn:focus,
	:global(.theseed-dark-mode) .content-tools .tools-btn:hover {
		background-color: #383b40;
		color: white;
	}

	.content-tools .tools-btn.btn-danger,
	.content-tools .tools-btn.btn-danger:hover,
	.content-tools .tools-btn.btn-danger:focus,
	.content-tools .tools-btn.btn-danger:active {
		background-color: #d9534f;
		border-color: #adadad;
		color: white;
	}

	:global(.theseed-dark-mode) .content-tools .btn.btn-danger.tools-btn,
	:global(.theseed-dark-mode) .content-tools .btn.btn-danger.tools-btn:hover,
	:global(.theseed-dark-mode) .content-tools .btn.btn-danger.tools-btn:active,
	:global(.theseed-dark-mode) .content-tools .btn.btn-danger.tools-btn:focus {
		background-color: #d9534f;
		color: #ddd;
	}

	.content-tools .tools-btn.btn-discuss-progress {
		background-color: #bbeabb;
	}

	:global(.theseed-dark-mode) .content-tools .tools-btn.btn-discuss-progress {
		background-color: #325a56;
	}

	.content-tools .tools-btn.btn-discuss-progress:hover,
	.content-tools .tools-btn.btn-discuss-progress:focus,
	.content-tools .tools-btn.btn-discuss-progress:active {
		background-color: #c5f4c5;
	}

	:global(.theseed-dark-mode) .content-tools .tools-btn.btn-discuss-progress:hover,
	:global(.theseed-dark-mode) .content-tools .tools-btn.btn-discuss-progress:active,
	:global(.theseed-dark-mode) .content-tools .tools-btn.btn-discuss-progress:focus {
		background-color: #438a83;
	}

	.content-tools .tools-btn.btn-info {
		color: #373a3c;
		background-color: #c7eef9;
		border-color: #78d4ef;
	}

	:global(.theseed-dark-mode) .content-tools .tools-btn.btn-info {
		background-color: #334351;
	}

	.content-tools .tools-btn.btn-info:hover,
	.content-tools .tools-btn.btn-info:focus,
	.content-tools .tools-btn.btn-info:active {
		background-color: #a8ebff;
		border-color: #51c8eb;
	}

	:global(.theseed-dark-mode) .content-tools .tools-btn.btn-info:hover,
	:global(.theseed-dark-mode) .content-tools .tools-btn.btn-info:focus,
	:global(.theseed-dark-mode) .content-tools .tools-btn.btn-info:active {
		background-color: #2a343d;
	}

	.content-tools .dropdown-menu {
		top: auto;
	}

	.dropdown-item.admin {
		background-color: #c94545;
		color: white;
		border-top: 1px white solid;
	}

	.dropdown-item.admin:hover {
		background-color: #ab0000;
	}

	:global(.theseed-dark-mode) .dropdown-item.admin {
		background-color: #711;
		color: white;
		border-top: 1px var(--liberty-brand-dark-color, #16171a) solid;
	}

	:global(.theseed-dark-mode) .dropdown-item.admin:hover {
		background-color: #970000;
	}
</style>
