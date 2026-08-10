<script lang="ts">
	import { EditProxyFieldEdit, get_id_string, type ID, type IEdit, type Proxy } from "$lib/models.svelte";
	import { ExternalLink, Plus, RotateCcw, SquarePen, X } from "@lucide/svelte";
	import type { Target, UserData } from "../DashBoard.svelte";
	import FieldGroup from "./FieldGroup.svelte";

    let {
        proxy,
        add_edit,
        user_data,
        target
    }: {
        proxy: Proxy,
        add_edit: (edit: IEdit) => void,
        user_data: UserData,
        target: (target: Target) => void
    } = $props();

    function update_proxy_triggers() {
        add_edit(new EditProxyFieldEdit(proxy.id, 'triggers', proxy.triggers));
    }

    function update_proxy_forms() {
        add_edit(new EditProxyFieldEdit(proxy.id, 'forms', proxy.forms));
    }

    const current_form = {
        get current_form(): string {
            return proxy.current_form;
        },
        set current_form(v: string) {
            proxy.current_form = v;
            add_edit(new EditProxyFieldEdit(proxy.id, 'current_form', v));
        }
    };
</script>

{#snippet popup_input(name: string, placeholder: string, bind: { get: () => string, set: (v: string) => void }, more_tags: object = {})}
    <div style="flex-grow: 1; position: relative; width: auto;">
        <input id={name} {name} {placeholder} type="url" class="actioned-input" bind:value={
            () => bind.get(),
            (v: string) => bind.set(v)
        } {...more_tags}>
        <a href={bind.get()} target="_blank" rel="external" class="input-action" aria-label="open link">
            <ExternalLink></ExternalLink>
        </a>
    </div>
{/snippet}

{#snippet deletable_input(placeholder: string, bind: { get: () => string, set: (v: string) => void, delete: () => void }, more_tags: object = {})}
    <div style="flex-grow: 1; position: relative; width: auto;">
        <input {placeholder} class="actioned-input" bind:value={
            () => bind.get(),
            (v: string) => bind.set(v)
        } {...more_tags}>
        <button class="input-action x-button" aria-label="delete" onclick={bind.delete}>
            <X></X>
        </button>
    </div>
{/snippet}

{#snippet proxy_tag_options()}
    <option value={null}></option>
    <!-- eslint-disable svelte/require-each-key -->
    {#each user_data.tags as tag}
        <option value={tag.id}>{tag.name}</option>
    {/each}
{/snippet}

<div class="inspector">
    <div class="row" style="gap: 20px;">
        <img src={proxy.avatar_url} alt="proxy avatar" class="avatar big-avatar">
        <div style="flex-grow: 1; display: flex; gap: 10px; flex-direction: column; position: relative;">
            <h1 style="margin: 0;">{proxy.effective_name}</h1>
            <h2 style="margin: 0;">{proxy.name}</h2>
            <button style="position: absolute; top: 0; right: 0;" onclick={() => {
                navigator.clipboard.writeText(get_id_string(proxy.id));
            }}>
                Copy ID: <span class="monospace" style="font-size: 1em;">{get_id_string(proxy.id)}</span>
            </button>
        </div>
    </div>
    <FieldGroup title="Basic Information">
        <div class="field">
            <label for="name">Name:</label>
            <input name="name" id="name" placeholder="Name" bind:value={
                () => proxy.name,
                (v: string) => {
                    proxy.name = v;
                    if (v) add_edit(new EditProxyFieldEdit(proxy.id, 'name', v));
                }
            } class:error={!proxy.name}>
        </div>
        <div class="field">
            <label for="nickname">Nickname:</label>
            <input name="nickname" id="nickname" placeholder="Nickname" bind:value={
                () => proxy.nickname,
                (v: string) => {
                    proxy.nickname = v;
                    add_edit(new EditProxyFieldEdit(proxy.id, 'nickname', v));
                }
            }>
        </div>
        <div class="field">
            <label for="pronouns">Pronouns:</label>
            <input name="pronouns" id="pronouns" placeholder="Pronouns" bind:value={
                () => proxy.pronouns,
                (v: string) => {
                    proxy.pronouns = v;
                    add_edit(new EditProxyFieldEdit(proxy.id, 'pronouns', v));
                }
            }>
        </div>
        <div class="field">
            <label for="avatar">Avatar:</label>
            <img src={proxy.avatar_url} alt="proxy avatar" class="avatar small-avatar">
            {@render popup_input("avatar", "Avatar URL", {
                get: () => proxy.avatar_url,
                set: (v: string) => {
                    proxy.avatar_url = v;
                    add_edit(new EditProxyFieldEdit(proxy.id, 'avatar_url', v));
                }
            })}
        </div>
        <div class="field">
            <p>Metadata:</p>
            <table>
                <thead>
                    <tr>
                        <th>Date Created</th>
                        <th>Messages Sent</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{new Intl.DateTimeFormat().format(new Date(proxy.creation_date * 1000))}</td>
                        <td>{proxy.times_used}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </FieldGroup>
    <FieldGroup title="Triggers, Tags, and Forms">
        <div class="vfield">
            <label for="triggers">Triggers:</label>
            <div id="triggers" class="gridded">
                <!-- eslint-disable @typescript-eslint/no-unused-vars -->
                {#each proxy.triggers as _, index (index)}
                    {@render deletable_input("Trigger", {
                        get: () => proxy.triggers[index],
                        set: (v: string) => {
                            proxy.triggers[index] = v;
                            update_proxy_triggers();
                        },
                        delete: () => {
                            proxy.triggers.splice(index, 1);
                            update_proxy_triggers();
                        }
                    })}
                {/each}
                <button aria-label="new trigger" onclick={() => {
                    proxy.triggers.push('');
                }}>
                    <Plus></Plus> Trigger
                </button>
            </div>
        </div>
        <div class="vfield">
            <label for="tags">Tags:</label>
            <div id="tags" class="gridded">
                {#each proxy.tags as tag_id, index}
                    <div style="flex-grow: 1; position: relative; width: auto;">
                        <select name={`tag-${index}`} style="width: 100%;" bind:value={
                            () => tag_id,
                            (v: ID | null) => {
                                if (v != null) { 
                                    proxy.tags[index] = v;
                                } else {
                                    proxy.tags.splice(index, 1);
                                }
                                add_edit(new EditProxyFieldEdit(proxy.id, 'tags', proxy.tags));
                            }
                        } class:error={proxy.tags.filter(t => t == tag_id).length > 1}>
                            {@render proxy_tag_options()}
                        </select>
                        {#if proxy.tags[index]}
                            <button class="input-action" style="right: 2.5rem; width: 1em; aspect-ratio: 1;" aria-label="inspect tag" onclick={() => {
                                target({
                                    type: 'tag',
                                    data: user_data.tags.find(t => t.id == proxy.tags[index])!
                                });
                            }}>
                                <SquarePen></SquarePen>
                            </button>
                        {/if}
                        <button class="input-action x-button" style="right: 1rem; width: 1.5em; aspect-ratio: 1;" aria-label="delete" onclick={() => {
                            proxy.tags.splice(index, 1);
                            add_edit(new EditProxyFieldEdit(proxy.id, 'tags', proxy.tags));
                        }}>
                            <X></X>
                        </button>
                    </div>
                {/each}
                <button aria-label="new tag" onclick={() => {
                    proxy.tags.push(null!);
                }}>
                    <Plus></Plus> Tag
                </button>
            </div>
        </div>
        <div class="vfield">
            <label for="forms">Forms:</label>
            <div id="forms" style="display: flex; gap: 5px; flex-direction: column; flex-grow: 1;">
                {#each Object.entries(proxy.forms) as [form_name, form_avatar], index}
                    <div class="proxy-form">
                        <input type="radio" style="flex-grow: 0;" name="proxy-form-radio-group" bind:group={current_form.current_form} value={form_name}>
                        {@render deletable_input("Form name", {
                            get: () => form_name,
                            set: (v: string) => {
                                proxy.forms = Object.fromEntries(Object.entries(proxy.forms).map(
                                    ([k, v_], i) => i == index ? [v, v_] : [k, v_]
                                )); // to preserve order
                                update_proxy_forms();
                            },
                            delete: () => {
                                proxy.forms = Object.fromEntries(Object.entries(proxy.forms).filter((_, i) => i != index));
                                if (proxy.current_form == form_name) {
                                    current_form.current_form = '';
                                }
                                update_proxy_forms();
                            }
                        })}
                        <span style="color: var(--text-primary);">=</span>
                        <img src={form_avatar} alt="form avatar" class="avatar small-avatar">
                        {@render popup_input("", "Form Avatar URL", {
                            get: () => form_avatar,
                            set: (v: string) => {
                                proxy.forms[form_name] = v;
                                update_proxy_forms();
                            }
                        })}
                    </div>
                {/each}
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; width: 100%">
                    <button aria-label="new form" onclick={() => {
                        proxy.forms[""] = "";
                    }}>
                        <Plus></Plus> Form
                    </button>
                    <button aria-label="reset current form" onclick={() => {
                        current_form.current_form = '';
                    }}>
                        <RotateCcw></RotateCcw> Reset current form
                    </button>
                </div>
            </div>
        </div>
    </FieldGroup>
    <div class="vfield">
        <label for="description">Description:</label>
        <textarea name="description" id="description" placeholder="Description" bind:value={
            () => proxy.description,
            (v: string) => {
                proxy.description = v;
                add_edit(new EditProxyFieldEdit(proxy.id, 'description', v));
            }
        }></textarea>
    </div>
</div>

<style>
    p {
        margin: 2px 0;
    }

    .inspector {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .row {
        display: flex;
        flex-direction: row;
        gap: 5px;
    }

    .field {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 10px;
    }

    .vfield {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .field input {
        flex-grow: 1;
        width: 100%;
    }

    .big-avatar {
        height: 6em;
        border: 5px solid var(--background-primary);
    }

    .small-avatar {
        height: 2.5em;
    }

    .actioned-input {
        position: relative;
        padding-right: 2.5em;
        box-sizing: border-box;
        width: 100%;
    }

    .input-action {
        background-color: transparent;
        position: absolute;
        right: 0.5rem;
		top: 25%;
		padding: 0;
		margin: 0;
    }

    .x-button {
        color: var(--accent-danger);
    }

    .gridded {
        display: grid;
        gap: 5px;
        grid-template-columns: 1fr 1fr 1fr;
        flex-grow: 1;
    }

    .proxy-form {
        flex-grow: 1;
        position: relative;
        display: flex;
        gap: 5px;
        width: 100%;
        align-items: center;
    }
</style>