<script>
	import { Shuffle, List, Home, MenuIcon, Route } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import { fly } from 'svelte/transition';
	import { afterNavigate } from '$app/navigation';
	import { Button } from '$lib/components';

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
				aria-label="Go to exercises list"
				class="flex w-full flex-row items-center justify-center gap-2 rounded-full border border-neutral-700/50 bg-neutral-600/30 px-4 py-2 text-center text-base transition-colors"
			>
				<List class="size-5" />
				Exercises list
			</a>
			<a
				href="/app/exercises/random"
				class="flex w-full flex-row items-center justify-center gap-2 rounded-full border border-neutral-700/50 bg-neutral-600/30 px-4 py-2 text-center text-base transition-colors"
				aria-label="Go to a random exercise"
			>
				<Shuffle class="size-4" />
				Random exercise
			</a>

			<!-- Horizontal separator -->
			<div class="w-full px-2">
				<hr class="w-full bg-neutral-700/50" />
			</div>

			<a
				href="/app/learning-paths"
				class="flex w-full flex-row items-center justify-center gap-2 rounded-full border border-neutral-700/50 bg-neutral-600/30 px-4 py-2 text-center text-base transition-colors"
				aria-label="Go to the learning paths"
			>
				<Route class="size-4" />
				Leaning paths
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
				aria-label="Go home"
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
				>
					<List class="size-5" />
					Exercises list
				</a>
				<a
					href="/app/exercises/random"
					class="flex h-full flex-row items-center gap-2 px-2 text-base transition-colors hover:!bg-neutral-700/70 group-hover:bg-neutral-700/30"
					aria-label="Go to a random exercise"
				>
					<Shuffle class="size-4" />
				</a>
			</div>

			<a
				class="flex h-10 flex-row items-center gap-2 overflow-hidden rounded-lg px-2 text-base text-neutral-400 transition-colors hover:bg-neutral-700/70 hover:text-neutral-100"
				href="/app/learning-paths"
			>
				<Route class="size-4" />
				Leaning paths
			</a>
		</div>

		<a href="/" class="block text-lg font-semibold md:hidden"> Skill Forge </a>

		<!-- Account button -->
		<a href="/app/account" aria-label="Got to account dashboard">
			<img src={user.profile_picture} alt="" class="size-8 rounded-full object-cover" />
		</a>
	</nav>

	<div class="flex grow flex-col gap-2 p-2 pt-0">
		{@render children()}
	</div>
</div>
