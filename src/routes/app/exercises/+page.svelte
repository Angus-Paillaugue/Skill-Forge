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
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="size-5 text-green-600"
								><path d="M21.801 10A10 10 0 1 1 17 3.335" /><path d="m9 11 3 3L22 4" /></svg
							>
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
