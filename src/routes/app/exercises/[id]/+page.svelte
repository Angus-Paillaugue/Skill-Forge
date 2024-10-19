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
	import { Play, CloudDownload, AlarmClock, AlarmClockOff, Pause } from 'lucide-svelte';
	import { scale, slide } from 'svelte/transition';

	const { data } = $props();
	const { exercise } = data;
	const RATE_LIMITING_TIMEOUT = 2000;

	let jsConfetti = $state();
	let isRunning = $state(false);
	let latestRunnedTestsResults = $state(null);
	let isSubmitting = $state(false);
	let editor = $state();
	let submissions = $state(exercise.submissions);
	let value = $state(exercise.content);
	let mobileActiveTabIndex = $state(0);
	let leftPaneActiveIndex = $state(0);
	let timer = $state(null);
	let timerInterval = $state();
	let rateLimiting = $state(false);
	let hasBeenWarnedRateLimiting = $state(false);

	onMount(async () => {
		window.addEventListener('keydown', handleShortcut);
		jsConfetti = new JSConfetti();
		if (exercise.submissions.length > 0) {
			value = exercise.submissions[0].submission;
		}

		return () => {
			window.removeEventListener('keydown', handleShortcut);
		};
	});

	/**
	 * Handles keyboard shortcuts for the exercise page.
	 *
	 * @param {Event} event - The keyboard event triggered by the user.
	 */
	function handleShortcut(event) {
		if (event.ctrlKey && event.key === 'Enter') {
			console.log('Shortcut triggered');
			runCode();
		}
	}

	/**
	 * Submits the solution for the current exercise.
	 * It handles the process of sending the solution to the server for validation or storage.
	 */
	async function submitSolution() {
		if (hasBeenWarnedRateLimiting || isSubmitting) return;
		if (rateLimiting) {
			hasBeenWarnedRateLimiting = true;
			newToast({ type: 'red', message: 'Please wait a moment before submitting again.', timeout: RATE_LIMITING_TIMEOUT });
			return;
		}
		isSubmitting = true;
		rateLimiting = true;
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
				leftPaneActiveIndex = 1;
			}
		} catch (error) {
			newToast({ type: 'red', message: error.message });
		} finally {
			editor.resetEditorLayout();
			isSubmitting = false;
			setTimeout(() => {
				rateLimiting = false;
				hasBeenWarnedRateLimiting = false;
			}, RATE_LIMITING_TIMEOUT);
		}
	}

	/**
	 * Makes a request to the server to run the tests of the current exercise.
	 *
	 * @async
	 * @function runCode
	 */
	async function runCode() {
		if (hasBeenWarnedRateLimiting || isRunning) return;
		if (rateLimiting) {
			hasBeenWarnedRateLimiting = true;
			newToast({ type: 'red', message: 'Please wait a moment before submitting again.', timeout: RATE_LIMITING_TIMEOUT });
			return;
		}
		rateLimiting = true;
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
		mobileActiveTabIndex = 2;
		if (editor) editor.resetEditorLayout();

		// Check if all tests passed
		const isSolutionAccepted = data.results.every((test) => test.passed);
		if (isSolutionAccepted) {
			newToast({ type: 'green', message: 'All tests passed!', timeout: 1500 });
		} else {
			newToast({ type: 'red', message: 'Some tests failed!', timeout: 1500 });
		}

		isRunning = false;

		setTimeout(() => {
			rateLimiting = false;
			hasBeenWarnedRateLimiting = false;
		}, RATE_LIMITING_TIMEOUT);
	}

	function formatTime(secs) {
		const pad = (n) => (n < 10 ? `0${n}` : n);
		const h = Math.floor(secs / 3600);
		const m = Math.floor(secs / 60) - h * 60;
		const s = Math.floor(secs - h * 3600 - m * 60);

		return `${pad(h)}:${pad(m)}:${pad(s)}`;
	}

	const startTimer = () => {
		timer = 0;
		timerInterval = setInterval(() => {
			timer++;
		}, 1000);
	};
	const pauseTimer = () => {
		clearInterval(timerInterval);
		timerInterval = null;
	};
	const playTimer = () => {
		timerInterval = setInterval(() => {
			timer++;
		}, 1000);
	};
	const clearTimer = () => {
		clearInterval(timerInterval);
		timerInterval = null;
		timer = null;
	};
</script>

<svelte:head>
	<title>{exercise.title}</title>
</svelte:head>

<!-- Code action buttons -->
<div class="z-20 absolute max-lg:bottom-4 lg:top-2 w-52 left-1/2 -ml-[6.5rem]">
	<div class="grid grid-cols-2 items-center gap-px relative">
		<!-- Run button -->
		<Tooltip content="Run <kbd>CTRL</kbd> <kbd>Enter</kbd>" delay={100} position="bottom">
			<button
				class="px-2 py-2 w-full text-center justify-center text-base rounded-l-lg font-medium text-neutral-300 bg-neutral-900 lg:bg-neutral-800 flex flex-row items-center gap-2"
				onclick={() => {
					runCode();
				}}
			>
				<div class="block relative size-5">
					<Play
						class={cn(
							'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fill-neutral-300 duration-300 transition-all',
							isRunning ? 'size-0' : 'size-5'
						)}
					/>
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
				<CloudDownload
					class={cn(
						'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 duration-300 transition-all',
						isSubmitting ? 'size-0' : 'size-5'
					)}
				/>
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

		<div
			class="absolute -top-full max-lg:-translate-x-1/2 max-lg:-mt-2 max-lg:left-1/2 lg:left-full lg:ml-2 lg:top-0 rounded-lg overflow-hidden"
		>
			<div class="flex flex-row gap-px">
				<Tooltip
					content={timerInterval ? 'Reset timer' : 'Start timer'}
					delay={100}
					class="size-10 bg-neutral-800"
					position="bottom"
				>
					<button
						aria-label="Start timer"
						class="flex flex-col items-center justify-center size-10 text-neutral-300 bg-neutral-900 lg:bg-neutral-800"
						onclick={() => {
							if (timerInterval) clearTimer();
							else startTimer();
						}}
					>
						{#if timer == null}
							<span in:scale>
								<AlarmClock class="size-5" />
							</span>
						{:else}
							<span in:scale>
								<AlarmClockOff class="size-5" />
							</span>
						{/if}
					</button>
				</Tooltip>
				{#if timer !== null}
					<div class="flex flex-row gap-px w-fit" transition:slide={{ axis: 'x', duration: 700 }}>
						<!-- Time display -->
						<div
							class="flex flex-col items-center px-2 justify-center text-center text-neutral-400 h-10 bg-neutral-900 lg:bg-neutral-800"
						>
							{formatTime(timer)}
						</div>
						<!-- Play/Pause button -->
						<button
							class="flex size-10 shrink-0 bg-neutral-900 text-neutral-300 lg:bg-neutral-800 flex-col items-center justify-center"
							aria-label="Reset timer"
							onclick={() => {
								if (timerInterval) pauseTimer();
								else playTimer();
							}}
						>
							{#if timerInterval}
								<span in:scale>
									<Pause class="size-5" />
								</span>
							{:else}
								<span in:scale>
									<Play class="size-5 fill-neutral-300" />
								</span>
							{/if}
						</button>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<!-- Main content on < lg screen size -->
<div class="max-lg:flex hidden flex-col grow !h-[calc(100vh-4rem)] overflow-hidden">
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
		<div class="flex flex-col overflow-y-auto">
			<LeftPane {exercise} bind:leftPaneActiveIndex bind:value bind:editor bind:submissions />
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
	<Pane defaultSize={50} class="flex flex-col">
		<LeftPane {exercise} bind:leftPaneActiveIndex bind:value bind:editor bind:submissions />
	</Pane>
	<PaneResizer class="relative flex w-2 items-center justify-center group">
		<div class="flex h-7 w-[2px] items-center justify-center rounded-sm bg-neutral-700"></div>
		<div
			class="absolute top-0 rounded-full transition-colors bottom-0 w-[2px] left-1/2 -translate-x-1/2 group-hover:bg-neutral-500"
		></div>
	</PaneResizer>

	<Pane defaultSize={50} class="flex w-full flex-col">
		<Editor {exercise} bind:editor bind:value {runCode} />
		<Testcase {exercise} bind:latestRunnedTestsResults />
	</Pane>
</PaneGroup>
