<script lang="ts">
	import { page } from "$app/state";
	import DiscordIcon from "$lib/components/DiscordIcon.svelte";
	import FluxerIcon from "$lib/components/FluxerIcon.svelte";
	import { default as config } from "$lib/config.json";

    const fluxer_redirect_uri = `${config.api_url}/auth/fluxer?redirect_uri=${encodeURI(page.url.origin + "/redirect/fluxer")}`;
    const discord_redirect_uri = `${config.api_url}/auth/discord?redirect_uri=${encodeURI(page.url.origin + "/redirect/discord")}`;
</script>

<svelte:head>
	<title>Login | Fishing Bucket</title>
</svelte:head>

<div class="wrap-scrollable-container">
	<div style="text-align: center; width: 100%;">
		<h1>Login</h1>
        <h2>Login with:</h2>
        <div style="display: inline-flex; align-items: center; gap: 5px;">
            <a href="{fluxer_redirect_uri}" rel="external" class="login-option fluxer"><FluxerIcon></FluxerIcon> Fluxer</a>
            OR
            <a href="{discord_redirect_uri}" rel="external" class="login-option discord"><DiscordIcon></DiscordIcon> Discord</a>
        </div>
	</div>
</div>

<style>
    .login-option {
        padding: 0.75em;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
        text-decoration: none;
        vertical-align: central;
        display: inline-flex;
        align-items: center;
        gap: 5px;
    }

    .fluxer {
        background-color: var(--accent-primary);
    }

    .fluxer:hover {
        background-color: var(--accent-secondary);
    }
</style>