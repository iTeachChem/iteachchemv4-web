<script lang="ts">
	import { Badge } from 'flowbite-svelte';
	import type { UserRow } from '../../routes/+page.server';

	interface Props {
		pageRows: UserRow[];
		tab: 'doubts' | 'quiz';
		page: number;
		pageSize: number;
	}

	let { pageRows, tab, page, pageSize }: Props = $props();
</script>

<div class="overflow-x-auto rounded" style="background:var(--dc-2);">
	<table class="w-full min-w-[280px] text-sm">
		<thead>
			<tr style="border-bottom:1px solid var(--dc-border);">
				<th class="w-10 px-2 py-2 text-left text-[10px] font-bold uppercase tracking-wider sm:w-12 sm:px-3" style="color:var(--dc-t3);">#</th>
				<th class="px-2 py-2 text-left text-[10px] font-bold uppercase tracking-wider sm:px-3" style="color:var(--dc-t3);">Member</th>
				<th class="px-2 py-2 text-right text-[10px] font-bold uppercase tracking-wider sm:px-3" style="color:var(--dc-t3);">{tab === 'doubts' ? 'Doubts' : 'Solved'}</th>
				{#if tab === 'quiz'}
					<th class="hidden px-2 py-2 text-right text-[10px] font-bold uppercase tracking-wider sm:table-cell sm:px-3" style="color:var(--dc-t3);">Attempted</th>
				{/if}
			</tr>
		</thead>
		<tbody>
			{#each pageRows as row, i (row.user_id)}
				{@const rank = (page - 1) * pageSize + i}
				<tr
					class="transition-colors"
					style="border-bottom:1px solid var(--dc-border);"
					onmouseenter={(e) => ((e.currentTarget as HTMLElement).style.background = '#32353b')}
					onmouseleave={(e) => ((e.currentTarget as HTMLElement).style.background = '')}
				>
					<td class="px-2 py-2 sm:px-3">
						{#if rank === 0}
							<span class="text-base">🥇</span>
						{:else if rank === 1}
							<span class="text-base">🥈</span>
						{:else if rank === 2}
							<span class="text-base">🥉</span>
						{:else}
							<span class="font-mono text-xs" style="color:var(--dc-t4);">{rank + 1}</span>
						{/if}
					</td>
					<td class="max-w-[120px] truncate px-2 py-2 font-medium sm:max-w-none sm:px-3" style="color:var(--dc-t1);">{row.username}</td>
					<td class="px-2 py-2 text-right sm:px-3">
						<Badge color="blue" class="font-mono text-[11px] font-semibold">
							{tab === 'doubts' ? row.doubts_solved : row.questions_solved}
						</Badge>
					</td>
					{#if tab === 'quiz'}
						<td class="hidden px-2 py-2 text-right font-mono text-xs sm:table-cell sm:px-3" style="color:var(--dc-t3);">
							{row.questions_attempted ?? 0}
						</td>
					{/if}
				</tr>
			{/each}
		</tbody>
	</table>
</div>
