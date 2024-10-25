<script>
	import { removeToast } from '$lib/stores';
	import { scale } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { toasts } from '$lib/stores';
	import { cn } from '$lib/utils';
	import { CircleCheckBig, CircleX, TriangleAlert, X } from 'lucide-svelte';

	const baseToastClasses = 'rounded-xl bg-neutral-800 ring-2 ring-neutral-600/50 p-4 relative';

	const svgColors = {
		red: 'text-red-600',
		green: 'text-green-600',
		gray: 'text-neutral-600'
	};
</script>

<div
	class="fixed left-1/2 top-16 z-[51] flex w-full max-w-[300px] -translate-x-1/2 flex-col-reverse gap-2"
>
	{#each $toasts.slice(0, 4) as toast (toast.id)}
		<div
			role="alert"
			class={baseToastClasses}
			animate:flip={{ duration: 500 }}
			transition:scale={{ duration: 300 }}
		>
			<div class="flex items-center gap-2">
				{#if toast.type === 'red'}
					<CircleX class={cn('h-5 w-5', svgColors[toast.type])} />
				{:else if toast.type === 'green'}
					<CircleCheckBig class={cn('h-5 w-5', svgColors[toast.type])} />
				{:else}
					<TriangleAlert class={cn('h-5 w-5', svgColors[toast.type])} />
				{/if}

				<strong class="block text-lg font-bold">{toast.title}</strong>
			</div>

			<p class="mb-0 mt-2 text-sm font-medium">
				{@html toast.message}
			</p>
			<button
				class="absolute right-2 top-2"
				name="Remove toast"
				aria-label="Remove toast"
				on:click={() => removeToast(toast.id)}
			>
				<X class="size-6" />
			</button>
		</div>
	{/each}
</div>
