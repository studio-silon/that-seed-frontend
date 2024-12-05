<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Backend } from '$lib/backend';
	import { urlEncoding } from '$lib/utils/wiki';
	import ContentHeader from '../../../component/ContentHeader.svelte';
	import ContentTools from '../../../component/ContentTools.svelte';
	import { dataStore, type DataStoreType } from '$lib/stores/data';

	let siteData: DataStoreType = $state(null);

	dataStore.subscribe((data) => {
		siteData = data;
	});

	const backend = new Backend(fetch);

	const name = $page.params.name;
	const url = urlEncoding(name);

	async function getData() {
		return await backend.getDocs(name);
	}

	let getDataPromise = getData();

	let mode: boolean = $state(true);
	let content: string = $state('');
	let html: string = $state('');

	let contentInitialized = false;

	$effect: if (!contentInitialized && $page.params.name) {
		getDataPromise.then((data) => {
			content = data.wiki?.content || '';
			contentInitialized = true;
		});
	}

	async function submitForm(event: Event) {
		event.preventDefault();

		const formData = new FormData(event.target as HTMLFormElement);

		try {
			await backend.editDocs(name, content, '' + formData.get('log'));
		} catch (error) {
			console.error('저장 중 오류 발생:', error);
		}

		goto('/w/' + url);
	}
</script>

{#await getDataPromise}
	loading...
{:then data}
	<ContentHeader
		wiki={data.wiki}
		{name}
		viewName="thread_list"
		baserev={data.wiki ? '' + data.wiki.rever : '0'}
	>
		<ContentTools
			tools={[
				{
					to: '/move/' + url,
					title: '이동'
				},
				{
					to: '/delete/' + url,
					class: 'btn-danger',
					title: '삭제'
				},
				{
					to: '/history/' + url,
					title: '역사'
				},
				{
					to: '/acl/' + url,
					title: 'ACL'
				}
			]}
		/>
	</ContentHeader>
	<div class="liberty-content-main wiki-article">
		<h3 class="wiki-heading">편집 요청</h3>
		<div class="wiki-heading-content">
			<ul class="wiki-list"></ul>
			<p>
				<a href="?state=close">[닫힌 토론 목록 보기]</a>
			</p>
		</div>

		<h3 class="wiki-heading">토론</h3>
		<div class="wiki-heading-content">
			<ul class="wiki-list"></ul>
			<p>
				<a href="?state=close">[닫힌 토론 목록 보기]</a>
			</p>
		</div>

		<h3 class="wiki-heading">새 주제 생성</h3>

		{#if name === siteData?.site.frontPage}
			<div class="alert alert-success alert-dismissible fade in" role="alert">
				<strong>[경고!]</strong> 이 토론은 {name} 문서의 토론입니다. {name} 문서와 관련 없는 토론은 각
				문서의 토론에서 진행해 주시기 바랍니다. {name} 문서와 관련 없는 토론은 삭제될 수 있습니다.
			</div>
		{/if}

		<form method="post" class="new-thread-form" id="topicForm">
			<div class="form-group">
				<label class="control-label" for="topicInput" style="margin-bottom: 0.2rem;">주제 :</label>
				<input type="text" class="form-control" id="topicInput" name="topic" />
			</div>

			<div class="form-group">
				<label class="control-label" for="contentInput" style="margin-bottom: 0.2rem;">내용 :</label
				>
				<textarea name="text" class="form-control" id="contentInput" rows="5"></textarea>
			</div>

			{#if !siteData?.user}
				<p style="font-weight: bold; font-size: 1rem;">
					[알림] 비로그인 상태로 토론 주제를 생성합니다. 토론 내역에 IP($ip_check(req))가 영구히
					기록됩니다.
				</p>
			{/if}

			<div class="btns">
				<button id="createBtn" class="btn btn-primary" style="width: 8rem;">전송</button>
			</div>
		</form>
	</div>
{:catch someError}
	System error: {someError.message}.
{/await}

<style>
	@import '$lib/css/seed.css';

	@import '$lib/css/input.css';
	@import '$lib/css/button.css';

	.seed-button {
		margin-left: auto;
		width: 100px;
	}

	.wiki-preview {
		height: 30rem;
		overflow: auto;
		padding: 10px;
		border: none;
		width: 100%;
	}

	.bordered {
		border: 1px solid #ddd;
		border-top: none;
	}
</style>
