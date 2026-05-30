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
	<table class="mx-auto w-full max-w-2xl text-base">
		<thead>
			<tr style="border-bottom:1px solid var(--dc-border);">
				<th class="w-12 px-3 py-3 text-left text-xs font-bold uppercase tracking-wider" style="color:var(--dc-t3);">#</th>
				<th class="px-3 py-3 text-left text-xs font-bold uppercase tracking-wider" style="color:var(--dc-t3);">Member</th>
				<th class="px-3 py-3 text-right text-xs font-bold uppercase tracking-wider" style="color:var(--dc-t3);">{tab === 'doubts' ? 'Doubts' : 'Solved'}</th>
				{#if tab === 'quiz'}
					<th class="hidden px-3 py-3 text-right text-xs font-bold uppercase tracking-wider sm:table-cell" style="color:var(--dc-t3);">Attempted</th>
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
					<td class="px-3 py-4">
						{#if rank === 0}
							<span class="text-xl">🥇</span>
						{:else if rank === 1}
							<span class="text-xl">🥈</span>
						{:else if rank === 2}
							<span class="text-xl">🥉</span>
						{:else}
							<span class="font-mono text-sm" style="color:var(--dc-t4);">{rank + 1}</span>
						{/if}
					</td>
					<td class="max-w-[140px] truncate px-3 py-4 text-base font-medium sm:max-w-none" style="color:var(--dc-t1);">{row.username}</td>
					<td class="px-3 py-4 text-right">
						<Badge color="blue" class="font-mono text-sm font-semibold">
							{tab === 'doubts' ? row.doubts_solved : row.questions_solved}
						</Badge>
					</td>
					{#if tab === 'quiz'}
						<td class="hidden px-3 py-4 text-right font-mono text-sm sm:table-cell" style="color:var(--dc-t3);">
							{row.questions_attempted ?? 0}
						</td>
					{/if}
				</tr>
			{/each}
		</tbody>
	</table>
</div>
