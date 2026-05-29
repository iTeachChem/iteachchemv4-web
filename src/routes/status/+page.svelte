<script lang="ts">
	let { data } = $props();

	let now = $state(new Date());

	$effect(() => {
		const t = setInterval(() => (now = new Date()), 1000);
		return () => clearInterval(t);
	});

	function formatUptime(isoString: string, tick: Date): string {
		const started = new Date(isoString);
		const diffMs = tick.getTime() - started.getTime();
		if (diffMs < 0) return 'just started';
		const s = Math.floor(diffMs / 1000);
		const m = Math.floor(s / 60);
		const h = Math.floor(m / 60);
		const d = Math.floor(h / 24);
		if (d > 0) return `${d}d ${h % 24}h ${m % 60}m ${s % 60}s`;
		if (h > 0) return `${h}h ${m % 60}m ${s % 60}s`;
		if (m > 0) return `${m}m ${s % 60}s`;
		return `${s}s`;
	}

	type BarState = 'online' | 'offline' | 'unknown';

	function computeBars(
		startedAt: string | null,
		tick: Date,
		count: number,
		intervalMs: number
	): BarState[] {
		if (!startedAt) return Array(count).fill('unknown');
		const started = new Date(startedAt);
		return Array.from({ length: count }, (_, i) => {
			const barEnd = new Date(tick.getTime() - (count - 1 - i) * intervalMs);
			return started <= barEnd ? 'online' : 'unknown';
		});
	}

	function uptimePct(bars: BarState[]): string {
		const known = bars.filter((b) => b !== 'unknown');
		if (!known.length) return '—';
		const pct = (known.filter((b) => b === 'online').length / known.length) * 100;
		return pct.toFixed(2) + '%';
	}

	function barTimeRange(i: number, count: number, intervalMs: number, tick: Date) {
		const barEnd   = new Date(tick.getTime() - (count - 1 - i) * intervalMs);
		const barStart = new Date(barEnd.getTime() - intervalMs);
		const fmt = (d: Date) =>
			intervalMs < 86_400_000
				? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
				: d.toLocaleDateString([], { month: 'short', day: 'numeric' });
		return `${fmt(barStart)} – ${fmt(barEnd)}`;
	}

	const HALF_HOUR_MS = 30 * 60_000;
	const DAY_MS       = 86_400_000;
	const BAR_COUNT    = 20;

	const halfHourBars = $derived(computeBars(data.startedAt, now, BAR_COUNT, HALF_HOUR_MS));
	const dailyBars    = $derived(computeBars(data.startedAt, now, BAR_COUNT, DAY_MS));
	const online       = $derived(!!data.startedAt);

	const fill: Record<BarState, { base: string; hover: string }> = {
		online:  { base: '#23a55a', hover: '#3dbd72' },
		offline: { base: '#f23f42', hover: '#ff6b6b' },
		unknown: { base: '#4e5058', hover: '#636970' },
	};

	type TooltipInfo = {
		visible: boolean;
		x: number;
		y: number;
		timeRange: string;
		state: BarState;
	};

	let tooltip = $state<TooltipInfo>({
		visible: false, x: 0, y: 0, timeRange: '', state: 'unknown',
	});

	let hoveredChart = $state<string | null>(null);
	let hoveredIdx   = $state<number | null>(null);

	function showTooltip(
		e: MouseEvent,
		state: BarState,
		i: number,
		count: number,
		intervalMs: number,
		chart: string
	) {
		const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
		hoveredChart = chart;
		hoveredIdx   = i;
		tooltip = {
			visible:   true,
			x:         rect.left + rect.width / 2,
			y:         rect.top - 8,
			timeRange: barTimeRange(i, count, intervalMs, now),
			state,
		};
	}

	function hideTooltip() {
		tooltip   = { ...tooltip, visible: false };
		hoveredChart = null;
		hoveredIdx   = null;
	}

	const statusLabel: Record<BarState, string> = {
		online:  'Operational',
		offline: 'Downtime',
		unknown: 'No data',
	};

	const legend: [string, string][] = [
		['#23a55a', 'Online'],
		['#f23f42', 'Offline'],
		['#4e5058', 'No data'],
	];

	const statusColor: Record<BarState, string> = {
		online:  '#23a55a',
		offline: '#f23f42',
		unknown: '#80848e',
	};
</script>

<svelte:head>
	<title>iteachchem · bot status</title>
</svelte:head>

<!-- Custom tooltip -->
{#if tooltip.visible}
	<div
		class="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-full rounded-md px-3 py-2 text-left shadow-xl"
		style="left:{tooltip.x}px; top:{tooltip.y - 6}px; background:var(--dc-3); border:1px solid var(--dc-border); min-width:120px;"
	>
		<p class="text-xs font-semibold" style="color:var(--dc-t1);">{tooltip.timeRange}</p>
		<p class="mt-0.5 text-[11px] font-medium" style="color:{statusColor[tooltip.state]};">
			{statusLabel[tooltip.state]}
		</p>
		<span
			class="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent"
			style="border-top-color:var(--dc-border);"
		></span>
	</div>
{/if}

<div
	class="flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6"
	style="background:var(--dc-1); color:var(--dc-t1);"
>
	<div class="w-full max-w-sm sm:max-w-md">

		<!-- Top bar -->
		<div class="mb-6 flex items-center justify-between">
			<a href="/" class="text-xs font-medium transition-opacity hover:opacity-70" style="color:var(--dc-t3);">← Leaderboard</a>
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
				Join Server
			</a>
		</div>

		<!-- Avatar + name -->
		<div class="mb-8 flex flex-col items-center gap-3 text-center">
			{#if data.bot}
				<div class="relative">
					<img
						src={data.bot.avatarUrl}
						alt="bot avatar"
						class="size-20 rounded-full sm:size-24"
						style="border:3px solid {online ? '#23a55a' : '#80848e'};"
					/>
					<span
						class="absolute bottom-1 right-1 size-4 rounded-full ring-[3px] sm:size-5"
						style="background:{online ? '#23a55a' : '#80848e'}; --tw-ring-color:var(--dc-1);"
					></span>
				</div>
				<div>
					<h1 class="text-xl font-bold sm:text-2xl" style="color:var(--dc-t1);">{data.bot.username}</h1>
					<p class="mt-0.5 text-xs sm:text-sm" style="color:var(--dc-t3);">Discord Bot · iteachchem</p>
				</div>
			{:else}
				<div class="flex size-20 items-center justify-center rounded-full text-3xl sm:size-24 sm:text-4xl" style="background:var(--dc-4);">🤖</div>
				<div>
					<h1 class="text-xl font-bold sm:text-2xl" style="color:var(--dc-t1);">Bot Status</h1>
					<p class="mt-0.5 text-xs" style="color:#f23f42;">{data.tokenError ?? 'Unknown error'}</p>
				</div>
			{/if}
		</div>

		<!-- Status card -->
		<div class="w-full overflow-hidden rounded-lg" style="background:var(--dc-2); border:1px solid var(--dc-border);">
			<div class="flex items-center justify-between px-4 py-3 sm:px-5 sm:py-4" style="border-bottom:1px solid var(--dc-border);">
				<span class="text-[11px] font-bold uppercase tracking-wider sm:text-xs" style="color:var(--dc-t3);">Status</span>
				<div class="flex items-center gap-2">
					<span class="size-2 rounded-full" style="background:{online ? '#23a55a' : '#80848e'};"></span>
					<span class="text-sm font-semibold" style="color:{online ? '#23a55a' : 'var(--dc-t2)'};">
						{online ? 'Online' : 'Offline'}
					</span>
				</div>
			</div>
			<div class="flex items-center justify-between px-4 py-3 sm:px-5 sm:py-4" style="border-bottom:1px solid var(--dc-border);">
				<span class="text-[11px] font-bold uppercase tracking-wider sm:text-xs" style="color:var(--dc-t3);">Uptime</span>
				{#if data.startedAt}
					<span class="font-mono text-sm font-semibold" style="color:var(--dc-accent);">{formatUptime(data.startedAt, now)}</span>
				{:else}
					<span class="text-sm" style="color:var(--dc-t3);">—</span>
				{/if}
			</div>
			<div class="flex items-center justify-between px-4 py-3 sm:px-5 sm:py-4">
				<span class="text-[11px] font-bold uppercase tracking-wider sm:text-xs" style="color:var(--dc-t3);">Last Start</span>
				{#if data.startedAt}
					<span class="text-xs sm:text-sm" style="color:var(--dc-t2);">{new Date(data.startedAt).toLocaleString()}</span>
				{:else}
					<span class="text-sm" style="color:var(--dc-t3);">No data</span>
				{/if}
			</div>
		</div>

		<!-- 30-min bar chart -->
		<div class="mt-4 w-full overflow-hidden rounded-lg" style="background:var(--dc-2); border:1px solid var(--dc-border);">
			<div class="flex items-center justify-between px-4 py-3 sm:px-5" style="border-bottom:1px solid var(--dc-border);">
				<div>
					<span class="text-[11px] font-bold uppercase tracking-wider sm:text-xs" style="color:var(--dc-t3);">30-Min Intervals</span>
					<span class="ml-2 text-[10px]" style="color:var(--dc-t4);">last 10 h</span>
				</div>
				<span class="font-mono text-xs font-semibold" style="color:{online ? '#23a55a' : 'var(--dc-t3)'};">{uptimePct(halfHourBars)}</span>
			</div>
			<div class="px-4 py-4 sm:px-5">
				<div class="flex items-end gap-[3px]">
					{#each halfHourBars as state, i}
						{@const hovered = hoveredChart === 'half' && hoveredIdx === i}
						<div
							role="presentation"
							class="min-w-0 flex-1 cursor-default rounded-sm transition-colors duration-150"
							style="height:28px; background:{hovered ? fill[state].hover : fill[state].base}; opacity:{state === 'unknown' ? (hovered ? 0.55 : 0.3) : 1};"
							onmouseenter={(e) => showTooltip(e, state, i, BAR_COUNT, HALF_HOUR_MS, 'half')}
							onmouseleave={hideTooltip}
						></div>
					{/each}
				</div>
				<div class="mt-2 flex justify-between">
					<span class="text-[10px]" style="color:var(--dc-t4);">10 h ago</span>
					<span class="text-[10px]" style="color:var(--dc-t4);">now</span>
				</div>
			</div>
		</div>

		<!-- Daily bar chart -->
		<div class="mt-4 w-full overflow-hidden rounded-lg" style="background:var(--dc-2); border:1px solid var(--dc-border);">
			<div class="flex items-center justify-between px-4 py-3 sm:px-5" style="border-bottom:1px solid var(--dc-border);">
				<div>
					<span class="text-[11px] font-bold uppercase tracking-wider sm:text-xs" style="color:var(--dc-t3);">Daily</span>
					<span class="ml-2 text-[10px]" style="color:var(--dc-t4);">last 20 days</span>
				</div>
				<span class="font-mono text-xs font-semibold" style="color:{online ? '#23a55a' : 'var(--dc-t3)'};">{uptimePct(dailyBars)}</span>
			</div>
			<div class="px-4 py-4 sm:px-5">
				<div class="flex items-end gap-[3px]">
					{#each dailyBars as state, i}
						{@const hovered = hoveredChart === 'daily' && hoveredIdx === i}
						<div
							role="presentation"
							class="min-w-0 flex-1 cursor-default rounded-sm transition-colors duration-150"
							style="height:28px; background:{hovered ? fill[state].hover : fill[state].base}; opacity:{state === 'unknown' ? (hovered ? 0.55 : 0.3) : 1};"
							onmouseenter={(e) => showTooltip(e, state, i, BAR_COUNT, DAY_MS, 'daily')}
							onmouseleave={hideTooltip}
						></div>
					{/each}
				</div>
				<div class="mt-2 flex justify-between">
					<span class="text-[10px]" style="color:var(--dc-t4);">20 days ago</span>
					<span class="text-[10px]" style="color:var(--dc-t4);">today</span>
				</div>
			</div>
		</div>

		<!-- Legend -->
		<div class="mt-4 flex items-center justify-center gap-4">
			{#each legend as [color, label]}
				<div class="flex items-center gap-1.5">
					<span class="size-2.5 rounded-sm" style="background:{color};"></span>
					<span class="text-[11px]" style="color:var(--dc-t3);">{label}</span>
				</div>
			{/each}
		</div>

		<p class="mt-5 text-center text-[10px]" style="color:var(--dc-t4);">ticks live · data refreshes every 10 s on reload</p>
	</div>
</div>
