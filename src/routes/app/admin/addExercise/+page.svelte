<script>
	import { cn } from '$lib/utils';
	import { Spinner, Editor } from '$lib/components';
	import { fade, fly, scale } from 'svelte/transition';

	const { data } = $props();
	const DIFFICULTIES = ['easy', 'medium', 'hard'];
	let categories = $state(data.categories);
	let title = $state('Title');
	let description = $state('# Description');
	let category = $state(categories[0].id);
	let isSaving = $state(false);
	let error = $state(null);
	let tests = $state([{ input: '', expected_output: '' }]);
	let selectedTestIndex = $state(0);
	let difficulty = $state(DIFFICULTIES[0]);
	let startValue = $state('');
	let editor = $state();
	let createCategoryModalVisible = $state(false);
	let createCategoryModalError = $state(null);
	let isCreatingCategory = $state(false);

	async function save() {
		isSaving = true;
		const res = await fetch('/api/createExercise', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				title,
				description,
				category_id: category,
				difficulty,
				tests,
				content: startValue
			})
		});
		const data = await res.json();
		if (data.error) {
			error = data.error;
			isSaving = false;
			return;
		}
		console.log(data);
		isSaving = false;
	}

	function addTest() {
		tests.push({ input: '', expected_output: '' });
		selectedTestIndex = tests.length - 1;
		editor.resetEditorLayout();
	}

	async function createCategory(e) {
		e.preventDefault();
		isCreatingCategory = true;
		const categoryName = new FormData(e.target).get('name');

		if (!categoryName) {
			createCategoryModalError = 'Category name is required';
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
			console.log(data);
			if (!res.ok) {
				createCategoryModalError = data.message;
				return;
			}
			categories = [...categories, { id: data.id, name: data.name }];
			category = data.id;
			createCategoryModalVisible = false;
		} catch (error) {
			createCategoryModalError = error.message;
			isCreatingCategory = false;
		} finally {
			isCreatingCategory = false;
		}
	}
</script>

<svelte:head>
	<title>Add exercise</title>
</svelte:head>

{#if createCategoryModalVisible}
	<div transition:fade class="fixed z-40 inset-0 bg-neutral-900/50 backdrop-blur-md"></div>
	<div
		transition:fly={{ y: '100%' }}
		class="fixed z-40 inset-0 flex flex-col items-center justify-center p-2"
	>
		<form
			onsubmit={createCategory}
			class="p-4 rounded-xl bg-neutral-950 max-w-md w-full flex flex-col gap-4"
		>
			<h2 class="text-2xl font-semibold">Create category</h2>
			<input
				type="text"
				class="text-base font-medium md:font-semibold w-full rounded-xl bg-neutral-800 px-4 py-2 text-text-heading-dark outline-0 placeholder:text-text-body focus:outline-0"
				name="name"
				placeholder="Category name"
			/>
			{#if createCategoryModalError}
				<div
					transition:scale
					class="flex flex-col flex-shrink-0 p-4 border-red-600 border bg-neutral-900 rounded-xl"
				>
					<p>{createCategoryModalError}</p>
				</div>
			{/if}
			<div class="grid grid-cols-2 gap-4">
				<button
					type="button"
					class="text-base font-medium md:font-semibold w-full rounded-xl bg-neutral-900 px-4 py-2 text-text-heading-dark outline-0 placeholder:text-text-body focus:outline-0"
					onclick={() => (createCategoryModalVisible = false)}
				>
					Cancel
				</button>
				<button
					type="submit"
					class="text-base font-medium md:font-semibold w-full rounded-xl bg-neutral-800 px-4 py-2 text-text-heading-dark outline-0 placeholder:text-text-body focus:outline-0 flex flex-row items-center justify-center gap-2"
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

<div class="flex flex-col h-screen gap-4 p-4">
	<!-- Top part -->
	<!-- Create button -->
	<div class="flex shrink-0 justify-center items-center h-10">
		<div class="flex flex-row gap-0 rounded-lg overflow-hidden">
			<button
				class="px-2 py-2 text-base font-medium bg-neutral-800 flex flex-row items-center gap-2"
				onclick={save}
			>
				<div class="block relative size-5 text-green-600">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class={cn(
							'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 duration-300 transition-all',
							isSaving ? 'size-0' : 'size-5'
						)}
						><path d="M14.531 12.469 6.619 20.38a1 1 0 1 1-3-3l7.912-7.912" /><path
							d="M15.686 4.314A12.5 12.5 0 0 0 5.461 2.958 1 1 0 0 0 5.58 4.71a22 22 0 0 1 6.318 3.393"
						/><path
							d="M17.7 3.7a1 1 0 0 0-1.4 0l-4.6 4.6a1 1 0 0 0 0 1.4l2.6 2.6a1 1 0 0 0 1.4 0l4.6-4.6a1 1 0 0 0 0-1.4z"
						/><path
							d="M19.686 8.314a12.501 12.501 0 0 1 1.356 10.225 1 1 0 0 1-1.751-.119 22 22 0 0 0-3.393-6.319"
						/></svg
					>
					<div
						class={cn(
							'duration-300 transition-all absolute size-5 flex flex-col items-center justify-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
						)}
					>
						<Spinner class={cn('transition-all', isSaving ? 'size-5' : 'size-0')} />
					</div>
				</div>
				Create
			</button>
		</div>
	</div>

	<!-- Exercise content -->
	<div class="grid grid-cols-2 grow gap-4">
		<!-- Left part -->
		<div class="flex flex-col grow gap-4">
			<!-- Error -->
			{#if error}
				<div
					transition:scale
					class="flex flex-col flex-shrink-0 p-4 border-red-600 border bg-neutral-900 rounded-xl"
				>
					<h1 class="text-2xl font-bold text-red-600">Error</h1>
					<p>{error}</p>
				</div>
			{/if}

			<div class="flex flex-col grow bg-neutral-900 rounded-xl overflow-hidden">
				<div class="p-4 grow flex flex-col overflow-y-auto">
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
						<div class="h-full w-px bg-neutral-950"></div>
						<!-- Add new category -->
						<button
							class="size-9 flex flex-col items-center justify-center rounded-r-lg bg-neutral-800 text-base font-semibold"
							aria-label="Create category"
							onclick={() => (createCategoryModalVisible = true)}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="size-6"><path d="M5 12h14" /><path d="M12 5v14" /></svg
							>
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
					<input
						type="text"
						class="mb-2 mt-4 text-3xl font-medium leading-[3.5rem] md:font-semibold md:leading-[4rem] w-full rounded-xl bg-neutral-800 px-4 py-2 text-text-heading-dark outline-0 placeholder:text-text-body focus:outline-0"
						bind:value={title}
					/>
					<!-- Exercise description -->
					<textarea
						type="text"
						bind:value={description}
						class="grow w-full rounded-xl bg-neutral-800 px-6 py-3 text-base resize-none font-medium text-text-heading-dark outline-0 placeholder:text-text-body focus:outline-0"
					></textarea>
				</div>
			</div>
		</div>

		<!-- Right part -->
		<div class="flex w-full flex-col gap-4">
			<Editor language="javascript" bind:value={startValue} bind:this={editor} />
			<!-- Tests cases -->
			<div class="flex flex-col p-4 bg-neutral-900 rounded-xl shrink-0">
				<div class="flex flex-row flex-no-wrap overflow-x-auto gap-2">
					{#each tests as _test, index}
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div
							tabindex="0"
							class={cn(
								'px-3 shrink-0  py-1 rounded-xl flex flex-row items-center gap-2',
								index === selectedTestIndex && 'bg-neutral-950'
							)}
							onclick={() => (selectedTestIndex = index)}
						>
							Case {index + 1}
							<button
								aria-label="Delete test case"
								onclick={(e) => {
									e.stopPropagation();
									tests.splice(index, 1);
									if (selectedTestIndex != 0) selectedTestIndex--;
								}}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="size-4"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg
								>
							</button>
						</div>
					{/each}
					<button
						class="px-3 py-1 shrink-0 rounded-lg flex flex-row transition-all items-center gap-2 bg-neutral-700"
						onclick={addTest}
					>
						Add
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="size-4"><path d="M5 12h14" /><path d="M12 5v14" /></svg
						>
					</button>
				</div>
				{#if tests.length > 0}
					<div class="mt-4">
						<h6 class="text-base font-medium">Input</h6>
						<input
							type="text"
							class="font-mono whitespace-pre-wrap p-2 mt-1 rounded-xl w-full bg-neutral-800"
							bind:value={tests[selectedTestIndex].input}
						/>

						<h6 class="text-base font-medium mt-4">Expected Output</h6>
						<input
							type="text"
							class="font-mono whitespace-pre-wrap p-2 mt-1 rounded-xl w-full bg-neutral-800"
							bind:value={tests[selectedTestIndex].expected_output}
						/>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
