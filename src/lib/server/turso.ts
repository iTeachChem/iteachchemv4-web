import { createClient } from '@libsql/client/web';
import { TURSO_DATABASE_URL, TURSO_AUTH_TOKEN } from '$env/static/private';

export const db = createClient({
	url: TURSO_DATABASE_URL.trim(),
	authToken: TURSO_AUTH_TOKEN.trim(),
});

const CACHE_TTL = 3_600_000;
const _store = new Map<string, { value: unknown; expires: number }>();

export async function cached<T>(key: string, fn: () => Promise<T>, ttl = CACHE_TTL): Promise<T> {
	const hit = _store.get(key);
	if (hit && hit.expires > Date.now()) return hit.value as T;
	const value = await fn();
	_store.set(key, { value, expires: Date.now() + ttl });
	return value;
}

export function invalidate(key: string) {
	_store.delete(key);
}
