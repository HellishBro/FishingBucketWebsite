<script lang="ts">
	import { default as config } from "$lib/config.json";
	import { type FluxerUser } from '$lib/fluxer';
	import { page } from '$app/state';
	import DashBoard from '$lib/components/DashBoard.svelte';
	import { getContext } from 'svelte';

	let auth: string | null = $derived(getContext<() => string | null>("get_auth")());
	let user: FluxerUser | null = $derived(getContext<() => FluxerUser | null>("get_user")());
</script>

<svelte:head>
	<title>Dashboard | Fishing Bucket</title>
</svelte:head>

{#if auth && user}
	<DashBoard {auth} {user}></DashBoard>
{:else}
	<h1>You must be logged in to use the dashboard!</h1>
{/if}