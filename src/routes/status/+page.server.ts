import type { PageServerLoad } from './$types';
import { getBotUser, avatarUrl } from '$lib/server/discord';
import { db, cached } from '$lib/server/turso';

export const load: PageServerLoad = async () => {
	const [botResult, startedAt] = await Promise.allSettled([
		getBotUser(),
		cached('bot_started_at', async () => {
			const r = await db.execute(
				"SELECT value FROM bot_meta WHERE key = 'started_at'"
			);
			return (r.rows[0]?.value as string) ?? null;
		}, 10_000),
	]);

	const bot = botResult.status === 'fulfilled' ? botResult.value : null;
	const tokenError = botResult.status === 'rejected' ? String(botResult.reason) : null;
	const started = startedAt.status === 'fulfilled' ? startedAt.value : null;

	return {
		bot: bot ? { ...bot, avatarUrl: avatarUrl(bot) } : null,
		tokenError,
		startedAt: started,
	};
};
