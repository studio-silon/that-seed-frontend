<script lang="ts">
	import { goto } from '$app/navigation';
	import { Backend } from '$lib/backend';
	import { reloadData } from '$lib/stores/data';

	const backend = new Backend(fetch);

	let username: string = '';
	let password: string = '';
	let autologin: boolean = false;
	let error: boolean = false;

	const handleLogin = async (): Promise<void> => {
		error = false;
		if (await backend.login(username, password)) {
			reloadData(fetch);
			goto('/');
		} else {
			error = true;
		}
	};
</script>

<div class="liberty-content-header">
	<div class="title">
		<h1>로그인</h1>
	</div>
</div>

<div class="liberty-content-main wiki-article">
	{#if error}
		<div class="alert alert-danger">
			<b>[오류!]</b> 아이디 혹은 패스워드가 틀립니다.
		</div>
	{/if}
	<form class="login-form" on:submit|preventDefault={handleLogin}>
		<div class="form-group">
			<label for="username">Username</label>
			<input class="seed-input" id="username" bind:value={username} name="username" type="text" />
		</div>

		<div class="form-group">
			<label for="password">Password</label>
			<input
				class="seed-input"
				id="password"
				bind:value={password}
				name="password"
				type="password"
			/>
		</div>

		<div class="checkbox autologin">
			<label>
				<input type="checkbox" bind:checked={autologin} name="autologin" />
				<span>자동 로그인</span>
			</label>
		</div>

		<a href="/member/recover_password" class="recover_password">비밀번호를 잊어버리셨나요?</a> <br />

		<div class="seed-btns">
			<a href="/member/signup" class="seed-button outline">계정 만들기</a>
			<button type="submit" class="seed-button">로그인</button>
		</div>
	</form>
</div>

<style>
	@import '$lib/css/input.css';
	@import '$lib/css/button.css';

	.autologin {
		display: inline-block;
	}

	.recover_password {
		float: right;
	}

	.seed-btns {
		display: flex;
		justify-content: end;
		gap: 0.5rem;
	}

	.login-form {
		margin: 0 auto;
		width: 100%;
	}

	@media screen and (min-width: 34rem) {
		.login-form {
			margin: 0 auto;
			width: 28rem;
		}
	}
</style>
