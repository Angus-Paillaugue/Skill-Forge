<script>
	import { MenuIcon, Undo2, CircleX } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import { fade, scale } from 'svelte/transition';
	import { Button } from '$lib/components';
	import * as m from '$msgs';
	import { page } from '$app/stores';
	import { bounceOut } from 'svelte/easing';

	let { mobileMenuOpened = $bindable(false), pageName = $bindable('') } = $props();
	let path = $derived($page.url.pathname.slice($page.url.pathname.indexOf('/app/') + 5));
	let isExercisePage = $derived(path.includes('exercises/'));
</script>

<header
	class={cn(
		'sticky top-0 z-30 flex h-12 shrink-0 flex-row items-center gap-4 px-2 lg:hidden',
		isExercisePage ? 'bg-neutral-900' : 'bg-body'
	)}
>
	<!-- Go back button (shown if the page is nested i.e: /app/account/settings) -->
	{#if path.split('/').length > 1}
		<div transition:scale|global={{ ease: bounceOut, start: 0, duration: 500 }}>
			<Button href="/app/account" variant="backButton" arial-label={m.app_home_layout_nav_go_back()}
				><Undo2 class="size-5" /></Button
			>
		</div>
		{#if !isExercisePage}
			<div transition:fade|global class="h-full w-px bg-border"></div>
		{/if}
	{/if}

	<!-- Page title -->
	{#if !isExercisePage}
		<span
			class={cn(
				'absolute left-2 top-1/2 -translate-y-1/2 text-lg font-medium transition-all duration-500 ease-in-out',
				path.split('/').length > 1 && 'ml-16'
			)}>{pageName}</span
		>
	{/if}
</header>

<!-- Open mobile nav button -->
<Button
	class={cn(
		'fixed right-2 top-2 z-50 ml-auto transition-transform lg:hidden',
		mobileMenuOpened ? 'scale-125' : ''
	)}
	variant="backButton"
	aria-label={m.app_home_layout_nav_open_menu_label()}
	onclick={() => (mobileMenuOpened = !mobileMenuOpened)}
>
	{#if mobileMenuOpened}
		<span in:scale>
			<CircleX class="size-5" />
		</span>
	{:else}
		<span in:scale>
			<MenuIcon class="size-5" />
		</span>
	{/if}
</Button>
