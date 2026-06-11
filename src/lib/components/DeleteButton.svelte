<script lang="ts">
	import { shake } from '$lib/frontend_lib';
	import type { Snippet } from 'svelte';

	let {
		confirm_text,
		button_text,
		delete_function,
		prefix,
		class: class_ = []
	}: {
		confirm_text: string,
		button_text: string,
		delete_function: () => void,
		prefix: Snippet,
		class?: string[]
	} = $props();

	let delete_confirmation = $state(false);
	let delete_button: HTMLElement = $state(null)!;
	let timeout_id: number = $state(null)!;

	export function reset() {
		if (timeout_id) {
			clearTimeout(timeout_id);
		}
		delete_confirmation = false;
	}

	$effect(() => {
		return () => {
			if (timeout_id) {
				clearTimeout(timeout_id);
			}
		};
	});
</script>

<button
	class={[...class_, "dangerous-button"]}
	style="flex-grow: 1; display: flex; align-items: center; justify-content: center;"
	onclick={e => {
		e.stopPropagation();

		if (delete_confirmation) {
			delete_function();
			reset();
			return;
		}
		shake(delete_button);
		delete_confirmation = true;
		// @ts-expect-error uses browser setTimeout instead of node setTimeout
		timeout_id = setTimeout(() => {
			if (delete_confirmation) {
				delete_confirmation = false;
				shake(delete_button);
			}
		}, 15000);
	}}
	bind:this={delete_button}
>
	{@render prefix()}
	{#if delete_confirmation}
		{confirm_text}
	{:else}
		{button_text}
	{/if}
</button>