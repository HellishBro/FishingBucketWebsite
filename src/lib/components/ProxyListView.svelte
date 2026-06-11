<script lang="ts">
	import { Eye, EyeClosed } from '@lucide/svelte';
	import { get_effective_avatar_url, type Proxy, type ProxyGroup } from '$lib/models.svelte';
	import type { ProxyGroupCollection } from '$lib/components/DashBoard.svelte';
	import { get_id_string } from '$lib/models.svelte';

	let {
		target, groups
	}: {
		target: (thing: Proxy | ProxyGroup | null, type: "proxy" | "group" | null) => void,
		groups: ProxyGroupCollection[]
	} = $props();
</script>

<div style="display: flex; gap: 10px; flex-direction: column; overflow-y: auto; border-radius: 10px;">
	{#each groups as group (group.group?.id)}
		<div class="group">
			<div class="group-name">
				<button onclick={e => {
					e.stopPropagation();
					group.expanded = !group.expanded;
				}}>
					{#if group.expanded}
						<Eye></Eye>
					{:else}
						<EyeClosed></EyeClosed>
					{/if}
				</button>
				<button class="group-info" onclick={e => {
					e.stopPropagation();
					if (group.group) {
						target(group.group, "group");
					} else {
						target(null, null);
					}
				}}>
					<h2 style="flex-grow: 1; text-align: left; margin: 0;">{group.group ? group.group.name : "Ungrouped"}</h2>
					{#if group.group}
						<p style="margin: 0 10px 0 auto; text-align: right;">ID: <span class="monospace">{get_id_string(group.group.id)}</span></p>
					{/if}
				</button>
			</div>
			{#if group.expanded}
				<div class="group-inside">
					{#each group.proxies as proxy (proxy.id)}
						<button class="proxy" onclick={e => {
							e.stopPropagation();
							target(proxy, "proxy");
						}}>
							<img src="{get_effective_avatar_url(proxy)}" alt="Proxy avatar" class="avatar" style="width: 80px; height: 80px; display: block;">
							<div style="flex-grow: 1; display: flex; flex-direction: column; text-align: left;">
								<div style="display: flex;">
									<h2 style="flex-grow: 1; text-align: left; margin: 0;">{proxy.effective_name}</h2>
									<p style="margin: 0 10px 0 auto; text-align: right;">ID: <span class="monospace">{get_id_string(proxy.id)}</span></p>
								</div>
								<p style="margin: 0;">{proxy.name}</p>
								<div style="width: 100%; overflow: hidden; flex-wrap: nowrap;">
									<div style="overflow-x: auto;">
										<!-- eslint-disable-next-line svelte/require-each-key -->
										{#each proxy.triggers as trigger}
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
        display: flex;
    }

    .group-info {
        display: flex;
        background-color: transparent;
        flex-grow: 1;
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
        padding: 2px 5px;
        margin: 5px 0;
        overflow: hidden;
    }
</style>