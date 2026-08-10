<script lang="ts">
	import { type User } from '$lib/user';
	import DashBoard from '$lib/components/dashboard/DashBoard.svelte';
	import { getContext } from 'svelte';

	let auth: string | null = $derived(getContext<() => string | null>("get_auth")());
	let user: User | null = $derived(getContext<() => User | null>("get_user")());
</script>

<svelte:head>
	<title>Dashboard | Fishing Bucket</title>
</svelte:head>

{#if auth && user}
	<DashBoard {auth} {user}></DashBoard>
{:else}
	<h1>You must be logged in to use the dashboard!</h1>
{/if}