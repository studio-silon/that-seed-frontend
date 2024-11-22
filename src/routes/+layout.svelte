<script lang="ts">
	import { Backend } from '$lib/backend';
	import Dropdown from '../component/Dropdown.svelte';

	const backend = new Backend(fetch);

	async function getData() {
		return await backend.getData();
	}
	let getDataPromise = getData();

	let isOpen = false;

	function toggleDropdown() {
		isOpen = !isOpen;
	}
</script>

{#await getDataPromise}
	loading...
{:then data}
	<div class="Liberty">
		<div id="top"></div>
		<link rel="shortcut icon" href="../lib/img/favicon.ico" />
		<div class="nav-wrapper">
			<nav class="navbar navbar-dark">
				<a class="navbar-brand" href="/">{data.site.title}</a>
				<ul class="nav navbar-nav">
					<li class="nav-item">
						<a class="nav-link" href="/RecentChanges"
							><span class="fa fa-refresh"></span><span class="hide-title">최근 변경</span></a
						>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="/RecentDiscuss"
							><span class="fa fa-comments"></span><span class="hide-title">최근 토론</span></a
						>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="/random"
							><span class="fa fa-random"></span><span class="hide-title">임의 문서</span></a
						>
					</li>
					<li class="nav-item dropdown">
						<Dropdown>
							<div slot="toggle">
								<!-- svelte-ignore a11y_missing_attribute -->
								<a
									class="nav-link dropdown-toggle dropdown-toggle-fix"
									data-toggle="dropdown"
									aria-expanded="false"
								>
									<span class="fa fa-gear"></span><span class="hide-title">도구</span>
								</a>
							</div>
							<div slot="dropdown">
								<a href="/NeededPages" class="dropdown-item">작성이 필요한 문서</a>
								<a href="/OrphanedPages" class="dropdown-item">고립된 문서</a>
								<a href="/UncategorizedPages" class="dropdown-item">분류가 되지 않은 문서</a>
								<a href="/OldPages" class="dropdown-item">편집된 지 오래된 문서</a>
								<a href="/ShortestPages" class="dropdown-item">내용이 짧은 문서</a>
								<a href="/LongestPages" class="dropdown-item">내용이 긴 문서</a>
								<a href="/BlockHistory" class="dropdown-item">차단 내역</a>
								<a href="/RandomPage" class="dropdown-item">RandomPage</a>
								<a href="/Upload" class="dropdown-item">파일 올리기</a>
								<a href="/License" class="dropdown-item">라이선스</a>
								<div class="dropdown-divider"></div>
								<a href="/admin/ipacl" class="dropdown-item">IPACL</a>
								<a href="/admin/suspend_account" class="dropdown-item">계정 차단</a>
								<a href="/admin/grant" class="dropdown-item">권한</a>
								<a href="/admin/login_history" class="dropdown-item">로그인 기록 조회</a>
								<a href="/aclgroup" class="dropdown-item">ACL Group</a>
							</div>
						</Dropdown>
					</li>
				</ul>
				<div class="navbar-login">
					{#if data.user}
						<Dropdown className="login-menu">
							<div slot="toggle">
								<!-- svelte-ignore a11y_missing_attribute -->
								<a
									id="login-menu"
									class="dropdown-toggle"
									type="button"
									data-toggle="dropdown"
									aria-haspopup="true"
									aria-expanded="false"
								>
									<span class="fa fa-user"></span>
								</a>
							</div>
							<div slot="dropdown">
								<div class="username dropdown-item">
									<b>{data.user.username}</b><br />Member
								</div>
								<div class="dropdown-divider"></div>
								<a href="/settings" class="dropdown-item">설정</a>
								<a id="theme" href="#" class="dropdown-item">다크 테마로</a>
								<div class="dropdown-divider"></div>
								<a href="/member/mypage" class="dropdown-item">내 정보</a>
								<a href="/w/{data.user.username}" class="dropdown-item">내 사용자 문서</a>
								<a href="/member/starred_documents" class="dropdown-item">내 문서함</a>
								<div class="dropdown-divider"></div>
								<a class="dropdown-item" href="/contribution/user/{data.user.username}/document"
									>내 문서 기여 목록</a
								>
								<a class="dropdown-item" href="/contribution/user/{data.user.username}/discuss"
									>내 토론 기여 목록</a
								>
								<div class="dropdown-divider"></div>
								<a href="/logout" class="dropdown-item">로그아웃</a>
							</div>
						</Dropdown>
					{:else}
						<Dropdown className="login-menu">
							<div slot="toggle">
								<a
									id="login-menu"
									class="dropdown-toggle"
									type="button"
									data-toggle="dropdown"
									aria-haspopup="true"
									aria-expanded="false"
									on:click={toggleDropdown}
								>
									<span class="fa fa-user"></span>
								</a>
							</div>
							<div
								slot="dropdown"
								class="dropdown-menu dropdown-menu-right login-dropdown-menu {isOpen ? 'open' : ''}"
							>
								<div class="username dropdown-item">Please login!</div>
								<div class="dropdown-divider"></div>
								<a id="theme" href="#" class="dropdown-item">다크 테마로</a>
								<div class="dropdown-divider"></div>
								<a href="/login" class="dropdown-item">로그인</a>
							</div>
						</Dropdown>
					{/if}
				</div>
				<form id="searchform" class="form-inline">
					<div class="input-group">
						<input
							type="search"
							name="q"
							placeholder="검색"
							accesskey="f"
							class="form-control"
							id="searchInput"
							autocomplete="off"
						/>
						<span class="input-group-btn">
							<button
								type="submit"
								name="fulltext"
								value="검색"
								id="searchSearchButton"
								class="btn btn-secondary"><span class="fa fa-search"></span></button
							>
							<button
								type="submit"
								name="go"
								value="보기"
								id="searchGoButton"
								class="btn btn-secondary"><span class="fa fa-arrow-right"></span></button
							>
						</span>
					</div>
				</form>
			</nav>
		</div>
	</div>
	<slot />
{:catch someError}
	System error: {someError.message}.
{/await}

<style>
	@import '../lib/css/bootstrap.min.css';
	@import '../lib/css/font-awesome.min.css';
	@import '../lib/css/font/Noto Sans KR.css';
	@import '../lib/css/default.css';
	@import '../lib/css/default_mobile.css';
	@import '../lib/css/dark.css';

	.dropdown-menu {
		z-index: 1;
		opacity: 0;
		transition: opacity 0.2s ease-in-out;
	}

	.dropdown-menu.open {
		display: block;
		opacity: 1;
	}
</style>
