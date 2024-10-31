<script>
	import { cn, urlHealer } from '$lib/utils';
	import { Spinner, Editor, Input } from '$lib/components';
	import { scale } from 'svelte/transition';
	import { PaneGroup, Pane, PaneResizer } from 'paneforge';
	import { toast } from '$lib/components/Toast';
	import { Save, Plus, Text, ScanEye, Code, X } from 'lucide-svelte';

	const { data } = $props();
	const { exercise } = data;
	const DIFFICULTIES = ['easy', 'medium', 'hard'];
	let title = $state(exercise.title);
	let description = $state(exercise.description);
	let isSaving = $state(false);
	let tests = $state(exercise.tests);
	let selectedTestIndex = $state(0);
	let difficulty = $state(exercise.difficulty);
	let startValue = $state(exercise.content);
	let editor = $state();
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
				learning_path_id: null,
				difficulty,
				tests,
				content: startValue
			})
		});
		const data = await res.json();
		if (!res.ok) {
			toast.error({ message: data.message });
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
			toast.error({ message: error.message });
		}
	}
</script>

<!-- SEO -->
<svelte:head>
	<!-- Normal tags -->
	<title>Edit an exercise | Skill-Forge</title>
	<meta name="description" content="Edit an exercise" />

	<!-- Open Graph tags -->
	<meta property="og:title" content="Edit an exercise | Skill-Forge" />
	<meta property="og:description" content="Edit an exercise" />

	<!-- Twitter / X tags -->
	<meta property="twitter:title" content="Edit an exercise | Skill-Forge" />
	<meta property="twitter:description" content="Edit an exercise" />
</svelte:head>

<!-- Create button -->
<button
	class="absolute left-1/2 top-2 z-40 flex -translate-x-1/2 flex-row items-center gap-2 rounded-lg bg-neutral-800 px-2 py-2 text-base font-medium"
	onclick={save}
>
	<div class="relative block size-5 text-green-600">
		<Save
			class={cn(
				'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300',
				isSaving ? 'size-0' : 'size-5'
			)}
		/>
		<div
			class={cn(
				'absolute left-1/2 top-1/2 flex size-5 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center transition-all duration-300'
			)}
		>
			<Spinner class={cn('transition-all', isSaving ? 'size-5' : 'size-0')} />
		</div>
	</div>
	Save
</button>

<PaneGroup
	direction="horizontal"
	class="!h-[calc(100vh-4rem)] grow overflow-hidden"
	style="height: auto;"
	autoSaveId="adminAddExercisePage"
>
	<!-- Left part -->
	<Pane defaultSize={50} class="flex flex-col gap-2">
		{#if success}
			<div
				transition:scale
				class="flex flex-shrink-0 flex-col rounded-xl border border-green-600 bg-neutral-900 p-4"
			>
				<h1 class="text-2xl font-bold text-green-600">Success</h1>
				<p>{success.message}</p>
				<a
					class="text-neutral-100 underline transition-colors hover:text-neutral-400"
					href="/app/exercises/{urlHealer.identifier.join(exercise.slug, exercise.exercise_id)}"
					>Go to exercise</a
				>
			</div>
		{/if}

		<div class="flex h-full grow flex-col rounded-xl bg-neutral-900">
			<div class="flex grow flex-col overflow-y-auto p-4">
				<!-- Exercise difficulty -->
				<select
					bind:value={difficulty}
					class={cn(
						'mt-6 block w-fit rounded-full px-2 py-1 text-sm font-semibold',
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
					class="mb-6 mt-4 bg-neutral-800 text-2xl font-medium leading-[3.5rem] md:font-semibold md:leading-[4rem]"
					bind:value={title}
				/>
				<!-- Exercise description -->
				<div class="flex grow flex-col">
					<!-- Test/Preview buttons -->
					<div class="mb-2 flex shrink-0 flex-row gap-4">
						<button
							class={cn(
								'flex flex-row items-center gap-2 rounded-xl px-2 py-1 transition-colors',
								!isPreviewingDescription && 'bg-neutral-800'
							)}
							onclick={() => (isPreviewingDescription = false)}
						>
							Text
							<Text class="size-5" />
						</button>
						<button
							class={cn(
								'flex flex-row items-center gap-2 rounded-xl px-2 py-1 transition-colors',
								isPreviewingDescription && 'bg-neutral-800'
							)}
							onclick={() => (isPreviewingDescription = true)}
						>
							Preview
							<ScanEye class="size-5" />
						</button>
					</div>
					<div id="pageContainer" class="flex shrink-0 grow flex-col">
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
								class="w-full grow resize-none rounded-xl bg-neutral-800 px-6 py-3 text-base font-medium text-neutral-100 placeholder:text-neutral-400"
							></textarea>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</Pane>
	<PaneResizer class="group relative flex w-2 items-center justify-center">
		<div class="flex h-7 w-[2px] items-center justify-center rounded-sm bg-neutral-700"></div>
		<div
			class="absolute bottom-0 left-1/2 top-0 w-[2px] -translate-x-1/2 rounded-full transition-colors group-hover:bg-neutral-500"
		></div>
	</PaneResizer>
	<!-- Right part -->
	<Pane defaultSize={50} class="flex w-full flex-col">
		<!-- Main code editor -->
		<div class="flex flex-col">
			<!-- Full screen button -->
			<div
				class="flex h-10 flex-row items-center gap-2 rounded-t-xl bg-neutral-800 px-2 text-neutral-400"
			>
				<div class="flex flex-row items-center gap-2 px-2">
					<Code class="size-5" />
					Code
				</div>
			</div>
		</div>
		<Editor language="javascript" bind:value={startValue} bind:this={editor} />
		<!-- Tests cases -->
		<div class="mt-2 flex shrink-0 flex-col rounded-xl bg-neutral-800 p-4">
			<div class="flex-no-wrap flex flex-row gap-2 overflow-x-auto">
				{#each tests as _test, index}
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div
						tabindex="0"
						class={cn(
							'flex shrink-0  cursor-pointer flex-row items-center gap-2 rounded-xl px-3 py-1',
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
									toast.error({ message: 'You must have at least one test case' });
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
					class="flex shrink-0 flex-row items-center gap-2 rounded-lg bg-neutral-700 px-3 py-1 transition-all"
					onclick={addTest}
				>
					Add
					<Plus class="size-4" />
				</button>
			</div>
			{#if tests.length > 0}
				<div class="mt-4">
					<h6 class="mb-1 text-base font-medium">Input</h6>
					<Input
						id="testInput"
						placeholder="Test input"
						class="whitespace-pre-wrap bg-neutral-700 font-mono"
						bind:value={tests[selectedTestIndex].input}
					/>

					<h6 class="mb-1 mt-4 text-base font-medium">Expected Output</h6>
					<Input
						id="testOutput"
						placeholder="Test output"
						class="whitespace-pre-wrap bg-neutral-700 font-mono"
						bind:value={tests[selectedTestIndex].expected_output}
					/>
				</div>
			{/if}
		</div>
	</Pane>
</PaneGroup>
