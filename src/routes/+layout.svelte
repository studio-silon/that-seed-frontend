<script lang="ts">
	import { Backend } from '$lib/backend';
	import { onMount } from 'svelte';
	import Dropdown from '../component/Dropdown.svelte';
	import SearchFrom from '../component/SearchFrom.svelte';
	import theme from '../theme.json';
	import RecentCard from '../component/RecentCard.svelte';
	import { dataStore } from '$lib/stores/data';

	const backend = new Backend(fetch);

	async function getData() {
		return await backend.getData();
	}
	let getDataPromise = getData();

	let isDark = $state(false);

	const applyCSSVariables = (theme: Record<string, string>) => {
		const root = document.documentElement;

		for (const key in theme) {
			if (theme.hasOwnProperty(key)) {
				root.style.setProperty(`--${key}`, theme[key]);
			}
		}
	};

	const applyDarkMode = () => {
		const root = document.body;

		if (isDark) {
			root.classList.add('theseed-dark-mode');
		} else {
			root.classList.remove('theseed-dark-mode');
		}
	};

	onMount(() => {
		applyCSSVariables(theme);
		isDark = localStorage.getItem('darkMode') ? !+localStorage.getItem('darkMode')! : false;
		applyDarkMode();
	});
</script>

{#await getDataPromise}
	loading...
{:then data}
	{dataStore.set(data)}
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
					<li class="nav-item">
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
							<div class="dropdown-menu" role="menu">
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
								<a href="/admin/grant" class="dropdown-item">권한</a>
								<a href="/admin/login_history" class="dropdown-item">로그인 기록 조회</a>
								<a href="/aclgroup" class="dropdown-item">ACL Group</a>
							</div>
						</Dropdown>
					</li>
				</ul>
				<div class="navbar-login">
					<Dropdown className="login-menu">
						<div slot="toggle">
							<!-- svelte-ignore a11y_consider_explicit_label -->
							<a id="login-menu" class="dropdown-toggle" type="button">
								<span class="fa fa-user"></span>
							</a>
						</div>
						<div class="dropdown-menu dropdown-menu-right login-dropdown-menu">
							{#if data.user}
								<div class="username dropdown-item">
									<b>{data.user.username}</b><br />Member
								</div>
							{:else}
								<div class="username dropdown-item">Please login!</div>
							{/if}
							<div class="dropdown-divider"></div>
							<a
								id="theme"
								href="#"
								onclick={() => {
									isDark = !isDark;
									localStorage.setItem('darkMode', '' + +!+isDark);

									applyDarkMode();
								}}
								class="dropdown-item"
								>{#if isDark}라이트{:else}다크{/if} 테마로</a
							>
							<div class="dropdown-divider"></div>
							{#if data.user}
								<a href="/settings" class="dropdown-item">설정</a>
								<a href="/member/mypage" class="dropdown-item">내 정보</a>
								<a href="/w/사용자:{data.user.username}" class="dropdown-item">내 사용자 문서</a>
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
							{:else}
								<a href="/login" class="dropdown-item">로그인</a>
							{/if}
						</div>
					</Dropdown>
				</div>
				<SearchFrom />
			</nav>
		</div>
		<div class="content-wrapper">
			<div class="liberty-sidebar">
				<div class="liberty-right-fixed">
					<div class="live-recent">
						<div class="live-recent-header">
							<ul class="nav nav-tabs">
								<li class="nav-item">
									<a id="liberty-recent-tab1" class="nav-link active">최근 변경</a>
								</li>
							</ul>
						</div>
						<RecentCard limit={10} />
						<div class="live-recent-footer">
							<a href="/RecentChanges" title="최근 변경내역"
								><span class="label label-info">더 보기</span></a
							>
						</div>
					</div>
				</div>
			</div>
			<div class="container-fluid liberty-content">
				<slot />
				<div id="bottom" class="liberty-footer">
					<ul class="footer-places"></ul>
					<ul class="footer-icons">
						<li class="footer-poweredbyico">
							<a href="//gitlab.com/librewiki/Liberty-MW-Skin">Liberty</a> |
							<a href="https://github.com/studio-silon/that-seed-frontend">not seed(that seed)</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
{:catch someError}
	System error: {someError.message}.
{/await}
