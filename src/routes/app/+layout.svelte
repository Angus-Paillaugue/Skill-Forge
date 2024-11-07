<script>
	import { Shuffle, List, MenuIcon, Route, ChevronRight, Undo2, CircleX } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import { fade, scale, slide } from 'svelte/transition';
	import { afterNavigate } from '$app/navigation';
	import { Button } from '$lib/components';
	import * as m from '$msgs';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { bounceOut } from 'svelte/easing';

	const { children, data } = $props();
	const { user } = data;

	let mobileMenuOpened = $state(false);
	let path = $derived($page.url.pathname.slice($page.url.pathname.indexOf('/app/') + 5));
	let isExercisePage = $derived(path.includes('exercises/'));
	let pageName = $state();

	const getPageTitle = () => document.title.split('|').slice(0, -1).join('|');

	afterNavigate(() => {
		mobileMenuOpened = false;
		pageName = getPageTitle();
	});

	onMount(() => {
		pageName = getPageTitle();
	});
</script>

<!-- Mobile navbar backdrop -->
{#if mobileMenuOpened}
	<button
		type="button"
		class="max-lg:bg-body/50 max-lg:fixed max-lg:inset-0 max-lg:z-40 max-lg:backdrop-blur-lg"
		transition:fade={{ duration: 300 }}
		aria-label="Close menu"
		onclick={() => (mobileMenuOpened = false)}
		onkeydown={(e) => e.key === 'Enter' && (mobileMenuOpened = false)}
	></button>
{/if}

<div class="flex h-screen w-full flex-row gap-2 bg-body lg:p-2">
	<nav
		class={cn(
			'shrink-0 flex-col rounded-xl border border-border bg-card p-2 pt-3 transition-transform duration-300 max-lg:fixed max-lg:bottom-2 max-lg:left-0 max-lg:top-2 max-lg:z-50 max-lg:flex max-lg:w-1/2 max-lg:min-w-[300px] lg:w-[16rem]',
			mobileMenuOpened
				? ' max-lg:ml-2 max-lg:translate-x-0'
				: 'hidden max-lg:-ml-2 max-lg:-translate-x-full lg:flex'
		)}
	>
		{#if path.split('/').length > 1}
			<div
				transition:slide={{ axis: 'y' }}
				class={cn('relative mb-6 flex flex-row items-center gap-2')}
			>
				<Button
					href={'/app/' + path.split('/').slice(0, -1).join('/')}
					variant="backButton"
					arial-label={m.app_home_layout_nav_go_back()}><Undo2 class="size-5" /></Button
				>
				<!-- {#if !isExercisePage} -->
				<span
					class={cn(
						'linear absolute left-2 top-1/2 -translate-y-1/2 text-lg font-medium transition-all duration-300',
						path.split('/').length > 1 && 'ml-10'
					)}>{isExercisePage ? 'Exercise' : pageName}</span
				>
				<!-- {/if} -->
			</div>
		{/if}

		<!-- Navigation -->
		<div class="flex grow flex-col">
			<!-- Exercises -->
			<div class="flex flex-col gap-1">
				<p class="mx-2 font-mono text-base text-neutral-400">
					{m.app_home_layout_nav_exercises_list()}
				</p>
				<a
					href="/app/exercises"
					class={cn(
						'group relative flex w-full flex-row items-center gap-2 overflow-hidden rounded-lg px-2 py-1 text-base font-medium text-neutral-200 transition-colors',
						path === 'exercises' ? 'bg-neutral-800/80' : 'hover:bg-neutral-800/80'
					)}
					aria-label={m.app_home_layout_nav_exercises_list_label()}
				>
					<List class="size-5" />
					{m.app_home_layout_nav_exercises_all()}
					<ChevronRight class="ml-auto size-4" />
				</a>
				<a
					href="/app/exercises/random"
					class="group relative flex w-full flex-row items-center gap-2 overflow-hidden rounded-lg px-2 py-1 text-base font-medium text-neutral-200 transition-colors hover:bg-neutral-800/80"
					aria-label={m.app_home_layout_nav_random_exercise_label()}
				>
					<Shuffle class="size-5" />
					{m.app_home_layout_nav_exercises_random()}
					<ChevronRight class="ml-auto size-4" />
				</a>
			</div>
			<hr />

			<!-- Learning paths -->
			<a
				href="/app/learning-paths"
				class={cn(
					'group relative flex w-full flex-row items-center gap-2 overflow-hidden rounded-lg px-2 py-1 text-base font-medium text-neutral-200 transition-colors hover:bg-card',
					path.startsWith('learning-paths') ? 'bg-neutral-800/80' : 'hover:bg-neutral-800/80'
				)}
				aria-label={m.app_home_layout_nav_learning_paths_label()}
			>
				<Route class="size-5" />
				{m.app_home_layout_nav_learning_paths()}
				<ChevronRight class="ml-auto size-4" />
			</a>
		</div>

		<!-- Profile -->
		<a
			href="/app/account"
			aria-label={m.app_home_layout_nav_profile_label()}
			class={cn(
				'flex flex-row items-center gap-4 rounded-lg p-2 transition-colors',
				path.startsWith('account') ? 'bg-neutral-800/80' : 'hover:bg-neutral-800/80'
			)}
		>
			<img src={user.profile_picture} alt="" class="size-10 rounded-lg object-cover" />
			<div class="flex h-full flex-col justify-between">
				<span class="line-clamp-1 text-base font-medium text-neutral-100">{user.username}</span>
				<span class="font-mono text-xs text-neutral-400"
					>{m.app_home_layout_nav_your_profile()}</span
				>
			</div>
		</a>
	</nav>

	<!-- Content -->
	<div class="no-scrollbar flex h-full grow flex-col overflow-auto">
		<!-- Page title and back button on mobile -->
		<div
			class={cn(
				'sticky top-0 z-30 flex flex-row items-center gap-4 px-2 py-4 lg:hidden',
				isExercisePage ? 'bg-neutral-950' : 'bg-body'
			)}
		>
			{#if path.split('/').length > 1}
				<div transition:scale|global={{ ease: bounceOut, start: 0, duration: 500 }}>
					<Button
						href="/app/account"
						variant="backButton"
						arial-label={m.app_home_layout_nav_go_back()}><Undo2 class="size-5" /></Button
					>
				</div>
				{#if !isExercisePage}
					<div transition:fade|global class="h-full w-px bg-border"></div>
				{/if}
			{/if}
			{#if !isExercisePage}
				<span
					class={cn(
						'absolute left-2 top-1/2 -translate-y-1/2 text-lg font-medium transition-all duration-500 ease-in-out',
						path.split('/').length > 1 && 'ml-16'
					)}>{pageName}</span
				>
			{/if}
			<div class="h-8"></div>
		</div>
		<!-- Open mobile nav button -->
		<Button
			class={cn(
				'fixed right-2 top-4 ml-auto transition-transform max-lg:z-50 lg:hidden',
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
		<div class="flex grow flex-col max-lg:p-2">
			{@render children()}
		</div>
	</div>
</div>
