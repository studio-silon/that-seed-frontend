<script lang="ts">
	import { diffChars, type Change } from 'diff';

	let {
		original = '',
		modified = '',
		oldrever = 1,
		rever = 2
	}: {
		original?: string;
		modified?: string;
		oldrever?: number | string | null;
		rever?: number | string | null;
	} = $props();

	const lines1 = original.split('\n');
	const lines2 = modified.split('\n');

	const maxLines = Math.max(lines1.length, lines2.length);
	const diffResult: {
		line1: string;
		line2: string;
		diff: Change[];
		index1: number;
		index2: number;
	}[] = [];

	for (let i = 0; i < maxLines; i++) {
		const line1 = lines1[i] || '';
		const line2 = lines2[i] || '';
		const lineDiff = diffChars(line1, line2);

		diffResult.push({
			line1,
			line2,
			diff: lineDiff,
			index1: i + 1,
			index2: i + 1
		});
	}

	const getDisplayDiff = () => {
		let displayLines: {
			line1: string;
			line2: string;
			diff: Change[];
			index1: number;
			index2: number;
		}[] = [];

		let firstChangedLine = -1;
		let lastChangedLine = -1;

		for (let i = 0; i < diffResult.length; i++) {
			const { line1, line2 } = diffResult[i];
			const isChanged = line1 !== line2;

			if (isChanged) {
				if (firstChangedLine === -1) {
					firstChangedLine = i;
				}
				lastChangedLine = i;
			}
		}

		const contextWindow = 3;
		let startLine = Math.max(firstChangedLine - contextWindow, 0);
		let endLine = Math.min(lastChangedLine + contextWindow, diffResult.length - 1);

		for (let i = startLine; i <= endLine; i++) {
			const { line1, line2, diff, index1, index2 } = diffResult[i];
			displayLines.push({
				line1,
				line2,
				diff,
				index1,
				index2
			});
		}

		if (startLine > 0) {
			displayLines.unshift({ line1: '...', line2: '...', diff: [], index1: 0, index2: 0 });
		}
		if (endLine < diffResult.length - 1) {
			displayLines.push({ line1: '...', line2: '...', diff: [], index1: 0, index2: 0 });
		}

		return displayLines;
	};
</script>

<table class="diff inlinediff">
	<thead>
		<tr>
			<th></th>
			<th></th>
			<th class="texttitle"> r{oldrever} vs r{rever}</th>
		</tr>
	</thead>
	<tbody>
		{#each getDisplayDiff() as { line1, line2, diff, index1, index2 }}
			{#if line1 === '...' && line2 === '...'}
				<tr>
					<th>...</th>
					<th>...</th>
					<td class="skip"></td>
				</tr>
			{:else}
				<tr>
					<th>{line1 ? index1 : ''}</th>
					<th>{line2 ? index2 : ''}</th>
					<td>
						<div>
							{#each diff as part}
								{#if part.added}
									<ins class="diff insert">{part.value}</ins>
								{:else if part.removed}
									<del class="diff delete">{part.value}</del>
								{:else}
									<span class="equal">{part.value}</span>
								{/if}
							{/each}
						</div>
					</td>
				</tr>
			{/if}
		{/each}
	</tbody>
</table>

<style>
	@import '$lib/css/diff.css';

	th {
		white-space: nowrap;
	}
</style>
