<script lang="ts">
	import DashboardShell from '$lib/components/DashboardShell.svelte';
	import LeaderboardTable from '$lib/components/LeaderboardTable.svelte';
	import Pagination from '$lib/components/Pagination.svelte';

	const PAGE_SIZE = 50;

	let { data } = $props();

	let tab = $state<'doubts' | 'quiz'>('doubts');
	let query = $state('');
	let page = $state(1);

	const source = $derived(tab === 'doubts' ? data.doubts : data.quiz);

	const rows = $derived(
		query.trim()
			? source.filter((r) => String(r.username ?? '').toLowerCase().includes(query.toLowerCase()))
			: source
	);

	const totalPages = $derived(Math.max(1, Math.ceil(rows.length / PAGE_SIZE)));
	const pageRows = $derived(rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE));

	$effect(() => {
		tab; query;
		page = 1;
	});
</script>

<DashboardShell>
<div class="px-4 py-6 sm:px-6">
	<!-- Top bar: search + action buttons -->
	<div class="mb-4 flex items-center gap-2">
		<div class="relative min-w-0 flex-1 max-w-xs">
			<svg
				class="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5"
				style="color:var(--dc-t3);"
				fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
			>
				<path stroke-linecap="round" stroke-linejoin="round"
					d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
			</svg>
			<input
				bind:value={query}
				type="search"
				placeholder="Search members..."
				class="w-full rounded py-1.5 pl-8 pr-3 text-sm outline-none"
				style="background:var(--dc-3); color:var(--dc-t1); border:1px solid var(--dc-5);"
			/>
		</div>
		<div class="ml-auto flex shrink-0 items-center gap-2">
			<a
				href="/status"
				class="rounded px-2.5 py-1.5 text-xs font-medium transition-colors"
				style="background:var(--dc-3); color:var(--dc-t2); border:1px solid var(--dc-5);"
				onmouseenter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--dc-t1)')}
				onmouseleave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--dc-t2)')}
			>Status</a>
			<a
				href="https://discord.gg/dzD5gt3phx"
				target="_blank"
				rel="noopener noreferrer"
				class="flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-medium transition-opacity hover:opacity-85"
				style="background:#5865f2; color:#fff;"
			>
				<svg class="size-3.5" viewBox="0 0 24 24" fill="currentColor">
					<path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
				</svg>
				<span class="hidden sm:inline">Join Server</span>
			</a>
		</div>
	</div>

	<!-- Tabs -->
	<div class="mb-4 flex" style="border-bottom:1px solid var(--dc-border);">
		<button
			onclick={() => { tab = 'doubts'; query = ''; }}
			class="cursor-pointer px-3 py-2 text-sm font-medium transition-colors"
			style={tab === 'doubts'
				? 'color:var(--dc-t1); border-bottom:2px solid var(--dc-accent); margin-bottom:-1px;'
				: 'color:var(--dc-t3); border-bottom:2px solid transparent; margin-bottom:-1px;'}
		>Doubts Solved</button>
		<button
			onclick={() => { tab = 'quiz'; query = ''; }}
			class="cursor-pointer px-3 py-2 text-sm font-medium transition-colors"
			style={tab === 'quiz'
				? 'color:var(--dc-t1); border-bottom:2px solid var(--dc-accent); margin-bottom:-1px;'
				: 'color:var(--dc-t3); border-bottom:2px solid transparent; margin-bottom:-1px;'}
		>Quiz Rankings</button>
	</div>

	<!-- Count + clear -->
	<div class="mb-2 flex items-center justify-between">
		<span class="text-[11px]" style="color:var(--dc-t3);">
			{rows.length} member{rows.length !== 1 ? 's' : ''}
		</span>
		{#if query}
			<button
				onclick={() => (query = '')}
				class="cursor-pointer text-[11px] transition-opacity hover:opacity-70"
				style="color:var(--dc-accent);"
			>Clear</button>
		{/if}
	</div>

	<!-- Table -->
	{#if rows.length === 0}
		<div class="py-16 text-center text-sm" style="color:var(--dc-t3);">No members found</div>
	{:else}
		<LeaderboardTable {pageRows} {tab} {page} pageSize={PAGE_SIZE} />
		<Pagination {page} {totalPages} onpage={(n) => (page = n)} />
	{/if}

	<p class="mt-4 text-[10px] text-neutral-300">refreshes every 1 hour</p>
</div>
</DashboardShell>
