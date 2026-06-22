<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { post } from '$lib/api';
	import { resolve } from '$app/paths';
	import type { PageProps } from './$types';

	let {
		params
	}: PageProps = $props();

	let text = $state("");

	onMount(async () => {
		if (["fluxer", "discord"].includes(params.platform)) {
			text = "Logging in...";
			const code = page.url.searchParams.get("code");
			if (code == null) {
				text = "Login canceled";
				window.location.assign(resolve("/"));
				return;
			}
			let redirect_url = page.url;
			redirect_url.searchParams.delete("code");
			const { error, body: res } = await post<{ session_id: string, user: object, platform: string, expires: number }>(`/auth/${params.platform}/login`, { code: code, redirect_uri: redirect_url.toString() });
			if (error) {
				text = `${error.error_code}: ${error.message}`;
				return;
			}
			else if (res) {
				text = "Saving data...";
				const { session_id, user, platform, expires } = res;
				localStorage.setItem('session_id', session_id);
				localStorage.setItem('user', JSON.stringify(user));
				localStorage.setItem('platform', platform);
				localStorage.setItem('expires', expires.toString());
				text = "Redirecting...";
				window.location.assign(resolve("/"));
			}
		} else {
			text = `Error: unrecognized platform ${params.platform}`;
		}
	});
</script>

<svelte:head>
	<title>Authorization | Fishing Bucket</title>
</svelte:head>

<h1>{text}</h1>
