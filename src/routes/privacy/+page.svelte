<svelte:head>
	<title>Privacy Policy | Fishing Bucket</title>
	<meta name="description" content="Privacy Policy for Fishing Bucket Fluxer bot and website" />
</svelte:head>

<div class="legal-page">
	<div class="page-header">
		<h1>Privacy Policy</h1>
		<p class="last-updated">Last updated: June 3, 2025</p>
	</div>

	<div class="content-sections">
		<section class="content-section">
			<h2>Prelude</h2>
			<p>
				This document is the privacy policy for the Fishing Bucket Fluxer bot and website (both referred to as "services" in this document).
				I am not a lawyer, but this document should suffice. I will not bore you with legal terms.
			</p>
			<p>
				Any updates to this policy will be announced in the Fluxer community. All changes will be effective immediately.
				If you are reading this privacy policy, this document is already in effect.
			</p>
			<p>
				By using these services, you, the user, acknowledge and agree to the information laid out by this document.
			</p>
		</section>

		<section class="content-section">
			<h2>Data Collection</h2>
			<h3>Without Registration</h3>
			<p>Fishing Bucket will collect the following information even without the user registering with the services:</p>
			<ul>
				<li>Fluxer IDs, such as message IDs, user IDs, community IDs, channel IDs, and webhook IDs</li>
				<li>Community settings, such as proxy permissions, logging channels, and any additional information that the community moderators have set</li>
				<li>Ephemeral, anonymous data (boolean values representing if the action was done) about command usage or interactions with the Fluxer bot, which only lasts until the bot restarts</li>
			</ul>

			<h3>With Registration</h3>
			<p>By registering with the services (by creating proxies or proxy groups), the services will collect the following information:</p>
			<ul>
				<li>The user's ID</li>
				<li>Any data explicitly passed into the forms or commands</li>
			</ul>
			<p><strong>Note:</strong> message content, age-restricted data, channel names, use cases, et cetera are not collected. You can rest easy :)</p>
		</section>

		<section class="content-section">
			<h2>Data Collection (Website)</h2>
			<p>
				The website collects additional information about the user: Fluxer OAuth data and the session to connect with the Fishing Bucket API.
				Session data are stored in LocalStorage instead of cookies. The website does not use any cookies.
			</p>
			<p>No analytics, trackers, or ads will be used.</p>
		</section>

		<section class="content-section">
			<h2>Data Use</h2>
			<p>Data is used by these services to fulfill Fishing Bucket's functions:</p>
			<ul>
				<li>Proxies are used for the integral part of the service, and that is message proxying</li>
				<li>Proxy groups for organization</li>
				<li>User preferences on data visibility to other users, as well as dice environments</li>
				<li>Message IDs are linked to the proxy that made it for moderation and inspect purposes</li>
				<li>Community settings are stored, including permissions, moderation, and community-wide dice environments</li>
				<li>Authenticating users with the website</li>
			</ul>
		</section>

		<section class="content-section">
			<h2>Data Storage</h2>
			<p>
				Data is stored locally on a <abbr title="Virtual Private Server">VPS</abbr> provided by Contabo GmbH.
				Data is kept indefinitely until the user deletes it, or administrative actions are required to access, modify, or delete user data;
				however, the latter will not be done without the user's knowledge.
				Data is secured via access control on the VPS.
			</p>
			<p>
				No system is 100% secure! Fishing Bucket does not guarantee that your data is not accessed by an external malicious actor.
				If such an event did happen, users will be notified as soon as possible.
				To avoid such an event, the VPS is secured to the best of its abilities.
			</p>
		</section>

		<section class="content-section">
			<h2>Data Sharing</h2>
			<p>
				Your data will not leave the VPS. Fishing Bucket will not sell nor rent its collected data.
				However, data will be shared to Fluxer for the bot to function in the form of command responses, and for legal compliance if necessary.
			</p>
			<p>
				Additionally, other users may view a user's proxies. However, the extent in which what they could view is dictated by the user's privacy settings.
				By default, every field is set to public.
			</p>
		</section>

		<section class="content-section">
			<h2>User Rights</h2>
			<p>Users can access, modify, delete, and restrict their data by interacting with these services.</p>
		</section>

		<section class="content-section">
			<h2>Data Deletion</h2>
			<p>
				Data will not be automatically deleted. Users can delete their own data by interacting with these services.
			</p>
			<p>
				A removal (kick, ban, or voluntary leave) from a Fluxer community will not automatically remove your affiliations with the community.
				That means, the stored message IDs, permissions, et cetera will persist.
				This is required to preserve the integrity of the message history, for moderation or otherwise.
			</p>
			<p>The user must contact the administrators of these services to delete such data.</p>
		</section>

		<section class="content-section">
			<h2>Age Requirements</h2>
			<p>
				These services are not for users who are not legally allowed to be on Fluxer. In most cases, this restricts the age of access to be not below 13 years of age.
			</p>
		</section>
	</div>
</div>

<style>
	.legal-page {
		max-width: 900px;
		margin: 0 auto;
	}

	.page-header {
		text-align: center;
		margin-bottom: 3rem;
		padding: 2rem;
		background: linear-gradient(135deg, var(--background-secondary) 0%, var(--background-primary) 100%);
		border-radius: 12px;
		border: 1px solid var(--border-color);
	}

	.page-header h1 {
		font-size: 2.5rem;
		font-weight: 700;
		margin-bottom: 0.5rem;
	}

	.last-updated {
		color: var(--text-secondary);
		font-size: 0.9rem;
		margin: 0;
	}

	.content-sections {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.content-section {
		background-color: var(--background-secondary);
		padding: 2rem;
		border-radius: 12px;
		border: 1px solid var(--border-color);
	}

	.content-section h2 {
		font-size: 1.5rem;
		font-weight: 600;
		margin-bottom: 1rem;
		padding-bottom: 0.5rem;
		border-bottom: 2px solid var(--border-color);
	}

	.content-section h3 {
		font-size: 1.25rem;
		font-weight: 600;
		margin: 1.5rem 0 0.75rem 0;
		color: var(--accent-primary);
	}

	.content-section p {
		color: var(--text-secondary);
		line-height: 1.7;
		margin-bottom: 1rem;
	}

	.content-section ul {
		margin: 1rem 0;
		padding-left: 1.5rem;
	}

	.content-section li {
		color: var(--text-secondary);
		line-height: 1.7;
		margin-bottom: 0.5rem;
	}

	abbr {
		text-decoration: underline dotted;
		cursor: help;
	}

	@media (max-width: 768px) {
		.page-header {
			padding: 1.5rem;
		}

		.page-header h1 {
			font-size: 2rem;
		}

		.content-section {
			padding: 1.5rem;
		}

		.content-section h2 {
			font-size: 1.25rem;
		}
	}
</style>

