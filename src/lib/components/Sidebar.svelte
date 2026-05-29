<script lang="ts">
	import { page } from '$app/stores';

	const links = [
		{ href: '/',       label: 'Leaderboard', icon: '🏆' },
		{ href: '/status', label: 'Bot Status',   icon: '🤖' },
	];
</script>

<aside
	class="fixed left-0 top-0 z-50 flex h-screen w-48 flex-col"
	style="background:var(--dc-2); border-right:1px solid var(--dc-border);"
>
	<!-- Logo -->
	<div class="flex h-11 items-center px-3" style="border-bottom:1px solid var(--dc-border);">
		<span class="text-xs font-bold uppercase tracking-widest" style="color:var(--dc-accent);">
			iteachchem
		</span>
	</div>

	<!-- Nav -->
	<nav class="flex-1 overflow-y-auto px-2 py-2">
		<p class="mb-1 px-2 text-[10px] font-bold uppercase tracking-wider" style="color:var(--dc-t3);">
			Navigation
		</p>
		{#each links as link}
			{@const active = $page.url.pathname === link.href}
			<a
				href={link.href}
				class="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-xs font-medium transition-colors"
				style={active
					? 'background:var(--dc-4); color:var(--dc-t1);'
					: 'color:var(--dc-t2);'}
				onmouseenter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = 'var(--dc-5)'; (e.currentTarget as HTMLElement).style.color = 'var(--dc-t1)'; }}
				onmouseleave={(e) => { if (!active) { (e.currentTarget as HTMLElement).style.background = ''; (e.currentTarget as HTMLElement).style.color = 'var(--dc-t2)'; } }}
			>
				<span class="text-sm">{link.icon}</span>
				{link.label}
			</a>
		{/each}
	</nav>

	<!-- Logout -->
	<div class="px-2 py-2" style="border-top:1px solid var(--dc-border);">
		<form method="POST" action="/login?/logout">
			<button
				type="submit"
				class="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-xs font-medium transition-colors"
				style="color:var(--dc-t3);"
				onmouseenter={(e) => { (e.currentTarget as HTMLElement).style.color = '#f23f42'; (e.currentTarget as HTMLElement).style.background = 'var(--dc-5)'; }}
				onmouseleave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--dc-t3)'; (e.currentTarget as HTMLElement).style.background = ''; }}
			>
				<span class="text-sm">↩</span>
				Logout
			</button>
		</form>
	</div>
</aside>
