<script>
	import { default as config } from "$lib/config.json";
	import FluxerIcon from "$lib/components/FluxerIcon.svelte";
	import { Mail } from "@lucide/svelte";
</script>

<svelte:head>
	<title>Contact Us | Fishing Bucket</title>
</svelte:head>

<!-- eslint-disable svelte/no-navigation-without-resolve -->

<div class="wrap-scrollable-container">
	<div style="text-align: center; width: 100%;">
		<h1>Contact Us</h1>
		<p>
			Inquiries? Concerns? Appeals? Need to talk to someone? Contact us here!
		</p>
		<div style="height: auto; gap: 5px;">
			<a class="button" href="{config.hq_server_invite}" style="font-size: 1.25em; display: inline-flex; gap: 5px;">
				<FluxerIcon></FluxerIcon> Join Support Community
			</a>
		</div>
	</div>

	<div class="cards" style="margin-top: 25px;">
		<div class="card">
			<h1>Fishing Bucket Administration Team</h1>
			<p>
				The administration team oversees everything that goes on with Fishing Bucket.
				They handle moderation, appeals, and community, ensuring the well-being of the infrastructure.
			</p>
			<div class="cards-nested" style="margin-top: 10px;">
				<div class="card">
					<h2>Sarah Tempest</h2>
					<p>
						Hello! It is I, Sarah, currently the only admin of Fishing Bucket!
						I am currently the sole developer and maintainer of Fishing Bucket, but I hope that will change soon!
						You can contact me at my email, or shoot me a message on Fluxer!
						<br>
						Make sure to read through <a href="https://nohello.net/">No Hello</a> when contacting me about issues with these services.
					</p>
					<div style="height: auto; gap: 5px;">
						<a class="button" href="mailto:thetempestsunite@proton.me" style="display: inline-flex; gap: 5px;">
							<Mail></Mail> E-mail
						</a>
						<div class="button fluxer-contact">
							<FluxerIcon></FluxerIcon> @hellishbro#0001
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
    p {
        text-indent: 1em each-line;
    }

    .cards {
        display: grid;
        grid-template-columns: 1fr;
        gap: 10px;
    }

    .card {
        box-sizing: border-box;
        background-color: var(--background-primary);
        border-radius: 10px;
        padding: 10px 20px;
    }

		.cards-nested .card {
				background-color: var(--background-secondary);
		}

    @media (min-aspect-ratio: 3/4) {
        .cards-nested {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
        }
    }

    @media (max-aspect-ratio: 3/4) {
        .cards-nested {
            display: grid;
            grid-template-columns: 1fr;
            gap: 10px;
        }
    }

		.fluxer-contact {
        display: inline-flex;
				gap: 5px;
				cursor: revert;
		}

		.fluxer-contact:hover {
				background-color: var(--accent-primary);
		}
</style>

