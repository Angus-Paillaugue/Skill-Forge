<script>
	import { cn } from '$lib/utils';
	import { Spinner, Editor, Button, Input } from '$lib/components';
	import { fade, fly, scale } from 'svelte/transition';
	import { PaneGroup, Pane, PaneResizer } from 'paneforge';
	import { newToast } from '$lib/stores';
	import { Save, Plus, Text, ScanEye, Code, X } from 'lucide-svelte';

	const { data } = $props();
	const { exercise } = data;
	const DIFFICULTIES = ['easy', 'medium', 'hard'];
	let categories = $state(data.categories);
	let title = $state(exercise.title);
	let description = $state(exercise.description);
	// svelte-ignore state_referenced_locally
	let category = $state(categories[0].id);
	let isSaving = $state(false);
	let tests = $state(exercise.tests);
	let selectedTestIndex = $state(0);
	let difficulty = $state(exercise.difficulty);
	let startValue = $state(exercise.content);
	let editor = $state();
	let createCategoryModalVisible = $state(false);
	let isCreatingCategory = $state(false);
	let isPreviewingDescription = $state(false);
	let success = $state(null);

	/**
	 * Asynchronously saves the current exercise data.
	 * This function is typically called when the user submits the form to add a new exercise.
	 * It handles the necessary operations to persist the exercise information.
	 */
	async function save() {
		isSaving = true;
		const res = await fetch('/api/saveExercise', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id: exercise.exercise_id,
				title,
				description,
				category_id: category,
				difficulty,
				tests,
				content: startValue
			})
		});
		const data = await res.json();
		if (!res.ok) {
			newToast({ type: 'red', message: data.message });
			isSaving = false;
			return;
		}
		success = data;
		isSaving = false;
	}

	/**
	 * Function to add a test exercise to the platform.
	 * This function is used in the admin section to add new exercises.
	 */
	function addTest() {
		tests.push({ input: '', expected_output: '' });
		selectedTestIndex = tests.length - 1;
		editor.resetEditorLayout();
	}

	/**
	 * Asynchronous function to create a new exercise category.
	 * This function is triggered by an event, typically a form submission.
	 *
	 * @param {Event} e - The event object from the form submission.
	 */
	async function createCategory(e) {
		e.preventDefault();
		isCreatingCategory = true;
		const categoryName = new FormData(e.target).get('name');

		if (!categoryName) {
			newToast({ type: 'red', message: 'Category name is required' });
			isCreatingCategory = false;
			return;
		}

		try {
			const res = await fetch('/api/createCategory', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ name: categoryName })
			});
			const data = await res.json();
			if (!res.ok) {
				newToast({ type: 'red', message: data.message });
				return;
			}
			categories = [...categories, { id: data.id, name: data.name }];
			category = data.id;
			createCategoryModalVisible = false;
		} catch (error) {
			newToast({ type: 'red', message: error.message });
			isCreatingCategory = false;
		} finally {
			isCreatingCategory = false;
		}
	}

	/**
	 * This function compiles the provided Markdown content into HTML.
	 * It is an asynchronous function that processes the Markdown input
	 * and returns the compiled HTML output.
	 * @returns {Promise<string>} - The compiled HTML output.
	 */
	async function compileMarkdown() {
		try {
			const res = await fetch('/api/compileMarkdown', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ text: description })
			});
			const data = await res.text();
			return data;
		} catch (error) {
			newToast({ type: 'red', message: error.message });
		}
	}
</script>

<svelte:head>
	<title>Edit exercise</title>
</svelte:head>

{#if createCategoryModalVisible}
	<div transition:fade class="fixed z-40 inset-0 bg-neutral-900/50 backdrop-blur-md"></div>
	<div
		transition:fly={{ y: '100%' }}
		class="fixed z-40 inset-0 flex flex-col items-center justify-center p-2"
	>
		<form
			onsubmit={createCategory}
			class="p-4 rounded-xl bg-neutral-800 max-w-md w-full flex flex-col gap-4"
		>
			<h2 class="text-2xl font-semibold">Create category</h2>
			<Input id="name" placeholder="Category name" />
			<div class="grid grid-cols-2 gap-4">
				<button
					type="button"
					class="text-base font-medium md:font-semibold w-full rounded-xl bg-neutral-700 px-4 py-2 text-neutral-100 placeholder:text-neutral-400"
					onclick={() => (createCategoryModalVisible = false)}
				>
					Cancel
				</button>
				<button
					type="submit"
					class="text-base font-medium md:font-semibold w-full rounded-xl bg-neutral-900 px-4 py-2 text-neutral-100 placeholder:text-neutral-400 focus:flex flex-row items-center justify-center gap-2"
				>
					{#if isCreatingCategory}
						<Spinner class="size-5" />
					{/if}
					Create
				</button>
			</div>
		</form>
	</div>
{/if}

<!-- Create button -->
<button
	class="px-2 py-2 text-base rounded-lg font-medium bg-neutral-800 flex flex-row items-center gap-2 absolute top-2 left-1/2 -translate-x-1/2"
	onclick={save}
>
	<div class="block relative size-5 text-green-600">
		<Save
			class={cn(
				'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 duration-300 transition-all',
				isSaving ? 'size-0' : 'size-5'
			)}
		/>
		<div
			class={cn(
				'duration-300 transition-all absolute size-5 flex flex-col items-center justify-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
			)}
		>
			<Spinner class={cn('transition-all', isSaving ? 'size-5' : 'size-0')} />
		</div>
	</div>
	Save
</button>

<PaneGroup
	direction="horizontal"
	class="grow !h-[calc(100vh-4rem)] overflow-hidden"
	style="height: auto;"
	autoSaveId="adminAddExercisePage"
>
	<!-- Left part -->
	<Pane defaultSize={50} class="flex flex-col gap-2">
		{#if success}
			<div
				transition:scale
				class="flex flex-col flex-shrink-0 p-4 border-green-600 border bg-neutral-900 rounded-xl"
			>
				<h1 class="text-2xl font-bold text-green-600">Success</h1>
				<p>{success.message}</p>
				<Button variant="link" href="/app/exercises/{exercise.exercise_id}" class="link"
					>Go to exercise</Button
				>
			</div>
		{/if}

		<div class="flex flex-col grow bg-neutral-900 h-full rounded-xl">
			<div class="p-4 grow flex flex-col overflow-y-auto">
				<!-- Category -->
				<div class="flex flex-row items-center">
					<!-- Select category -->
					<select
						bind:value={category}
						class="block px-2 h-9 rounded-l-lg bg-neutral-800 text-base font-semibold w-fit"
					>
						{#each categories as _category}
							<option value={_category.id}>{_category.name}</option>
						{/each}
					</select>
					<div class="h-full w-px bg-neutral-900"></div>
					<!-- Add new category -->
					<button
						class="size-9 flex flex-col items-center justify-center rounded-r-lg bg-neutral-800 text-base font-semibold"
						aria-label="Create category"
						onclick={() => (createCategoryModalVisible = true)}
					>
						<Plus class="size-6" />
					</button>
				</div>
				<!-- Exercise difficulty -->
				<select
					bind:value={difficulty}
					class={cn(
						'block px-2 py-1 mt-6 rounded-full text-sm w-fit font-semibold',
						difficulty === 'easy' && 'bg-green-600 text-white',
						difficulty === 'medium' && 'bg-yellow-600 text-black',
						difficulty === 'hard' && 'bg-red-600 text-white'
					)}
				>
					{#each DIFFICULTIES as _difficulty}
						<option value={_difficulty}>{_difficulty}</option>
					{/each}
				</select>
				<!-- Exercise title -->
				<Input
					id="exerciseTitle"
					placeholder="Exercise title"
					class="bg-neutral-800 mb-6 mt-4 text-2xl font-medium leading-[3.5rem] md:font-semibold md:leading-[4rem]"
					bind:value={title}
				/>
				<!-- Exercise description -->
				<div class="flex flex-col grow">
					<!-- Test/Preview buttons -->
					<div class="flex flex-row shrink-0 gap-4 mb-2">
						<button
							class={cn(
								'flex flex-row gap-2 items-center rounded-xl px-2 py-1 transition-colors',
								!isPreviewingDescription && 'bg-neutral-800'
							)}
							onclick={() => (isPreviewingDescription = false)}
						>
							Text
							<Text class="size-5" />
						</button>
						<button
							class={cn(
								'flex flex-row gap-2 items-center rounded-xl px-2 py-1 transition-colors',
								isPreviewingDescription && 'bg-neutral-800'
							)}
							onclick={() => (isPreviewingDescription = true)}
						>
							Preview
							<ScanEye class="size-5" />
						</button>
					</div>
					<div id="pageContainer" class="flex flex-col grow shrink-0">
						{#if isPreviewingDescription}
							{#await compileMarkdown()}
								Loading...
							{:then md}
								{@html md}
							{/await}
						{:else}
							<textarea
								type="text"
								bind:value={description}
								class="grow w-full rounded-xl bg-neutral-800 px-6 py-3 text-base resize-none font-medium text-neutral-100 placeholder:text-neutral-400"
							></textarea>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</Pane>
	<PaneResizer class="relative flex w-2 items-center justify-center group">
		<div class="flex h-7 w-[2px] items-center justify-center rounded-sm bg-neutral-700"></div>
		<div
			class="absolute top-0 rounded-full transition-colors bottom-0 w-[2px] left-1/2 -translate-x-1/2 group-hover:bg-neutral-500"
		></div>
	</PaneResizer>
	<!-- Right part -->
	<Pane defaultSize={50} class="flex w-full flex-col">
		<!-- Main code editor -->
		<div class="flex flex-col">
			<!-- Full screen button -->
			<div
				class="flex flex-row items-center px-2 gap-2 h-10 rounded-t-xl bg-neutral-800 text-neutral-400"
			>
				<div class="flex flex-row items-center px-2 gap-2">
					<Code class="size-5" />
					Code
				</div>
			</div>
		</div>
		<Editor language="javascript" bind:value={startValue} bind:this={editor} />
		<!-- Tests cases -->
		<div class="flex flex-col p-4 bg-neutral-800 rounded-xl shrink-0 mt-2">
			<div class="flex flex-row flex-no-wrap overflow-x-auto gap-2">
				{#each tests as _test, index}
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div
						tabindex="0"
						class={cn(
							'px-3 shrink-0  py-1 rounded-xl flex flex-row items-center gap-2 cursor-pointer',
							index === selectedTestIndex && 'bg-neutral-900'
						)}
						onclick={() => (selectedTestIndex = index)}
					>
						Case {index + 1}
						<button
							aria-label="Delete test case"
							onclick={(e) => {
								e.stopPropagation();
								if (tests.length === 1) {
									newToast({ type: 'red', message: 'You must have at least one test case' });
									return;
								}
								tests.splice(index, 1);
								if (selectedTestIndex != 0) selectedTestIndex--;
							}}
						>
							<X class="size-4" />
						</button>
					</div>
				{/each}
				<button
					class="px-3 py-1 shrink-0 rounded-lg flex flex-row transition-all items-center gap-2 bg-neutral-700"
					onclick={addTest}
				>
					Add
					<Plus class="size-4" />
				</button>
			</div>
			{#if tests.length > 0}
				<div class="mt-4">
					<h6 class="text-base font-medium mb-1">Input</h6>
					<Input
						id="testInput"
						placeholder="Test input"
						class="font-mono whitespace-pre-wrap bg-neutral-700"
						bind:value={tests[selectedTestIndex].input}
					/>

					<h6 class="text-base font-medium mt-4 mb-1">Expected Output</h6>
					<Input
						id="testOutput"
						placeholder="Test output"
						class="font-mono whitespace-pre-wrap bg-neutral-700"
						bind:value={tests[selectedTestIndex].expected_output}
					/>
				</div>
			{/if}
		</div>
	</Pane>
</PaneGroup>
