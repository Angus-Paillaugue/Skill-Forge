<script>
	import { Difficulty, Input } from '$lib/components';
	import { CircleCheckBig, ChevronDown } from 'lucide-svelte';
	import { formatDate, cn } from '$lib/utils';
	import { flip } from 'svelte/animate';
	import { slide } from 'svelte/transition';
	import Fuse from 'fuse.js';

	const { data } = $props();
	const { latestExercises } = data;
	const DIFFICULTY_MAP = new Map([
		['easy', 1],
		['medium', 2],
		['hard', 3]
	]);


	let sortedExercises = $state(latestExercises);
	let filteredExercises = $state(latestExercises);
	let orderBy = $state('created_at');
	let orderWay = $state('DESC');
	let searchValue = $state('');

	const fuseList = new Fuse(latestExercises, {
		threshold: 0.4,
		ignoreLocation: true,
		keys: ['title']
	});

	/**
	 * Filters the list of exercises based on the provided search value.
	 *
	 * @param {Array} exercises - The array of exercise objects to search through.
	 * @param {string} val - The search string used to filter the exercises.
	 * @returns {Array} - A filtered array of exercises that match the search criteria.
	 */
	function search(val) {
		if (val.length === 0) {
			filteredExercises = latestExercises;
			return;
		}

		filteredExercises = fuseList.search(val).map((result) => result.item);
	}

	/**
	 * Sorts the items based on the specified order and direction.
	 *
	 * @param {string} order - The order in which to sort the items (e.g., 'asc' for ascending, 'desc' for descending).
	 * @param {string} way - The way to sort the items (e.g., 'alphabetical', 'numerical').
	 */
	function sort(order, way) {
		// Sort the exercises based on the specified order
		// If the order is 'solved' or 'title', use the localeCompare method to sort the items alphabetically
		// If the order is 'created_at', sort the items based on the date
		// If the order is 'difficulty', sort the items based on the difficulty level (easy, medium, hard) using the DIFFICULTY_MAP to get their weight
		let exercises = filteredExercises.sort((a, b) =>
			order==='solved'||order==='title' ? a[order].localeCompare(b[order]) : order==='created_at' ? a[order] - b[order] : DIFFICULTY_MAP.get(a[order]) - DIFFICULTY_MAP.get(b[order])
		);
		if (way === 'DESC') exercises = exercises.reverse();

		sortedExercises = exercises;
	}

	/**
	 * Sorts the items based on the specified order.
	 *
	 * @param {string} order - The order in which to sort the items.
	 *                         It can be 'asc' for ascending or 'desc' for descending.
	 */
	function sortBy(order) {
		// If the order is the same as the current order, reverse the order
		if (orderBy === order) orderWay = orderWay === 'ASC' ? 'DESC' : 'ASC';

		orderBy = order;
		sort(orderBy, orderWay);
	}

	/**
	 * Handles the input event for the search functionality.
	 * This function is triggered whenever the user types in the search input field.
	 */
	function onSearchInput() {
		search(searchValue);
		sort(orderBy, orderWay);
	}
</script>

<svelte:head>
	<title>All exercises</title>
</svelte:head>

<div class="max-w-screen-lg w-full mx-auto mt-10 flex flex-col gap-2">
	<Input
		id="search"
		placeholder="Search for an exercise"
		class="bg-neutral-800"
		bind:value={searchValue}
		oninput={onSearchInput}
	/>
	<div class="relative overflow-x-auto overflow-y-hidden w-full shadow-md rounded-lg">
		<table class="w-full text-sm text-left rtl:text-right text-neutral-400 table-auto">
			<thead class="text-xs uppercase bg-neutral-800/50 text-neutral-400">
				<tr>
					<th scope="col" class="px-3 md:px-6 py-3">
						<button class="flex flex-row items-center gap-4" onclick={() => sortBy('solved')}>
							Status
							{#if orderBy === 'solved'}
								<ChevronDown
									class={cn('size-4 transition-transform', orderWay === 'DESC' && 'rotate-180')}
								/>
							{/if}
						</button>
					</th>
					<th scope="col" class="px-3 md:px-6 py-3">
						<button class="flex flex-row items-center gap-4" onclick={() => sortBy('title')}>
							Title
							{#if orderBy === 'title'}
								<ChevronDown
									class={cn('size-4 transition-transform', orderWay === 'DESC' && 'rotate-180')}
								/>
							{/if}
						</button>
					</th>
					<th scope="col" class="px-3 md:px-6 py-3">
						<button class="flex flex-row items-center gap-4" onclick={() => sortBy('difficulty')}>
							Difficulty
							{#if orderBy === 'difficulty'}
								<ChevronDown
									class={cn('size-4 transition-transform', orderWay === 'DESC' && 'rotate-180')}
								/>
							{/if}
						</button>
					</th>
					<th scope="col" class="px-3 md:px-6 py-3">
						<button class="flex flex-row items-center gap-4" onclick={() => sortBy('created_at')}>
							Added
							{#if orderBy === 'created_at'}
								<ChevronDown
									class={cn('size-4 transition-transform', orderWay === 'DESC' && 'rotate-180')}
								/>
							{/if}
						</button>
					</th>
				</tr>
			</thead>
			<tbody>
				{#each sortedExercises as exercise (exercise.exercise_id)}
					<tr
						class="even:bg-neutral-800/50 border-b border-neutral-700"
						transition:slide={{ axis: 'y' }}
						animate:flip={{ duration: 300 }}
					>
						<td class="px-3 md:px-6 py-2 md:py-4 font-medium whitespace-nowrap w-1/6 text-white">
							{#if exercise.solved}
								<CircleCheckBig class="size-5 text-green-600" />
							{/if}
						</td>
						<td class="w-1/2 px-3 md:px-6 py-2">
							<a href="/app/exercises/{exercise.exercise_id}" class="text-lg md:text-2xl font-bold">
								{exercise.title}
							</a>
						</td>
						<td class="px-3 md:px-6 py-2 md:py-4 w-1/6">
							<Difficulty difficulty={exercise.difficulty} />
						</td>
						<td class="px-3 md:px-6 py-2 md:py-4 w-2/5">
							{formatDate(exercise.created_at)}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
