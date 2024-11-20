<script>
	import LeftPane from './LeftPane.svelte';
	import Testcase from './Testcase.svelte';
	import Editor from './Editor.svelte';
	import { Spinner, Tooltip, SEO } from '$lib/components';
	import { cn } from '$lib/utils';
	import { onMount } from 'svelte';
	import { toast } from '$lib/components/Toast';
	import { PaneGroup, Pane, PaneResizer } from 'paneforge';
	import JSConfetti from 'js-confetti';
	import { Play, CloudDownload, AlarmClock, AlarmClockOff, Pause } from 'lucide-svelte';
	import { scale, slide } from 'svelte/transition';
	import * as m from '$msgs';

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
	let timerInterval = $state(null);
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
			toast.error({
				message: m.app_exercise_submit_timeout(),
				timeout: RATE_LIMITING_TIMEOUT
			});
			return;
		}
		isSubmitting = true;
		rateLimiting = true;
		try {
			editor.formatCode();
			await new Promise((resolve) => setTimeout(resolve, 100));
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
				toast.error({ message: data.error });
				editor.resetEditorLayout();
				isSubmitting = false;
				return;
			}

			if (!data.passed) {
				toast.error({ message: data.error });
			} else {
				exercise.completed_at = data.submission.completed_at;
				if (!exercise?.submissions) exercise.submissions = [];

				exercise.submissions = [data.submission, ...exercise.submissions];
				submissions = exercise.submissions;
				jsConfetti.addConfetti();
				leftPaneActiveIndex = 1;
			}
		} catch (error) {
			toast.error({ message: error.message });
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
			toast.error({
				message: m.app_exercise_submit_timeout(),
				timeout: RATE_LIMITING_TIMEOUT
			});
			return;
		}
		rateLimiting = true;
		isRunning = true;

		try {
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
			if (!data.ok) {
				toast.error({
					message: data.message
				});
				isRunning = false;
			} else {
				latestRunnedTestsResults = data;
				mobileActiveTabIndex = 2;
				if (editor) editor.resetEditorLayout();

				// Check if all tests passed
				const isSolutionAccepted = data.results.every((test) => test.passed);
				if (isSolutionAccepted) {
					toast.success({ message: m.app_exercise_run_all_tests_passed(), timeout: 2500 });
				} else {
					toast.error({ message: m.app_exercise_run_some_tests_failed(), timeout: 2500 });
				}
			}
		} catch (error) {
			toast.error({
				message: error
			});
		}
		isRunning = false;

		setTimeout(() => {
			rateLimiting = false;
			hasBeenWarnedRateLimiting = false;
		}, RATE_LIMITING_TIMEOUT);
	}

	/**
	 * Loads the submission data.
	 *
	 * @param {Object} submission - The submission object containing the data to be loaded.
	 */
	function loadSubmission(submission) {
		editor.loadCode(submission.submission);
		mobileActiveTabIndex = 1;
	}

	/**
	 * Formats a given time in seconds into a human-readable string.
	 *
	 * @param {number} secs - The time in seconds to be formatted.
	 * @returns {string} The formatted time string.
	 */
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

<SEO title={exercise.title} description={exercise.description.slice(0, 160)} />

<!-- Code action buttons -->
<div
	class="z-30 mb-2 w-52 max-lg:fixed max-lg:left-1/2 max-lg:top-1 max-lg:-translate-x-1/2 lg:mx-auto"
>
	<div class="relative grid grid-cols-2 items-center gap-px">
		<!-- Run button -->
		<Tooltip
			content={isRunning
				? m.app_exercise_running_button_label()
				: m.app_exercise_run_button_label()}
			position="bottom"
		>
			<button
				class="flex w-full flex-row items-center justify-center gap-2 rounded-l-lg bg-neutral-800 px-2 py-2 text-center text-base font-medium text-neutral-300"
				onclick={() => {
					runCode();
				}}
			>
				<div class="relative block size-5">
					<Play
						class={cn(
							'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 fill-neutral-300 transition-all duration-300',
							isRunning ? 'size-0' : 'size-5'
						)}
					/>
					<div
						class={cn(
							'absolute left-1/2 top-1/2 flex size-5 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center transition-all duration-300'
						)}
					>
						<Spinner class={cn('transition-all', isRunning ? 'size-5' : 'size-0')} />
					</div>
				</div>
				{m.app_exercise_run_button()}
			</button>
		</Tooltip>
		<!-- Submit button -->
		<button
			class="flex flex-row items-center gap-2 rounded-r-lg bg-neutral-800 px-2 py-2 text-base font-medium text-green-600"
			onclick={submitSolution}
		>
			<div class="relative block size-5">
				<CloudDownload
					class={cn(
						'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300',
						isSubmitting ? 'size-0' : 'size-5'
					)}
				/>
				<div
					class={cn(
						'absolute left-1/2 top-1/2 flex size-5 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center transition-all duration-300'
					)}
				>
					<Spinner class={cn('transition-all', isSubmitting ? 'size-5' : 'size-0')} />
				</div>
			</div>
			{m.app_exercise_submit_button()}
		</button>

		<!-- Timer -->
		<div class="absolute left-full top-0 ml-2 hidden overflow-hidden rounded-lg lg:block">
			<div class="flex flex-row gap-px">
				<Tooltip
					content={timerInterval ? m.app_exercise_timer_reset() : m.app_exercise_timer_start()}
					class="size-10 bg-neutral-800"
					position="bottom"
				>
					<button
						aria-label={m.app_exercise_timer_start()}
						class="flex size-10 flex-col items-center justify-center bg-neutral-800 text-neutral-300"
						onclick={() => {
							if (timer || timerInterval) clearTimer();
							else startTimer();
						}}
					>
						{#if timer || timerInterval}
							<span in:scale>
								<AlarmClockOff class="size-5" />
							</span>
						{:else}
							<span in:scale>
								<AlarmClock class="size-5" />
							</span>
						{/if}
					</button>
				</Tooltip>
				{#if timer || timerInterval}
					<div class="flex w-fit flex-row gap-px" transition:slide={{ axis: 'x', duration: 700 }}>
						<!-- Time display -->
						<div
							class="flex h-10 flex-col items-center justify-center bg-neutral-900 px-2 text-center text-neutral-400 lg:bg-neutral-800"
						>
							{formatTime(timer)}
						</div>
						<!-- Play/Pause button -->
						<button
							class="flex size-10 shrink-0 flex-col items-center justify-center bg-neutral-900 text-neutral-300 lg:bg-neutral-800"
							aria-label={m.app_exercise_timer_reset()}
							onclick={() => {
								if (timerInterval !== null) pauseTimer();
								else playTimer();
							}}
						>
							{#if timerInterval !== null}
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
<div class="hidden !h-[calc(100vh-4rem)] grow flex-col overflow-hidden max-lg:flex">
	<div
		class="mb-2 grid shrink-0 grid-cols-3 flex-nowrap overflow-x-auto rounded-full bg-neutral-800"
	>
		<button
			class={cn(
				'flex flex-row items-center justify-center gap-2 rounded-full px-3 py-1 text-lg font-semibold transition-colors',
				mobileActiveTabIndex != 0 ? 'text-neutral-400 hover:bg-neutral-900/50' : 'bg-neutral-700'
			)}
			onclick={() => (mobileActiveTabIndex = 0)}>Problem</button
		>
		<button
			class={cn(
				'flex flex-row items-center justify-center gap-2 rounded-full px-3 py-1 text-lg font-semibold transition-colors',
				mobileActiveTabIndex != 1 ? 'text-neutral-400 hover:bg-neutral-900/50' : 'bg-neutral-700'
			)}
			onclick={() => (mobileActiveTabIndex = 1)}>Code</button
		>
		<button
			class={cn(
				'flex flex-row items-center justify-center gap-2 rounded-full px-3 py-1 text-lg font-semibold transition-colors',
				mobileActiveTabIndex != 2 ? 'text-neutral-400 hover:bg-neutral-900/50' : 'bg-neutral-700'
			)}
			onclick={() => (mobileActiveTabIndex = 2)}>Tests</button
		>
	</div>
	<div
		class="no-scrollbar grid w-[calc(300%)] grow grid-cols-3 overflow-hidden transition-transform duration-300"
		style="transform: translateX(-{(mobileActiveTabIndex * 100) / 3}%);"
	>
		<div class="flex flex-col overflow-y-auto">
			<LeftPane {exercise} {loadSubmission} bind:leftPaneActiveIndex bind:submissions />
		</div>
		<div class="flex grow flex-col">
			<Editor {exercise} bind:editor bind:value {runCode} />
		</div>
		<div class="flex grow flex-col">
			<Testcase {exercise} bind:latestRunnedTestsResults />
		</div>
	</div>
</div>

<!-- Main content on > lg screen size -->
<PaneGroup
	direction="horizontal"
	class="!hidden !h-[calc(100vh-4rem)] grow overflow-hidden lg:!flex"
	style="height: auto;"
	autoSaveId="exercisePage"
>
	<!-- Left part -->
	<Pane defaultSize={50} class="flex flex-col">
		<LeftPane {exercise} {loadSubmission} bind:leftPaneActiveIndex bind:submissions />
	</Pane>
	<PaneResizer class="group relative flex w-2 items-center justify-center">
		<div class="flex h-7 w-[2px] items-center justify-center rounded-sm bg-neutral-700"></div>
		<div
			class="absolute bottom-0 left-1/2 top-0 w-[2px] -translate-x-1/2 rounded-full transition-colors group-hover:bg-neutral-500"
		></div>
	</PaneResizer>

	<Pane defaultSize={50} class="flex w-full flex-col">
		<Editor {exercise} bind:editor bind:value {runCode} />
		<Testcase {exercise} bind:latestRunnedTestsResults />
	</Pane>
</PaneGroup>
