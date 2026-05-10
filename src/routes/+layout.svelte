<script lang="ts">
	import "$lib/assets/themes/fluxer-dark.css"
	import '$lib/assets/common.css';
	import TopBar from '$lib/components/TopBar.svelte';
	import { type FluxerUser, get_user } from '$lib/fluxer';
	import { onMount, setContext } from 'svelte';
	import { get_auth } from '$lib/api';

	let { children } = $props();

	let auth: string | null = $state(null);
	let user: FluxerUser | null = $state(null);

	onMount(() => {
		auth = get_auth();
		user = get_user();
	});

	setContext("get_user", () => user);
	setContext("get_auth", () => auth);
</script>

<div class="app">
	<TopBar></TopBar>

	<div class="contents">
		{@render children()}
	</div>
</div>

<style>
	.app {
      display: flex;
      flex-direction: column;
			min-height: 0;
			height: 100vh;
			overflow: hidden;
	}

	.contents {
      margin: calc(2.5em + 55px) 20px 20px;
      flex-grow: 1;
      min-height: 0;
			position: relative;
			box-sizing: border-box;
			background-color: var(--background-secondary);
			padding: 10px;
			border-radius: 10px;
	}
</style>