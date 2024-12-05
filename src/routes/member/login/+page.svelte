<script lang="ts">
	import { Backend } from '$lib/backend';

	const backend = new Backend(fetch);

	let username: string = '';
	let password: string = '';
	let autologin: boolean = false;
	let error: boolean = false;

	const handleLogin = async (): Promise<void> => {
		error = false;
		console.log(await backend.login(username, password));
		if (await backend.login(username, password)) {
			alert('Login successful!');
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
	<form class="login-form" on:submit|preventDefault={handleLogin}>
		{#if error}
			<div class="alert alert-danger">
				<b>[error!]</b> Login failed. Please check your credentials.
			</div>
		{/if}
		<div class="form-group">
			<label for="username">Username</label>
			<input
				class="seed-log-input"
				id="username"
				bind:value={username}
				name="username"
				type="text"
			/>
		</div>

		<div class="form-group">
			<label for="password">Password</label>
			<input
				class="seed-log-input"
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

		<a href="/member/recover_password" class="recover_password">[아이디/비밀번호 찾기]</a> <br />

		<div class="seed-btns">
			<a href="/member/signup" class="seed-button outline">계정 만들기</a>
			<button type="submit" class="seed-button">로그인</button>
		</div>
	</form>
</div>

<style>
	@import '$lib/css/input.css';
	@import '$lib/css/button.css';

	.alert.alert-danger {
		color: #721c24;
		background-color: #f8d7da;
		border-color: #f5c6cb;
		padding: 0.75rem 1.25rem;
		margin-bottom: 1rem;
		border: 1px solid transparent;
		border-radius: 0.25rem;
	}

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
