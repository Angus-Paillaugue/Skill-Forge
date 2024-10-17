<script>
	import LeftPane from './LeftPane.svelte';
	import Testcase from './Testcase.svelte';
	import Editor from './Editor.svelte';
	import { Spinner, Tooltip } from '$lib/components';
	import { cn } from '$lib/utils';
	import { onMount } from 'svelte';
	import { newToast } from '$lib/stores';
	import { PaneGroup, Pane, PaneResizer } from 'paneforge';
	import JSConfetti from 'js-confetti';

	const { data } = $props();
	const { exercise } = data;

	const jsConfetti = new JSConfetti();
	let value = $state(exercise?.submission || exercise.content);
	let isRunning = $state(false);
	let latestRunnedTestsResults = $state(null);
	let isSubmitting = $state(false);
	let editor = $state();
	let submissions = $state(exercise.submissions);
	let mobileActiveTabIndex = $state(0);

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
	 * Submits the solution for the current exercise.
	 * It handles the process of sending the solution to the server for validation or storage.
	 */
	async function submitSolution() {
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
			latestRunnedTestsResults = data.results;
			if (data.error) {
				newToast({ type: 'red', message: data.error });
				editor.resetEditorLayout();
				isSubmitting = false;
				return;
			}

			if (!data.passed) {
				newToast({ type: 'red', message: data.error });
			} else {
				exercise.completed_at = data.submission.completed_at;
				if (!exercise?.submissions) exercise.submissions = [];

				exercise.submissions = [data.submission, ...exercise.submissions];
				submissions = exercise.submissions;
				jsConfetti.addConfetti();
			}
		} catch (error) {
			newToast({ type: 'red', message: error.message });
		} finally {
			editor.resetEditorLayout();
			isSubmitting = false;
		}
	}

	/**
	 * Makes a request to the server to run the tests of the current exercise.
	 *
	 * @async
	 * @function runCode
	 */
	async function runCode() {
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
		mobileActiveTabIndex = 2;
		const isSolutionAccepted = data.every((test) => test.passed);
		if (isSolutionAccepted) {
			newToast({ type: 'green', message: 'All tests passed!', timeout: 1500 });
		} else {
			newToast({ type: 'red', message: 'Some tests failed!', timeout: 1500 });
		}

		isRunning = false;
	}
</script>

<svelte:head>
	<title>{exercise.title}</title>
</svelte:head>

<!-- Code action buttons -->
<div
	class="grid grid-cols-2 z-20 items-center gap-px absolute max-lg:bottom-4 lg:top-2 left-1/2 -translate-x-1/2"
>
	<!-- Run button -->
	<Tooltip
		content="Run <kbd>CTRL</kbd> <kbd>Enter</kbd>"
		delay={100}
		class="w-fit ml-auto"
		position="bottom"
	>
		<button
			class="px-2 py-2 text-base rounded-l-lg font-medium text-neutral-300 bg-neutral-900 lg:bg-neutral-800 flex flex-row items-center gap-2"
			onclick={() => {
				runCode();
			}}
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
		class="px-2 py-2 text-base rounded-r-lg font-medium text-green-600 bg-neutral-900 lg:bg-neutral-800 flex flex-row items-center gap-2"
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

<!-- Main content on < lg screen size -->
<div class="max-lg:flex hidden flex-col grow overflow-hidden">
	<div
		class="grid mb-2 grid-cols-3 shrink-0 rounded-full flex-nowrap overflow-x-auto bg-neutral-800"
	>
		<button
			class={cn(
				'px-3 py-1 text-lg font-semibold justify-center transition-colors rounded-full flex flex-row items-center gap-2',
				mobileActiveTabIndex != 0 ? 'text-neutral-400 hover:bg-neutral-900/50' : 'bg-neutral-700'
			)}
			onclick={() => (mobileActiveTabIndex = 0)}>Problem</button
		>
		<button
			class={cn(
				'px-3 py-1 text-lg font-semibold justify-center transition-colors rounded-full flex flex-row items-center gap-2',
				mobileActiveTabIndex != 1 ? 'text-neutral-400 hover:bg-neutral-900/50' : 'bg-neutral-700'
			)}
			onclick={() => (mobileActiveTabIndex = 1)}>Code</button
		>
		<button
			class={cn(
				'px-3 py-1 text-lg font-semibold justify-center transition-colors rounded-full flex flex-row items-center gap-2',
				mobileActiveTabIndex != 2 ? 'text-neutral-400 hover:bg-neutral-900/50' : 'bg-neutral-700'
			)}
			onclick={() => (mobileActiveTabIndex = 2)}>Tests</button
		>
	</div>
	<div
		class="grid grid-cols-3 grow no-scrollbar w-[calc(300%+2rem)] gap-4 transition-transform overflow-hidden"
		style="transform: translateX(-{(mobileActiveTabIndex * 100) / 2.974}%);"
	>
		<div class="flex flex-col grow">
			<LeftPane {exercise} bind:value bind:editor bind:submissions />
		</div>
		<div class="flex flex-col grow">
			<Editor {exercise} bind:editor bind:value {runCode} />
		</div>
		<div class="flex flex-col grow">
			<Testcase {exercise} bind:latestRunnedTestsResults />
		</div>
	</div>
</div>

<!-- Main content on > lg screen size -->
<PaneGroup
	direction="horizontal"
	class="grow !h-[calc(100vh-4rem)] overflow-hidden lg:!flex !hidden"
	style="height: auto;"
	autoSaveId="exercisePage"
>
	<!-- Left part -->
	<Pane defaultSize={50} class="flex flex-col gap-2">
		<LeftPane {exercise} bind:value bind:editor bind:submissions />
	</Pane>
	<PaneResizer class="relative flex w-2 items-center justify-center group">
		<div class="flex h-7 w-[2px] items-center justify-center rounded-sm bg-neutral-700"></div>
		<div
			class="absolute top-0 rounded-full transition-colors bottom-0 w-[2px] left-1/2 -translate-x-1/2 group-hover:bg-blue-600"
		></div>
	</PaneResizer>

	<Pane defaultSize={50} class="flex w-full flex-col">
		<Editor {exercise} bind:editor bind:value {runCode} />
		<Testcase {exercise} bind:latestRunnedTestsResults />
	</Pane>
</PaneGroup>
