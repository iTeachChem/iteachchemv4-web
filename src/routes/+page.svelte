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
<div class="px-6 py-6">
	<!-- Search -->
	<div class="relative mb-4 max-w-xs">
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

	<p class="mt-4 text-[10px]" style="color:var(--dc-t4);">refreshes every 30 s</p>
</div>
</DashboardShell>
