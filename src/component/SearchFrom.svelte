<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let searchText = '';
	let show = false;
	let cursor = -1;
	let internalItems: string[] = [];

	$: $page, resetOnRouteChange();

	const mockAutocomplete = (query: string): string[] => {
		const sampleData = ['Option 1', 'Option 2', 'Option 3']; // Replace with actual logic
		return sampleData.filter((item) => item.toLowerCase().includes(query.toLowerCase()));
	};

	const reset = (): void => {
		searchText = '';
		internalItems = [];
		cursor = -1;
	};

	const resetOnRouteChange = (): void => {
		if ($page?.url?.searchParams?.get('reset') !== 'false') {
			reset();
		}
	};

	const onClickSearch = (): void => {
		if (!searchText) return;
		goto(`/search?q=${encodeURIComponent(searchText)}`);
	};

	const onClickMove = (): void => {
		if (!searchText) return;
		const link = `/docs/${encodeURIComponent(searchText)}`; // Replace with actual logic
		goto(link);
	};

	const onClickItem = (item: string): void => {
		searchText = item;
		show = false;
		onClickSearch();
	};

	const blur = (): void => {
		setTimeout(() => (show = false), 200);
	};

	const focus = (): void => {
		show = true;
	};

	const inputChange = (e: Event): void => {
		const target = e.target as HTMLInputElement;
		const value = target.value;
		internalItems = value ? mockAutocomplete(value) : [];
		show = !!internalItems.length;
	};

	const keyEnter = (): void => {
		if (cursor >= 0 && internalItems[cursor]) {
			onClickItem(internalItems[cursor]);
		}
	};

	const keyHandler = (event: KeyboardEvent): void => {
		if (event.key === 'Enter') {
			keyEnter();
		} else if (event.key === 'Tab') {
			keyEnter();
		} else if (event.key === 'ArrowUp') {
			cursor = cursor > 0 ? cursor - 1 : internalItems.length - 1;
		} else if (event.key === 'ArrowDown') {
			cursor = cursor < internalItems.length - 1 ? cursor + 1 : 0;
		}
	};
</script>

<form id="searchform" class="form-inline" on:submit|preventDefault>
	<div class="input-group">
		<div class="input-search">
			<input
				type="search"
				name="q"
				placeholder="검색"
				accesskey="f"
				class="form-control"
				id="searchInput"
				autocomplete="off"
				bind:value={searchText}
				on:blur={blur}
				on:focus={focus}
				on:keydown={keyHandler}
				on:input={inputChange}
			/>
			{#if show}
				<div class="v-autocomplete-list">
					{#each internalItems as item, i}
						<div
							class="v-autocomplete-list-item"
							class:v-autocomplete-item-active={i === cursor}
							on:click={() => onClickItem(item)}
							on:mouseover={() => (cursor = i)}
						>
							<div>{item}</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
		<span class="input-group-btn">
			<button type="button" class="btn btn-secondary" on:click={onClickSearch}>
				<span class="fa fa-search"></span>
			</button>
			<button type="button" class="btn btn-secondary" on:click={onClickMove}>
				<span class="fa fa-arrow-right"></span>
			</button>
		</span>
	</div>
</form>

<style>
	.v-autocomplete-list {
		position: absolute;
		z-index: 3;
		border: 1px solid #ccc;
		background-color: #fff;
		width: 10.8rem;
	}

	@media (max-width: 1023px) {
		.v-autocomplete-list {
			width: 100%;
		}
	}

	.theseed-dark-mode .v-autocomplete-list {
		background-color: #2d2f34;
		border: 1px solid #383b40;
	}

	.v-autocomplete-list-item {
		cursor: pointer;
		color: #373a3c;
		padding: 0.5rem;
		word-break: break-all;
	}

	.theseed-dark-mode .v-autocomplete-list-item {
		color: #ddd;
	}

	.v-autocomplete-list-item.v-autocomplete-item-active {
		background-color: #f3f6fa;
	}

	.theseed-dark-mode .v-autocomplete-list-item.v-autocomplete-item-active {
		background-color: #383b40;
	}
</style>
