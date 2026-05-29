<script lang="ts">
	import Sidebar from './Sidebar.svelte';
	import Navbar from './Navbar.svelte';

	let { children } = $props();
</script>

<Sidebar />
<Navbar />

<main class="ml-48 mt-11 min-h-screen" style="background:var(--dc-1); color:var(--dc-t1);">
	{@render children()}
</main>
