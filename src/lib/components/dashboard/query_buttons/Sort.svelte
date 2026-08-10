<script lang="ts">
	import Dialog, { Button, Level } from "$lib/components/Dialog.svelte";
	import type { Proxy, ProxyTag } from "$lib/models.svelte";
	import { ArrowDownWideNarrow } from "@lucide/svelte";
	import { SORT_BY_PROXY, SortOrder, SortStringCountBy, type QuerySettings, type SortSettings, type SortString } from "../query";

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

    let open_proxies_sort: () => void = $state()!;
    let open_tags_sort: () => void = $state()!;

    let proxy_sort_settings: SortSettings<Proxy> = $state()!;
    let tag_sort_settings: SortSettings<ProxyTag> = $state()!;
    
    function copy<T>(t: T): T {
        return JSON.parse(JSON.stringify(t));
    }
    
    function make_copy() {
        proxy_sort_settings = queries.proxies.sort ? copy(queries.proxies.sort) : {
            type: "id",
            sort: {
                order: SortOrder.ASCENDING
            }
        };
        tag_sort_settings = queries.tags.sort ? copy(queries.tags.sort) : {
            type: "id",
            sort: {
                order: SortOrder.ASCENDING
            }
        };
    }
</script>

<Dialog
    title="Sort proxies"
    level={Level.INFO}
    buttons={[
        [Button.CANCEL, (self, close) => {
            close();
        }],
        [Button.RESET, () => {
            proxy_sort_settings = {
                type: 'id',
                sort: {
                    order: SortOrder.ASCENDING
                }
            };
        }],
        [Button.OK, (self, close) => {
            close();
            queries.proxies.sort = proxy_sort_settings;
        }]
    ]}
    bind:open={open_proxies_sort}
>
    <label for="sort-proxies">Sort By:</label>
    <select id="sort-proxies" name="sort-proxies" bind:value={
        () => proxy_sort_settings.type,
        (v: keyof typeof SORT_BY_PROXY) => {
            proxy_sort_settings.type = v;
            let kind = SORT_BY_PROXY[v][1];
            switch (kind) {
                case "string":
                    proxy_sort_settings.sort = {
                        order: SortOrder.ASCENDING,
                        count_by: SortStringCountBy.ALPHABET
                    };
                    break;
                default:
                    proxy_sort_settings.sort = {
                        order: SortOrder.ASCENDING
                    };
            }
        }
    }>
        {#each Object.entries(SORT_BY_PROXY) as [key, [name]], index (index)}
            <option value={key}>{name}</option>
        {/each}
    </select>
    {let kind = $derived(SORT_BY_PROXY[proxy_sort_settings.type][1])}

    {#if kind == 'list'}
        <label for="sort-proxies-order">Order Length By:</label>
    {:else}
        <label for="sort-proxies-order">Order By:</label>
    {/if}
    <select id="sort-proxies-order" name="sort-proxies-order" bind:value={proxy_sort_settings.sort.order}>
        <option value={SortOrder.ASCENDING}>Ascending</option>
        <option value={SortOrder.DESCENDING}>Descending</option>
    </select>

    {#if kind == 'string'}
        <label for="sort-proxies-count-by">Counting:</label>
        <select id="sort-proxies-count-by" name="sort-proxies-count-by" bind:value={(proxy_sort_settings.sort as SortString).count_by}>
            <option value={SortStringCountBy.ALPHABET}>Alphabetically</option>
            <option value={SortStringCountBy.LENGTH}>Length-wise</option>
        </select>
    {/if}
</Dialog>

<Dialog
    title="Group tags"
    level={Level.INFO}
    buttons={[
        [Button.CANCEL, (self, close) => {
            close();
        }],
        [Button.RESET, () => {
            tag_sort_settings = {
                type: 'id',
                sort: {
                    order: SortOrder.ASCENDING
                }
            };
        }],
        [Button.OK, (self, close) => {
            close();
            queries.tags.sort = tag_sort_settings;
        }]
    ]}
    bind:open={open_tags_sort}
>
    <label for="sort-proxies">Sort By:</label>
    <select id="sort-proxies" name="sort-proxies" bind:value={
        () => proxy_sort_settings.type,
        (v: keyof typeof SORT_BY_PROXY) => {
            proxy_sort_settings.type = v;
            let kind = SORT_BY_PROXY[v][1];
            switch (kind) {
                case "string":
                    proxy_sort_settings.sort = {
                        order: SortOrder.ASCENDING,
                        count_by: SortStringCountBy.ALPHABET
                    };
                    break;
                default:
                    proxy_sort_settings.sort = {
                        order: SortOrder.ASCENDING
                    };
            }
        }
    }>
        {#each Object.entries(SORT_BY_PROXY) as [key, [name]], index (index)}
            <option value={key}>{name}</option>
        {/each}
    </select>
    {let kind = SORT_BY_PROXY[proxy_sort_settings.type][1]}

    {#if kind == 'list'}
        <label for="sort-proxies-order">Order Length By:</label>
    {:else}
        <label for="sort-proxies-order">Order By:</label>
    {/if}
    <select id="sort-proxies-order" name="sort-proxies-order" bind:value={proxy_sort_settings.sort.order}>
        <option value={SortOrder.ASCENDING}>Ascending</option>
        <option value={SortOrder.DESCENDING}>Descending</option>
    </select>

    {#if kind == 'string'}
        <label for="sort-proxies-count-by">Counting:</label>
        <select id="sort-proxies-count-by" name="sort-proxies-count-by" bind:value={(proxy_sort_settings.sort as SortString).count_by}>
            <option value={SortStringCountBy.ALPHABET}>Alphabetically</option>
            <option value={SortStringCountBy.LENGTH}>Length-wise</option>
        </select>
    {/if}
</Dialog>

<button class="small-button gray-button" onclick={() => {
    make_copy();
    if (current_tab == 'proxies') {
        open_proxies_sort();
    } else {
        open_tags_sort();
    }
}} aria-label="group">
	<ArrowDownWideNarrow></ArrowDownWideNarrow>
</button>