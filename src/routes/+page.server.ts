import type { PageServerLoad } from './$types';
import { db, cached } from '$lib/server/turso';

export type UserRow = {
	user_id: string;
	username: string;
	doubts_solved: number;
	questions_attempted: number;
	questions_solved: number;
	questions_skipped: number;
	points: number;
	total_time_taken: string | null;
};

export const load: PageServerLoad = async () => {
	const [doubts, quiz] = await Promise.all([
		cached('lb_doubts', async () => {
			const r = await db.execute(
				"SELECT * FROM user_stats WHERE username != 'iteachchem' ORDER BY doubts_solved DESC"
			);
			return r.rows as unknown as UserRow[];
		}),
		cached('lb_quiz', async () => {
			const r = await db.execute(
				"SELECT * FROM user_stats WHERE username != 'iteachchem' ORDER BY questions_solved DESC"
			);
			return r.rows as unknown as UserRow[];
		}),
	]);

	return { doubts, quiz };
};
