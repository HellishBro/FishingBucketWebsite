export class EphemeralID {
	index: number;

	constructor(index: number) {
		this.index = index;
	}
}

export type ID = number | EphemeralID;

export function id_equals(a: ID | null, b: ID | null): boolean {
	if (typeof a == "number" && typeof b == "number") return a == b;
	else if (a == null || b == null) return a == b;
	else if (typeof a == "object" && typeof b == "object") return (<EphemeralID>a).index == (<EphemeralID>b).index;
	else return false;
}

export function get_id_string(id: ID): string {
	if (typeof id == "number") {
		return "0x" + id.toString(16);
	}
	return "new 0x" + id.index.toString(16);
}

export interface Proxy {
	id: ID;
	name: string;
	description: string | null;
	avatar_url: string;
	triggers: string[];
	owner: string;
	times_used: number;
	creation_date: number;
	group: ID | null;
	nickname: string | null;
	effective_name: string;
	forms: Record<string, string>;
	current_form: string | null;
	pronouns: string | null;
}

export interface ProxyGroup {
	id: ID;
	name: string;
	description: string | null;
	owner: string;
	creation_date: number;
	tag: string | null;
	parent: ID | null;
}

export function get_effective_avatar_url(proxy: Proxy): string {
	return proxy.current_form ? proxy.forms[proxy.current_form] ?? proxy.avatar_url : proxy.avatar_url;
}

export function get_random_avatar(): string {
	return `https://raw.githubusercontent.com/fluxerapp/static/refs/heads/main/avatars/${Math.floor(Math.random() * 6)}.png`;
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

export class NewProxyGroupEdit implements IEdit {
	edit_type = "NEW_PROXY_GROUP";
	group: ProxyGroup;

	constructor(group: ProxyGroup) {
		this.group = group;
	}

	toJSON(): object {
		return {
			group: this.group
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

export class DeleteProxyGroupEdit implements IEdit {
	edit_type = "DELETE_PROXY_GROUP";
	group_id: ID;

	constructor(group_id: ID) {
		this.group_id = group_id;
	}

	toJSON(): object {
		return {
			group_id: this.group_id
		};
	}
}

type ProxyFields = {
	name: string,
	description: string | null,
	avatar_url: string,
	triggers: string[],
	group: ID | null,
	nickname: string | null,
	forms: Record<string, string>,
	current_form: string | null,
	pronouns: string | null
}

type ProxyGroupFields = {
	name: string,
	description: string | null,
	tag: string | null,
	parent: ID | null,
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

export class EditProxyGroupFieldEdit<K extends keyof ProxyGroupFields = keyof ProxyGroupFields> implements IEdit {
	edit_type = "EDIT_PROXY_GROUP_FIELD";
	id: ID;
	field: K;
	value: ProxyGroupFields[K];

	constructor(id: ID, field: K, value: ProxyGroupFields[K]) {
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