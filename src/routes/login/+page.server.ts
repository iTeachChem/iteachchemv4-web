import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { checkCredentials, makeToken, verifyToken, COOKIE_NAME, COOKIE_OPTS } from '$lib/server/auth';

export const load: PageServerLoad = async ({ cookies, url }) => {
	const token = cookies.get(COOKIE_NAME);
	if (token && (await verifyToken(token))) {
		throw redirect(303, url.searchParams.get('next') ?? '/');
	}
	return {};
};

export const actions: Actions = {
	login: async ({ request, cookies, url }) => {
		const form = await request.formData();
		const email = String(form.get('email') ?? '');
		const password = String(form.get('password') ?? '');

		if (!checkCredentials(email, password)) {
			return fail(401, { error: 'Invalid email or password.' });
		}

		cookies.set(COOKIE_NAME, await makeToken(), COOKIE_OPTS);
		throw redirect(303, url.searchParams.get('next') ?? '/');
	},

	logout: async ({ cookies }) => {
		cookies.delete(COOKIE_NAME, { path: '/' });
		throw redirect(303, '/login');
	},
};
