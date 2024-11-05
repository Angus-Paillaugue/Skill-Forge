<script>
	import { Shuffle, List, Home, MenuIcon, Route } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import { fly } from 'svelte/transition';
	import { afterNavigate } from '$app/navigation';
	import { Button } from '$lib/components';
	import * as m from '$msgs';

	const { children, data } = $props();
	const { user } = data;

	let mobileMenuOpened = $state(false);

	afterNavigate(() => {
		mobileMenuOpened = false;
	});
</script>

{#if mobileMenuOpened}
	<div
		transition:fly={{ x: '-100%', opacity: 1 }}
		class="fixed bottom-0 left-0 right-0 top-14 z-40 block bg-neutral-900/50 px-4 py-8 backdrop-blur md:hidden"
	>
		<div class="mx-auto flex w-fit flex-col items-center gap-4">
			<a
				href="/app/exercises"
				aria-label={m.app_home_layout_nav_exercises_list_label()}
				class="flex w-full flex-row items-center justify-center gap-2 rounded-full border border-neutral-700/50 bg-neutral-600/30 px-4 py-2 text-center text-base transition-colors"
			>
				<List class="size-5" />
				{m.app_home_layout_nav_exercises_list()}
			</a>
			<a
				href="/app/exercises/random"
				class="flex w-full flex-row items-center justify-center gap-2 rounded-full border border-neutral-700/50 bg-neutral-600/30 px-4 py-2 text-center text-base transition-colors"
				aria-label={m.app_home_layout_nav_random_exercise_label()}
			>
				<Shuffle class="size-4" />
				{m.app_home_layout_nav_random_exercise()}
			</a>

			<!-- Horizontal separator -->
			<div class="w-full px-2">
				<hr class="w-full bg-neutral-700/50" />
			</div>

			<a
				href="/app/learning-paths"
				class="flex w-full flex-row items-center justify-center gap-2 rounded-full border border-neutral-700/50 bg-neutral-600/30 px-4 py-2 text-center text-base transition-colors"
				aria-label={m.app_home_layout_nav_learning_paths_label()}
			>
				<Route class="size-4" />
				{m.app_home_layout_nav_learning_paths()}
			</a>
		</div>
	</div>
{/if}

<div class="h-screen">
	<nav
		class={cn(
			'sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between bg-neutral-900/50 p-2 backdrop-blur transition-colors duration-300',
			mobileMenuOpened && 'bg-neutral-900'
		)}
	>
		<!-- Toggle side bar on mobile button -->
		<Button
			variant="ghost"
			class="block w-fit p-2 md:hidden"
			onclick={() => (mobileMenuOpened = !mobileMenuOpened)}
		>
			<MenuIcon class="size-5" />
		</Button>
		<!-- Left part : home and problem list links -->
		<div class="hidden flex-row items-center gap-4 md:flex">
			<!-- Website logo placeholder -->
			<Button
				href="/app"
				aria-label={m.app_home_layout_nav_home_label()}
				variant="primary square"
				class="group flex w-fit flex-col items-center justify-center"
			>
				<Home class="size-6 text-neutral-400 transition-colors group-hover:text-neutral-100" />
			</Button>
			<!-- Vertical separator -->
			<div class="h-5 w-px bg-neutral-800"></div>

			<!-- Button group -->
			<div
				class="group flex h-10 flex-row gap-px overflow-hidden rounded-lg text-neutral-400 hover:text-neutral-100"
			>
				<a
					href="/app/exercises"
					class="flex h-full flex-row items-center gap-2 px-2 text-base transition-colors hover:!bg-neutral-700/70 group-hover:bg-neutral-700/30"
					aria-label={m.app_home_layout_nav_exercises_list_label()}
				>
					<List class="size-5" />
					{m.app_home_layout_nav_exercises_list()}
				</a>
				<a
					href="/app/exercises/random"
					class="flex h-full flex-row items-center gap-2 px-2 text-base transition-colors hover:!bg-neutral-700/70 group-hover:bg-neutral-700/30"
					aria-label={m.app_home_layout_nav_random_exercise_label()}
				>
					<Shuffle class="size-4" />
				</a>
			</div>

			<a
				class="flex h-10 flex-row items-center gap-2 overflow-hidden rounded-lg px-2 text-base text-neutral-400 transition-colors hover:bg-neutral-700/70 hover:text-neutral-100"
				href="/app/learning-paths"
				aria-label={m.app_home_layout_nav_learning_paths_label()}
			>
				<Route class="size-4" />
				{m.app_home_layout_nav_learning_paths()}
			</a>
		</div>

		<a href="/" class="block text-lg font-semibold md:hidden"> Skill Forge </a>

		<!-- Account button -->
		<a href="/app/account" aria-label={m.app_home_layout_nav_profile_label()}>
			<img src={user.profile_picture} alt="" class="size-8 rounded-full object-cover" />
		</a>
	</nav>

	<div class="flex grow flex-col gap-2 p-2 pt-0">
		{@render children()}
	</div>
</div>
