<script lang="ts">
	import { page } from '$app/stores';

	const titles: Record<string, string> = {
		'/': 'Leaderboard',
		'/status': 'Bot Status',
	};

	const title = $derived(titles[$page.url.pathname] ?? 'iteachchem');
</script>

<nav
	class="fixed top-0 left-48 right-0 z-40 flex h-11 items-center px-4"
	style="background:var(--dc-1); border-bottom:1px solid var(--dc-border);"
>
	<span class="text-sm font-semibold" style="color:var(--dc-t1);">{title}</span>
</nav>
