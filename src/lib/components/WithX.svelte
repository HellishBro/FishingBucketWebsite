<script lang="ts">
	import { X } from "@lucide/svelte";
	import type { Snippet } from "svelte";

    let {
        onclick,
        children
    }: {
        onclick: () => void,
        children: Snippet
    } = $props();
</script>

<div class="xable-container">
    <div>
        {@render children()}
    </div>
    <button class="neutered-button small-button x-button" {onclick}>
        <X></X>
    </button>
</div>

<style>
    .xable-container {
        position: relative;
        height: min-content;
    }

    .x-button {
        background-color: transparent;
        position: absolute;
        right: 1em;
        top: 25%;
        padding: 0;
        margin: 0;
        width: 1em;
        color: var(--accent-danger);
    }
</style>