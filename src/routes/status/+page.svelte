<script lang="ts">
	import { Badge } from 'flowbite-svelte';
	import DashboardShell from '$lib/components/DashboardShell.svelte';

	let { data } = $props();

	function formatUptime(isoString: string): string {
		const started = new Date(isoString);
		const now = new Date();
		const diffMs = now.getTime() - started.getTime();
		if (diffMs < 0) return 'just started';

		const s = Math.floor(diffMs / 1000);
		const m = Math.floor(s / 60);
		const h = Math.floor(m / 60);
		const d = Math.floor(h / 24);

		if (d > 0) return `${d}d ${h % 24}h ${m % 60}m`;
		if (h > 0) return `${h}h ${m % 60}m`;
		if (m > 0) return `${m}m ${s % 60}s`;
		return `${s}s`;
	}
</script>

<DashboardShell>
<div class="px-6 py-6 max-w-lg">
	<div class="rounded overflow-hidden" style="background:var(--dc-2); border:1px solid var(--dc-border);">

		<!-- Bot identity -->
		<div class="flex items-center gap-3 px-4 py-4" style="border-bottom:1px solid var(--dc-border);">
			{#if data.bot}
				<img src={data.bot.avatarUrl} alt="bot avatar" class="size-10 rounded-full" />
				<div>
					<p class="text-sm font-semibold" style="color:var(--dc-t1);">
						{data.bot.username}
						{#if data.bot.discriminator !== '0'}
							<span style="color:var(--dc-t3);">#{data.bot.discriminator}</span>
						{/if}
					</p>
					<p class="text-[11px]" style="color:var(--dc-t3);">ID: {data.bot.id}</p>
				</div>
				<div class="ml-auto">
					<Badge color="green" class="text-[11px]">token valid</Badge>
				</div>
			{:else}
				<div class="flex items-center gap-2">
					<Badge color="red" class="text-[11px]">token error</Badge>
					<span class="text-xs" style="color:var(--dc-t3);">{data.tokenError}</span>
				</div>
			{/if}
		</div>

		<!-- Uptime row -->
		<div class="px-4 py-3">
			<p class="mb-2 text-[10px] font-bold uppercase tracking-wider" style="color:var(--dc-t3);">
				Process Uptime
			</p>
			{#if data.startedAt}
				{@const uptime = formatUptime(data.startedAt)}
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-semibold" style="color:var(--dc-t1);">{uptime}</p>
						<p class="text-[11px]" style="color:var(--dc-t3);">
							started {new Date(data.startedAt).toLocaleString()}
						</p>
					</div>
					<Badge color="green" class="text-[11px]">online</Badge>
				</div>
			{:else}
				<div class="flex items-center justify-between">
					<p class="text-xs" style="color:var(--dc-t3);">
						No heartbeat in DB yet — add <code
							class="rounded px-1 py-0.5 text-[11px]"
							style="background:var(--dc-3); color:var(--dc-t2);">set_started_at()</code
						> to your bot's <code
							class="rounded px-1 py-0.5 text-[11px]"
							style="background:var(--dc-3); color:var(--dc-t2);">on_ready</code
						>
					</p>
					<Badge color="yellow" class="text-[11px]">unknown</Badge>
				</div>
			{/if}
		</div>
	</div>

	<p class="mt-3 text-[10px]" style="color:var(--dc-t4);">
		token check · refreshes on page load &nbsp;·&nbsp; uptime cache 10 s
	</p>
</div>
</DashboardShell>
