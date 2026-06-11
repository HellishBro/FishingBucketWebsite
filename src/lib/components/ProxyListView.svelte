<script lang="ts">
	import { Eye, EyeClosed } from '@lucide/svelte';
	import { get_effective_avatar_url, type Proxy, type ProxyGroup } from '$lib/models.svelte';
	import type { ProxyGroupCollection } from '$lib/components/DashBoard.svelte';
	import { get_id_string } from '$lib/models.svelte';

	let {
		target,
		groups
	}: {
		target: (thing: Proxy | ProxyGroup | null, type: 'proxy' | 'group' | null) => void;
		groups: ProxyGroupCollection[];
	} = $props();
</script>

<div
	style="display: flex; gap: 10px; flex-direction: column; border-radius: 10px; box-sizing: border-box;"
>
	{#each groups as group (group.group?.id)}
		<div class="group">
			<div class="group-name">
				<button
					onclick={(e) => {
						e.stopPropagation();
						group.expanded = !group.expanded;
					}}
					class="small-button"
				>
					{#if group.expanded}
						<Eye></Eye>
					{:else}
						<EyeClosed></EyeClosed>
					{/if}
				</button>
				<button
					class="group-info small-button"
					onclick={(e) => {
						e.stopPropagation();
						if (group.group) {
							target(group.group, 'group');
						} else {
							target(null, null);
						}
					}}
				>
					<p style="flex-grow: 1; text-align: left; margin: 0;">
						{group.group ? group.group.name : 'Ungrouped'}
					</p>
					{#if group.group}
						<p style="margin: 0 10px 0 auto; text-align: right;">
							ID: <span class="monospace">{get_id_string(group.group.id)}</span>
						</p>
					{/if}
				</button>
			</div>
			{#if group.expanded}
				<div class="group-inside">
					{#each group.proxies as proxy (proxy.id)}
						<button
							class="proxy"
							onclick={(e) => {
								e.stopPropagation();
								target(proxy, 'proxy');
							}}
						>
							<img
								src={get_effective_avatar_url(proxy)}
								alt="Proxy avatar"
								class="avatar"
								style="width: 80px; height: 80px; display: block;"
							/>
							<div style="flex-grow: 1; display: flex; flex-direction: column; text-align: left;">
								<div style="display: flex; position: relative;">
									<div class="hover-fade" style="flex-grow: 1; text-align: left; margin: 0;">
										<p class="fade-original-text">
											{proxy.effective_name}
										</p>
										<p class="fade-new-text">
											{proxy.name}
										</p>
									</div>
									<p style="margin: 0 10px 0 auto; text-align: right;">
										ID: <span class="monospace">{get_id_string(proxy.id)}</span>
									</p>
								</div>
								<div style="width: 100%; overflow: hidden; flex-wrap: nowrap;">
									<div style="display: flex; gap: 5px;">
										<!-- eslint-disable-next-line svelte/require-each-key -->
										{#each proxy.triggers.slice(0, 3) as trigger}
											<p class="monospace trigger">{trigger}</p>
										{/each}
									</div>
								</div>
							</div>
						</button>
					{/each}
				</div>
			{/if}
		</div>
	{/each}
</div>

<style>
	.group {
		background-color: var(--background-secondary);
		border-radius: 10px;
		padding: 10px;
		width: auto;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.group-inside {
		width: auto;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.group-name {
		display: grid;
		grid-template-columns: min-content auto;
		grid-template-rows: auto;
		gap: 0.5rem;
	}

	.group-info {
		background-color: transparent;
	}

	.proxy {
		background-color: var(--background-secondary-alt);
		border-radius: 10px;
		padding: 10px;
		width: auto;
		display: flex;
		gap: 20px;
	}

	.trigger {
		display: inline-block;
		background-color: var(--background-tertiary);
		border-radius: 5px;
		padding: 0 2px;
	}

	.small-button {
		padding: 5px;
	}

	.fade-original-text {
		margin: 0;
		transition: opacity 0.2s ease;
		position: absolute;
		top: 0;
		left: 0;
	}

	.fade-new-text {
		margin: 0;
		transition: opacity 0.2s ease;
		position: absolute;
		top: 0;
		left: 0;
		opacity: 0;
	}

	.hover-fade {
		position: relative;
		mix-blend-mode: lighten;
		width: min-content;
	}

	.hover-fade:hover .fade-original-text {
		opacity: 0;
	}

	.hover-fade:hover .fade-new-text {
		opacity: 1;
	}
</style>
