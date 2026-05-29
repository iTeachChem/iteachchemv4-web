import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { verifyToken, COOKIE_NAME } from '$lib/server/auth';

const PUBLIC = ['/login', '/public-uptime'];

export const handle: Handle = async ({ event, resolve }) => {
	const path = event.url.pathname;

	if (PUBLIC.some((p) => path.startsWith(p))) {
		return resolve(event);
	}

	const token = event.cookies.get(COOKIE_NAME);
	if (!token || !(await verifyToken(token))) {
		throw redirect(303, `/login?next=${encodeURIComponent(path)}`);
	}

	return resolve(event);
};
