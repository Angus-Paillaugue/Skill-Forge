<script>
	import { toast } from './index.js';
	import { cn } from '$lib/utils';
	import { CircleCheck, CircleX, TriangleAlert, X, Info } from 'lucide-svelte';
	import { slide } from 'svelte/transition';
	import { tweened } from 'svelte/motion';
	import { onMount } from 'svelte';
	import * as m from '$msgs';
	import { Button } from '$lib/components';

	const { toast: t } = $props();
	const baseToastClasses =
		'border border-neutral-700/50 bg-[#272727] text-neutral-100 relative p-4 rounded-xl overflow-hidden flex flex-col gap-2';
	const progress = tweened(0, {
		duration: t.timeout
	});

	const svgs = {
		error: {
			component: CircleX,
			color: 'text-[#ff4c3e]'
		},
		success: {
			component: CircleCheck,
			color: 'text-[#52ff6e]'
		},
		warning: {
			component: TriangleAlert,
			color: 'text-[#ffba31]'
		},
		info: {
			component: Info,
			color: 'text-[#3cbcfb]'
		}
	};

	onMount(() => {
		if (t.timeout) progress.set(100);
	});
</script>

<div role="alert" class={baseToastClasses} transition:slide={{ duration: 300, axis: 'y' }}>
	<!-- Progress -->
	{#if progress}
		<div class="absolute left-0 right-2 top-0 h-[3px]">
			<div class="h-full bg-neutral-600" style="width: {$progress}%;"></div>
		</div>
	{/if}

	<!-- Content -->
	<div class="flex flex-col gap-2">
		<div class="item-start flex flex-row gap-2">
			<!-- svelte-ignore svelte_component_deprecated -->
			<svelte:component
				this={svgs[t.type].component}
				class={cn('size-4 shrink-0', svgs[t.type].color)}
			/>

			<div class="flex grow flex-col gap-2">
				<!-- Title -->
				<p class="text-white-400 block text-base font-medium leading-4">{t.title}</p>
				<!-- Message -->
				<p class="font-base text-sm text-neutral-400">
					{@html t.message}
				</p>
			</div>
		</div>
		{#if t?.action}
			<Button variant="secondary" class="w-fit px-2 py-1 text-sm" onclick={(e) => {t.action.callback(e);if(t.action.close){toast.removeToast(t.id)}}}>
				{@html t.action.text}
			</Button>
		{/if}
	</div>

	<!-- Close button -->
	<button
		class="absolute right-2 top-2 text-neutral-400"
		name={m.components_toast_remove()}
		aria-label={m.components_toast_remove()}
		onclick={() => toast.removeToast(t.id)}
	>
		<X class="size-4" />
	</button>
</div>
