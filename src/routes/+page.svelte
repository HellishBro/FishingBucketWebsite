<script lang="ts">
	import { default as config } from "$lib/config.json";
	import { Cog } from "@lucide/svelte";
	import { type FluxerUser } from '$lib/user';
	import { resolve } from '$app/paths';
	import { getContext } from 'svelte';
	import FluxerIcon from "$lib/components/FluxerIcon.svelte";
	import DiscordIcon from "$lib/components/DiscordIcon.svelte";

	let auth: string | null = $derived(getContext<() => string | null>("get_auth")());
	let user: FluxerUser | null = $derived(getContext<() => FluxerUser | null>("get_user")());
</script>

<svelte:head>
	<title>Fishing Bucket</title>
</svelte:head>

<!-- eslint-disable svelte/no-navigation-without-resolve -->

<div class="wrap-scrollable-container">
	<div style="text-align: center; width: 100%; display: flex; flex-direction: column; align-items: center; gap: 5px;">
		<h1 style="margin-bottom: 0;">Fishing Bucket</h1>
		<div style="height: auto; gap: 5px; display: flex; flex-direction: row; text-align: center;">
			<a class="button iconed-button med-font" href="{config.bot_invite_link}"><FluxerIcon></FluxerIcon> Add to Fluxer</a>
			<a class="button iconed-button med-font discord" href="{config.bot_invite_link}"><DiscordIcon></DiscordIcon> Add to Discord</a>
		</div>
		{#if auth && user}
			<a class="button iconed-button med-font" href="{resolve('/dashboard')}"><Cog></Cog> Go to Dashboard</a>
		{/if}
	</div>

	<div class="cards" style="margin-top: 25px;">
		<div class="card">
			<h2 id="intro">Fishing Bucket is the Fluxer bot for proxying messages.</h2>
			<p>What does this mean? If you want to send a message as a different profiles, or <a href="#proxies">proxies</a>, Fishing Bucket can do that easily.</p>
		</div>

		<div class="card">
			<h2 id="use-cases">Use Cases</h2>
			<p style="margin-bottom: 0">Fishing Bucket does not try to appeal for a specific audience. However, the current list of use cases for the bot include:</p>
			<ul style="margin-left: 1em; margin-top: 0">
				<li>expression of plural system members <a style="font-size: 0.7em" href="https://morethanone.info/">(what's a system?)</a>,</li>
				<li>roleplaying as different characters, real or fictional,</li>
				<li>and as a tool for <abbr title="Live-Action Role-Play">LARP</abbr> or <abbr title="Table-Top Role-Playing Games">TTRPGs</abbr>.</li>
			</ul>
		</div>

		<div class="card">
			<h2 id="proxies">Proxies</h2>
			<p>
				Proxies are faux profiles that can be used to send messages through, as long as Fishing Bucket has access to the channel, and you have permission to use proxies in that channel.
				<br>
				Proxies can be used via invoking its <a href="#trigger">trigger</a>, which is essentially a pattern that Fishing Bucket tries to search for in messages.
			</p>
		</div>

		<div class="card">
			<h2 id="proxy-features">Proxy Features</h2>
			<p style="margin-bottom: 0">Fishing Bucket proxies has a variety of features, including but not limited to:</p>
			<ul style="margin-left: 1em; margin-top: 0">
				<li>changing the proxy's name or avatar,</li>
				<li>add a nickname to the proxy,</li>
				<li>organize proxies into proxy groups,</li>
				<li>add and switch proxy forms instantly,</li>
				<li>import from other services like PluralKit or Tupperbox,</li>
				<li>and more!</li>
			</ul>
		</div>

		<div class="card">
			<h2 id="proxied-messages">Proxied Messages</h2>
			<p style="margin-bottom: 0">A proxied message is a message sent via a proxy. You can interact with a proxied message in a variety of different ways:</p>
			<ul style="margin-left: 1em; margin-top: 0">
				<li>React with ❌ to a message that you've sent to delete it;</li>
				<li>React with ❓ to a proxy to show who sent it and the corresponding proxy information;</li>
				<li>React with 📝 to edit a message that you've sent;</li>
				<li>React with 🔔 to ping the person behind the proxied message.</li>
			</ul>
		</div>

		<div class="card">
			<h2 id="autoproxy">Autoproxy</h2>
			<p>
				Autoproxy is a setting to automatically send messages through a proxy. If this setting is not off, every message you sent will be automatically proxied.
				<br>
				Autoproxy comes in two different modes: specific and latch. You can autoproxy as a specific proxy, or as the last used proxy.
				<br>
				Starting a message with the backslash symbol (\) will bypass autoproxy settings for that message, while starting a message with two such symbols (\\) will autoproxy.
			</p>
		</div>

		<div class="card">
			<h2 id="trigger">Trigger</h2>
			<p>
				A trigger is a specific way to let Fishing Bucket know when and how to proxy a specific message. Fishing Bucket triggers are extremely powerful.
				<br>
				Triggers must contain a placeholder, indicated by the literal &#123;&#125; acting as where the proxied text will go. Around the placeholder or placeholders, prefixes, suffixes, and infixes can be placed.
			</p>
		</div>

		<div class="card">
			<h2 id="logging">Logging</h2>
			<p>Logging is a feature of Fishing Bucket. You can configure a channel for Fishing Bucket to log all proxy message actions to. A useful tool for moderation.</p>
		</div>

		<div class="card">
			<h2 id="more">And More!</h2>
			<p>This information panel is a non-exhaustive list of all the features that Fishing Bucket offers. To see a full list of features, please await, or join our <a href="{config.hq_server_invite}">Fluxer</a> or <a href="{config.hq_discord_invite}">Discord</a> communities! Where you can pester me, the developer, about finishing this website.</p>
		</div>
	</div>
</div>

<style>
	p {
			text-indent: 1em each-line;
	}

	@media (min-aspect-ratio: 3/4) {
      .cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
      }
  }

	@media (max-aspect-ratio: 3/4) {
      .cards {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
      }
	}

	.card {
			box-sizing: border-box;
			background-color: var(--background-primary);
			border-radius: 10px;
			padding: 10px 20px;
	}
</style>