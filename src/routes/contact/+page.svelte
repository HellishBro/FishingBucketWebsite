<script lang="ts">
	import { default as config } from "$lib/config.json";
	import FluxerIcon from "$lib/components/FluxerIcon.svelte";
	import DiscordIcon from "$lib/components/DiscordIcon.svelte";
	import { Mail, Users, Copy, Check } from "@lucide/svelte";

	let fluxerCopied = $state(false);
	let discordCopied = $state(false);

	async function copyToClipboard(text: string, type: 'fluxer' | 'discord') {
		await navigator.clipboard.writeText(text);
		if (type === 'fluxer') {
			fluxerCopied = true;
			setTimeout(() => fluxerCopied = false, 2000);
		} else {
			discordCopied = true;
			setTimeout(() => discordCopied = false, 2000);
		}
	}
</script>

<svelte:head>
	<title>Contact Us | Fishing Bucket</title>
	<meta name="description" content="Contact the Fishing Bucket team for support, inquiries, or appeals" />
</svelte:head>

<div class="contact-page">
	<div class="page-header">
		<h1>Contact Us</h1>
		<p class="page-subtitle">Inquiries? Concerns? Appeals? Need to talk to someone? Contact us here!</p>
		<div class="header-actions">
			<a class="button primary-button" href="https://discord.gg/yPJAg4ytaJ" target="_blank" rel="noopener noreferrer">
				<DiscordIcon></DiscordIcon> Contact Us
			</a>
			<a class="button secondary-button" href="{config.hq_server_invite}" target="_blank" rel="noopener noreferrer">
				<FluxerIcon></FluxerIcon> Join Support Community
			</a>
		</div>
	</div>

	<div class="contact-content">
		<section class="team-section">
			<h2>Fishing Bucket Administration Team</h2>
			<p>
				The administration team oversees everything that goes on with Fishing Bucket.
				They handle moderation, appeals, and community, ensuring the well-being of the infrastructure.
			</p>
			
			<div class="team-member">
				<div class="member-header">
					<div class="member-avatar">
						<Users></Users>
					</div>
					<div class="member-info">
						<h3>Sarah Tempest</h3>
						<p class="member-role">Lead Developer & Administrator</p>
					</div>
				</div>
				<div class="member-bio">
					<p>
						Hello! It is I, Sarah, currently the only admin of Fishing Bucket!
						I am currently the sole developer and maintainer of Fishing Bucket, but I hope that will change soon!
						You can contact me at my email, or shoot me a message on Fluxer!
					</p>
					<p>
						<strong>Tip:</strong> Make sure to read through <a href="https://nohello.net/" target="_blank" rel="noopener noreferrer">No Hello</a> when contacting me about issues with these services.
					</p>
				</div>
				<div class="member-contact">
				    <a class="button secondary-button" href="mailto:thetempestsunite@proton.me">
						<Mail></Mail> Send Email
					</a>
					<button class="contact-username fluxer" onclick={() => copyToClipboard('@hellishbro#0001', 'fluxer')}>
						<FluxerIcon></FluxerIcon> @hellishbro#0001
						{#if fluxerCopied}
							<Check></Check>
						{:else}
							<Copy></Copy>
						{/if}
					</button>
					<button class="contact-username discord" onclick={() => copyToClipboard('hellishbro.', 'discord')}>
						<DiscordIcon></DiscordIcon> hellishbro.
						{#if discordCopied}
							<Check></Check>
						{:else}
							<Copy></Copy>
						{/if}
					</button>
				</div>
			</div>
		</section>
	</div>
</div>

<style>
	.contact-page {
		max-width: 900px;
		margin: 0 auto;
	}

	.page-header {
		text-align: center;
		margin-bottom: 3rem;
		padding: 3rem 2rem;
		background: linear-gradient(135deg, var(--background-secondary) 0%, var(--background-primary) 100%);
		border-radius: 12px;
		border: 1px solid var(--border-color);
	}

	.page-header h1 {
		font-size: 2.5rem;
		font-weight: 700;
		margin-bottom: 0.75rem;
	}

	.page-subtitle {
		color: var(--text-secondary);
		font-size: 1.1rem;
		margin-bottom: 2rem;
		line-height: 1.6;
	}

	.header-actions {
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

	.secondary-button {
		background-color: var(--background-secondary);
		color: var(--text-primary);
		border: 2px solid var(--border-color);
		padding: 0.75rem 1.5rem;
		font-size: 1rem;
	}

	.secondary-button:hover {
		background-color: var(--background-tertiary);
		border-color: var(--accent-primary);
	}

	.contact-content {
		display: flex;
		flex-direction: column;
		gap: 3rem;
	}

	.team-section h2 {
		font-size: 2rem;
		font-weight: 700;
		margin-bottom: 1rem;
	}

	.team-section > p {
		color: var(--text-secondary);
		line-height: 1.7;
		margin-bottom: 2rem;
	}

	.team-member {
		background-color: var(--background-secondary);
		padding: 2rem;
		border-radius: 12px;
		border: 1px solid var(--border-color);
	}

	.member-header {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		margin-bottom: 1.5rem;
	}

	.member-avatar {
		width: 64px;
		height: 64px;
		background-color: var(--accent-primary);
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		flex-shrink: 0;
	}

	.member-info h3 {
		font-size: 1.5rem;
		font-weight: 600;
		margin-bottom: 0.25rem;
	}

	.member-role {
		color: var(--text-secondary);
		font-size: 0.9rem;
		margin: 0;
	}

	.member-bio {
		margin-bottom: 1.5rem;
	}

	.member-bio p {
		color: var(--text-secondary);
		line-height: 1.7;
		margin-bottom: 1rem;
	}

	.member-contact {
		display: flex;
		gap: 1rem;
		align-items: center;
		flex-wrap: wrap;
	}

	.contact-username {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.25rem;
		background-color: var(--background-tertiary);
		border-radius: 8px;
		font-weight: 500;
		cursor: pointer;
		border: 1px solid var(--border-color);
	}

	.contact-username:hover {
		background-color: var(--background-secondary);
		border-color: var(--accent-primary);
	}

	.contact-username.fluxer {
		color: var(--accent-primary);
	}

	.contact-username.discord {
		color: #5865F2;
	}

	@media (max-width: 768px) {
		.page-header {
			padding: 2rem 1.5rem;
		}

		.page-header h1 {
			font-size: 2rem;
		}

		.page-subtitle {
			font-size: 1rem;
		}

		.member-header {
			flex-direction: column;
			text-align: center;
		}
	}
</style>

