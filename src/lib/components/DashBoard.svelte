<script module lang="ts">
	export interface ProxyGroupCollection {
		group: ProxyGroup | null;
		expanded: boolean;
		proxies: Proxy[];
	}
</script>

<script lang="ts">
	import { Plus, Save, RotateCcw } from '@lucide/svelte';
	import type { FluxerUser } from '$lib/user';
	import {
		BatchEdit,
		DeleteProxyEdit,
		DeleteProxyGroupEdit,
		EditProxyFieldEdit,
		EditProxyGroupFieldEdit,
		EphemeralID,
		get_random_avatar,
		type ID,
		id_equals,
		type IEdit,
		NewProxyEdit,
		NewProxyGroupEdit,
		type Proxy,
		type ProxyGroup
	} from '$lib/models.svelte';
	import ProxyListView from '$lib/components/ProxyListView.svelte';
	import Inspector from '$lib/components/Inspector.svelte';
	import { onMount } from 'svelte';
	import { type ApiError, get, post } from '$lib/api';
	import DeleteButton from '$lib/components/DeleteButton.svelte';

	let {
		auth,
		user
	}: {
		auth: string;
		user: FluxerUser;
	} = $props();

	let edits: IEdit[] = $state([]);
	let next_ephemeral_id: number = $state(1);

	let current_target_proxy: Proxy = $state(null)!;
	let current_target_group: ProxyGroup = $state(null)!;
	let current_target_type: 'group' | 'proxy' | null = $state(null);

	let save_confirmation = $state(false);

	function target(thing: Proxy | ProxyGroup | null, type: 'group' | 'proxy' | null) {
		save_confirmation = false;
		error = null;
		if (
			current_target_type == type &&
			thing &&
			(id_equals(current_target_group?.id ?? null, thing.id) ||
				id_equals(current_target_proxy?.id ?? null, thing.id))
		) {
			return;
		}
		if (type == 'group') {
			current_target_group = thing as ProxyGroup;
			current_target_proxy = null!;
		} else if (type == 'proxy') {
			current_target_group = null!;
			current_target_proxy = thing as Proxy;
		} else {
			current_target_proxy = null!;
			current_target_group = null!;
		}
		current_target_type = type;
	}

	let groups: ProxyGroupCollection[] = $state([]);

	function delete_proxy(proxy: Proxy) {
		if (current_target_proxy && id_equals(current_target_proxy.id, proxy.id)) {
			target(null, null);
		}

		for (let group of groups) {
			let idx = group.proxies.findIndex((p) => id_equals(p.id, proxy.id));
			if (idx != -1) {
				group.proxies.splice(idx, 1);
				return;
			}
		}
	}

	function ungroup_group(group: ProxyGroup) {
		if (current_target_group && id_equals(current_target_group.id, group.id)) {
			target(null, null);
		}

		let ungrouped_group = groups.findIndex((v) => v.group == null);

		let index = 0;
		for (let g of groups) {
			if (id_equals(g.group?.id ?? null, group.id)) {
				for (let proxy of g.proxies) {
					proxy.group = null;
					add_edit(new EditProxyFieldEdit(proxy.id, 'group', null));
					groups[ungrouped_group].proxies.push(proxy);
				}
				add_edit(new DeleteProxyGroupEdit(group.id));
				groups.splice(index, 1);
				return;
			}
			index++;
		}
	}

	function delete_group(group: ProxyGroup) {
		if (id_equals(current_target_group?.id ?? null, group.id)) {
			target(null, null);
		}

		let index = 0;
		for (let g of groups) {
			if (id_equals(g.group?.id ?? null, group.id)) {
				for (let proxy of g.proxies) {
					proxy.group = null;
					add_edit(new DeleteProxyEdit(proxy.id));
				}
				add_edit(new DeleteProxyGroupEdit(group.id));
				groups.splice(index, 1);
				return;
			}
			index++;
		}
	}

	function set_proxy_group(proxy: Proxy, group: ID | null) {
		for (let group of groups) {
			let idx = group.proxies.findIndex((p) => id_equals(p.id, proxy.id));
			if (idx != -1) {
				group.proxies.splice(idx, 1);
				break;
			}
		}

		proxy.group = group;

		for (let g of groups) {
			if (id_equals(g.group?.id ?? null, group)) {
				g.proxies.push(proxy);
				return;
			}
		}
	}

	let error: ApiError | null = $state(null);

	async function populate_data() {
		let { error: error_proxies, body: proxies_response } = await get<Proxy[]>('/proxies', auth);
		let { error: error_groups, body: groups_response } = await get<ProxyGroup[]>('/groups', auth);

		if (error_proxies || error_groups) {
			error = (error_proxies || error_groups)!;
			return;
		}

		groups = (groups_response! as (ProxyGroup | null)[])
			.concat(null)
			.map((group: ProxyGroup | null) => {
				const proxies = proxies_response!.filter((v) => v.group == (group?.id ?? null));
				return {
					group: group,
					expanded:
						groups.find((v) => id_equals(v.group?.id ?? null, group?.id ?? null))?.expanded ?? true,
					proxies: proxies
				} as ProxyGroupCollection;
			});

		target(null, null);
	}

	function add_edit(edit: IEdit) {
		if (edit instanceof EditProxyFieldEdit || edit instanceof EditProxyGroupFieldEdit) {
			const previous = edits.findIndex((e: IEdit) => {
				if (e instanceof EditProxyFieldEdit || e instanceof EditProxyGroupFieldEdit) {
					return (
						e.edit_type == edit.edit_type &&
						id_equals(e.id, (edit as EditProxyFieldEdit | EditProxyGroupFieldEdit).id) &&
						e.field == (edit as EditProxyFieldEdit | EditProxyGroupFieldEdit).field
					);
				}
			});
			if (previous != -1) {
				edits.splice(previous, 1);
			}
		} else if (edit instanceof DeleteProxyEdit || edit instanceof DeleteProxyGroupEdit) {
			let i = edits.length;
			while (i--) {
				if (
					((e: IEdit) => {
						if (edit instanceof DeleteProxyEdit) {
							if (e instanceof NewProxyEdit && id_equals(e.proxy.id, edit.proxy_id)) return true;
							if (e instanceof EditProxyFieldEdit && id_equals(e.id, edit.proxy_id)) return true;
						}
						if (edit instanceof DeleteProxyGroupEdit) {
							if (e instanceof NewProxyGroupEdit && id_equals(e.group.id, edit.group_id))
								return true;
							if (e instanceof EditProxyGroupFieldEdit && id_equals(e.id, edit.group_id))
								return true;
						}
						return false;
					})(edits[i])
				) {
					edits.splice(i, 1);
				}
			}
			if (edit instanceof DeleteProxyGroupEdit && typeof edit.group_id != 'number') {
				edit = null!;
			}
			if (edit instanceof DeleteProxyEdit && typeof edit.proxy_id != 'number') {
				edit = null!;
			}
		}
		if (edit) edits.push(edit);
	}

	function new_proxy() {
		const id = {
			index: next_ephemeral_id
		} as EphemeralID;
		next_ephemeral_id++;

		const proxy = {
			id: id,
			name: 'New Proxy',
			description: null,
			avatar_url: get_random_avatar(),
			triggers: ['new: {}'],
			owner: user.id,
			times_used: 0,
			creation_date: Date.now() / 1000,
			group: null,
			nickname: null,
			effective_name: 'New Proxy',
			forms: {},
			current_form: null
		} as Proxy;

		const idx = groups.findIndex((g) => id_equals(g.group?.id ?? null, null));
		groups[idx].proxies.push(proxy);
		target(proxy, 'proxy');
		add_edit(new NewProxyEdit(proxy));
	}

	function new_group() {
		const id = {
			index: next_ephemeral_id
		} as EphemeralID;
		next_ephemeral_id++;

		const group = {
			id: id,
			name: 'New Group',
			description: null,
			owner: user.id,
			creation_date: Date.now() / 1000,
			tag: null,
			parent: null
		} as ProxyGroup;

		groups.splice(groups.length - 1, 0, {
			group: group,
			expanded: true,
			proxies: []
		} as ProxyGroupCollection);
		target(group, 'group');
		add_edit(new NewProxyGroupEdit(group));
	}

	async function save() {
		let json = $state.snapshot(new BatchEdit(edits).toJSON());
		let { error: e, body } = await post('/edit', json, auth);
		if (e) {
			error = e;
			return;
		}
		console.log(body); // idc i prolly dont use this here
		await populate_data();
		save_confirmation = true;
		edits.splice(0, edits.length);
		next_ephemeral_id = 1;
	}

	onMount(async () => {
		target(null, null);
		await populate_data();
	});
</script>

<div class="container">
	<div
		class="panel"
		style="display: flex; gap: 10px; flex-direction: column; box-sizing: content-box;"
		onclick={() => {
			target(null, null);
		}}
		onkeyup={(e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				target(null, null);
			}
		}}
		role="presentation"
	>
		<div style="display: flex; gap: 10px; flex-direction: row; box-sizing: border-box;">
			<button
				class="green-button small-button"
				onclick={(e) => {
					e.stopPropagation();
					new_proxy();
				}}><Plus></Plus> Proxy</button
			>
			<button
				class="green-button small-button"
				onclick={(e) => {
					e.stopPropagation();
					new_group();
				}}><Plus></Plus> Group</button
			>
			<div style="margin-left: auto;">
				<DeleteButton
					button_text="Reset & Fetch"
					confirm_text="Really reset?"
					delete_function={async () => {
						target(null, null);
						await populate_data();
						next_ephemeral_id = 1;
						edits.splice(0, edits.length);
					}}
					class={["small-button"]}
				>
					{#snippet prefix()}
						<RotateCcw></RotateCcw>
					{/snippet}
				</DeleteButton>
			</div>
			<button
				class="yellow-button small-button"
				onclick={async (e) => {
					e.stopPropagation();
					target(null, null);
					await save();
				}}><Save></Save> Save</button
			>
		</div>
		<ProxyListView {target} {groups}></ProxyListView>
	</div>
	<div class="panel">
		<div class="inspector">
			{#if error}
				<h2 style="font-size: 2em;">
					Error encountered ({error.error_code})
				</h2>
				<p>{error.message}</p>
			{:else if save_confirmation}
				<h2 style="font-size: 2em;">
					Your edits have been <span
						style="font-size: inherit; padding: 5px; background-color: var(--background-primary); border: var(--accent-warning) 2px solid; border-radius: 5px; color: var(--accent-warning);"
						>saved</span
					>.
				</h2>
			{:else}
				<Inspector
					bind:current_target_proxy
					bind:current_target_group
					{current_target_type}
					{delete_proxy}
					{ungroup_group}
					{delete_group}
					{set_proxy_group}
					{groups}
					{add_edit}
				></Inspector>
			{/if}
		</div>
	</div>
</div>

<style>
	.inspector {
		width: auto;
		height: 100%;
		margin: 0;
		padding: 0;
		border-radius: 10px;
		display: flex;
		flex-direction: column;
		gap: 10px;
		box-sizing: border-box;
	}

	.container {
		width: auto;
		height: auto;
		display: grid;
		grid-template-columns: 40% 1fr;
		gap: 10px;
		position: relative;
		box-sizing: border-box;
	}

	@media (min-aspect-ratio: 3/4) {
		.container {
			grid-template-columns: 40% 1fr;
		}
	}

	@media (max-aspect-ratio: 3/4) {
		.container {
			grid-template-columns: 1fr;
		}

		.panel {
			height: 100%;
		}
	}

	.panel {
		position: relative;
		background-color: var(--background-secondary-alt);
		border-radius: 10px;
		padding: 10px;
		max-height: 100%;
	}
</style>
