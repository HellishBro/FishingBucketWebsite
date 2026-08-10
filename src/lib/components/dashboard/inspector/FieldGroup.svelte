<script lang="ts">
    import { CircleChevronRight as Chevron } from "@lucide/svelte";
	import type { Snippet } from "svelte";
	import { slide } from "svelte/transition";

    let {
        title,
        children
    }: {
        title: string,
        children: Snippet
    } = $props();

    let field_visible = $state(true);
</script>

<div class="field-group">
    <button class="neutered-button field-group-title" onclick={() => {
        field_visible = !field_visible;
    }}>
        <span class="button neutered-button expand-button" class:collapsed={field_visible}>
            <Chevron></Chevron>
        </span>
        <span>{title}</span>
    </button>
    <span class="h-bar"></span>
    {#if field_visible}
        <div class="field-group-item" transition:slide>
            {@render children()}
        </div>
    {/if}
</div>

<style>
    .field-group {
        display: flex;
        flex-direction: column;
        gap: 10px;
        border-radius: 10px;
        background-color: var(--background-secondary);
        padding: 10px;
    }

    .field-group-title {
        display: flex;
        gap: 10px;
        align-items: center;
        color: var(--text-primary);
        justify-content: left;
        padding: 0;
    }

    .field-group-item {
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