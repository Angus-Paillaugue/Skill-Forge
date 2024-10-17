<script>
	import { Difficulty } from '$lib/components';
	const { data } = $props();
	const { latestExercises } = data;
</script>

<svelte:head>
	<title>All exercises</title>
</svelte:head>

<div
	class="relative overflow-x-auto overflow-y-hidden w-full shadow-md sm:rounded-lg max-w-screen-lg mx-auto mt-10"
>
	<table class="w-full text-sm text-left rtl:text-right text-neutral-400 table-auto">
		<thead class="text-xs uppercase bg-neutral-700 text-neutral-400">
			<tr>
				<th scope="col" class="px-6 py-3"> Status </th>
				<th scope="col" class="px-6 py-3"> Title </th>
				<th scope="col" class="px-6 py-3"> Difficulty </th>
			</tr>
		</thead>
		<tbody>
			{#each latestExercises as exercise}
				<tr
					class="odd:bg-white odd:dark:bg-neutral-900 even:bg-neutral-800 border-b border-neutral-700"
				>
					<th scope="row" class="px-6 py-4 font-medium whitespace-nowrap text-white">
						{#if exercise.solved}
							<span class="px-2 py-1 rounded-full text-sm w-fit font-semibold bg-green-600">
								Completed
							</span>
						{/if}
					</th>
					<td>
						<a href="/app/exercises/{exercise.exercise_id}" class="px-6 py-4">
							<h1 class="text-2xl font-bold">{exercise.title}</h1>
						</a>
					</td>
					<td class="px-6 py-4">
						<Difficulty difficulty={exercise.difficulty} />
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
