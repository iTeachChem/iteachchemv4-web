import { BOT_TOKEN } from '$env/static/private';

const BASE = 'https://discord.com/api/v10';

export type BotUser = {
	id: string;
	username: string;
	discriminator: string;
	avatar: string | null;
	bot: boolean;
};

export async function getBotUser(): Promise<BotUser> {
	const res = await fetch(`${BASE}/users/@me`, {
		headers: { Authorization: `Bot ${BOT_TOKEN}` },
	});
	if (!res.ok) throw new Error(`Discord API ${res.status}: ${await res.text()}`);
	return res.json();
}

export function avatarUrl(user: BotUser): string {
	if (user.avatar) return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`;
	const def = Number(user.discriminator) % 5;
	return `https://cdn.discordapp.com/embed/avatars/${def}.png`;
}
