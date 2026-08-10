<script lang="ts">
	import Dialog, { Button, Level } from "$lib/components/Dialog.svelte";
	import type { Proxy, ProxyTag } from "$lib/models.svelte";
	import { Boxes } from "@lucide/svelte";
	import { GroupBySettingsProxy, GroupBySettingsTag, type GroupBySettings, type QuerySettings } from "../query";

        let {
        queries = $bindable(),
        current_tab
    }: {
        queries: {
		    proxies: QuerySettings<Proxy>;
            tags: QuerySettings<ProxyTag>
        },
        current_tab: 'proxies' | 'tags'
    } = $props();

    let open_proxies_group: () => void = $state()!;
    let open_tags_group: () => void = $state()!;

    let proxy_group_settings: GroupBySettings<Proxy> = $state()!;
    let tag_group_settings: GroupBySettings<ProxyTag> = $state()!;
    
    function make_copy() {
        proxy_group_settings = queries.proxies.group_by ?? GroupBySettingsProxy.NONE;
        tag_group_settings = queries.tags.group_by ?? GroupBySettingsTag.NONE;
    }
</script>

<Dialog
    title="Group proxies"
    level={Level.INFO}
    buttons={[
        [Button.CANCEL, (self, close) => {
            close();
        }],
        [Button.RESET, () => {
            proxy_group_settings = GroupBySettingsProxy.FIRST_TAG;
        }],
        [Button.OK, (self, close) => {
            close();
            queries.proxies.group_by = proxy_group_settings;
        }]
    ]}
    bind:open={open_proxies_group}
>
    <label for="group-proxies">Group By:</label>
    <select id="group-proxies" name="group-proxies" bind:value={proxy_group_settings}>
        <option value={GroupBySettingsProxy.NONE}>None</option>
        <option value={GroupBySettingsProxy.FIRST_TAG}>First Tag</option>
        <option value={GroupBySettingsProxy.ALL_TAGS}>All Tags</option>
        <option value={GroupBySettingsProxy.FIRST_LETTER}>First Letter</option>
    </select>
</Dialog>

<Dialog
    title="Group tags"
    level={Level.INFO}
    buttons={[
        [Button.CANCEL, (self, close) => {
            close();
        }],
        [Button.RESET, () => {
            tag_group_settings = GroupBySettingsTag.NONE;
        }],
        [Button.OK, (self, close) => {
            close();
            queries.tags.group_by = tag_group_settings;
        }]
    ]}
    bind:open={open_tags_group}
>
    <label for="group-tags">Group By:</label>
    <select id="group-tags" name="group-tags" bind:value={tag_group_settings}>
        <option value={GroupBySettingsTag.NONE}>None</option>
        <option value={GroupBySettingsTag.FIRST_LETTER}>First Letter</option>
    </select>
</Dialog>

<button class="small-button gray-button" onclick={() => {
    make_copy();
    if (current_tab == 'proxies') {
        open_proxies_group();
    } else {
        open_tags_group();
    }
}} aria-label="group">
	<Boxes></Boxes>
</button>