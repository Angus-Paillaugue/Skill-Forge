<script>
	import { Shuffle, List } from 'lucide-svelte';
	const { children } = $props();
</script>

<div class="h-screen flex flex-col p-2 gap-2">
	<nav class="flex shrink-0 justify-between items-center h-10">
		<!-- Left part : home and problem list links -->
		<div class="flex flex-row items-center gap-4">
			<!-- Website logo placeholder -->
			<a href="/app" aria-label="Go home">
				<div class="size-8 rounded-full bg-blue-600"></div>
			</a>
			<!-- Vertical separator -->
			<div class="h-5 w-px bg-neutral-800"></div>

			<!-- Button group -->
			<div
				class="group rounded-lg overflow-hidden flex flex-row gap-px h-10 text-neutral-400 hover:text-neutral-100"
			>
				<a
					href="/app/exercises"
					class="flex flex-row gap-2 items-center text-base transition-colors group-hover:bg-neutral-700/30 hover:!bg-neutral-700/70 h-full px-2"
				>
					<List class="size-5" />
					Problem list
				</a>
				<a
					href="/app/exercises/random"
					class="flex flex-row gap-2 items-center text-base transition-colors group-hover:bg-neutral-700/30 hover:!bg-neutral-700/70 h-full px-2"
					aria-label="Go to a random exercise"
				>
					<Shuffle class="size-4" />
				</a>
			</div>
		</div>

		<!-- Account buttons -->
		<a href="/app/account" aria-label="Got to account dashboard">
			<img src="/default_avatar.jpg" alt="" class="size-8 rounded-full object-cover" />
		</a>
	</nav>

	<div class="grow flex flex-col">
		{@render children()}
	</div>
</div>
