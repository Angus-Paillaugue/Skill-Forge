<script>
	import { Shuffle, List, MenuIcon, Route, ChevronRight } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import { fade } from 'svelte/transition';
	import { afterNavigate } from '$app/navigation';
	import { Button } from '$lib/components';
	import * as m from '$msgs';
	import { page } from '$app/stores';

	const { children, data } = $props();
	const { user } = data;

	let mobileMenuOpened = $state(false);
	let path = $derived($page.url.pathname.slice($page.url.pathname.indexOf('/app/') + 5));
	let isExercisePage = $derived(path.includes('exercises/'));

	afterNavigate(() => {
		mobileMenuOpened = false;
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
			'shrink-0 flex-col gap-6 rounded-xl border border-border bg-card p-2 transition-transform duration-300 max-lg:fixed max-lg:bottom-0 max-lg:left-0 max-lg:top-0 max-lg:z-50 max-lg:flex max-lg:w-1/2 max-lg:min-w-[300px] lg:w-[16rem]',
			mobileMenuOpened ? ' max-lg:translate-x-0' : 'hidden max-lg:-translate-x-full lg:flex'
		)}
	>
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
				<span class="font-mono text-xs text-neutral-400">{m.app_home_layout_nav_your_profile()}</span>
			</div>
		</a>

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
	</nav>
	<div class="no-scrollbar flex h-full grow flex-col overflow-auto">
		<!-- Open mobile nav button and breadcrumbs -->
		<div
			class={cn(
				'sticky top-0 z-30 flex flex-row items-center gap-4 p-4 lg:hidden',
				isExercisePage ? 'bg-neutral-950' : 'bg-bodyzx'
			)}
		>
			<Button
				class="w-fit p-1.5"
				variant="primary"
				aria-label={m.app_home_layout_nav_open_menu_label()}
				onclick={() => (mobileMenuOpened = !mobileMenuOpened)}
			>
				<MenuIcon class="size-5" />
			</Button>
		</div>
		<div class={cn('flex grow flex-col')}>
			{@render children()}
		</div>
	</div>
</div>
