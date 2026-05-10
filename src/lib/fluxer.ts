export interface FluxerUser {
	id: string,
	avatar: string,
	username: string,
	discriminator: string,
	global_name: string
}

export function get_user(): FluxerUser | null {
	if (window) {
		const user_unparsed = window.localStorage.getItem("user");
		if (user_unparsed == null) return null;
		return JSON.parse(user_unparsed);
	}
	return null;
}

export function get_user_avatar(size: number): string | null {
	const user = get_user();
	if (user) {
		return `https://fluxerusercontent.com/avatars/${user.id}/${user.avatar}.webp?size=${size}`;
	}
	return null;
}