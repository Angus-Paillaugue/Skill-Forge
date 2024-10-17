<script>
	import { Editor, Spinner, Difficulty, Tooltip } from '$lib/components';
	import { cn, formatDate } from '$lib/utils';
	import { scale } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { PaneGroup, Pane, PaneResizer } from 'paneforge';
	import JSConfetti from 'js-confetti';

	const { data } = $props();
	const { exercise } = data;

	const jsConfetti = new JSConfetti();
	let value = $state(exercise?.submission || exercise.content);
	let isRunning = $state(false);
	let selectedTestIndex = $state(0);
	let latestRunnedTestsResults = $state(null);
	let isSubmitting = $state(false);
	let editor = $state();
	let error = $state(null);
	let leftPaneActiveIndex = $state(0);
	let submissions = $state(exercise.submissions);
	let editorFullScreen = $state(false);

	onMount(async () => {
		window.addEventListener('keydown', handleShortcut);
	});

	/**
	 * Handles keyboard shortcuts for the exercise page.
	 *
	 * @param {Event} event - The keyboard event triggered by the user.
	 */
	function handleShortcut(event) {
		if (event.ctrlKey && event.key === 'Enter') {
			runCode();
		}
	}

	/**
	 * Makes a request to the server to run the tests of the current exercise.
	 *
	 * @async
	 * @function runCode
	 */
	async function runCode() {
		error = false;
		isRunning = true;
		const res = await fetch('/api/runTests', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				exercise_id: exercise.exercise_id,
				user_input: value
			})
		});
		const data = await res.json();

		latestRunnedTestsResults = data;
		editor.resetEditorLayout();

		isRunning = false;
	}

	/**
	 * Submits the solution for the current exercise.
	 * It handles the process of sending the solution to the server for validation or storage.
	 */
	async function submitSolution() {
		error = false;
		isSubmitting = true;
		try {
			const res = await fetch('/api/submitSolution', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					exercise_id: exercise.exercise_id,
					user_input: value
				})
			});
			const data = await res.json();
			if (data.error) {
				error = data.error;
				isSubmitting = false;
				return;
			}

			if (!data.passed) {
				error = data.error;
			} else {
				exercise.completed_at = data.submission.completed_at;
				if (!exercise?.submissions) exercise.submissions = [];

				exercise.submissions = [data.submission, ...exercise.submissions];
				submissions = exercise.submissions;
				jsConfetti.addConfetti();
				leftPaneActiveIndex = 1;
			}
		} catch (error) {
			console.error(error);
			error = error.message;
		} finally {
			editor.resetEditorLayout();
			latestRunnedTestsResults = data.results;
			isSubmitting = false;
		}
	}
</script>

<svelte:head>
	<title>{exercise.title}</title>
</svelte:head>

<!-- Code action buttons -->
<div class="grid grid-cols-2 items-center gap-px absolute top-2 left-1/2 -translate-x-1/2">
	<!-- Run button -->
	<Tooltip
		content="Run <kbd>CTRL</kbd> <kbd>Enter</kbd>"
		delay={100}
		class="w-fit ml-auto"
		position="bottom"
	>
		<button
			class="px-2 py-2 text-base rounded-l-lg font-medium text-neutral-300 bg-neutral-800 flex flex-row items-center gap-2"
			onclick={runCode}
		>
			<div class="block relative size-5">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="currentColor"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class={cn(
						'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 duration-300 transition-all',
						isRunning ? 'size-0' : 'size-5'
					)}><polygon points="6 3 20 12 6 21 6 3" /></svg
				>
				<div
					class={cn(
						'duration-300 transition-all absolute size-5 flex flex-col items-center justify-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
					)}
				>
					<Spinner class={cn('transition-all', isRunning ? 'size-5' : 'size-0')} />
				</div>
			</div>
			Run
		</button>
	</Tooltip>
	<!-- Submit button -->
	<button
		class="px-2 py-2 text-base rounded-r-lg font-medium text-green-600 bg-neutral-800 flex flex-row items-center gap-2"
		onclick={submitSolution}
	>
		<div class="block relative size-5">
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
					isSubmitting ? 'size-0' : 'size-5'
				)}
				><path d="M12 13v8l-4-4" /><path d="m12 21 4-4" /><path
					d="M4.393 15.269A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.436 8.284"
				/></svg
			>
			<div
				class={cn(
					'duration-300 transition-all absolute size-5 flex flex-col items-center justify-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
				)}
			>
				<Spinner class={cn('transition-all', isSubmitting ? 'size-5' : 'size-0')} />
			</div>
		</div>
		Submit
	</button>
</div>

<!-- Main content -->
<PaneGroup
	direction="horizontal"
	class="grow !h-[calc(100vh-4rem)] overflow-hidden"
	style="height: auto;"
	autoSaveId="exercisePage"
>
	<!-- Left part -->
	<Pane defaultSize={50} class="flex flex-col gap-4">
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

		<div class="flex flex-col grow justify-center bg-neutral-900 rounded-xl overflow-hidden">
			<!-- Tab selection buttons -->
			<div class="flex flex-row flex-nowrap overflow-x-auto shrink-0 bg-neutral-800 p-1">
				<button
					class={cn(
						'px-3 py-1 shrink-0  rounded-lg flex flex-row transition-all items-center gap-2 hover:bg-neutral-700',
						leftPaneActiveIndex != 0 && 'opacity-50'
					)}
					onclick={() => (leftPaneActiveIndex = 0)}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="size-5"
						><path d="M12 7v14" /><path d="M16 12h2" /><path d="M16 8h2" /><path
							d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"
						/><path d="M6 12h2" /><path d="M6 8h2" /></svg
					>
					Description
				</button>
				<button
					class={cn(
						'px-3 py-1 shrink-0 rounded-lg flex flex-row transition-all items-center gap-2 hover:bg-neutral-700',
						leftPaneActiveIndex != 1 && 'opacity-50'
					)}
					onclick={() => (leftPaneActiveIndex = 1)}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="size-5"
						><path
							d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"
						/><path d="M8.5 2h7" /><path d="M7 16h10" /></svg
					>
					Solutions
				</button>
			</div>
			<!-- Exercise infos (title, description) -->
			<div class="p-4 grow overflow-y-auto">
				<!-- Exercise description -->
				{#if leftPaneActiveIndex === 0}
					<div class="flex flex-row items-center justify-between">
						<div class="block px-2 py-2 rounded-lg bg-neutral-800 text-base font-semibold w-fit">
							{exercise.category_name}
						</div>
						{#if exercise?.submissions?.length > 0}
							<div class="flex flex-row items-center gap-2">
								Solved
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
							</div>
						{/if}
					</div>
					<Difficulty class="mt-6" difficulty={exercise.difficulty} />
					<h1
						class="mb-2 mt-4 text-3xl font-medium leading-[3.5rem] md:font-semibold md:leading-[4rem]"
					>
						{exercise.title}
					</h1>
					<div id="pageContainer">
						{@html exercise.description}
					</div>
				{:else if leftPaneActiveIndex === 1}
					<!-- User submitted solutions -->
					<div class="relative overflow-x-auto w-full rounded-lg">
						{#if submissions.length === 0}
							<div class="w-full bg-neutral-800 p-4 rounded-lg">
								<h2 class="text-base font-medium">You have no submissions!</h2>
							</div>
						{:else}
							<table class="w-full text-sm text-left rtl:text-right text-neutral-400 table-auto">
								<thead class="text-xs uppercase bg-neutral-700 text-neutral-400">
									<tr>
										<th scope="col" class="px-6 py-3"> Code </th>
										<th scope="col" class="px-6 py-3"> Date </th>
									</tr>
								</thead>
								<tbody>
									{#key submissions}
										{#each submissions as submission}
											<tr
												class="odd:bg-white odd:dark:bg-neutral-900 even:bg-neutral-800 border-b border-neutral-700"
												onclick={() => {
													value = submission.submission;
													editor.loadCode(value);
												}}
											>
												<td class="px-6 py-4">
													<p class="text-sm whitespace-pre-wrap line-clamp-3 font-mono">
														{submission.submission}
													</p>
												</td>
												<td class="px-6 py-4">
													{formatDate(submission.completed_at)}
												</td>
											</tr>
										{/each}
									{/key}
								</tbody>
							</table>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	</Pane>
	<PaneResizer class="relative flex w-2 items-center justify-center bg-background">
		<div class="z-10 flex h-7 w-1 items-center justify-center rounded-sm bg-neutral-800"></div>
	</PaneResizer>
	<!-- Right part -->
	<Pane defaultSize={50} class="flex w-full flex-col">
		<!-- Main code editor -->
		<div class={cn('flex flex-col', editorFullScreen && 'fixed inset-2')}>
			<!-- Full screen button -->
			<div
				class="flex flex-row items-center px-2 gap-2 h-10 rounded-t-xl bg-neutral-800 text-neutral-400"
			>
				<div class="flex flex-row items-center px-2 gap-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="size-5"
						><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg
					>
					Code
				</div>
			</div>
		</div>
		<Editor
			language="javascript"
			defaultValue={exercise.content}
			bind:value
			bind:this={editor}
			onRunCodeShortcut={runCode}
		/>
		<!-- Tests cases -->
		<div class="flex flex-col p-4 bg-neutral-900 rounded-xl shrink-0 mt-2">
			<div class="flex flex-row flex-no-wrap overflow-x-auto gap-2">
				{#each exercise.tests as _test, index}
					<button
						class={cn(
							'px-3 py-1 shrink-0  rounded-xl flex flex-row items-center gap-2',
							index === selectedTestIndex && 'bg-neutral-950'
						)}
						onclick={() => (selectedTestIndex = index)}
					>
						{#if latestRunnedTestsResults}
							<div
								transition:scale
								class={cn(
									'size-2 rounded-full',
									latestRunnedTestsResults[index].passed ? 'bg-green-600' : 'bg-red-600'
								)}
							></div>
						{/if}
						Case {index + 1}
					</button>
				{/each}
			</div>
			{#if latestRunnedTestsResults}
				<h2
					transition:scale
					class={cn(
						'text-lg w-fit font-semibold mt-2',
						latestRunnedTestsResults[selectedTestIndex].passed ? 'text-green-600' : 'text-red-600'
					)}
				>
					{latestRunnedTestsResults[selectedTestIndex].passed ? 'Accepted' : 'Wrong Answer'}
				</h2>
				{#if latestRunnedTestsResults[selectedTestIndex]?.error}
					<div transition:scale class="mt-2 p-2 bg-red-600 text-white rounded-xl">
						{latestRunnedTestsResults[selectedTestIndex].error}
					</div>
				{/if}
			{/if}
			<div class="mt-4">
				<h6 class="text-base font-medium">Input</h6>
				<div class="font-mono whitespace-pre-wrap p-2 mt-1 rounded-xl w-full bg-neutral-800">
					{exercise.tests[selectedTestIndex].input}
				</div>

				<h6 class="text-base font-medium mt-4">Expected Output</h6>
				<div class="font-mono whitespace-pre-wrap p-2 mt-1 rounded-xl w-full bg-neutral-800">
					{exercise.tests[selectedTestIndex].expected_output}
				</div>
			</div>
		</div>
	</Pane>
</PaneGroup>
