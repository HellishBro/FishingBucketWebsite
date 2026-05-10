<script lang="ts">
	import { Menu } from "@lucide/svelte";
	import { default as config } from "$lib/config.json";
	import { onMount } from 'svelte';
	import { get_auth, get } from '$lib/api';
	import { type FluxerUser, get_user, get_user_avatar } from '$lib/fluxer';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { fly } from "svelte/transition";

	let auth: string | null = $state(null);
	let user: FluxerUser | null = $state(null);

	onMount(() => {
		auth = get_auth();
		user = get_user();
	});

	let expand_user_settings = $state(false);
	let menu_open = $state(false);

	async function logout() {
		await get<object>("/auth/logout", auth!);
		window.localStorage.removeItem("user");
		window.localStorage.removeItem("session_id");
		window.location.href = resolve("/");
	}
</script>

<nav>
	<div class="desktop-nav-links">
		<div class="centered-link button">
			<a style="font-size: 1.5em; color: var(--text-primary)" href="{resolve('/')}">
				Fishing Bucket
			</a>
		</div>

		{#if auth && user}
			<div class="centered-link">
				<a href="{resolve('/dashboard')}">Dashboard</a>
			</div>
		{/if}
		<div class="centered-link">
			<a href="{resolve('/privacy')}">Privacy</a>
		</div>
		<div class="centered-link">
			<a href="{resolve('/terms')}">Terms</a>
		</div>
		<div class="centered-link">
			<a href="{resolve('/copyright')}">Copyright</a>
		</div>
		<div class="centered-link">
			<a href="{resolve('/contact')}">Contact</a>
		</div>
	</div>

	<button class="hamburger" onclick={() => {menu_open = !menu_open}}><Menu></Menu></button>

	<div class="login">
		{#if auth && user}
			<div class="user-menu">
				{#if expand_user_settings}
					<div style="display: flex;" transition:fly={{
						duration: 200,
						x: 100
					}}>
						<div class="centered-link">
							<button class="dangerous-button" onclick={logout}>Logout</button>
						</div>
					</div>
				{/if}

				<button class="user-info" onclick={() => {
					expand_user_settings = !expand_user_settings;
				}}>
					<img src={get_user_avatar(160)} style="width: 2.5em; height: 2.5em;" alt="User avatar" class="avatar" />
					<span>{user.global_name}</span>
				</button>
			</div>
		{:else}
			<button onclick={() => {
				window.location.href = config.api_url + "/auth?redirect_uri=" + encodeURI(page.url.origin + "/redirect");
			}}><span style="display: inline-block; line-height: 2.5em;">Login</span></button>
		{/if}
	</div>
</nav>

{#if menu_open}
	<nav class="mobile-nav" transition:fly={{ y: -20, duration: 200 }}>
		<a style="font-size: 1.5em; color: var(--text-primary)" href="{resolve('/')}" class="button">Fishing Bucket</a>
		{#if auth && user}
			<a href="{resolve('/dashboard')}" onclick={() => { menu_open = false; }}>Dashboard</a>
		{/if}
		<a href="{resolve('/privacy')}" onclick={() => { menu_open = false; }}>Privacy</a>
		<a href="{resolve('/terms')}" onclick={() => { menu_open = false; }}>Terms</a>
		<a href="{resolve('/copyright')}" onclick={() => { menu_open = false; }}>Copyright</a>
		<a href="{resolve('/contact')}" onclick={() => { menu_open = false; }}>Contact</a>
	</nav>
{/if}

<style>
    nav {
        width: calc(100vw - 20px);
        height: auto;
        padding: 10px 10px;
        display: flex;
        background-color: var(--fluxer-brand-primary-light);
        color: var(--text-on-fluxer-brand-primary);
        gap: 10px;
				align-items: center;
        border-radius: 0 0 10px 10px;
        position: fixed;
        z-index: 9999;
    }

    .centered-link a {
        color: var(--text-on-fluxer-brand-primary);
        text-decoration: none;
        font-size: 1.25em;
    }

    .centered-link {
        margin: auto 0;
        height: auto;
        padding: 5px 10px;
    }

    .login {
        height: auto;
        display: inline-block;
        margin: 0 10px 0 auto;
    }

    .user-menu {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .user-info {
        display: inline-flex;
        align-items: center;
        gap: 10px;
    }

    .desktop-nav-links {
        display: flex;
        gap: 10px;
				flex-grow: 1;
				overflow-x: auto;
    }

		.hamburger {
				aspect-ratio: 1;
				width: auto;
				display: flex;
				align-items: center;
		}

    .mobile-nav {
        position: fixed;
				top: 60px;
        left: 0;
        right: 0;
				bottom: 0;
        flex-direction: column;
				align-items: start;
				gap: 20px;
				z-index: 9998;
    }

    .mobile-nav a {
        color: var(--text-on-fluxer-brand-primary);
        text-decoration: none;
        font-size: 1.25em;
    }

		@media (min-aspect-ratio: 3/4) {
				.hamburger {
						display: none;
        }

				.mobile-nav {
						display: none;
        }
		}

    @media (max-aspect-ratio: 3/4) {
        .desktop-nav-links {
            display: none;
        }

        .hamburger {
            display: flex;
        }
    }

    @media (max-width: 480px) {
        .user-info span {
            display: none;
        }

        .user-info img {
            margin: 0;
        }
    }
</style>