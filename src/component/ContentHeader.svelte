<script lang="ts">
	import { page } from '$app/stores';
	import { joinName } from '$lib/utils/wiki';

	let {
		wiki,
		name,
		viewName = 'wiki',
		baserev,
		section,
		rev,
		children
	}: {
		wiki:
			| {
					title: string;
					namespace: string;
			  }
			| undefined;
		name?: string;
		viewName?: string;
		baserev?: string | undefined;
		section?: boolean | undefined;
		rev?: string | undefined;
		children?: import('svelte').Snippet;
	} = $props();

	let namespacePrefix = $derived(wiki?.namespace ? `${wiki.namespace}:` : '');
	let displayTitle = $derived(wiki ? `${namespacePrefix}${wiki.title}` : name);

	function getSubtitle() {
		switch (viewName) {
			case 'edit_edit_request':
			case 'edit_request':
				return '(편집 요청)';
			case 'edit':
				if (section) return `(r${baserev} 문단 편집)`;
				if (baserev === '0') return '(새 문서 생성)';
				return `(r${baserev} 편집)`;
			case 'history':
				return '(역사)';
			case 'backlink':
				return '(역링크)';
			case 'move':
				return '(이동)';
			case 'delete':
				return '(삭제)';
			case 'acl':
				return '(ACL)';
			case 'thread':
				return '(토론)';
			case 'thread_list':
				return '(토론 목록)';
			case 'thread_list_close':
				return '(닫힌 토론)';
			case 'edit_request_close':
				return '(닫힌 편집 요청)';
			case 'diff':
				return '(비교)';
			case 'revert':
				return rev ? `(r${rev}로 되돌리기)` : '';
			case 'raw':
				return rev ? `(r${rev} RAW)` : '';
			case 'blame':
				return rev ? `(r${rev} Blame)` : '';
			case 'wiki':
				return rev ? `(r${rev} 판)` : '';
			default:
				return '';
		}
	}
</script>

<div class="liberty-content-header">
	{@render children?.()}
	<div class="title">
		<h1>
			{#if wiki && viewName !== 'error'}
				<a href="/w/{joinName(wiki.namespace, wiki.title)}">
					{#if wiki.namespace}
						<span class="namespace">{wiki.namespace}:</span>
					{/if}
					{wiki.title}
				</a>
				<small>{getSubtitle()}</small>
			{:else}
				{displayTitle}
				<small>{getSubtitle()}</small>
			{/if}
		</h1>
	</div>
</div>
