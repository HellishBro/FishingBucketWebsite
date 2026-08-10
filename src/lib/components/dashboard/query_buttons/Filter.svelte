<script lang="ts">
	import { Funnel, Plus } from "@lucide/svelte";
    import {FilterValidators, get_default_filter, make_number, PROXY_FILTER_FIELDS, TAG_FILTER_FIELDS, type FilterID, type FilterKind, type FilterList, type FilterNumeric, type FilterSettings, type FilterSettingsProxy, type FilterSettingsTag, type FilterString, type FilterTypes, type QuerySettings} from "../query";
    import {get_id_string, type Proxy, type ProxyTag} from "$lib/models.svelte";
	import Dialog, { Button, Level } from "$lib/components/Dialog.svelte";
	import WithX from "$lib/components/WithX.svelte";

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

    let open_proxies_filter: () => void = $state()!;
    let open_tags_filter: () => void = $state()!;

    let proxy_filter_settings: FilterSettings<Proxy> = $state()!;
    let tag_filter_settings: FilterSettings<ProxyTag> = $state()!;

    function copy<T>(t: T): T {
        return JSON.parse(JSON.stringify(t));
    }
    
    function make_copy() {
        proxy_filter_settings = queries.proxies.filter ? copy(queries.proxies.filter) : {};
        tag_filter_settings = queries.tags.filter ? copy(queries.tags.filter) : {};
    }

    function normalize<T extends { [key: string]: FilterTypes | FilterList<FilterTypes> | undefined }>(settings: T, key: {
        [key: string]: [string, FilterKind, ...FilterKind[]]
    }): Partial<T> {
        let res = {...settings};
        for (const [k, value] of Object.entries(settings)) {
            if (value) {
                let kind = key[k][1];
                let valid = true;
                if ('numeric' in value) {
                    valid = FilterValidators.numeric(kind, value);
                }
                if ('string' in value) {
                    valid = FilterValidators.string(kind, value);
                }
                if ('list' in value) {
                    valid = FilterValidators.list(key[k][2], value);
                }
                if (!valid) {
                    delete res[k];
                }
            }
        }
        return res;
    }
</script>

{#snippet filter_number(ty: FilterKind, i: number, f: FilterNumeric)}
    {#snippet input(name: string, bind: { get: () => number, set: (v: number) => void }, style = "")}
        {#if ty == 'numeric' || ty == 'id'}
            {let d: string | number = $state(ty == 'id' ? get_id_string(bind.get()) : bind.get())}
            <input id={name} {name} placeholder="number" bind:value={
                () => d,
                (v: number | string) => {
                    d = v;
                    let made = make_number(v);
                    if (made != undefined) {
                        bind.set(made);
                    }
                }
            } {style} class:error={make_number(d) == undefined}>
        {:else if ty == 'date'}
            <input id={name} {name} type="datetime-local" placeholder="time" bind:value={
                // https://stackoverflow.com/questions/30166338/setting-value-of-datetime-local-from-date
                () => new Date(
                        ((bind.get() ?? (Date.now() / 1000)) - new Date().getTimezoneOffset() * 60) * 1000
                    ).toISOString().slice(0, 19),
                (v: string) => bind.set(Date.parse(v) / 1000)
            } {style} class:error={typeof bind.get() != 'number'}>
        {/if}
    {/snippet}

    {let n = `number-${i}`}
    <label for={n}>Keep If:</label>
    <select id={n} name={n} bind:value={f.type}>
        <option value="range">In range ...</option>
        <option value=">">Greater than ...</option>
        <option value=">=">Greater than or equal to ...</option>
        <option value="<">Less than ...</option>
        <option value="<=">Less than or equal to ...</option>
        <option value="=">Equal to ...</option>
        <option value="!=">Not equal to ...</option>
    </select>
    {#if f.type == 'range'}
        {let n = `number-${i}-lower-bound`}
        <label for={n}>Lower Bound:</label>
        <div style="display: flex; gap: 5px; align-items: center;">
            {@render input(n, {
                get: () => f.lower,
                set: (v: number) => f.lower = v
            }, "flex-grow: 1;")}
            <label for={`${n}-include`}>Inclusive:</label>
            <input id={`${n}-include`} name={`${n}-include`} type="checkbox" bind:checked={
                () => !f.lower_exclusive,
                (v: boolean) => f.lower_exclusive = !v
            }>
        </div>
        {let n2 = `number-${i}-upper-bound`}
        <label for={n2}>Upper Bound:</label>
        <div style="display: flex; gap: 5px; align-items: center;">
            {@render input(n, {
                get: () => f.upper,
                set: (v: number) => f.upper = v
            }, "flex-grow: 1;")}
            <label for={`${n2}-include`}>Inclusive:</label>
            <input id={`${n2}-include`} name={`${n2}-include`} type="checkbox" bind:checked={
                () => !f.upper_exclusive,
                (v: boolean) => f.upper_exclusive = !v
            }>
        </div>
    {:else}
        {let n = `number-${i}-rhs`}
        <label for={n}>Compare To:</label>
        {@render input(n, {
            get: () => f.rhs,
            set: (v: number) => f.rhs = v
        })}
    {/if}
    {#if ty == 'id'}
        {let n = `id-${i}-ty`}
        <label for={n}>ID Type:</label>
        <select id={n} name={n} bind:value={(f as FilterID).ty}>
            <option value={undefined}>All</option>
            <option value="concrete">Concrete</option>
            <option value="ephemeral">Ephemeral</option>
        </select>
    {/if}
{/snippet}

{#snippet filter_string(i: number, f: FilterString)}
    {let n = `string-${i}`}
    <label for={n}>Keep If:</label>
    <select id={n} name={n} bind:value={
        () => f.type,
        (v: FilterString['type']) => {
            f.type = v;
            if (f.type == "length" && !f.length) {
                f.length = get_default_filter('numeric') as FilterNumeric;
            }
        }
    }>
        <option value="truthy">Contains content</option>
        <option value="falsy">Does not contain content</option>
        <option value="contains">Contains ...</option>
        <option value="startswith">Starts with ...</option>
        <option value="endswith">Ends with ...</option>
        <option value="length">Has length ...</option>
        <option value="regex">Tests regex ...</option>
    </select>
    {#if f.type == "contains" || f.type == "startswith" || f.type == "endswith"}
        {#if f.type == "contains"}
            {let n = `string-${i}-contains`}
            <label for={n}>Contains:</label>
            <input id={n} name={n} bind:value={f.contains} placeholder="text">
        {:else if f.type == "startswith"}
            {let n = `string-${i}-startswith`}
            <label for={n}>Starts With:</label>
            <input id={n} name={n} bind:value={f.startswith} placeholder="text">
        {:else if f.type == "endswith"}
            {let n = `string-${i}-endswith`}
            <label for={n}>Ends With:</label>
            <input id={n} name={n} bind:value={f.endswith} placeholder="text">
        {/if}
        {let n = `string-${i}-case-insensitive`}
        <label for={n}>Case Sensitive:</label>
        <input id={n} name={n} type="checkbox" bind:checked={f.case_sensitive}>
    {:else if f.type == "length"}
        {let n = `string-${i}-length`}
        <label for={n}>Length:</label>
        <div id={n} class="filtering subfilter">
            {@render filter_number('numeric', i, f.length)}
        </div>
    {:else if f.type == "regex"}
        {let n = `string-${i}-regex`}
        <label for={n}>Regex:</label>
        <input id={n} name={n} bind:value={f.regex} placeholder="^.*?text.*?$" class="monospace">
    {/if}
{/snippet}

{#snippet filter_list(ty: FilterKind, i: number, f: FilterList<FilterTypes>)}
    {let n = `list-${i}`}
    <label for={n}>Keep If:</label>
    <select id={n} name={n} bind:value={
        () => f.type,
        (v: FilterList<FilterTypes>['type']) => {
            f.type = v;
            if (f.type == "any" && !f.any) {
                f.any = get_default_filter(ty) as FilterTypes;
            }
            if (f.type == "all" && !f.all) {
                f.all = get_default_filter(ty) as FilterTypes;
            }
        }
    }>
        <option value="truthy">Contains items</option>
        <option value="falsy">Does not contain items</option>
        <option value="any">Any ...</option>
        <option value="all">All ...</option>
    </select>
    {#if f.type == "any"}
        {let n = `list-${i}-any`}
        <label for={n}>Condition:</label>
        <div id={n} class="filtering subfilter">
            {@render render_filter([ty], i, f.any)}
        </div>
    {:else if f.type == "all"}
        {let n = `list-${i}-all`}
        <label for={n}>Condition:</label>
        <div id={n} class="filtering subfilter">
            {@render render_filter([ty], i, f.all)}
        </div>
    {/if}
{/snippet}

{#snippet render_filter(type: FilterKind[], index: number, filter: FilterTypes | FilterList<FilterTypes>)}
    {#if 'string' in filter}
        {@render filter_string(index, filter)}
    {:else if 'numeric' in filter}
        {@render filter_number(type[0], index, filter)}
    {:else if 'list' in filter}
        {@render filter_list(type[1], index, filter)}
    {/if}
{/snippet}

<Dialog
    title="Filter proxies"
    level={Level.INFO}
    buttons={[
        [Button.CANCEL, (self, close) => {
            close();
        }],
        [Button.RESET, () => {
            proxy_filter_settings = {};
        }],
        [Button.OK, (self, close) => {
            close();
            // @ts-expect-error argument is ok
            queries.proxies.filter = normalize(proxy_filter_settings, PROXY_FILTER_FIELDS);
        }]
    ]}
    bind:open={open_proxies_filter}
>
    <div class="filters">
        {#each Object.entries(proxy_filter_settings) as entry, index (index)}
            {let key = $derived(entry[0] as keyof FilterSettingsProxy)}
            <div class="filter-element">
                <WithX onclick={() => {
                    delete proxy_filter_settings[key];
                }}>
                    <select name={`filter-${index}`} bind:value={
                        () => key,
                        (v) => {
                            proxy_filter_settings = Object.fromEntries(Object.entries(proxy_filter_settings).map(
                                ([k, v_], i) =>
                                    i == index
                                        ? [v, get_default_filter(PROXY_FILTER_FIELDS[v][1])]
                                        : [k, v_]
                            ));
                        }
                    }>
                        {#each Object.entries(PROXY_FILTER_FIELDS) as [possible_key, [display]], index (index)}
                            {#if !(possible_key in proxy_filter_settings && possible_key != key)}
                                <option value={possible_key}>{display}</option>
                            {/if}
                        {/each}
                    </select>
                </WithX>
                {#if key}
                    {let filter = $derived(entry[1] as (FilterTypes | FilterList<FilterTypes>))}
                    <div class="filtering">
                        <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
                        {let [_, ...type] = PROXY_FILTER_FIELDS[key]}
                        {@render render_filter(type, index, filter)}
                    </div>
                {/if}
            </div>
        {/each}
        <button onclick={() => {
            // @ts-expect-error '' is a sentinel key
            proxy_filter_settings[''] = {};
        }} disabled={Object.keys(proxy_filter_settings).length == Object.keys(PROXY_FILTER_FIELDS).length}><Plus></Plus></button>
    </div>
</Dialog>

<Dialog
    title="Filter tags"
    level={Level.INFO}
    buttons={[
        [Button.CANCEL, (self, close) => {
            close();
        }],
        [Button.RESET, () => {
            proxy_filter_settings = {};
        }],
        [Button.OK, (self, close) => {
            close();
            // @ts-expect-error argument is ok
            queries.tags.filter = normalize(tag_filter_settings);
        }]
    ]}
    bind:open={open_tags_filter}
>
    <div class="filters">
        {#each Object.entries(tag_filter_settings) as entry, index (index)}
            {let key = $derived(entry[0] as keyof FilterSettingsTag)}
            <div class="filter-element">
                <WithX onclick={() => {
                    delete tag_filter_settings[key];
                }}>
                    <select name={`filter-${index}`} bind:value={
                        () => key,
                        (v) => {
                            tag_filter_settings = Object.fromEntries(Object.entries(tag_filter_settings).map(
                                ([k, v_], i) =>
                                    i == index
                                        ? [v, get_default_filter(TAG_FILTER_FIELDS[v][1])]
                                        : [k, v_]
                            ));
                        }
                    }>
                        {#each Object.entries(TAG_FILTER_FIELDS) as [possible_key, [display]], index (index)}
                            {#if !(possible_key in tag_filter_settings && possible_key != key)}
                                <option value={possible_key}>{display}</option>
                            {/if}
                        {/each}
                    </select>
                </WithX>
                {#if key}
                    {let filter = $derived(entry[1] as (FilterTypes | FilterList<FilterTypes>))}
                    <div class="filtering">
                        <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
                        {let [_, ...type] = TAG_FILTER_FIELDS[key]}
                        {@render render_filter(type, index, filter)}
                    </div>
                {/if}
            </div>
        {/each}
        <button onclick={() => {
            // @ts-expect-error '' is a sentinel key
            tag_filter_settings[''] = {};
        }} disabled={Object.keys(tag_filter_settings).length == Object.keys(TAG_FILTER_FIELDS).length}><Plus></Plus></button>
    </div>
</Dialog>

<button class="small-button gray-button" onclick={() => {
    make_copy();
    if (current_tab == 'proxies') {
        open_proxies_filter();
    } else {
        open_tags_filter();
    }
}} aria-label="filter">
	<Funnel></Funnel>
</button>

<style>
    .filters {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .filter-element {
        display: flex;
        flex-direction: row;
        gap: 10px;
    }

    .filtering {
        display: grid;
        gap: 5px;
        flex-grow: 1;
        grid-template-columns: auto 1fr;
        align-items: center;
        justify-content: left;
    }

    .filtering label {
        text-align: right;
    }

    .subfilter {
        background: var(--background-secondary);
        padding: 10px;
        border: 2px solid var(--border-color);
        border-radius: 10px;
    }
</style>