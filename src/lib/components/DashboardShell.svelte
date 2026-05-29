<script lang="ts">
	let { children } = $props();
</script>

<main class="min-h-screen" style="background:var(--dc-1); color:var(--dc-t1);">
	{@render children()}
</main>
