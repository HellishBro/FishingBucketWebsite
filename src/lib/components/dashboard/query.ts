import { id_equals, type EphemeralID, type ID, type Proxy, type ProxyTag } from "$lib/models.svelte";
import { n2dnormalize } from "$lib/utils";

type Model = Proxy | ProxyTag;

export interface QuerySettings<M extends Model> {
    filter?: FilterSettings<M>;
    group_by?: GroupBySettings<M>;
    sort?: SortSettings<M>;
}

export function apply_query_proxy(proxies: Proxy[], query: QuerySettings<Proxy>): GroupedBy<Proxy>[] {
    if (query.filter) {
        proxies = filter_proxies(proxies, query.filter);
    }
    let groups: GroupedBy<Proxy>[] = [];
    if (query.group_by) {
        groups = group_by_proxies(proxies, query.group_by);
    } else {
        groups = nop_group(proxies);
    }
    if (query.sort) {
        for (const group of groups) {
            group.items = sort_proxies(group.items, query.sort);
        }
    }

    return groups;
}

export function apply_query_tags(tags: ProxyTag[], proxies: Proxy[], query: QuerySettings<ProxyTag>): GroupedBy<ProxyTag>[] {
    if (query.filter) {
        tags = filter_tags(tags, query.filter);
    }
    let groups: GroupedBy<ProxyTag>[] = [];
    if (query.group_by) {
        groups = group_by_tags(tags, query.group_by);
    } else {
        groups = nop_group(tags);
    }
    if (query.sort) {
        for (const group of groups) {
            group.items = sort_tags(group.items, proxies, query.sort);
        }
    }

    return groups;
}

// #region sorting
export enum SortOrder {
    ASCENDING, DESCENDING
}

export interface Sort {
    order: SortOrder
}

export enum SortStringCountBy {
    LENGTH, ALPHABET
}

export interface SortString extends Sort {
    count_by: SortStringCountBy
}

export type SortSettingsProxy = {
    type: 'id';
    sort: Sort;
} | {
    type: 'name';
    sort: SortString;
} | {
    type: 'description';
    sort: SortString;
} | {
    type: 'triggers';
    sort: Sort;
} | {
    type: 'times_used';
    sort: Sort;
} | {
    type: 'creation_date';
    sort: Sort;
} | {
    type: 'nickname';
    sort: SortString;
} | {
    type: 'pronouns';
    sort: SortString;
} | {
    type: 'tags';
    sort: Sort;
}

export type SortSettingsTag = {
    type: 'id';
    sort: Sort;
} | {
    type: 'name';
    sort: SortString;
} | {
    type: 'description';
    sort: SortString;
} | {
    type: 'creation_date';
    sort: Sort;
} | {
    type: 'tag';
    sort: SortString;
} | {
    type: 'members';
    sort: Sort;
};

export type SortKind = 'sort' | 'string' | 'list';

export const SORT_BY_PROXY: {
    [key in SortSettingsProxy['type']]: [string, SortKind]
} = {
    id: ['ID', 'sort'],
    name: ['Name', 'string'],
    description: ['Description', 'string'],
    triggers: ['Triggers', 'list'],
    times_used: ['Messages Sent', 'sort'],
    creation_date: ['Date Created', 'sort'],
    nickname: ['Nickname', 'string'],
    pronouns: ['Pronouns', 'string'],
    tags: ['Tags', 'list']
}

export const SORT_BY_TAG: {
    [key in SortSettingsTag['type']]: [string, SortKind]
} = {
    id: ['ID', 'sort'],
    name: ['Name', 'string'],
    description: ['Name', 'string'],
    creation_date: ['Date Created', 'sort'],
    tag: ['Marker', 'string'],
    members: ['Members', 'list']
}

export type SortSettings<M extends Model> = M extends Proxy ? SortSettingsProxy : SortSettingsTag;

function flip_with(res: number, sort: Sort): number {
    if (sort.order == SortOrder.ASCENDING) {
        return res;
    }
    return -res;
}

function sort_multiple(a: unknown[], b: unknown[]): number {
    return a.length - b.length;
}

function sort_id(a: ID, b: ID): number {
    if (typeof a == 'number') {
        if (typeof b == 'number') {
            return a - b;
        }
        return -1;
    }
    if (typeof b == 'number') {
        return 1;
    }
    return (a as EphemeralID).index - (b as EphemeralID).index;
}

function sort_numeric(a: number, b: number): number {
    return a - b;
}

function sort_string(a: string, b: string, setting: SortString): number {
    if (setting.count_by == SortStringCountBy.ALPHABET) {
        return a.localeCompare(b);
    }
    return a.length - b.length;
}

export function sort_proxies(list: Proxy[], settings: SortSettings<Proxy>): Proxy[] {
    switch (settings.type) {
        case "id":
            return list.toSorted((a, b) => flip_with(sort_id(a.id, b.id), settings.sort));
        case "name":
            return list.toSorted((a, b) => flip_with(sort_string(a.name, b.name, settings.sort), settings.sort));
        case "description":
            return list.toSorted((a, b) => flip_with(sort_string(a.description, b.description, settings.sort), settings.sort));
        case "triggers":
            return list.toSorted((a, b) => flip_with(sort_multiple(a.triggers, b.triggers), settings.sort));
        case "times_used":
            return list.toSorted((a, b) => flip_with(sort_numeric(a.times_used, b.times_used), settings.sort));
        case "creation_date":
            return list.toSorted((a, b) => flip_with(sort_numeric(a.creation_date, b.creation_date), settings.sort));
        case "nickname":
            return list.toSorted((a, b) => flip_with(sort_string(a.nickname, b.nickname, settings.sort), settings.sort));
        case "pronouns":
            return list.toSorted((a, b) => flip_with(sort_string(a.pronouns, b.pronouns, settings.sort), settings.sort));
        case "tags":
            return list.toSorted((a, b) => flip_with(sort_multiple(a.tags, b.tags), settings.sort));
    }
}

export function sort_tags(list: ProxyTag[], proxies: Proxy[], settings: SortSettings<ProxyTag>): ProxyTag[] {
    switch (settings.type) {
        case "id":
            return list.toSorted((a, b) => flip_with(sort_id(a.id, b.id), settings.sort));
        case "name":
            return list.toSorted((a, b) => flip_with(sort_string(a.name, b.name, settings.sort), settings.sort));
        case "description":
            return list.toSorted((a, b) => flip_with(sort_string(a.description, b.description, settings.sort), settings.sort));
        case "creation_date":
            return list.toSorted((a, b) => flip_with(sort_numeric(a.creation_date, b.creation_date), settings.sort));
        case "tag":
            return list.toSorted((a, b) => flip_with(sort_string(a.tag, b.tag, settings.sort), settings.sort));
        case "members": {
            const members_count_map = new Map<ID, number>();
            for (const tag of list) {
                members_count_map.set(tag.id, proxies.filter(p => p.tags.includes(tag.id)).length);
            }
            return list.toSorted((a, b) => flip_with(sort_numeric(members_count_map.get(a.id)!, members_count_map.get(b.id)!), settings.sort));
        }
    }
}
// #endregion sorting

// #region group by
export enum GroupBySettingsProxy {
    NONE, FIRST_TAG, ALL_TAGS, FIRST_LETTER
}

export enum GroupBySettingsTag {
    NONE, FIRST_LETTER
}

export type GroupBySettings<M extends Model> = M extends Proxy ? GroupBySettingsProxy : GroupBySettingsTag;

export type GroupedBy<M extends Model> = {
    group_info: GroupedInfo
    items: M[];
}

export type GroupedInfo = {
    type: null
} | {
    type: 'tag',
    tag: ID
} | {
    type: 'tags',
    tags: ID[]
} | {
    type: 'first_letter',
    letter: string
};

export function group_by_proxies(list: Proxy[], settings: GroupBySettings<Proxy>): GroupedBy<Proxy>[] {
    if (settings == GroupBySettingsProxy.FIRST_TAG) {
        const used_tags: (ID | null)[] = [...new Set(
            list.map(p => p.tags.length ? p.tags[0] : null)
        )];
        if (used_tags.includes(null)) {
            used_tags.splice(used_tags.indexOf(null), 1);
            used_tags.sort((a, b) => sort_id(a as ID, b as ID));
            used_tags.push(null);
        } else {
            used_tags.sort((a, b) => sort_id(a as ID, b as ID));
        }
        return used_tags.map(t => {
            if (t) {
                return {
                    group_info: {
                        type: 'tag',
                        tag: t
                    },
                    items: list.filter(p => p.tags.length && id_equals(p.tags[0], t))
                };
            } else {
                return {
                    group_info: {
                        type: null
                    },
                    items: list.filter(p => !p.tags.length)
                }
            }
        });
    }
    if (settings == GroupBySettingsProxy.ALL_TAGS) {
        let all_tags: (ID[] | null)[] = [...new Set(
            list.map(p => p.tags.length ? p.tags.map(t => t) : null)
        )];
        function sort() {
            all_tags = n2dnormalize(all_tags as ID[][], id_equals);
            (all_tags as ID[][]).sort((a, b) => b.length - a.length);
        }
        if (all_tags.includes(null)) {
            all_tags.splice(all_tags.indexOf(null), 1);
            sort();
            all_tags.push(null);
        } else {
            sort();
        }
        console.log(all_tags);
        return all_tags.map(ts => {
            if (ts) {
                return {
                    group_info: {
                        type: 'tags',
                        tags: ts
                    },
                    items: list.filter(p => p.tags.length == ts.length && p.tags.every((id, i) => id_equals(id, ts[i])))
                };
            } else {
                return {
                    group_info: {
                        type: null
                    },
                    items: list.filter(p => !p.tags.length)
                }
            }
        });
    }
    if (settings == GroupBySettingsProxy.FIRST_LETTER) {
        const all_letters: string[] = [...new Set(
            list.map(p => p.name.at(0)?.toLocaleLowerCase() ?? '')
        )].toSorted((a, b) => a.localeCompare(b));
        return all_letters.map(l => {
            return {
                group_info: {
                    type: 'first_letter',
                    letter: l
                },
                items: l ? list.filter(p => p.name.at(0)?.toLocaleLowerCase() == l) : list.filter(p => !p.name)
            };
        });
    }
    return nop_group(list);
}

export function group_by_tags(list: ProxyTag[], settings: GroupBySettingsTag): GroupedBy<ProxyTag>[] {
    if (settings == GroupBySettingsTag.FIRST_LETTER) {
        const all_letters: string[] = [...new Set(
            list.map(t => t.name.at(0)?.toLocaleLowerCase() ?? '')
        )].toSorted((a, b) => a.localeCompare(b));
        return all_letters.map(l => {
            return {
                group_info: {
                    type: 'first_letter',
                    letter: l
                },
                items: l ? list.filter(p => p.name.at(0)?.toLocaleLowerCase() == l) : list.filter(p => !p.name)
            };
        });
    }
    return nop_group(list);
}

function nop_group<M extends Model>(list: M[]): GroupedBy<M>[] {
    return [{
        group_info: {
            type: null
        },
        items: list
    }];
}
// #endregion group by

// #region filter
export type FilterNumeric = {
    numeric: true,
    type: 'range';
    lower: number;
    upper: number;
    lower_exclusive: boolean;
    upper_exclusive: boolean;
} | {
    numeric: true,
    type: '>';
    rhs: number;
} | {
    numeric: true,
    type: '<',
    rhs: number;
} | {
    numeric: true,
    type: '>=';
    rhs: number;
} | {
    numeric: true,
    type: '<=';
    rhs: number;
} | {
    numeric: true,
    type: '=';
    rhs: number;
} | {
    numeric: true,
    type: '!=';
    rhs: number;
};

export type FilterString = {
    string: true,
    type: 'truthy';
} | {
    string: true,
    type: 'falsy';
} | {
    string: true,
    type: 'contains';
    contains: string;
    case_sensitive: boolean;
} | {
    string: true,
    type: 'startswith';
    startswith: string;
    case_sensitive: boolean;
} | {
    string: true,
    type: 'endswith';
    endswith: string;
    case_sensitive: boolean;
} | {
    string: true,
    type: 'length';
    length: FilterNumeric;
} | {
    string: true,
    type: 'regex';
    regex: string
};

export type FilterID = { id: true, ty?: 'ephemeral' | 'concrete' } & FilterNumeric;

export type FilterTypes = FilterNumeric | FilterString | FilterID;

export type FilterList<F extends FilterTypes> = {
    list: true,
    type: 'truthy';
} | {
    list: true,
    type: 'falsy';
} | {
    list: true,
    type: 'any';
    any: F;
} | {
    list: true,
    type: 'all';
    all: F;
}

export type FilterKind = 'list' | 'string' | 'numeric' | 'id' | 'date';

export function get_default_filter(k: FilterKind): FilterTypes | FilterList<FilterTypes> {
    switch (k) {
        case "string":
            return {
                string: true,
                type: 'contains',
                contains: ''
            } as FilterString
        case "list":
            return {
                list: true,
                type: 'truthy'
            } as FilterList<FilterTypes>
        case "numeric":
            return {
                numeric: true,
                type: '!=',
                rhs: 0
            } as FilterNumeric
        case "date":
            return {
                numeric: true,
                type: '<=',
                rhs: Date.now() / 1000
            } as FilterNumeric
        case "id":
            return {
                numeric: true,
                id: true,
                type: '!=',
                rhs: 0
            } as FilterNumeric
    }
}

export interface FilterSettingsProxy {
    id?: FilterID;
    name?: FilterString;
    description?: FilterString;
    avatar_url?: FilterString;
    triggers?: FilterList<FilterString>;
    times_used?: FilterNumeric;
    creation_date?: FilterNumeric;
    nickname?: FilterString;
    forms?: FilterList<FilterString>;
    current_form?: FilterString;
    pronouns?: FilterString;
    tags?: FilterList<FilterID>;
}

export const PROXY_FILTER_FIELDS: {
    [key in keyof FilterSettingsProxy]-?: [string, FilterKind, ...FilterKind[]]
} = {
    id: ['ID', 'id'],
    name: ['Name', 'string'],
    description: ['Description', 'string'],
    avatar_url: ['Avatar', 'string'],
    triggers: ['Triggers', 'list', 'string'],
    times_used: ['Messages Sent', 'numeric'],
    creation_date: ['Date Created', 'date'],
    nickname: ['Nickname', 'string'],
    forms: ['Form Names', 'list', 'string'],
    current_form: ['Current Form', 'string'],
    pronouns: ['Pronouns', 'string'],
    tags: ['Tag IDs', 'list', 'id']
}

export interface FilterSettingsTag {
    id?: FilterID;
    name?: FilterString;
    description?: FilterString;
    creation_date?: FilterNumeric;
    tag?: FilterString;
}

export const TAG_FILTER_FIELDS: {
    [key in keyof FilterSettingsTag]-?: [string, FilterKind]
} = {
    id: ['ID', 'id'],
    name: ['Name', 'string'],
    description: ['Description', 'string'],
    creation_date: ['Date Created', 'date'],
    tag: ['Marker', 'string']
}

export type FilterSettings<M extends Model> = M extends Proxy ? FilterSettingsProxy : FilterSettingsTag;

function number_is(num: number, filter: FilterNumeric): boolean {
    switch (filter.type) {
        case "range":
            return (
                !filter.lower_exclusive ? filter.lower <= num : filter.lower < num
            ) && (
                !filter.upper_exclusive ? num <= filter.upper : num < filter.upper
            );
        case ">":
            return num > filter.rhs;
        case "<":
            return num < filter.rhs;
        case ">=":
            return num >= filter.rhs;
        case "<=":
            return num <= filter.rhs;
        case "=":
            return num == filter.rhs;
        case "!=":
            return num != filter.rhs;
    }
}

function id_is(id: ID, filter: FilterID): boolean {
    if (filter.ty == 'ephemeral') {
        return typeof id == 'object' && number_is((id as EphemeralID).index, filter);
    } else if (filter.ty == 'concrete') {
        return typeof id == 'number' && number_is(id, filter);
    }
    return typeof id == 'object' ? number_is((id as EphemeralID).index, filter) : number_is(id, filter);
}

function string_is(str: string, filter: FilterString): boolean {
    switch (filter.type) {
        case "truthy":
            return !!str.length;
        case "falsy":
            return !str.length;
        case "contains":
            return filter.case_sensitive
                ? str.includes(filter.contains)
                : str.toLocaleLowerCase().includes(filter.contains.toLocaleLowerCase());
        case "startswith":
            return filter.case_sensitive
                ? str.startsWith(filter.startswith)
                : str.toLocaleLowerCase().startsWith(filter.startswith.toLocaleLowerCase());
        case "endswith":
            return filter.case_sensitive
                ? str.endsWith(filter.endswith)
                : str.toLocaleLowerCase().endsWith(filter.endswith.toLocaleLowerCase());
        case "length":
            return number_is(str.length, filter.length);
        case "regex":
            return new RegExp(filter.regex).test(str);
    }
}

function list_is<T, Ty extends FilterTypes>(list: T[], filter: FilterList<Ty>, cb: (item: T, filter: Ty) => boolean): boolean {
    switch (filter.type) {
        case "truthy":
            return !!list.length;
        case "falsy":
            return !list.length;
        case "any":
            return (!!list.length) && list.some(t => cb(t, filter.any));
        case "all":
            return (!!list.length) && list.every(t => cb(t, filter.all));
    }
}

function proxy_is(proxy: Proxy, settings: FilterSettingsProxy): boolean {
    const conditions = [
        settings.id ? id_is(proxy.id, settings.id) : null,
        settings.name ? string_is(proxy.name, settings.name) : null,
        settings.description ? string_is(proxy.description, settings.description) : null,
        settings.avatar_url ? string_is(proxy.avatar_url, settings.avatar_url) : null,
        settings.triggers ? list_is(proxy.triggers, settings.triggers, string_is) : null,
        settings.times_used ? number_is(proxy.times_used, settings.times_used) : null,
        settings.creation_date ? number_is(proxy.creation_date, settings.creation_date) : null,
        settings.forms ? list_is(Object.keys(proxy.forms), settings.forms, string_is) : null,
        settings.current_form ? string_is(proxy.current_form, settings.current_form) : null,
        settings.pronouns ? string_is(proxy.pronouns, settings.pronouns) : null,
        settings.tags ? list_is(proxy.tags, settings.tags, id_is) : null
    ];
    return conditions.filter(c => c != null).every(c => c);
}

function tag_is(tag: ProxyTag, settings: FilterSettingsTag): boolean {
    const conditions = [
        settings.id ? id_is(tag.id, settings.id) : null,
        settings.name ? string_is(tag.name, settings.name) : null,
        settings.description ? string_is(tag.description, settings.description) : null,
        settings.creation_date ? number_is(tag.creation_date, settings.creation_date) : null,
        settings.tag ? string_is(tag.tag, settings.tag) : null
    ];
    return conditions.filter(c => c != null).every(c => c);
}

export function filter_proxies(list: Proxy[], settings: FilterSettings<Proxy>): Proxy[] {
    return list.filter(p => proxy_is(p, settings));
}

export function filter_tags(list: ProxyTag[], settings: FilterSettings<ProxyTag>): ProxyTag[] {
    return list.filter(t => tag_is(t, settings));
}

export function make_number(v: string | number): number | undefined {
    try {
        if (typeof v == 'string') {
            let d: number;
            if (v.startsWith('new+')) {
                return make_number(v.slice(4));
            }
            if (v.startsWith('0x')) {
                d = parseInt(v.slice(2), 16);
            } else {
                d = parseFloat(v);
            }
            console.log(v, d);
            if (Number.isFinite(d)) {
                return d;
            }
            return undefined;
        } else if (typeof v == 'number') {
            return v;
        }
        return undefined;
    } catch {
        return undefined;
    }
}

export const FilterValidators = {
    numeric: (kind: FilterKind, value: FilterNumeric): boolean => {
        let to_validate: unknown[] = [];
        if (value.type == 'range') {
            to_validate = [make_number(value.lower), make_number(value.upper)];
        } else {
            to_validate = [make_number(value.rhs)];
        }

        for (const va of to_validate){
            if (typeof va != 'number') {
                return false;
            }
            if (kind == 'date') {
                if (va < 0) {
                    return false;
                }
            }
        }
        return true;
    },
    string: (_: FilterKind, value: FilterString): boolean => {
        switch (value.type) {
            case "length":
                return FilterValidators.numeric('numeric', value.length);
            case "regex": {
                try {
                    new RegExp(value.regex);
                } catch {
                    return false;
                }
            }
        }
        return true;
    },
    list: (inner_kind: FilterKind, value: FilterList<FilterTypes>): boolean => {
        // @ts-expect-error i am too lazy to solve this contravariant thing
        const method: (kind: FilterKind, value: FilterTypes | FilterList<FilterTypes>) => boolean =
            inner_kind == 'date' || inner_kind == 'id' || inner_kind == 'numeric'
                ? FilterValidators.numeric
                : inner_kind == 'string'
                ? FilterValidators.string
                : FilterValidators.list
            ;
        switch (value.type) {
            case "any":
                return method(inner_kind, value.any);
            case "all":
                return method(inner_kind, value.all);
        }
        return true;
    }
}
// #endregion

export const DEFAULT_PROXY_QUERIES = {
    filter: {},
    group_by: GroupBySettingsProxy.FIRST_TAG,
    sort: {
        type: 'id',
        sort: {
            order: SortOrder.ASCENDING
        }
    }
} as QuerySettings<Proxy>;

export const DEFAULT_TAG_QUERIES = {
    filter: {},
    group_by: GroupBySettingsTag.NONE,
    sort: {
        type: 'id',
        sort: {
            order: SortOrder.ASCENDING
        }
    }
} as QuerySettings<ProxyTag>;