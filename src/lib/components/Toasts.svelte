<script>
	import { removeToast } from '$lib/stores';
	import { fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { toasts } from '$lib/stores';
	import { cn } from '$lib/utils';

	const baseToastClasses = 'rounded-xl border bg-neutral-900 border-neutral-700 p-4 relative';

	const svgColors = {
		red: 'text-red-600',
		green: 'text-green-600',
		gray: 'text-neutral-600'
	};
</script>

<div
	class="fixed bottom-0 right-0 z-[51] flex max-h-[100vh-5rem] w-full max-w-[500px] flex-col-reverse gap-2 p-2 lg:p-4"
>
	{#each $toasts.slice(0, 4) as toast (toast.id)}
		<div
			role="alert"
			class={baseToastClasses}
			animate:flip={{ duration: 500 }}
			transition:fly={{ duration: 250, x: '100%' }}
		>
			<div class="flex items-center gap-2">
				{#if toast.type === 'red'}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class={cn('h-5 w-5', svgColors[toast.type])}
						><path d="M12 16h.01" /><path d="M12 8v4" /><path
							d="M15.312 2a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586l-4.688-4.688A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2z"
						/></svg
					>
				{:else if toast.type === 'green'}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class={cn('h-5 w-5', svgColors[toast.type])}
						><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg
					>
				{:else}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class={cn('h-5 w-5', svgColors[toast.type])}
						><path
							d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"
						/><path d="M12 9v4" /><path d="M12 17h.01" /></svg
					>
				{/if}

				<strong class="block font-medium">{toast.title}</strong>
			</div>

			<p class="mb-0 mt-2 text-sm">
				{@html toast.message}
			</p>
			<button
				class="absolute right-2 top-2"
				name="Remove toast"
				aria-label="Remove toast"
				on:click={() => removeToast(toast.id)}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="size-5"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg
				>
			</button>
		</div>
	{/each}
</div>
