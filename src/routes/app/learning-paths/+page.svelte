<script>
	const { data } = $props();
	const { paths } = data;

	const startedPaths = paths.filter((path) => path.solved_exercises > 0);
	const notStartedPaths = paths.filter((path) => path.solved_exercises === 0);
</script>

<svelte:head>
	<title>Learning paths</title>
</svelte:head>

{#snippet card(path)}
	{@const solvedPercentage = path.solved_exercises/path.total_exercises * 100}
	<a href="/app/learning-paths/{path.id}" class="border border-neutral-700/50 bg-neutral-800 hover:bg-neutral-800/50 rounded-xl transition-colors flex flex-col gap-2 p-6">
		<h1 class="text-base font-bold md:text-2xl">
			{path.name}
		</h1>
		<p class="font-mono text-sm text-neutral-400">
			{path.description}
		</p>
		<!-- Progress indicators -->
		{#if path.solved_exercises > 0}
			<div class="flex flex-col gap-1 mt-4">
				<!-- Progress bar -->
				<div class="relative h-2 rounded-full overflow-hidden bg-neutral-700/50">
					<div class="h-full bg-neutral-100" style="width: {solvedPercentage}%;"></div>
				</div>
				<!-- Textual progress -->
				<div class="flex flex-row items-center justify-between">
					<span class="capitalize text-neutral-400 text-sm">Total Progress</span>
					<div class="block">
						<span class="text-neutral-100 text-lg font-semibold">{path.solved_exercises}</span>
						<span class="text-neutral-400 text-sm">/{path.total_exercises}</span>
					</div>
				</div>
			</div>
		{/if}
	</a>
{/snippet}

<div class="mx-auto mt-10 flex w-full max-w-screen-lg flex-col gap-2">
	<h1 class="text-2xl font-bold capitalize">Continue Learning</h1>
	<div class="relative w-full rounded-lg grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
		{#each startedPaths as path}
			{@render card(path)}
		{/each}
	</div>

	<h1 class="text-2xl font-bold mt-10 capitalize">Start Today</h1>
	<div class="relative w-full rounded-lg grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
		{#each notStartedPaths as path}
			{@render card(path)}
		{/each}
	</div>
</div>
