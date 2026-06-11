<script lang="ts">
	import { default as config } from "$lib/config.json";
	import { Cog } from "@lucide/svelte";
	import { type FluxerUser } from '$lib/user';
	import { resolve } from '$app/paths';
	import { getContext } from 'svelte';
	import FluxerIcon from "$lib/components/FluxerIcon.svelte";
	import DiscordIcon from "$lib/components/DiscordIcon.svelte";
	import favicon from "$lib/assets/favicon.png";

	let auth: string | null = $derived(getContext<() => string | null>("get_auth")());
	let user: FluxerUser | null = $derived(getContext<() => FluxerUser | null>("get_user")());
</script>

<svelte:head>
	<title>Fishing Bucket - The Fluxer Proxy Bot</title>
	<meta name="description" content="Fishing Bucket is the Fluxer bot for proxying messages. Perfect for plural systems, roleplaying, and TTRPGs." />
</svelte:head>

<div class="homepage">
	<section class="hero">
		<div class="hero-content">
			<img src={favicon} alt="Fishing Bucket" class="hero-avatar" />
			<h1 class="hero-title">Fishing Bucket</h1>
			<div class="hero-buttons">
				<a class="button primary-button" href="{config.bot_invite_link}" rel="external">
					<FluxerIcon></FluxerIcon> Add to Fluxer
				</a>
				<a class="button secondary-button discord" href="{config.bot_invite_link}" rel="external">
					<DiscordIcon></DiscordIcon> Add to Discord
				</a>
				{#if auth && user}
					<a class="button secondary-button" href="{resolve('/dashboard')}">
						<Cog></Cog> Dashboard
					</a>
				{/if}
			</div>
		</div>
	</section>

	<section class="features">		
		<div class="feature-grid">
			<div class="feature-card">
				<h3>Proxies</h3>
				<p>Proxies are faux profiles that can be used to send messages through, as long as Fishing Bucket has access to the channel, and you have permission to use proxies in that channel. Proxies can be used via invoking its trigger, which is essentially a pattern that Fishing Bucket tries to search for in messages.</p>
			</div>

			<div class="feature-card">
				<h3>Proxy Features</h3>
				<p>Fishing Bucket proxies has a variety of features, including but not limited to:</p>
				<ul>
					<li>Changing the proxy's name or avatar</li>
					<li>Add a nickname to the proxy</li>
					<li>Organize proxies into proxy groups</li>
					<li>Add and switch proxy forms instantly</li>
					<li>Import from other services like PluralKit or Tupperbox</li>
					<li>And more!</li>
				</ul>
			</div>

			<div class="feature-card">
				<h3>Proxied Messages</h3>
				<p>A proxied message is a message sent via a proxy. You can interact with a proxied message in a variety of different ways:</p>
				<ul>
					<li>React with ❌ to a message that you've sent to delete it</li>
					<li>React with ❓ to a proxy to show who sent it and the corresponding proxy information</li>
					<li>React with 📝 to edit a message that you've sent</li>
					<li>React with 🔔 to ping the person behind the proxied message</li>
				</ul>
			</div>

			<div class="feature-card">
				<h3>Autoproxy</h3>
				<p>Autoproxy is a setting to automatically send messages through a proxy. If this setting is not off, every message you sent will be automatically proxied. Autoproxy comes in two different modes: specific and latch. You can autoproxy as a specific proxy, or as the last used proxy. Starting a message with the backslash symbol (\) will bypass autoproxy settings for that message, while starting a message with two such symbols (\\) will autoproxy.</p>
			</div>

			<div class="feature-card">
				<h3>Trigger</h3>
				<p>A trigger is a specific way to let Fishing Bucket know when and how to proxy a specific message. Fishing Bucket triggers are extremely powerful. Triggers must contain a placeholder, indicated by the literal {"{}"} acting as where the proxied text will go. Around the placeholder or placeholders, prefixes, suffixes, and infixes can be placed.</p>
			</div>

			<div class="feature-card">
				<h3>Logging</h3>
				<p>Logging is a feature of Fishing Bucket. You can configure a channel for Fishing Bucket to log all proxy message actions to. A useful tool for moderation.</p>
			</div>
		</div>
	</section>

	<section class="use-cases">
		<h2 class="section-title">Perfect For</h2>
		<div class="use-case-grid">
			<div class="use-case-card">
				<h3>Plural Systems</h3>
				<p>Express different system members with unique proxy profiles.</p>
				<a href="https://morethanone.info/" target="_blank" rel="noopener noreferrer" class="learn-more">Learn more →</a>
			</div>
			<div class="use-case-card">
				<h3>Roleplaying</h3>
				<p>Roleplay as different characters, real or fictional, with ease.</p>
			</div>
			<div class="use-case-card">
				<h3>TTRPGs & LARP</h3>
				<p>Enhance your tabletop and live-action role-playing experiences.</p>
			</div>
		</div>
	</section>

	<section class="cta">
		<h2>Ready to Get Started?</h2>
		<p>Join thousands of users already using Fishing Bucket</p>
		<div class="cta-buttons">
			<a class="button primary-button" href="{config.bot_invite_link}">
				<FluxerIcon></FluxerIcon> Add to Fluxer
			</a>
			<a class="button secondary-button discord" href="{config.bot_invite_link}">
				<DiscordIcon></DiscordIcon> Add to Discord
			</a>
		</div>
	</section>
</div>

<style>
	.homepage {
		width: 100%;
	}

	.hero {
		text-align: center;
		padding: 4rem 0;
		background: linear-gradient(135deg, var(--background-secondary) 0%, var(--background-primary) 100%);
		border-radius: 16px;
		margin-bottom: 3rem;
	}

	.hero-content {
		max-width: 800px;
		margin: 0 auto;
		padding: 0 2rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem;
	}

	.hero-avatar {
		width: 120px;
		height: 120px;
		border-radius: 24px;
	}

	.hero-title {
		font-size: 3.5rem;
		font-weight: 800;
		line-height: 1.1;
		margin: 0;
	}

	.hero-buttons {
		display: flex;
		gap: 1rem;
		justify-content: center;
		flex-wrap: wrap;
	}

	.primary-button {
		background-color: var(--accent-primary);
		color: white;
		padding: 1rem 2rem;
		font-size: 1.1rem;
	}

	.primary-button:hover {
		background-color: var(--accent-secondary);
	}

	.secondary-button {
		background-color: var(--background-secondary);
		color: var(--text-primary);
		border: 2px solid var(--border-color);
		padding: 1rem 2rem;
		font-size: 1.1rem;
	}

	.secondary-button:hover {
		background-color: var(--background-tertiary);
		border-color: var(--accent-primary);
	}

	.features {
		margin-bottom: 4rem;
	}

	.section-title {
		font-size: 2.5rem;
		font-weight: 700;
		text-align: center;
		margin-bottom: 3rem;
	}

	.feature-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
		gap: 1.5rem;
	}

	.feature-card {
		background-color: var(--background-secondary);
		padding: 1rem;
		border-radius: 10px;
		border: 1px solid var(--border-color);
	}

	.feature-card h3 {
		font-size: 1.1rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
	}

	.feature-card p {
		color: var(--text-secondary);
		line-height: 1.5;
		margin: 0;
		font-size: 0.9rem;
	}

	.feature-card ul {
		margin: 0.5rem 0 0 0;
		padding-left: 1.25rem;
	}

	.feature-card li {
		color: var(--text-secondary);
		line-height: 1.5;
		margin-bottom: 0.25rem;
		font-size: 0.85rem;
	}

	.use-cases {
		margin-bottom: 4rem;
	}

	.use-case-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1rem;
	}

	.use-case-card {
		background: linear-gradient(135deg, var(--background-secondary) 0%, var(--background-tertiary) 100%);
		padding: 1.5rem;
		border-radius: 12px;
		border: 1px solid var(--border-color);
	}

	.use-case-card h3 {
		font-size: 1.25rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
	}

	.use-case-card p {
		color: var(--text-secondary);
		line-height: 1.5;
		margin-bottom: 0.75rem;
		font-size: 0.95rem;
	}

	.learn-more {
		color: var(--accent-primary);
		font-weight: 500;
		transition: color 0.2s ease;
		font-size: 0.9rem;
	}

	.learn-more:hover {
		color: var(--accent-secondary);
	}

	.cta {
		text-align: center;
		background: linear-gradient(135deg, var(--background-secondary) 0%, var(--background-primary) 100%);
		padding: 3rem 2rem;
		border-radius: 16px;
		margin-bottom: 2rem;
		border: 1px solid var(--border-color);
	}

	.cta h2 {
		font-size: 2rem;
		font-weight: 700;
		color: var(--text-primary);
		margin-bottom: 0.75rem;
	}

	.cta p {
		font-size: 1.1rem;
		color: var(--text-secondary);
		margin-bottom: 2rem;
	}

	.cta-buttons {
		display: flex;
		gap: 1rem;
		justify-content: center;
		flex-wrap: wrap;
	}

	.cta .button {
		background-color: var(--accent-primary);
		color: white;
		padding: 1rem 2rem;
		font-size: 1.1rem;
	}

	.cta .button:hover {
		background-color: var(--accent-secondary);
	}

	.cta .discord {
		background-color: var(--background-secondary);
		color: var(--text-primary);
		border: 2px solid var(--border-color);
	}

	.cta .discord:hover {
		background-color: var(--background-tertiary);
		border-color: var(--accent-primary);
	}

	@media (max-width: 768px) {
		.hero-title {
			font-size: 2.5rem;
		}

		.hero-avatar {
			width: 100px;
			height: 100px;
		}

		.section-title {
			font-size: 2rem;
		}

		.cta h2 {
			font-size: 2rem;
		}

		.cta p {
			font-size: 1rem;
		}

		.use-case-grid {
			grid-template-columns: 1fr;
		}
	}
</style>