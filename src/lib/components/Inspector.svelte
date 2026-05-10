<script lang="ts">
	import { ExternalLink, Plus, Trash } from '@lucide/svelte';
	import {
		DeleteProxyEdit,
		EditProxyFieldEdit, EditProxyGroupFieldEdit,
		get_effective_avatar_url, get_id_string,
		get_random_avatar, type ID, id_equals,
		type IEdit,
		type Proxy,
		type ProxyGroup
	} from '$lib/models.svelte';
	import DeleteButton from '$lib/components/DeleteButton.svelte';
	import type { ProxyGroupCollection } from '$lib/components/DashBoard.svelte';

	let {
		current_target_type,
		current_target_proxy = $bindable(),
		current_target_group = $bindable(),
		delete_proxy,
		ungroup_group,
		delete_group,
		set_proxy_group,
		groups,
		add_edit
	}: {
		current_target_type: "group" | "proxy" | null,
		current_target_proxy: Proxy,
		current_target_group: ProxyGroup,
		delete_proxy: (proxy: Proxy) => void,
		ungroup_group: (group: ProxyGroup) => void,
		delete_group: (group: ProxyGroup) => void,
		set_proxy_group: (proxy: Proxy, group: ID | null) => void,
		groups: ProxyGroupCollection[],
		add_edit: (edit: IEdit) => void
	} = $props();

	function update_proxy_triggers() {
		add_edit(new EditProxyFieldEdit(current_target_proxy.id, "triggers", current_target_proxy.triggers));
	}

	function update_proxy_forms() {
		add_edit(new EditProxyFieldEdit(current_target_proxy.id, "forms", current_target_proxy.forms));
	}

	const current_form_facade = {
		get current_form() { return current_target_proxy.current_form; },
		set current_form(v) {
			current_target_proxy.current_form = v;
			add_edit(new EditProxyFieldEdit(current_target_proxy.id, "current_form", v));
		}
	}
</script>

{#snippet trash_button()}
	<Trash></Trash>
{/snippet}

{#if current_target_type === "proxy"}
	<div class="inspector-row" style="gap: 20px;">
		<h2>Display:</h2>
		<img class="avatar" src="{get_effective_avatar_url(current_target_proxy)}" style="width: 80px; height: 80px;" alt="Proxy avatar">
		<div style="display: flex; flex-direction: column; gap: 5px">
			<h2 style="font-size: 2em; margin: 0">{current_target_proxy.effective_name}</h2>
			<p style="font-size: 1.25em; margin: 0">{current_target_proxy.name}</p>
		</div>
	</div>
	<div class="inspector-row">
		<button onclick={() => {
			navigator.clipboard.writeText(get_id_string(current_target_proxy.id));
		}}>
			Copy Proxy ID:
			<span class="monospace">{get_id_string(current_target_proxy.id)}</span>
		</button>
	</div>
	<div class="inspector-row">
		<label for="proxy-name">Proxy Name:</label>
		<input bind:value={
			() => current_target_proxy.name,
			(v) => {
				add_edit(new EditProxyFieldEdit(current_target_proxy.id, "name", v));
				current_target_proxy.name = v;
			}
		} name="proxy-name" placeholder="Proxy name goes here...">
	</div>
	<div class="inspector-row">
		<label for="proxy-nickname">Proxy Nickname:</label>
		<input bind:value={
			() => current_target_proxy.nickname,
			(v) => {
				add_edit(new EditProxyFieldEdit(current_target_proxy.id, "nickname", v));
				current_target_proxy.nickname = v;
			}
		} name="proxy-nickname" placeholder="Proxy nickname goes here...">
	</div>
	<div class="inspector-row">
		<label for="proxy-avatar">Proxy Avatar URL:</label>
		<img src={current_target_proxy.avatar_url} style="width: 40px; height: 40px;" alt="Proxy Avatar" class="avatar">
		<input bind:value={
			() => current_target_proxy.avatar_url,
			(v) => {
				add_edit(new EditProxyFieldEdit(current_target_proxy.id, "avatar_url", v));
				current_target_proxy.avatar_url = v;
			}
		} placeholder="Proxy avatar URL goes here..." type="url">
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
		<a href={current_target_proxy.avatar_url} target="_blank" class="button"><ExternalLink></ExternalLink></a>
	</div>
	<div class="inspector-row">
		<label for="proxy-group">Proxy Group:</label>
		<select name="proxy-group" bind:value={
			() => current_target_proxy.group,
			(v) => {
				set_proxy_group(current_target_proxy, v);
				add_edit(new EditProxyFieldEdit(current_target_proxy.id, "group", v));
			}
		}>
			{#each groups as g_group (g_group.group?.id ?? null)}
				<option value={g_group.group?.id ?? null}>{g_group.group?.name ?? "Ungrouped"}</option>
			{/each}
		</select>
	</div>
	<div class="inspector-row" style="flex-direction: column; text-align: left; align-items: flex-start;">
		<label for="proxy-triggers">Proxy Triggers:</label>
		<div style="flex-grow: 1; display: flex; flex-direction: row; flex-wrap: wrap; gap: 5px;">
			<!-- eslint-disable-next-line svelte/require-each-key @typescript-eslint/no-unused-vars -->
			{#each current_target_proxy.triggers as _, index}
				<div style="position: relative;">
					<input bind:value={
						() => current_target_proxy.triggers[index],
						(v) => {
							current_target_proxy.triggers[index] = v;
							update_proxy_triggers();
						}
					} placeholder="new{index}: {'{}'}" style="position: relative;">
					<button class="x-button" onclick={() => {
						current_target_proxy.triggers.splice(index, 1);
						update_proxy_triggers();
					}}>x</button>
				</div>
			{/each}
		</div>
		<button style="flex-shrink: 0;" onclick={() => {
			current_target_proxy.triggers.push(`new${current_target_proxy.triggers.length ? current_target_proxy.triggers.length + 1 : ''}: {}`);
			update_proxy_triggers();
		}}><Plus></Plus></button>
	</div>
	<div class="inspector-row" style="flex-direction: column; text-align: left; align-items: flex-start;">
		<label for="proxy-forms">Proxy Forms:</label>
		<div style="flex-grow: 1; display: flex; flex-direction: column; flex-wrap: wrap; width: 100%;">
			<!-- eslint-disable-next-line svelte/require-each-key -->
			{#each Object.entries(current_target_proxy.forms) as [ form_name, form_url ]}
				<div style="position: relative; display: flex; gap: 10px; align-items: center; width: 100%;">
					<input type="radio" style="flex-grow: 0;" name="proxy-form-radio-group" bind:group={current_form_facade.current_form} value={form_name}>

					<div style="position: relative; display: flex;">
						<input bind:value={
							() => form_name,
							(v) => {
								delete current_target_proxy.forms[form_name];
								current_target_proxy.forms[v] = form_url;
								update_proxy_forms();
							}
						} style="position: relative; flex-grow: 0;" placeholder="Proxy form name goes here...">
						<button class="x-button" onclick={() => {
								delete current_target_proxy.forms[form_name];
								update_proxy_forms();
							}}>x</button>
					</div>
					<p>=</p>
					<img src={form_url} style="width: 40px; height: 40px;" alt="Proxy Form Avatar" class="avatar">
					<input bind:value={
						() => current_target_proxy.forms[form_name],
						(v) => {
							current_target_proxy.forms[form_name] = v;
							update_proxy_forms();
						}
					} placeholder="Proxy form avatar URL goes here..." type="url" style="flex-grow: 1;">
					<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
					<a href={form_url} target="_blank" class="button"><ExternalLink></ExternalLink></a>
				</div>
			{/each}
		</div>
		<div style="display: flex; flex-direction: row; gap: 10px;">
			<button style="flex-shrink: 0;" onclick={() => {
				current_target_proxy.forms[`new${Object.keys(current_target_proxy.forms).length + 1}`] = get_random_avatar();
				update_proxy_forms();
			}}><Plus></Plus></button>
			<button style="flex-shrink: 0;" onclick={() => {
				current_target_proxy.current_form = null;
				current_form_facade.current_form = null;
			}}>Reset current form</button>
		</div>
	</div>
	<div class="inspector-row" style="gap: 20px;">
		<h2>Metadata:</h2>
		<div style="display: flex; flex-direction: column;">
			<h2 style="margin: 2px 0;">Date Created</h2>
			<p style="margin: 2px 0;">{new Intl.DateTimeFormat().format(new Date(current_target_proxy.creation_date * 1000))}</p>
		</div>
		<div style="display: flex; flex-direction: column;">
			<h2 style="margin: 2px 0;">Messages Sent</h2>
			<p style="margin: 2px 0;">{current_target_proxy.times_used}</p>
		</div>
	</div>
	<div class="inspector-row">
		<label for="proxy-description">Proxy Description:</label>
		<textarea bind:value={
			() => current_target_proxy.description,
			(v) => {
				current_target_proxy.description = v;
				add_edit(new EditProxyFieldEdit(current_target_proxy.id, "description", v));
			}
		} name="proxy-description" placeholder="Proxy description goes here..."></textarea>
	</div>
	<div class="inspector-row">
		<DeleteButton
			button_text="Delete"
			confirm_text="Deletion is unrecoverable; really delete?"
			delete_function={() => {
				add_edit(new DeleteProxyEdit(current_target_proxy.id));
				delete_proxy(current_target_proxy);
			}}
			prefix={trash_button}
		></DeleteButton>
	</div>
{:else if current_target_type === "group"}
	<div class="inspector-row" style="gap: 20px;">
		<h2 style="font-size: 2em;">{current_target_group.name}</h2>
	</div>
	<div class="inspector-row">
		<button onclick={() => {
	  	navigator.clipboard.writeText(get_id_string(current_target_group.id));
	  }}>
			Copy Group ID:
			<span class="monospace">{get_id_string(current_target_group.id)}</span>
		</button>
	</div>
	<div class="inspector-row">
		<label for="group-name">Group Name:</label>
		<input bind:value={
			() => current_target_group.name,
			(v) => {
				add_edit(new EditProxyGroupFieldEdit(current_target_group.id, "name", v));
				current_target_group.name = v;
			}
		} name="group-name" placeholder="Group name goes here...">
	</div>
	<div class="inspector-row">
		<label for="group-tag">Group Tag:</label>
		<input bind:value={
			() => current_target_group.tag,
			(v) => {
				add_edit(new EditProxyGroupFieldEdit(current_target_group.id, "tag", v));
				current_target_group.tag = v;
			}
		} name="group-tag" placeholder="Group tag goes here...">
	</div>
	<div class="inspector-row">
		<label for="group-parent">Group Parent:</label>
		<select name="group-parent" bind:value={
				() => current_target_group.parent,
				(v) => {
					current_target_group.parent = v;
					add_edit(new EditProxyGroupFieldEdit(current_target_group.id, "parent", v));
				}
			}>
			{#each groups as g_group (g_group.group?.id ?? null)}
				{#if !id_equals((g_group.group?.id ?? null), current_target_group.id)}
					<option value={g_group.group?.id ?? null}>{g_group.group?.name ?? "N/A"}</option>
				{/if}
			{/each}
		</select>
	</div>
	<div class="inspector-row" style="gap: 20px;">
		<h2>Metadata:</h2>
		<div style="display: flex; flex-direction: column;">
			<h2 style="margin: 2px 0;">Date Created</h2>
			<p style="margin: 2px 0;">{new Intl.DateTimeFormat().format(new Date(current_target_group.creation_date * 1000))}</p>
		</div>
	</div>
	<div class="inspector-row">
		<label for="group-description">Group Description:</label>
		<textarea bind:value={
			() => current_target_group.description,
			(v) => {
				add_edit(new EditProxyGroupFieldEdit(current_target_group.id, "description", v));
				current_target_group.description = v;
			}
		} name="group-description" placeholder="Group description goes here..."></textarea>
	</div>
	<div class="inspector-row">
		<DeleteButton
			button_text="Ungroup"
			confirm_text="Ungrouping is unrecoverable; really ungroup?"
			delete_function={() => ungroup_group(current_target_group)}
			prefix={trash_button}
		></DeleteButton>
	</div>
	<div class="inspector-row">
		<DeleteButton
			button_text="Delete all including children"
			confirm_text="Deletion is unrecoverable, and all contained proxies will also be deleted; really delete?"
			delete_function={() => delete_group(current_target_group)}
			prefix={trash_button}
		></DeleteButton>
	</div>
{:else}
	<h2 style="font-size: 2em;">
		Select a proxy or group to see and edit its properties!
	</h2>
{/if}

<style>
    .inspector-row {
        width: 100%;
        display: flex;
        gap: 10px;
        align-items: center;
    }

    .inspector-row input, .inspector-row textarea {
        flex-grow: 1;
    }

    .x-button {
        background-color: transparent;
        position: absolute;
        right: 5px;
        color: var(--accent-danger);
    }
</style>