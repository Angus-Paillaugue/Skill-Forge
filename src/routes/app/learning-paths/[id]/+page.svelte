<script>
	import { TestTubeDiagonal, CircleCheckBig } from 'lucide-svelte';
	import { stripMD, urlHealer } from '$lib/utils';
	import { CircularProgress } from '$lib/components';
	import { onMount } from 'svelte';

	const { data } = $props();
	const { path } = data;

	let noExercisesCompleted = $state(0);

	onMount(() => {
		noExercisesCompleted = path.exercises
			.map((e) => e.is_completed)
			.reduce((acc, cur) => acc + cur, 0);
	});
</script>

<svelte:head>
	<title>{path.name}</title>
</svelte:head>

<div class="mx-auto flex w-full max-w-screen-xl flex-col gap-10 p-4 md:gap-8">
	<div class="flex flex-col gap-4 rounded-xl bg-neutral-800 p-6 px-7">
		<h1 class="text-4xl font-bold text-neutral-100">{path.name}</h1>
		<p class="font-mono text-neutral-400">{path.description}</p>
	</div>

	<div class="rounded-xl bg-neutral-800">
		<div class="flex flex-row items-center gap-4 p-6 px-7">
			<TestTubeDiagonal class="size-6" />
			<div class="flex flex-col space-y-1.5">
				<h3 class="text-lg font-semibold leading-none tracking-tight">Exercises</h3>
				<p class="text-sm text-neutral-400">Exercises in this learning path.</p>
			</div>
			<div class="ml-auto flex flex-col gap-2">
				<CircularProgress
					class="size-12 md:size-16"
					min={0}
					max={path.exercises.length}
					bind:value={noExercisesCompleted}
					gaugePrimaryColor="rgb(22 163 74)"
					gaugeSecondaryColor="rgb(64 64 64 / 0.2)"
				/>
			</div>
		</div>

		<div class="p-6 pt-0">
			<div class="relative w-full overflow-x-auto">
				{#if path.exercises.length === 0}
					<div class="grow rounded-lg bg-neutral-700 p-4">
						<h2 class="text-base font-medium">There are no exercises in this learning path yet!</h2>
					</div>
				{:else}
					<table class="w-full caption-bottom text-sm">
						<thead class="sticky top-0 border-b border-neutral-700 bg-neutral-800"
							><tr
								><th class="h-12 px-4 text-left align-middle font-medium text-neutral-400">Name</th>
								<th class="h-12 px-4 text-left align-middle font-medium text-neutral-400"
									>Description</th
								>
								<th class="h-12 px-4 text-left align-middle font-medium text-neutral-400">Solved</th
								></tr
							></thead
						>
						<tbody class="[&amp;_tr:last-child]:border-0">
							{#each path.exercises as exercise}
								<tr class="border-b border-neutral-700 transition-colors odd:bg-neutral-700/20"
									><td class="w-1/3 p-4 align-middle">
										<a
											href="/app/exercises/{urlHealer.identifier.join(exercise.slug, exercise.id)}"
										>
											<div class="font-medium">{exercise.title}</div>
											<div class="inline text-xs text-neutral-400 md:text-sm">
												{exercise.difficulty}
											</div>
										</a>
									</td>
									<td class="w-1/2 overflow-hidden p-4 align-middle">
										<p class="line-clamp-2 font-mono">
											{stripMD(exercise.description)}
										</p>
									</td>
									<td class="p-4 align-middle">
										{#if exercise.is_completed}
											<CircleCheckBig class="size-5 text-green-600" />
										{/if}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				{/if}
			</div>
		</div>
	</div>
</div>
