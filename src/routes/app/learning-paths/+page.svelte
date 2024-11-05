<script>
	import { Card, Spinner } from '$lib/components';
	import { fade, slide } from 'svelte/transition';
	import Exercise from './Exercise.svelte';
	import { toast } from '$lib/components/Toast';
	import { backOut } from 'svelte/easing';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import * as m from '$msgs';

	const { data } = $props();
	const { paths } = data;

	const startedPaths = paths.filter((path) => path.solved_exercises > 0);
	const notStartedPaths = paths.filter((path) => path.solved_exercises === 0);

	let loadingPath = $state(null);
	let activePath = $state(null);

	async function fetchPath(id) {
		loadingPath = id;
		const res = await fetch(`/api/fetchPath`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id: id
			})
		});
		if (!res.ok) {
			toast.error({ message: m.app_learning_paths_error_failed_to_fetch_path(), timeout: 3000 });
			loadingPath = null;
			return;
		}
		const data = await res.json();
		activePath = data.path;
		loadingPath = null;
		setSearchParam('path', activePath.id);
	}

	function setSearchParam(k, v) {
		let query = new URLSearchParams($page.url.searchParams.toString());
		query.set(k, v);
		goto(`?${query.toString()}`);
	}

	function removeSearchParam(k) {
		let query = new URLSearchParams($page.url.searchParams.toString());
		query.delete(k);
		goto(`?${query.toString()}`);
	}

	function getSearchedParam(k) {
		let query = new URLSearchParams($page.url.searchParams.toString());
		return query.get(k);
	}

	// Handle search params
	onMount(() => {
		if (getSearchedParam('path')) {
			fetchPath(Number(getSearchedParam('path')));
		}
	});

	function closePreview() {
		activePath = null;
		removeSearchParam('path');
	}
</script>

<!-- SEO -->
<svelte:head>
	<!-- Normal tags -->
	<title>{m.app_learning_paths_title()} | Skill-Forge</title>
	<meta property="description" content={m.app_learning_paths_description()} />

	<!-- Open Graph tags -->
	<meta property="og:title" content="{m.app_learning_paths_title()} | Skill-Forge" />
	<meta property="og:description" content={m.app_learning_paths_description()} />

	<!-- Twitter / X tags -->
	<meta property="twitter:title" content="{m.app_learning_paths_title()} | Skill-Forge" />
	<meta property="twitter:description" content={m.app_learning_paths_description()} />
</svelte:head>

{#snippet card(path)}
	{@const solvedPercentage = (path.solved_exercises / path.total_exercises) * 100}
	<Card
		onclick={() => {
			fetchPath(path.id);
		}}
		onkeydown={(e) => {
			if (e.key === 'Enter') fetchPath(path.id);
		}}
		class="relative flex flex-col gap-2 overflow-hidden transition-colors hover:bg-neutral-800"
		tabindex="0"
	>
		<h1 class="text-base font-bold md:text-2xl">
			{path.name}
		</h1>
		<p class="font-mono text-sm text-neutral-400">
			{path.description}
		</p>
		<!-- Progress indicators -->
		{#if path.solved_exercises > 0}
			<div class="flex flex-col gap-1">
				<!-- Progress bar -->
				<div class="progress-bar relative h-2 overflow-hidden rounded-full bg-neutral-700/50">
					<div class="h-full bg-neutral-100" style="width: {solvedPercentage}%;"></div>
				</div>
				<!-- Textual progress -->
				<div class="flex flex-row items-center justify-between">
					<span class="text-sm capitalize text-neutral-400"
						>{m.app_learning_paths_card_total_progress()}</span
					>
					<div class="block">
						<span class="text-lg font-semibold text-neutral-100">{path.solved_exercises}</span>
						<span class="text-sm text-neutral-400">/{path.total_exercises}</span>
					</div>
				</div>
			</div>
		{/if}

		{#if loadingPath === path.id}
			<div
				class="absolute inset-0 !m-0 flex items-center justify-center bg-neutral-900/50 backdrop-blur-sm"
				transition:fade={{ duration: 200 }}
			>
				<Spinner class="size-10" />
			</div>
		{/if}
	</Card>
{/snippet}

<div class="mx-auto mt-10 flex w-full max-w-screen-lg flex-col gap-2">
	{#if startedPaths.length > 0}
		<h1 class="text-2xl font-bold capitalize">{m.app_learning_paths_sections_started_paths()}</h1>
		<div
			class="relative grid w-full gap-4 rounded-lg"
			style="grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));"
		>
			{#each startedPaths as path}
				{@render card(path)}
			{/each}
		</div>
	{/if}

	{#if notStartedPaths.length > 0}
		<h1 class="mt-10 text-2xl font-bold capitalize">
			{m.app_learning_paths_sections_not_started_paths()}
		</h1>
		<div class="relative grid w-full grid-cols-1 gap-4 rounded-lg lg:grid-cols-2 xl:grid-cols-3">
			{#each notStartedPaths as path}
				{@render card(path)}
			{/each}
		</div>
	{/if}
</div>

{#if activePath}
	<div
		class="absolute inset-0 z-30 bg-neutral-900/50 backdrop-blur-md"
		transition:fade={{ duration: 400 }}
	></div>
	<div
		class="no-scrollbar absolute bottom-0 left-0 right-0 z-40 max-h-full w-full overflow-y-auto rounded-t-xl border border-b-0 border-neutral-700/50 bg-neutral-900"
		transition:slide={{ axis: 'y', duration: 500, easing: backOut }}
	>
		<div class="mx-auto h-[90vh] w-full max-w-screen-lg md:h-[80vh]">
			<Exercise {closePreview} bind:path={activePath} />
		</div>
	</div>
{/if}
