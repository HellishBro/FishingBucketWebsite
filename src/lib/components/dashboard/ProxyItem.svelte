<script lang="ts">
	import { as_normalized_proxy, get_id_string, id_equals, type ID, type Proxy, type ProxyTag } from "$lib/models.svelte";
	import type { Target } from "./DashBoard.svelte";

    let {
        proxy,
        get_tag,
        onclick,
        current_target
    }: {
        proxy: Proxy,
        get_tag: (tag: ID) => ProxyTag,
        onclick: (proxy: Proxy) => void,
        current_target: Target
    } = $props();

    let normalized = $derived(as_normalized_proxy(proxy));
</script>

<button class="proxy-item" aria-label={normalized.effective_name} onclick={() => onclick(proxy)} class:selected={
    current_target.type == 'proxy' && id_equals(current_target.data.id, proxy.id)
}>
    <img src={normalized.avatar_url} alt="proxy avatar" class="avatar">
    <div class="proxy-info">
        <h2>{normalized.effective_name}</h2>
        <h2 class="id monospace">{get_id_string(normalized.id)}</h2>
        <div class="tags-list">
            <!-- eslint-disable svelte/require-each-key -->
            {#each normalized.tags as tag}
                <span class="tag">{get_tag(tag).name}</span>
            {/each}
        </div>
    </div>
</button>

<style>
    .proxy-item {
        width: 100%;
        background: var(--background-secondary-alt);
        display: flex;
        justify-content: left;
        padding: 10px;
        gap: 10px;
        transition: ease 0.5s background;
    }

    .selected {
        background: var(--background-tertiary);
    }

    .avatar {
        aspect-ratio: 1;
        height: 3em;
    }

    .proxy-info {
        display: flex;
        flex-direction: column;
        gap: 5px;
        align-items: flex-start;
        position: relative;
        flex-grow: 1;
    }

    .proxy-info h2 {
        font-size: 1em;
        margin: 0;
    }

    .id {
        position: absolute;
        top: 0;
        right: 0;
    }

    .tags-list {
        display: flex;
        gap: 5px;
        flex-wrap: wrap;
    }

    .tag {
        padding: 2px 5px;
        background: var(--background-tertiary);
        border-radius: 5px;
        border-color: var(--background-primary);
        border-width: 2px;
        border-style: solid;
        flex: 0 0 auto;
    }
</style>