<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { post } from '$lib/api';
	import { resolve } from '$app/paths';

	let text = $state("");

	onMount(async () => {
		text = "Logging in...";
		const code = page.url.searchParams.get("code");
		let redirect_url = page.url;
		redirect_url.searchParams.delete("code");
		const { error, body: res } = await post<{ session_id: string, user: object }>("/auth/login", { code: code, redirect_uri: redirect_url.toString() });
		if (error) {
			text = `${error.error_code}: ${error.message}`;
			return;
		}
		else if (res) {
			text = "Saving data..."
			const { session_id, user } = res;
			localStorage.setItem('session_id', session_id);
			localStorage.setItem('user', JSON.stringify(user));
			text = "Redirecting..."
			window.location = resolve("/");
		}
	});
</script>

<svelte:head>
	<title>Authorization | Fishing Bucket</title>
</svelte:head>

<h1>{text}</h1>
