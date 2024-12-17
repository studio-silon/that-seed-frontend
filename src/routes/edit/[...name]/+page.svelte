<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Backend } from '$lib/backend';
	import { urlEncoding } from '$lib/utils/wiki';
	import ContentHeader from '../../../component/ContentHeader.svelte';
	import ContentTools from '../../../component/ContentTools.svelte';

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
		viewName="edit"
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
		<form method="POST" id="editForm" enctype="multipart/form-data" onsubmit={submitForm}>
			<ul class="nav nav-tabs" role="tablist" style="height: 38px;">
				<li class="nav-item">
					<a
						class="nav-link {mode && 'active'}"
						data-toggle="tab"
						href="#edit"
						role="tab"
						aria-expanded={mode}
						onclick={() => (mode = true)}
					>
						RAW 편집
					</a>
				</li>
				<li class="nav-item">
					<a
						id="previewLink"
						class="nav-link {mode || 'active'}"
						data-toggle="tab"
						href="#preview"
						role="tab"
						aria-expanded={!mode}
						onclick={() => {
							mode = false;
							html = '';

							fetch('/api/api/wiki-preview', {
								method: 'POST',
								headers: {
									'Content-Type': 'application/x-www-form-urlencoded'
								},
								body: new URLSearchParams({
									content
								})
							})
								.then((res) => res.json())
								.then((res: { value: string }) => {
									html = res.value;
								});
						}}
					>
						미리보기
					</a>
				</li>
			</ul>

			<div class="tab-content bordered">
				<div class="tab-pane {mode && 'active'}" role="tabpanel">
					<textarea
						name="text"
						wrap="soft"
						class="form-control seed-edit-input"
						bind:value={content}>{data.wiki?.content || ''}</textarea
					>
				</div>
				<div class="tab-pane {mode || 'active'}" role="tabpanel">
					{#if !mode}
						<div class="wiki-preview wiki" id="preview">{@html html}</div>
					{/if}
				</div>
			</div>

			<div class="form-group" style="margin-top: 1rem;">
				<label class="control-label" for="summaryInput">요약</label>
				<input type="text" name="log" class="seed-input" value="" />
			</div>

			<label>
				<input type="checkbox" name="agree" id="agreeCheckbox" value="Y" />&nbsp;문서 편집을
				<strong>저장</strong>하면 당신은 기여한 내용을 <strong>CC-BY-SA 4.0</strong>으로 배포하고
				기여한 문서에 대한 하이퍼링크나 URL을 이용하여 저작자 표시를 하는 것으로 충분하다는 데
				동의하는 것입니다. 이 <strong>동의는 철회할 수 없습니다.</strong>
			</label>

			<div class="seed-flex">
				<button class="seed-button" type="submit">저장</button>
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
