<script lang="ts">
	import "$lib/assets/themes/fluxer-dark.css"
	import '$lib/assets/common.css';
	import TopBar from '$lib/components/TopBar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { type User, get_user } from '$lib/user';
	import { onMount, setContext } from 'svelte';
	import { attempt_refresh_token, get_auth } from '$lib/api';

	let { children } = $props();

	let auth: string | null = $state(null);
	let user: User | null = $state(null);

	onMount(() => {
		auth = get_auth();
		user = get_user();

		setInterval(async () => {
			console.log("refresh");
			await attempt_refresh_token();
		}, 60_000);
	});

	setContext("get_user", () => user);
	setContext("get_auth", () => auth);
</script>

<div class="app">
	<TopBar></TopBar>

	<main class="contents">
		{@render children()}
	</main>

	<Footer></Footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		background-color: var(--background-primary);
	}

	.contents {
		flex: 1;
		margin-top: 80px;
		padding: 2rem;
		max-width: 1400px;
		width: 100%;
		margin-left: auto;
		margin-right: auto;
		box-sizing: border-box;
	}

	@media (max-width: 768px) {
		.contents {
			padding: 1rem;
			margin-top: 70px;
		}
	}
</style>