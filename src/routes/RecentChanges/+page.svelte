<script lang="ts">
	import { Backend } from '$lib/backend';
	const backend = new Backend(fetch);

	async function getData() {
		return await backend.getRecentChanges();
	}

	let getDataPromise = getData();

	function formatRelativeDate(date: string) {
		const d = new Date(date);
		const now = new Date();
		const diff = now.getTime() - d.getTime();
		const days = Math.floor(diff / (1000 * 60 * 60 * 24));
		const hours = Math.floor(diff / (1000 * 60 * 60));
		const minutes = Math.floor(diff / (1000 * 60));

		if (days > 0) return `${days}일 전`;
		if (hours > 0) return `${hours}시간 전`;
		return `${minutes}분 전`;
	}
</script>

<div class="BgxsYBxf">
	<div class="_7tsGZmP7">
		<div class="nM6gcR96">
			<ul class="f5zvpEli">
				<li><a class="WM1fI54n" href="?type=all">전체</a></li>
				<li><a class="WM1fI54n" href="?type=create">새 문서</a></li>
				<li><a class="WM1fI54n" href="?type=delete">삭제</a></li>
				<li><a class="WM1fI54n" href="?type=move">이동</a></li>
				<li><a class="WM1fI54n" href="?type=revert">되돌림</a></li>
			</ul>
		</div>
	</div>
</div>

<div class="-Yy3Y6nP">
	<div class="NfJT3FPE DjsdhWRC">
		<div class="c0O2TLGQ">문서</div>
		<div class="c0O2TLGQ">기능</div>
		<div class="c0O2TLGQ">수정자</div>
		<div class="c0O2TLGQ">수정 시간</div>
	</div>

	{#await getDataPromise}
		<div class="c0O2TLGQ">Loading...</div>
	{:then data}
		{#each data.changes as change}
			<div class="NfJT3FPE">
				<div class="c0O2TLGQ">
					<a href="/w/{change.title}">{change.title}</a>
					{#if change.versions && change.versions[0]}
						<span
							class="MY5yAwDg {change.versions[0].type > 0
								? 'changes-positive'
								: 'changes-negative'}"
						>
							{change.versions[0].type}
						</span>
					{/if}
				</div>

				<div class="c0O2TLGQ">
					<div class="_4HlR7Xk">
						<a class="sx7-yPnI" title="역사" href="/history/{change.title}">역사</a>
						{#if change.rever > 1}
							<a
								class="sx7-yPnI"
								title="비교"
								href="/diff/{change.title}?rev={change.rever}&oldrev={change.rever - 1}">비교</a
							>
						{/if}
						<a class="sx7-yPnI" title="토론" href="/discuss/{change.title}">토론</a>
					</div>
				</div>

				<div class="c0O2TLGQ">
					{#if change.versions && change.versions[0] && change.versions[0].user}
						{change.versions[0].user.username}
					{:else}
						{change.versions?.[0]?.ipAddress || 'Unknown'}
					{/if}
				</div>

				<div class="c0O2TLGQ">
					{formatRelativeDate(change.updatedAt)}
				</div>

				{#if change.versions && change.versions[0] && change.versions[0].log}
					<div class="c0O2TLGQ i80SVicp">
						<span>{change.versions[0].log}</span>
					</div>
				{/if}
			</div>
		{/each}
	{:catch error}
		<div class="c0O2TLGQ">Error loading changes: {error.message}</div>
	{/await}
</div>

<style>
	.f5zvpEli {
		display: flex;
		list-style: none;
		margin: 0;
		padding: 0;
		position: relative;
	}

	.f5zvpEli li {
		border-bottom: 1px solid #e0e0e0;
		border-top: 1px solid #e0e0e0;
	}

	.f5zvpEli li:first-of-type {
		border-bottom-left-radius: 8px;
		border-left: 1px solid #e0e0e0;
		border-top-left-radius: 8px;
		padding: 0 0 0 0.5rem;
	}

	.WM1fI54n {
		color: var(--text-color, #373a3c);
		display: inline-block;
		padding: 0.5rem 0.75rem;
		position: relative;
		text-align: center;
		text-decoration: none;
		white-space: nowrap;
		width: 100%;
	}

	.-Yy3Y6nP {
		display: flex;
		flex-direction: column;
	}

	.NfJT3FPE {
		border-bottom: 1px solid #e0e0e0;
		display: grid;
		grid-template-columns: 1fr 10rem 11rem 13rem;
	}

	.DjsdhWRC {
		border-bottom-width: 2px;
		font-weight: 600;
	}

	.c0O2TLGQ {
		padding: 0.5rem 0.75rem;
	}

	.MY5yAwDg {
		font-size: 0.8rem;
		margin: 0 0 0 0.35rem;
		vertical-align: bottom;
	}

	.changes-positive {
		color: green;
	}

	.changes-negative {
		color: red;
	}

	._4HlR7Xk {
		display: flex;
		gap: 0.25rem;
	}

	.sx7-yPnI {
		align-items: center;
		border: 1px solid #e0e0e0;
		border-radius: 3px;
		color: #555;
		cursor: pointer;
		display: flex;
		font-size: 0.8rem;
		height: 1.3rem;
		justify-content: center;
		text-decoration: none;
		transition: background-color 0.1s ease-in;
		width: 2rem;
	}

	.sx7-yPnI:hover {
		background-color: #ededed;
	}

	@media screen and (max-width: 1023.98px) {
		.NfJT3FPE {
			gap: 0.1rem;
			grid-template-columns: 1fr 1fr;
			padding: 0.5rem;
		}

		.DjsdhWRC {
			display: none;
		}

		.c0O2TLGQ {
			margin: 0 !important;
			padding: 0 !important;
		}
	}
</style>
