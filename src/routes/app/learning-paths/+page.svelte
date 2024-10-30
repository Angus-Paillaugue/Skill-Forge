<script>
	const { data } = $props();
	const { paths } = data;

	const startedPaths = paths.filter((path) => path.solved_exercises > 0);
	const notStartedPaths = paths.filter((path) => path.solved_exercises === 0);
</script>

<!-- SEO -->
<svelte:head>
	<!-- Normal tags -->
	<title>Learning paths | Skill-Forge</title>
	<meta
		property="description"
		content="On this page, you will find all the learning paths available on Skill-Forge."
	/>

	<!-- Open Graph tags -->
	<meta property="og:title" content="Learning paths | Skill-Forge" />
	<meta
		property="og:description"
		content="On this page, you will find all the learning paths available on Skill-Forge."
	/>

	<!-- Twitter / X tags -->
	<meta property="twitter:title" content="Learning paths | Skill-Forge" />
	<meta
		property="twitter:description"
		content="On this page, you will find all the learning paths available on Skill-Forge."
	/>
</svelte:head>

{#snippet card(path)}
	{@const solvedPercentage = (path.solved_exercises / path.total_exercises) * 100}
	<a
		href="/app/learning-paths/{path.id}"
		class="flex flex-col gap-2 rounded-xl border border-neutral-700/50 bg-neutral-800 p-6 transition-colors hover:bg-neutral-800/50"
	>
		<h1 class="text-base font-bold md:text-2xl">
			{path.name}
		</h1>
		<p class="font-mono text-sm text-neutral-400">
			{path.description}
		</p>
		<!-- Progress indicators -->
		{#if path.solved_exercises > 0}
			<div class="mt-4 flex flex-col gap-1">
				<!-- Progress bar -->
				<div class="progress-bar relative h-2 overflow-hidden rounded-full bg-neutral-700/50">
					<div class="h-full bg-neutral-100" style="width: {solvedPercentage}%;"></div>
				</div>
				<!-- Textual progress -->
				<div class="flex flex-row items-center justify-between">
					<span class="text-sm capitalize text-neutral-400">Total Progress</span>
					<div class="block">
						<span class="text-lg font-semibold text-neutral-100">{path.solved_exercises}</span>
						<span class="text-sm text-neutral-400">/{path.total_exercises}</span>
					</div>
				</div>
			</div>
		{/if}
	</a>
{/snippet}

<div class="mx-auto mt-10 flex w-full max-w-screen-lg flex-col gap-2">
	{#if startedPaths.length > 0}
		<h1 class="text-2xl font-bold capitalize">Continue Learning</h1>
		<div class="relative grid w-full grid-cols-1 gap-4 rounded-lg lg:grid-cols-2 xl:grid-cols-3">
			{#each startedPaths as path}
				{@render card(path)}
			{/each}
		</div>
	{/if}

	{#if notStartedPaths.length > 0}
		<h1 class="mt-10 text-2xl font-bold capitalize">Start Today</h1>
		<div class="relative grid w-full grid-cols-1 gap-4 rounded-lg lg:grid-cols-2 xl:grid-cols-3">
			{#each notStartedPaths as path}
				{@render card(path)}
			{/each}
		</div>
	{/if}
</div>
