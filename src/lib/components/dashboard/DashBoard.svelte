<script module lang="ts">
	import { as_normalized_proxy, type Proxy, type ProxyTag } from '$lib/models.svelte';

	export type Target = {
		type: 'proxy';
		data: Proxy
	} | {
		type: 'tag';
		data: ProxyTag
	} | {
		type: null;
		data: undefined
	};

	export interface UserData {
		proxies: Proxy[];
		tags: ProxyTag[]
	};
</script>

<script lang="ts">
	import type { User } from '$lib/user';
	import {
		BatchEdit,
		DeleteProxyEdit,
		DeleteProxyTagEdit,
		EditProxyFieldEdit,
		EditProxyTagFieldEdit,
		EphemeralID,
		get_random_avatar,
		type ID,
		id_equals,
		type IEdit,
		NewProxyEdit,
		NewProxyTagEdit
	} from '$lib/models.svelte';
	import { onMount } from 'svelte';
	import { type ApiError, get, post } from '$lib/api';
	import ProxyList from './ProxyList.svelte';
	import Inspector from './inspector/Inspector.svelte';
	import TagList from './TagList.svelte';
	import { DEFAULT_PROXY_QUERIES, DEFAULT_TAG_QUERIES, type QuerySettings } from './query';
	import Filter from './query_buttons/Filter.svelte';
	import GroupBy from './query_buttons/GroupBy.svelte';
	import Sort from './query_buttons/Sort.svelte';
	import { Plus, RotateCcw, Save } from '@lucide/svelte';

	let {
		auth,
		user
	}: {
		auth: string;
		user: User;
	} = $props();

	let edits: IEdit[] = $state([]);
	let next_ephemeral_id: number = $state(1);

	let current_target: Target = $state({
		type: null,
		data: undefined
	});
	let current_tab: 'proxies' | 'tags' = $state('proxies');

	let user_data: UserData = $state({
		proxies: [],
		tags: []
	});

	let queries: {
		proxies: QuerySettings<Proxy>;
		tags: QuerySettings<ProxyTag>
	} = $state({
		proxies: {...DEFAULT_PROXY_QUERIES},
		tags: {...DEFAULT_TAG_QUERIES}
	});

	function target(target: Target) {
		error = null;
		if (
			current_target.type == target.type && id_equals(current_target.data?.id, target.data?.id)
		) {
			return;
		}

		if (current_target.type == 'proxy') {
			normalize_proxy(current_target.data);
		}

		current_target = target;
	}

	function normalize_proxy(proxy: Proxy) {
		let normalized = as_normalized_proxy(proxy);
		proxy.triggers = normalized.triggers;
		proxy.tags = normalized.tags;
		proxy.forms = normalized.forms;
	}

	function reset_target() {
		target({
			type: null,
			data: undefined
		})
	}

	function delete_proxy(proxy: Proxy) {
		if (current_target.type == 'proxy' && current_target.data.id == proxy.id) {
			reset_target();
		}
		
		user_data.proxies.splice(user_data.proxies.findIndex(p => p.id == proxy.id), 1);
		add_edit(new DeleteProxyEdit(proxy.id));
	}

	function delete_tag(tag: ProxyTag) {
		if (current_target.type == 'tag' && current_target.data.id == tag.id) {
			reset_target();
		}

		user_data.tags.splice(user_data.tags.findIndex(t => t.id == tag.id), 1);
		add_edit(new DeleteProxyTagEdit(tag.id));

		for (let proxy of user_data.proxies) {
			if (proxy.tags.includes(tag.id)) {
				set_proxy_tags(proxy, proxy.tags.filter(t => t != tag.id));
			}
		}
	}

	function set_proxy_tags(proxy: Proxy, tags: ID[]) {
		proxy.tags = tags;
		add_edit(new EditProxyFieldEdit(proxy.id, 'tags', tags));
	}

	let error: ApiError | null = $state(null);

	async function populate_data() {
		let { error: error_proxies, body: proxies_response } = await get<Proxy[]>('/proxies', auth);
		let { error: error_tags, body: tags_response } = await get<ProxyTag[]>('/tags', auth);

		if (proxies_response && tags_response) {
			user_data.proxies = proxies_response;
			user_data.tags = tags_response;
		} else {
			error = (error_proxies || error_tags)!;
			return;
		}

		reset_target();

		console.log(user_data);
	}

	function add_edit(edit: IEdit) {
		if (edit instanceof EditProxyFieldEdit || edit instanceof EditProxyTagFieldEdit) {
			const previous = edits.findIndex((e: IEdit) => {
				if (e instanceof EditProxyFieldEdit || e instanceof EditProxyTagFieldEdit) {
					return (
						e.edit_type == edit.edit_type &&
						id_equals(e.id, (edit as EditProxyFieldEdit | EditProxyTagFieldEdit).id) &&
						e.field == (edit as EditProxyFieldEdit | EditProxyTagFieldEdit).field
					);
				}
			});
			if (previous != -1) {
				edits.splice(previous, 1);
			}
		} else if (edit instanceof DeleteProxyEdit || edit instanceof DeleteProxyTagEdit) {
			let i = edits.length;
			while (i--) {
				if (
					((e: IEdit) => {
						if (edit instanceof DeleteProxyEdit) {
							if (e instanceof NewProxyEdit && id_equals(e.proxy.id, edit.proxy_id)) return true;
							if (e instanceof EditProxyFieldEdit && id_equals(e.id, edit.proxy_id)) return true;
						}
						if (edit instanceof DeleteProxyTagEdit) {
							if (e instanceof NewProxyTagEdit && id_equals(e.tag.id, edit.tag_id))
								return true;
							if (e instanceof EditProxyTagFieldEdit && id_equals(e.id, edit.tag_id))
								return true;
						}
						return false;
					})(edits[i])
				) {
					edits.splice(i, 1);
				}
			}
			if (edit instanceof DeleteProxyTagEdit && typeof edit.tag_id != 'number') {
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
			description: '',
			avatar_url: get_random_avatar(),
			triggers: ['new: {}'],
			owner: user.user.id,
			times_used: 0,
			creation_date: Date.now() / 1000,
			nickname: '',
			effective_name: 'New Proxy',
			forms: {},
			current_form: '',
			pronouns: '',
			tags: []
		} as Proxy;

		user_data.proxies.push(proxy);

		target({
			type: 'proxy',
			data: proxy
		});
		add_edit(new NewProxyEdit(proxy));
	}

	function new_tag() {
		const id = {
			index: next_ephemeral_id
		} as EphemeralID;
		next_ephemeral_id++;

		const tag = {
			id: id,
			name: 'New Tag',
			description: '',
			owner: user.user.id,
			creation_date: Date.now() / 1000,
			tag: ''
		} as ProxyTag;

		user_data.tags.push(tag);

		target({
			type: 'tag',
			data: tag
		});
		add_edit(new NewProxyTagEdit(tag));
	}

	async function save() {
		let json = $state.snapshot(new BatchEdit(edits).toJSON());
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		let { error: e, body } = await post('/edit', json, auth);
		if (e) {
			error = e;
			return;
		}
		await populate_data();
		edits.splice(0, edits.length);
		next_ephemeral_id = 1;
	}

	onMount(async () => {
		reset_target();
		await populate_data();
	});
</script>

<div class="container">
	<div class="actionbar">
		<button class="small-button" onclick={() => {
			new_proxy();
		}} aria-label="new proxy">
			<Plus></Plus> Proxy
		</button>
		<button class="small-button" onclick={() => {
			new_tag();
		}} aria-label="new tag">
			<Plus></Plus> Tag
		</button>
		<button class="small-button yellow-button" onclick={async () => {
			await save();
		}} aria-label="save">
			<Save></Save> Save
		</button>
		<button class="small-button dangerous-button" onclick={async () => {
			reset_target();
			await populate_data();
		}} aria-label="refresh">
			<RotateCcw></RotateCcw> Refresh
		</button>
		<div class="right">
			<Filter bind:queries {current_tab}></Filter>
			<GroupBy bind:queries {current_tab}></GroupBy>
			<Sort bind:queries {current_tab}></Sort>
		</div>
	</div>
	<div class="bulk">
		{#if error}
			<p>Error: {error.message} ({error.error_code})</p>
		{:else}
			<div class="section">
				<div class="proxy-or-tag">
					<button disabled={current_tab == 'proxies'} onclick={() => {
						current_tab = 'proxies';
					}}>
						Proxies
					</button>
					<button disabled={current_tab == 'tags'} onclick={() => {
						current_tab = 'tags';
					}}>
						Tags
					</button>
				</div>
				{#if current_tab == 'proxies'}
					<ProxyList {user_data} {target} {current_target} query={queries.proxies}></ProxyList>
				{:else}
					<TagList {user_data} {target} {current_target} query={queries.tags}></TagList>
				{/if}
			</div>
			<div class="section">
				<Inspector {current_target} {target} {add_edit} {delete_proxy} {delete_tag} {user_data}></Inspector>
			</div>
		{/if}
	</div>
</div>

<style>
	.container {
		background: var(--background-secondary);
		width: 100%;
		height: auto;
		padding: 10px;
		border-radius: 5px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.right {
		margin-left: auto;
	}

	.actionbar {
		display: flex;
		gap: 5px;
	}

	.bulk {
		display: grid;
		gap: 10px;
		grid-template-columns: 40% 1fr;
	}

	.section {
		height: 100%;
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	.proxy-or-tag {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 5px;
	}
</style>
