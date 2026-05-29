<script lang="ts">
	import { enhance } from '$app/forms';

	let { form } = $props();
	let loading = $state(false);
</script>

<div class="flex min-h-screen items-center justify-center px-4" style="background:var(--dc-1);">
	<div class="w-full max-w-xs">
		<div class="overflow-hidden rounded" style="background:var(--dc-2); border:1px solid var(--dc-border);">
			<!-- Header -->
			<div class="px-5 py-4" style="border-bottom:1px solid var(--dc-border);">
				<p class="mb-0.5 text-[10px] font-bold uppercase tracking-widest" style="color:var(--dc-accent);">
					iteachchem
				</p>
				<h1 class="text-sm font-semibold" style="color:var(--dc-t1);">Dashboard Login</h1>
				<p class="mt-0.5 text-xs" style="color:var(--dc-t3);">Sign in to continue.</p>
			</div>

			<!-- Form -->
			<form
				method="POST"
				action="?/login"
				class="flex flex-col gap-3 px-5 py-4"
				use:enhance={() => {
					loading = true;
					return async ({ update }) => { await update(); loading = false; };
				}}
			>
				<div class="flex flex-col gap-1">
					<label for="email" class="text-[11px] font-semibold uppercase tracking-wider" style="color:var(--dc-t3);">
						Email
					</label>
					<input
						id="email"
						name="email"
						type="email"
						autocomplete="email"
						placeholder="you@example.com"
						class="rounded px-3 py-1.5 text-sm outline-none"
						style="background:var(--dc-3); color:var(--dc-t1); border:1px solid {form?.error ? '#f23f42' : 'var(--dc-5)'};"
					/>
				</div>

				<div class="flex flex-col gap-1">
					<label for="password" class="text-[11px] font-semibold uppercase tracking-wider" style="color:var(--dc-t3);">
						Password
					</label>
					<input
						id="password"
						name="password"
						type="password"
						autocomplete="current-password"
						placeholder="••••••••"
						class="rounded px-3 py-1.5 text-sm outline-none"
						style="background:var(--dc-3); color:var(--dc-t1); border:1px solid {form?.error ? '#f23f42' : 'var(--dc-5)'};"
					/>
					{#if form?.error}
						<p class="text-[11px]" style="color:#f23f42;">{form.error}</p>
					{/if}
				</div>

				<button
					type="submit"
					disabled={loading}
					class="cursor-pointer rounded py-1.5 text-sm font-semibold transition-opacity disabled:opacity-60"
					style="background:var(--dc-accent); color:#fff;"
				>
					{loading ? 'Verifying…' : 'Login'}
				</button>
			</form>
		</div>
	</div>
</div>
