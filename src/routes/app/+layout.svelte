<script>
	import { Shuffle, List, Home, MenuIcon, Route } from 'lucide-svelte';
	import { Button } from '$lib/components';
	import { cn } from '$lib/utils';
	import { fly } from 'svelte/transition';
	import { afterNavigate } from '$app/navigation';

	const { children } = $props();

	let mobileMenuOpened = $state(false);

	afterNavigate(() => {
		mobileMenuOpened = false;
	});
</script>

{#if mobileMenuOpened}
	<div transition:fly={{ x:"-100%", opacity:1 }} class="fixed block md:hidden top-12 bottom-0 left-0 right-0 z-40 bg-neutral-900/50 backdrop-blur py-8 px-4">
		<div class="flex flex-col items-center w-fit mx-auto gap-4">
			<a
				href="/app/exercises"
				aria-label="Go to exercises list"
				class="flex flex-row gap-2 items-center justify-center text-center text-base transition-colors w-full bg-neutral-700/30 rounded-full px-4 py-2"
			>
				<List class="size-5" />
				Exercises list
			</a>
			<a
				href="/app/exercises/random"
				class="flex flex-row gap-2 items-center justify-center text-center text-base transition-colors w-full bg-neutral-700/30 rounded-full px-4 py-2"
				aria-label="Go to a random exercise"
			>
				<Shuffle class="size-4" />
				Random exercise
			</a>

			<!-- Horizontal separator -->
			<div class="px-2 w-full">
				<hr class="bg-neutral-700/50 w-full" />
			</div>

			<a
				href="/app/learning-paths"
				class="flex flex-row gap-2 items-center justify-center text-center text-base transition-colors w-full bg-neutral-700/30 rounded-full px-4 py-2"
				aria-label="Go to the learning paths"
			>
				<Route class="size-4" />
				Leaning paths
			</a>
		</div>
	</div>
{/if}

<div class="h-screen flex flex-col p-2 gap-2">
	<nav class="flex shrink-0 justify-between items-center h-10">
		<!-- Toggle side bar on mobile button -->
		<button class="block md:hidden p-2" onclick={() => (mobileMenuOpened = !mobileMenuOpened)}>
			<MenuIcon class="size-5" />
		</button>
		<!-- Left part : home and problem list links -->
		<div class="hidden md:flex flex-row items-center gap-4">
			<!-- Website logo placeholder -->
			<a href="/app" aria-label="Go home" class="size-10 group rounded-full bg-neutral-700/50 hidden md:flex flex-col items-center justify-center">
				<Home class="size-6 text-neutral-400 group-hover:text-neutral-100 transition-colors" />
			</a>
			<!-- Vertical separator -->
			<div class="h-5 w-px bg-neutral-800"></div>

			<!-- Button group -->
			<div
				class="group rounded-lg overflow-hidden hidden md:flex flex-row gap-px h-10 text-neutral-400 hover:text-neutral-100"
			>
				<a
					href="/app/exercises"
					class="flex flex-row gap-2 items-center text-base transition-colors group-hover:bg-neutral-700/30 hover:!bg-neutral-700/70 h-full px-2"
				>
					<List class="size-5" />
					Exercises list
				</a>
				<a
					href="/app/exercises/random"
					class="flex flex-row gap-2 items-center text-base transition-colors group-hover:bg-neutral-700/30 hover:!bg-neutral-700/70 h-full px-2"
					aria-label="Go to a random exercise"
				>
					<Shuffle class="size-4" />
				</a>
			</div>

			<Button variant="link" class="hidden md:flex" href="/app/learning-paths">Leaning paths</Button>
		</div>

		<a href="/" class="text-lg font-semibold block md:hidden">
			Skill Forge
		</a>


		<!-- Account button -->
		<a href="/app/account" aria-label="Got to account dashboard">
			<img src="/default_avatar.jpg" alt="" class="size-8 rounded-full object-cover" />
		</a>
	</nav>

	<div class="grow flex flex-col">
		{@render children()}
	</div>
</div>
