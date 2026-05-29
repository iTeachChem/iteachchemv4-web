<script lang="ts">
	interface Props {
		page: number;
		totalPages: number;
		onpage: (n: number) => void;
	}

	let { page, totalPages, onpage }: Props = $props();
</script>

{#if totalPages > 1}
	<div class="mt-3 flex items-center justify-center gap-1">
		<button
			onclick={() => onpage(page - 1)}
			disabled={page === 1}
			class="flex size-7 cursor-pointer items-center justify-center rounded text-xs transition-colors disabled:cursor-default disabled:opacity-30"
			style="background:var(--dc-2); color:var(--dc-t2);"
			onmouseenter={(e) => { if (page !== 1) (e.currentTarget as HTMLElement).style.background = '#32353b'; }}
			onmouseleave={(e) => { if (page !== 1) (e.currentTarget as HTMLElement).style.background = 'var(--dc-2)'; }}
		>‹</button>

		{#each Array.from({ length: totalPages }, (_, i) => i + 1) as n}
			<button
				onclick={() => onpage(n)}
				class="flex size-7 cursor-pointer items-center justify-center rounded font-mono text-xs font-medium transition-colors"
				style={page === n
					? 'background:var(--dc-accent); color:#fff;'
					: 'background:var(--dc-2); color:var(--dc-t3);'}
				onmouseenter={(e) => { if (page !== n) (e.currentTarget as HTMLElement).style.background = '#32353b'; }}
				onmouseleave={(e) => { if (page !== n) (e.currentTarget as HTMLElement).style.background = 'var(--dc-2)'; }}
			>{n}</button>
		{/each}

		<button
			onclick={() => onpage(page + 1)}
			disabled={page === totalPages}
			class="flex size-7 cursor-pointer items-center justify-center rounded text-xs transition-colors disabled:cursor-default disabled:opacity-30"
			style="background:var(--dc-2); color:var(--dc-t2);"
			onmouseenter={(e) => { if (page !== totalPages) (e.currentTarget as HTMLElement).style.background = '#32353b'; }}
			onmouseleave={(e) => { if (page !== totalPages) (e.currentTarget as HTMLElement).style.background = 'var(--dc-2)'; }}
		>›</button>
	</div>
{/if}
