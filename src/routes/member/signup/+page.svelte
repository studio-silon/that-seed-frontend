<script lang="ts">
	import { goto } from '$app/navigation';
	import { Backend } from '$lib/backend';
	import { reloadData } from '$lib/stores/data';

	const backend = new Backend(fetch);

	let username: string = $state('');
	let password: string = $state('');
	let token: string = $state('');
	let agree: boolean = $state(false);
	let error: boolean = $state(false);

	const handleSignup = async (event: Event): Promise<void> => {
		event.preventDefault();

		error = false;
		if (await backend.signup(username, password, token)) {
			reloadData(fetch);
			goto('/');
		} else {
			error = true;
		}
	};

	const getDataPromise = backend.getSignupData();
</script>

<div class="liberty-content-header">
	<div class="title">
		<h1>계정 만들기</h1>
	</div>
</div>

{#await getDataPromise}
	loading...
{:then data}
	<div class="liberty-content-main wiki-article">
		{#if error}
			<div class="alert alert-danger">
				<b>[오류!]</b> 가입할 수 없습니다.
			</div>
		{/if}
		<form class="login-form" onsubmit={handleSignup}>
			<div class="form-group">
				<label for="termsAndConditions">약관</label>
				<textarea
					class="seed-input big"
					id="termsAndConditions"
					value={data.termsAndConditions}
					name="termsAndConditions"
					disabled
				></textarea>
			</div>

			<div class="form-check">
				<input type="checkbox" class="form-check-input" id="agree" bind:checked={agree} />
				<label class="form-check-label" for="agree">동의합니다</label>
			</div>

			{#if data.needToken}
				<div class="form-group">
					<label for="token">Token</label>
					<input class="seed-input" id="token" bind:value={token} name="token" type="text" />
				</div>
			{/if}

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

			<div class="seed-btns">
				<button type="submit" class="seed-button" disabled={!agree}>가입</button>
			</div>
		</form>
	</div>
{/await}

<style>
	@import '$lib/css/input.css';
	@import '$lib/css/button.css';

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
