<script>
	const { children } = $props();
</script>

<div class="h-screen flex flex-col p-2 gap-2">
	<nav class="flex shrink-0 justify-between items-center h-10 relative">
		<!-- Left part : home and problem list links -->
		<div class="flex flex-row items-center gap-4">
			<!-- Website logo placeholder -->
			<a href="/app" aria-label="Go home ">
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
					class="flex flex-row gap-2 items-center text-base transition-colors group-hover:bg-neutral-900 hover:!bg-neutral-800 h-full px-2"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="size-5"
						><path d="M3 12h.01" /><path d="M3 18h.01" /><path d="M3 6h.01" /><path
							d="M8 12h13"
						/><path d="M8 18h13" /><path d="M8 6h13" /></svg
					>
					Problem list
				</a>
				<a
					href="/app/exercises/random"
					class="flex flex-row gap-2 items-center text-base transition-colors group-hover:bg-neutral-900 hover:!bg-neutral-800 h-full px-2"
					aria-label="Go to a random exercise"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="size-4"
						><path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22" /><path
							d="m18 2 4 4-4 4"
						/><path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2" /><path
							d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8"
						/><path d="m18 14 4 4-4 4" /></svg
					>
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
