<script>
	import { Difficulty, Input, LanguageIcon, SEO } from '$lib/components';
	import { CircleCheckBig, ChevronDown } from 'lucide-svelte';
	import { formatDate, cn, urlHealer } from '$lib/utils';
	import { flip } from 'svelte/animate';
	import { slide } from 'svelte/transition';
	import Fuse from 'fuse.js';
	import * as m from '$msgs';

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
	 * @param {string} way - The key to sort the items (e.g., 'language', 'solved', 'title', 'difficulty' or 'created_at').
	 */
	function sort(order, way) {
		// Sort the exercises based on the specified order
		// If the order is 'solved' or 'title', use the localeCompare method to sort the items alphabetically
		// If the order is 'created_at', sort the items based on the date
		// If the order is 'difficulty', sort the items based on the difficulty level (easy, medium, hard) using the DIFFICULTY_MAP to get their weight
		// If the order is 'language', sort the items based on the language
		sortedExercises = filteredExercises.sort((a, b) => {
			if (order === 'solved') {
				return way === 'ASC' ? a.solved - b.solved : b.solved - a.solved;
			} else if (order === 'title') {
				return way === 'ASC' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
			} else if (order === 'created_at') {
				return way === 'ASC'
					? new Date(a.created_at) - new Date(b.created_at)
					: new Date(b.created_at) - new Date(a.created_at);
			} else if (order === 'difficulty') {
				return way === 'ASC'
					? DIFFICULTY_MAP.get(a.difficulty) - DIFFICULTY_MAP.get(b.difficulty)
					: DIFFICULTY_MAP.get(b.difficulty) - DIFFICULTY_MAP.get(a.difficulty);
			} else if (order === 'language') {
				return way === 'ASC'
					? a.language.localeCompare(b.language)
					: b.language.localeCompare(a.language);
			}
		});
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

<SEO title={m.app_exercises_page_title()} description={m.app_exercises_page_description()} />

<div class="mx-auto w-full max-w-screen-lg">
	<Input
		id="search"
		placeholder={m.app_exercises_page_table_search_label()}
		class="mb-4 bg-card"
		bind:value={searchValue}
		oninput={onSearchInput}
	/>
	<div class="relative w-full overflow-hidden rounded-lg shadow-md">
		<table class="w-full min-w-[700px] table-auto overflow-y-auto text-sm">
			<thead class="border-b border-border bg-card">
				<tr>
					<th scope="col" class="h-12 px-4 text-left align-middle font-medium text-neutral-400">
						<button class="flex flex-row items-center gap-4" onclick={() => sortBy('language')}>
							{m.app_exercises_page_table_col_language()}
							{#if orderBy === 'language'}
								<ChevronDown
									class={cn('size-4 transition-transform', orderWay === 'DESC' && 'rotate-180')}
								/>
							{/if}
						</button>
					</th>
					<th scope="col" class="h-12 px-4 text-left align-middle font-medium text-neutral-400">
						<button class="flex flex-row items-center gap-4" onclick={() => sortBy('solved')}>
							{m.app_exercises_page_table_col_solved()}
							{#if orderBy === 'solved'}
								<ChevronDown
									class={cn('size-4 transition-transform', orderWay === 'DESC' && 'rotate-180')}
								/>
							{/if}
						</button>
					</th>
					<th scope="col" class="h-12 px-4 text-left align-middle font-medium text-neutral-400">
						<button class="flex flex-row items-center gap-4" onclick={() => sortBy('title')}>
							{m.app_exercises_page_table_col_title()}
							{#if orderBy === 'title'}
								<ChevronDown
									class={cn('size-4 transition-transform', orderWay === 'DESC' && 'rotate-180')}
								/>
							{/if}
						</button>
					</th>
					<th scope="col" class="h-12 px-4 text-left align-middle font-medium text-neutral-400">
						<button class="flex flex-row items-center gap-4" onclick={() => sortBy('difficulty')}>
							{m.app_exercises_page_table_col_difficulty()}
							{#if orderBy === 'difficulty'}
								<ChevronDown
									class={cn('size-4 transition-transform', orderWay === 'DESC' && 'rotate-180')}
								/>
							{/if}
						</button>
					</th>
					<th scope="col" class="h-12 px-4 text-left align-middle font-medium text-neutral-400">
						<button class="flex flex-row items-center gap-4" onclick={() => sortBy('created_at')}>
							{m.app_exercises_page_table_col_added()}
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
						class="border-b border-border transition-colors even:bg-card"
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
