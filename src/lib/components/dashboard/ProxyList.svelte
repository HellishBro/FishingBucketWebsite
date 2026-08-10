<script lang="ts">
    import { CircleChevronRight as Chevron } from "@lucide/svelte";
	import { type ID, type ProxyTag, type Proxy } from "$lib/models.svelte";
	import type { Target, UserData } from "./DashBoard.svelte";
	import ProxyItem from "./ProxyItem.svelte";
	import { apply_query_proxy, type QuerySettings } from "./query";
	import { slide } from "svelte/transition";

    let {
        user_data,
        target,
        current_target,
        query
    }: {
        user_data: UserData,
        target: (target: Target) => void,
        current_target: Target,
        query: QuerySettings<Proxy>
    } = $props();

    function get_tag(tag: ID): ProxyTag {
		return user_data.tags.find(t => t.id == tag)!;
	}

    function get_proxy(proxy: ID): Proxy {
        return user_data.proxies.find(p => p.id == proxy)!;
    }

    let processed_proxy_groups = $derived(apply_query_proxy(user_data.proxies, query));
</script>

{#snippet proxies_list(items: Proxy[])}
    {#each items as proxy, index2 (index2)}
        <ProxyItem {proxy} {get_tag} onclick={(proxy: Proxy) => {
            target({
                type: 'proxy',
                data: get_proxy(proxy.id)
            })
        }} {current_target}></ProxyItem>
    {/each}
{/snippet}

<div class="proxy-list">
    {#each processed_proxy_groups as group, index (index)}
        {#if group.group_info.type == null}
            {@render proxies_list(group.items)}
        {:else}
            <div class="group">
                {let field_visible = $state(true)}
                <div class="group-title">
                    <button class="neutered-button expand-button" class:collapsed={field_visible} onclick={() => {
                        field_visible = !field_visible;
                    }}>
                        <Chevron></Chevron>
                    </button>
                    <button class="neutered-button" onclick={() => {
                        if (group.group_info.type == "tag") {
                            target({
                                type: "tag",
                                data: get_tag(group.group_info.tag)
                            });
                        }
                    }}>
                        {#if group.group_info.type == "tag"}
                            {get_tag(group.group_info.tag).name}
                        {:else if group.group_info.type == "tags"}
                            {group.group_info.tags.map(t => get_tag(t).name).join(", ")}
                        {:else if group.group_info.type == "first_letter"}
                            {group.group_info.letter.toLocaleUpperCase()}
                        {/if}
                    </button>
                </div>
                <span class="h-bar"></span>
                {#if field_visible}
                    <div class="group-items" transition:slide>
                        {@render proxies_list(group.items)}
                    </div>
                {/if}
            </div>
        {/if}
    {/each}
</div>

<style>
    .proxy-list {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .group {
        display: flex;
        flex-direction: column;
        gap: 10px;
        border-radius: 10px;
        background-color: var(--background-primary);
        padding: 10px;
    }

    .group-items {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .expand-button {
        rotate: 0deg;
        transition: ease 0.25s rotate;
    }

    .collapsed {
        rotate: 90deg;
    }
</style>