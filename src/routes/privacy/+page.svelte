<svelte:head>
	<title>Privacy Policy | Fishing Bucket</title>
</svelte:head>

<div class="wrap-scrollable-container">
	<div style="text-align: center; width: 100%;">
		<h1>Privacy Policy</h1>
	</div>

	<div class="cards" style="margin-top: 25px;">
		<div class="card">
			<h2>Prelude</h2>
			<p>
				This document is the privacy policy for the Fishing Bucket Fluxer bot and website (both referred to as "services" in this document).
				I am not a lawyer, but this document should suffice. I will not bore you with legal terms.
				<br>
				Any updates to this policy will be announced in the Fluxer community. All changes will be effective immediately.
				If you are reading this privacy policy, this document is already in effect.
				<br>
				By using these services, you, the user, acknowledge and agree to the information laid out by this document.
			</p>
		</div>

		<div class="card">
			<h2>Data Collection</h2>
			<p style="margin-bottom: 0">
				Fishing Bucket will collect the following information even without the user registering with the services:
			</p>
			<ul style="margin-top: 0;">
				<li>Fluxer IDs, such as message IDs, user IDs, community IDs, channel IDs, and webhook IDs;</li>
				<li>Community settings, such as proxy permissions, logging channels, and any additional information that the community moderators have set;</li>
				<li>
					Ephemeral, anonymous data (boolean values representing if the action was done) about command usage or interactions with the Fluxer bot,
					which only lasts until the bot restarts.
				</li>
			</ul>
			<p style="margin-bottom: 0">
				By registering with the services (by creating proxies or proxy groups), the services will collect the following information:
			</p>
			<ul style="margin-top: 0;">
				<li>The user's ID;</li>
				<li>Any data explicitly passed into the forms or commands.</li>
			</ul>
			<p>
				Note: message content, age-restricted data, channel names, use cases, et cetera are not collected. You can rest easy :)
			</p>
		</div>

		<div class="card">
			<h2>Data Collection (Website)</h2>
			<p>
				The website collects additional information about the user: Fluxer OAuth data and the session to connect with the Fishing Bucket API.
				Session data are stored in LocalStorage instead of cookies. The website does not use any cookies.
				<br>
				No analytics, trackers, or ads will be used.
			</p>
		</div>

		<div class="card">
			<h2>Data Use</h2>
			<p style="margin-bottom: 0">Data is used by these services to fulfill Fishing Bucket's functions:</p>
			<ul style="margin-top: 0">
				<li>Proxies are used for the integral part of the service, and that is message proxying;</li>
				<li>Proxy groups for organization;</li>
				<li>User preferences on data visibility to other users, as well as dice environments;</li>
				<li>Message IDs are linked to the proxy that made it for moderation and inspect purposes;</li>
				<li>Community settings are stored, including permissions, moderation, and community-wide dice environments;</li>
				<li>Authenticating users with the website.</li>
			</ul>
		</div>

		<div class="card">
			<h2>Data Storage</h2>
			<p>
				Data is stored locally on a <abbr title="Virtual Private Server">VPS</abbr> provided by Contabo GmbH.
				Data is kept indefinitely until the user deletes it, or administrative actions are required to access, modify, or delete user data;
				however, the latter will not be done without the user's knowledge.
				Data is secured via access control on the VPS.
				<br>
				No system is 100% secure! Fishing Bucket does not guarantee that your data is not accessed by an external malicious actor.
				If such an event did happen, users will be notified as soon as possible.
				To avoid such an event, the VPS is secured to the best of its abilities.
			</p>
		</div>

		<div class="card">
			<h2>Data Sharing</h2>
			<p>
				Your data will not leave the VPS. Fishing Bucket will not sell nor rent its collected data.
				However, data will be shared to Fluxer for the bot to function in the form of command responses, and for legal compliance if necessary.
				<br>
				Additionally, other users may view a user's proxies. However, the extent in which what they could view is dictated by the user's privacy settings.
				By default, every field is set to public.
			</p>
		</div>

		<div class="card">
			<h2>User Rights</h2>
			<p>
				Users can access, modify, delete, and restrict their data by interacting with these services.
			</p>
		</div>

		<div class="card">
			<h2>Data Deletion</h2>
			<p>
				Data will not be automatically deleted. Users can delete their own data by interacting with these services.
				<br>
				A removal (kick, ban, or voluntary leave) from a Fluxer community will not automatically remove your affiliations with the community.
				That means, the stored message IDs, permissions, et cetera will persist.
				This is required to preserve the integrity of the message history, for moderation or otherwise.
				<br>
				The user must contact the administrators of these services to delete such data.
			</p>
		</div>

		<div class="card">
			<h2>Age</h2>
			<p>
				These services are not for users who are not legally allowed to be on Fluxer. In most cases, this restricts the age of access to be not below 13 years of age.
			</p>
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

