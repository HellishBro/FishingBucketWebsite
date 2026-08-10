export class EphemeralID {
	index: number;

	constructor(index: number) {
		this.index = index;
	}
}

export type ID = number | EphemeralID;

export function id_equals(a: ID | null | undefined, b: ID | null | undefined): boolean {
	if (typeof a == "number" && typeof b == "number") return a == b;
	else if (a == null || b == null || a == undefined || b == undefined) return a == b;
	else if (typeof a == "object" && typeof b == "object") return (a as EphemeralID).index == (b as EphemeralID).index;
	else return false;
}

export function get_id_string(id: ID): string {
	if (typeof id == "number") {
		return "0x" + id.toString(16);
	}
	return "new+0x" + id.index.toString(16);
}

export interface Proxy {
	id: ID;
	name: string;
	description: string;
	avatar_url: string;
	triggers: string[];
	owner: string;
	times_used: number;
	creation_date: number;
	nickname: string;
	effective_name: string;
	forms: Record<string, string>;
	current_form: string;
	pronouns: string;
	tags: ID[];
}

export interface ProxyTag {
	id: ID;
	name: string;
	description: string;
	owner: string;
	creation_date: number;
	tag: string;
}

export function as_normalized_proxy(proxy: Proxy): Proxy {
	return {
		...proxy,
		tags: proxy.tags.filter((t, i) => t != null && proxy.tags.indexOf(t) == i),
		triggers: proxy.triggers.filter(t => t),
		forms: Object.fromEntries(Object.entries(proxy.forms).filter(([k, v]) => k != null && v))
	};
}

export function get_effective_avatar_url(proxy: Proxy): string {
	return proxy.current_form ? proxy.forms[proxy.current_form] ?? proxy.avatar_url : proxy.avatar_url;
}

export function get_random_avatar(): string {
	return `https://fluxerstatic.com/avatars/${Math.floor(Math.random() * 6)}.png`;
}

export interface IEdit {
	edit_type: string;
	
	toJSON(): object;
}

export class NewProxyEdit implements IEdit {
	edit_type = "NEW_PROXY";
	proxy: Proxy;

	constructor(proxy: Proxy) {
		this.proxy = proxy;
	}

	toJSON(): object {
		return {
			proxy: this.proxy
		};
	}
}

export class NewProxyTagEdit implements IEdit {
	edit_type = "NEW_PROXY_TAG";
	tag: ProxyTag;

	constructor(tag: ProxyTag) {
		this.tag = tag;
	}

	toJSON(): object {
		return {
			tag: this.tag
		}
	}
}

export class DeleteProxyEdit implements IEdit {
	edit_type = "DELETE_PROXY";
	proxy_id: ID;

	constructor(proxy_id: ID) {
		this.proxy_id = proxy_id;
	}

	toJSON(): object {
		return {
			proxy_id: this.proxy_id
		};
	}
}

export class DeleteProxyTagEdit implements IEdit {
	edit_type = "DELETE_PROXY_TAG";
	tag_id: ID;

	constructor(tag_id: ID) {
		this.tag_id = tag_id;
	}

	toJSON(): object {
		return {
			tag_id: this.tag_id
		};
	}
}

type ProxyFields = {
	name: string,
	description: string,
	avatar_url: string,
	triggers: string[],
	nickname: string,
	forms: Record<string, string>,
	current_form: string,
	pronouns: string,
	tags: ID[]
}

type ProxyTagFields = {
	name: string,
	description: string,
	tag: string
}

export class EditProxyFieldEdit<K extends keyof ProxyFields = keyof ProxyFields> implements IEdit {
	edit_type = "EDIT_PROXY_FIELD";
	id: ID;
	field: K;
	value: ProxyFields[K];

	constructor(id: ID, field: K, value: ProxyFields[K]) {
		this.id = id;
		this.field = field;
		this.value = value;
	}

	toJSON(): object {
		return {
			id: this.id,
			kv: {
				field: this.field,
				value: this.value,
			}
		}
	}
}

export class EditProxyTagFieldEdit<K extends keyof ProxyTagFields = keyof ProxyTagFields> implements IEdit {
	edit_type = "EDIT_PROXY_TAG_FIELD";
	id: ID;
	field: K;
	value: ProxyTagFields[K];

	constructor(id: ID, field: K, value: ProxyTagFields[K]) {
		this.id = id;
		this.field = field;
		this.value = value;
	}

	toJSON(): object {
		return {
			id: this.id,
			kv: {
				field: this.field,
				value: this.value,
			}
		}
	}
}

export class BatchEdit {
	edits: IEdit[];

	constructor(edits: IEdit[]) {
		this.edits = edits;
	}

	toJSON(): object {
		return {
			edits: this.edits.map(edit => {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const j: any = edit.toJSON();
				j["edit_type" as keyof typeof j] = edit.edit_type;
				return { edit: j };
			})
		}
	}
}