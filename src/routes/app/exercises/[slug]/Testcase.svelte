<script>
	import { cn, formatBytes } from '$lib/utils';
	import { slide } from 'svelte/transition';
	import { TestTubeDiagonal, MemoryStick, Terminal, ChevronDown } from 'lucide-svelte';
	import { Tooltip, Button } from '$lib/components';
	import * as m from '$msgs';

	let { exercise, latestRunnedTestsResults = $bindable() } = $props();

	let selectedTestIndex = $state(0);
	let isSolutionAccepted = $state(false);
	let consoleVisible = $state(true);

	$effect(() => {
		if (!isSolutionAccepted) return;
		isSolutionAccepted = latestRunnedTestsResults.results.every((test) => test.passed);
	});
</script>

<!-- Tests cases -->
<div class="flex grow flex-col overflow-hidden rounded-xl lg:mt-2 lg:shrink-0">
	<div
		class="flex h-10 shrink-0 flex-row flex-nowrap items-center justify-between overflow-x-auto bg-neutral-800 p-1 px-2"
	>
		<div class="flex flex-row items-center gap-2">
			<TestTubeDiagonal class="size-5" />
			{m.app_exercise_test_case_panel_title()}
		</div>
		{#if latestRunnedTestsResults && latestRunnedTestsResults?.averageRamUsage}
			<div class="flex flex-row gap-2">
				<Tooltip
					class="flex flex-row items-center gap-2"
					content={m.app_exercise_test_case_panel_ram_usage()}
				>
					<MemoryStick class="size-5" />
					{formatBytes(latestRunnedTestsResults.averageRamUsage)}
				</Tooltip>
			</div>
		{/if}
	</div>

	<div class="flex flex-col space-y-4 bg-card p-4 max-lg:grow">
		{#if exercise.tests.length > 1}
			<div class="flex-no-wrap flex flex-row gap-2 overflow-x-auto">
				{#each exercise.tests as _test, index}
					<Button
						variant={index === selectedTestIndex ? 'secondary' : 'ghost small'}
						class={cn('w-fit ', index === selectedTestIndex && 'hover:bg-neutral-800')}
						onclick={() => (selectedTestIndex = index)}
					>
						{#if latestRunnedTestsResults}
							<div
								transition:slide={{ axis: 'y' }}
								class={cn(
									'size-2 rounded-full',
									latestRunnedTestsResults.results[index].passed ? 'bg-green-600' : 'bg-red-600'
								)}
							></div>
						{/if}
						{m.app_exercise_test_case_panel_case_number({ number: index + 1 })}
					</Button>
				{/each}
			</div>
		{/if}
		{#if latestRunnedTestsResults}
			<h2
				transition:slide={{ axis: 'y' }}
				class={cn(
					'w-fit text-lg font-semibold',
					latestRunnedTestsResults.results[selectedTestIndex].passed
						? 'text-green-600'
						: 'text-red-600'
				)}
			>
				{latestRunnedTestsResults.results[selectedTestIndex].passed
					? m.app_exercise_test_case_panel_accepted()
					: m.app_exercise_test_case_panel_wrong_answer()}
			</h2>
			{#if latestRunnedTestsResults.results[selectedTestIndex]?.error}
				<div
					transition:slide={{ axis: 'y' }}
					class="mt-2 rounded-xl bg-red-600 p-2 text-neutral-100"
				>
					{latestRunnedTestsResults.results[selectedTestIndex].error}
				</div>
			{/if}
		{/if}
		<div class="space-y-4">
			{#if exercise.tests[selectedTestIndex]?.input}
				<p class="text-base font-medium">Input</p>
				<div class="mt-1 h-10 w-full whitespace-pre-wrap rounded-xl bg-neutral-800 p-2 font-mono">
					{exercise.tests[selectedTestIndex]?.input_display_value ||
						exercise.tests[selectedTestIndex].input.split('\n').at(-1)}
				</div>
			{/if}

			{#if exercise.tests[selectedTestIndex]?.expected_output}
				<p class="text-base font-medium">Expected Output</p>
				<div class="mt-1 h-10 w-full whitespace-pre-wrap rounded-xl bg-neutral-800 p-2 font-mono">
					{exercise.tests[selectedTestIndex]?.expected_output_display_value ||
						exercise.tests[selectedTestIndex].expected_output.split('\n').at(-1)}
				</div>
			{/if}

			{#if latestRunnedTestsResults && !latestRunnedTestsResults.results[selectedTestIndex].passed && latestRunnedTestsResults.results[selectedTestIndex].actual_output}
				<div class="block" transition:slide={{ axis: 'y' }}>
					<p class="text-base font-medium">Actual Output</p>
					<div class="mt-1 h-10 w-full whitespace-pre-wrap rounded-xl bg-neutral-700 p-2 font-mono">
						{Array.isArray(latestRunnedTestsResults.results[selectedTestIndex].actual_output)
							? JSON.stringify(latestRunnedTestsResults.results[selectedTestIndex].actual_output)
							: latestRunnedTestsResults.results[selectedTestIndex].actual_output}
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>

<!-- Console -->
{#if latestRunnedTestsResults && latestRunnedTestsResults?.consoleOutput?.length > 0}
	<div
		class="mt-2 flex shrink-0 flex-col overflow-hidden rounded-xl"
		transition:slide={{ axis: 'y' }}
	>
		<div
			class="flex h-10 shrink-0 flex-row flex-nowrap items-center justify-between overflow-x-auto bg-neutral-800 p-1 px-2"
		>
			<div class="flex flex-row items-center gap-2">
				<Terminal class="size-5" />
				{m.app_exercise_console_title()}
			</div>
			<Tooltip
				content={consoleVisible ? m.app_exercise_console_hide() : m.app_exercise_console_show()}
				position="left"
			>
				<button
					aria-label={consoleVisible
						? m.app_exercise_console_hide()
						: m.app_exercise_console_show()}
					title={consoleVisible ? m.app_exercise_console_hide() : m.app_exercise_console_show()}
					class="ml-auto rounded-lg p-1 transition-colors hover:bg-neutral-900/50"
					onclick={() => (consoleVisible = !consoleVisible)}
				>
					<ChevronDown class={cn('size-4 transition-transform', consoleVisible && 'rotate-180')} />
				</button>
			</Tooltip>
		</div>
		{#if consoleVisible}
			<div
				class="flex max-h-[140px] grow flex-col overflow-y-auto bg-neutral-900 p-4"
				transition:slide={{ axis: 'y' }}
			>
				{#each latestRunnedTestsResults.consoleOutput as line}
					<p class="grow whitespace-pre-wrap font-mono text-base">
						{line}
					</p>
				{/each}
			</div>
		{/if}
	</div>
{/if}
