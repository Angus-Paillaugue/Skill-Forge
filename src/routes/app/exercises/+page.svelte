<script>
	import { Difficulty, Input, LanguageIcon } from '$lib/components';
	import { CircleCheckBig, ChevronDown } from 'lucide-svelte';
	import { formatDate, cn, urlHealer } from '$lib/utils';
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
			order === 'title' || order === 'language'
				? a[order].localeCompare(b[order])
				: order === 'created_at'
					? new Date(a[order]) - new Date(b[order])
					: order === 'solved'
						? a[order] - b[order]
						: DIFFICULTY_MAP.get(a[order]) - DIFFICULTY_MAP.get(b[order])
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

<div class="mx-auto w-full max-w-screen-lg md:mt-10">
	<Input
		id="search"
		placeholder="Search for an exercise"
		class="bg-neutral-800 mb-4"
		bind:value={searchValue}
		oninput={onSearchInput}
	/>
	<div class="relative w-full overflow-x-auto overflow-y-hidden rounded-lg shadow-md">
		<table
			class="w-full overflow-y-auto min-w-[700px] table-auto text-sm"
		>
			<thead class="border-b border-neutral-700 bg-neutral-800">
				<tr>
					<th scope="col" class="h-12 px-4 text-left align-middle font-medium text-neutral-400">
						<button class="flex flex-row items-center gap-4" onclick={() => sortBy('language')}>
							Language
							{#if orderBy === 'language'}
								<ChevronDown
									class={cn('size-4 transition-transform', orderWay === 'DESC' && 'rotate-180')}
								/>
							{/if}
						</button>
					</th>
					<th scope="col" class="h-12 px-4 text-left align-middle font-medium text-neutral-400">
						<button class="flex flex-row items-center gap-4" onclick={() => sortBy('solved')}>
							Solved
							{#if orderBy === 'solved'}
								<ChevronDown
									class={cn('size-4 transition-transform', orderWay === 'DESC' && 'rotate-180')}
								/>
							{/if}
						</button>
					</th>
					<th scope="col" class="h-12 px-4 text-left align-middle font-medium text-neutral-400">
						<button class="flex flex-row items-center gap-4" onclick={() => sortBy('title')}>
							Title
							{#if orderBy === 'title'}
								<ChevronDown
									class={cn('size-4 transition-transform', orderWay === 'DESC' && 'rotate-180')}
								/>
							{/if}
						</button>
					</th>
					<th scope="col" class="h-12 px-4 text-left align-middle font-medium text-neutral-400">
						<button class="flex flex-row items-center gap-4" onclick={() => sortBy('difficulty')}>
							Difficulty
							{#if orderBy === 'difficulty'}
								<ChevronDown
									class={cn('size-4 transition-transform', orderWay === 'DESC' && 'rotate-180')}
								/>
							{/if}
						</button>
					</th>
					<th scope="col" class="h-12 px-4 text-left align-middle font-medium text-neutral-400">
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
			<tbody class="[&amp;_tr:last-child]:border-0">
				{#each sortedExercises as exercise (exercise.exercise_id)}
					<tr
						class="border-b border-neutral-700 transition-colors even:bg-neutral-800/50"
						transition:slide={{ axis: 'y' }}
						animate:flip={{ duration: 300 }}
					>
						<td class="w-1/12 px-4 align-middle">
							<LanguageIcon name={exercise.language} />
						</td>
						<td class="w-1/12 px-4 align-middle">
							{#if exercise.solved}
								<CircleCheckBig class="size-5 text-green-600" />
							{/if}
						</td>
						<td class="px-3 py-4 md:px-6">
							<a
								href="/app/exercises/{urlHealer.identifier.join(
									exercise.slug,
									exercise.exercise_id
								)}"
								class="text-lg font-bold md:text-xl"
							>
								{exercise.title}
							</a>
						</td>
						<td class="w-1/12 px-4 align-middle">
							<Difficulty difficulty={exercise.difficulty} />
						</td>
						<td class="w-1/6 px-4 align-middle">
							{formatDate(exercise.created_at)}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
