import { DASHBOARD_EMAIL, DASHBOARD_PASSWORD, COOKIE_SECRET } from '$env/static/private';

export const COOKIE_NAME = 'session';
export const COOKIE_OPTS = {
	path: '/',
	httpOnly: true,
	sameSite: 'lax' as const,
	maxAge: 60 * 60 * 24 * 7,
};

async function hmac(secret: string, payload: string): Promise<string> {
	const key = await crypto.subtle.importKey(
		'raw',
		new TextEncoder().encode(secret),
		{ name: 'HMAC', hash: 'SHA-256' },
		false,
		['sign']
	);
	const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
	return Buffer.from(sig).toString('base64url');
}

function constEq(a: string, b: string): boolean {
	if (a.length !== b.length) return false;
	let diff = 0;
	for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
	return diff === 0;
}

/** Each call produces a unique token: `<nonce>.<HMAC(secret, nonce)>` */
export async function makeToken(): Promise<string> {
	const nonce = crypto.randomUUID();
	const sig = await hmac(COOKIE_SECRET, nonce);
	return `${nonce}.${sig}`;
}

/** Verify a token by recomputing the HMAC over its nonce. */
export async function verifyToken(token: string): Promise<boolean> {
	const dot = token.lastIndexOf('.');
	if (dot === -1) return false;
	const nonce = token.slice(0, dot);
	const sig = token.slice(dot + 1);
	const expected = await hmac(COOKIE_SECRET, nonce);
	return constEq(sig, expected);
}

export function checkCredentials(email: string, password: string): boolean {
	return constEq(email, DASHBOARD_EMAIL) && constEq(password, DASHBOARD_PASSWORD);
}
