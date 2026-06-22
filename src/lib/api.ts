import { default as config } from "./config.json";

export interface ApiError {
	error_code: number;
	message: string;
}

export function get_auth(): string | null {
	if (window) {
		if (time_until_expiration() > 0)
			return window.localStorage.getItem("session_id");
	}
	return null;
}

export function get_expires(): number {
	if (window) {
		return parseFloat(window.localStorage.getItem("expires")!);
	}
	return 0;
}

export function time_until_expiration(): number {
	return get_expires() - Date.now() / 1000;
}

export async function api_request<T>(url: string, init: RequestInit, auth?: string): Promise<{error?: ApiError, body?: T}> {
	const headers = {
		"Content-Type": "application/json"
	};

	if (auth) {
		headers["Authorization" as keyof typeof headers] = auth;
	}

	init.headers = headers;

	let response: Response;
	try {
		response = await fetch(config.api_url + url, init);
	} catch {
		response = {
			status: -1,
			text(): Promise<string> {
				return new Promise<string>(res => {
					res("Could not connect to the API!");
				})
			}
		} as Response;
	}

	if (response.status == 200) {
		return { body: await response.json() };
	}
	return { error: { error_code: response.status, message: await response.text() } };
}

export async function post<T>(url: string, body: object, auth?: string): Promise<{error?: ApiError, body?: T}> {
	return await api_request<T>(url, {
		method: "POST",
		body: JSON.stringify(body)
	}, auth);
}

export async function patch<T>(url: string, body: object, auth?: string): Promise<{error?: ApiError, body?: T}> {
	return await api_request<T>(url, {
		method: "PATCH",
		body: JSON.stringify(body)
	}, auth);
}

export async function get<T>(url: string, auth?: string): Promise<{error?: ApiError, body?: T}> {
	return await api_request<T>(url, {
		method: "GET"
	}, auth);
}

export async function attempt_refresh_token() {
	if (window) {
		const auth = get_auth();
		if (auth) {
			const { body } = await api_request<{ expires: number }>('/auth/extend', {
				method: "POST"
			}, auth);
			if (body) {
				const { expires } = body;
				window.localStorage.setItem('expires', expires.toString());
			}
		}
	}
}