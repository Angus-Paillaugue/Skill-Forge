<script>
	import { cn, formatBytes } from '$lib/utils';
	import { slide } from 'svelte/transition';
	import { TestTubeDiagonal, MemoryStick, Terminal, ChevronDown } from 'lucide-svelte';
	import { Tooltip, Button } from '$lib/components';

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
		class="flex h-10 shrink-0 flex-row flex-nowrap items-center justify-between overflow-x-auto bg-neutral-700 p-1 px-2"
	>
		<div class="flex flex-row items-center gap-2">
			<TestTubeDiagonal class="size-5" />
			Testcase
		</div>
		{#if latestRunnedTestsResults && latestRunnedTestsResults?.averageRamUsage}
			<div class="flex flex-row gap-2">
				<Tooltip class="flex flex-row items-center gap-2" content="RAM Usage">
					<MemoryStick class="size-5" />
					{formatBytes(latestRunnedTestsResults.averageRamUsage)}
				</Tooltip>
			</div>
		{/if}
	</div>

	<div class="flex flex-col bg-neutral-800 p-4 max-lg:grow">
		<div class="flex-no-wrap flex flex-row gap-2 overflow-x-auto">
			{#each exercise.tests as _test, index}
				<Button
					variant={index === selectedTestIndex ? 'secondary' : 'ghost small'}
					class={cn('w-fit ', index === selectedTestIndex && 'hover:bg-neutral-700')}
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
					Case {index + 1}
				</Button>
			{/each}
		</div>
		{#if latestRunnedTestsResults}
			<h2
				transition:slide={{ axis: 'y' }}
				class={cn(
					'mt-2 w-fit text-lg font-semibold',
					latestRunnedTestsResults.results[selectedTestIndex].passed
						? 'text-green-600'
						: 'text-red-600'
				)}
			>
				{latestRunnedTestsResults.results[selectedTestIndex].passed ? 'Accepted' : 'Wrong Answer'}
			</h2>
			{#if latestRunnedTestsResults.results[selectedTestIndex]?.error}
				<div transition:slide={{ axis: 'y' }} class="mt-2 rounded-xl bg-red-600 p-2 text-white">
					{latestRunnedTestsResults.results[selectedTestIndex].error}
				</div>
			{/if}
		{/if}
		<div class="mt-4">
			<p class="text-base font-medium">Input</p>
			<div class="mt-1 h-10 w-full whitespace-pre-wrap rounded-xl bg-neutral-700 p-2 font-mono">
				{exercise.tests[selectedTestIndex]?.display_value ||
					exercise.tests[selectedTestIndex].input.split('\n').at(-1)}
			</div>

			<p class="mt-4 text-base font-medium">Expected Output</p>
			<div class="mt-1 h-10 w-full whitespace-pre-wrap rounded-xl bg-neutral-700 p-2 font-mono">
				{exercise.tests[selectedTestIndex].expected_output}
			</div>

			{#if latestRunnedTestsResults && !latestRunnedTestsResults.results[selectedTestIndex].passed && latestRunnedTestsResults.results[selectedTestIndex].actual_output}
				<div class="block" transition:slide={{ axis: 'y' }}>
					<p class="mt-4 text-base font-medium">Actual Output</p>
					<div class="mt-1 h-10 w-full whitespace-pre-wrap rounded-xl bg-neutral-700 p-2 font-mono">
						{latestRunnedTestsResults.results[selectedTestIndex].actual_output}
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
			class="flex h-10 shrink-0 flex-row flex-nowrap items-center justify-between overflow-x-auto bg-neutral-700 p-1 px-2"
		>
			<div class="flex flex-row items-center gap-2">
				<Terminal class="size-5" />
				Console
			</div>
			<Tooltip content={consoleVisible ? 'Hide console' : 'Show console'} position="left">
				<button
					aria-label={consoleVisible ? 'Hide console' : 'Show console'}
					title={consoleVisible ? 'Hide console' : 'Show console'}
					class="ml-auto rounded-lg p-1 transition-colors hover:bg-neutral-900/50"
					onclick={() => (consoleVisible = !consoleVisible)}
				>
					<ChevronDown class={cn('size-4 transition-transform', consoleVisible && 'rotate-180')} />
				</button>
			</Tooltip>
		</div>
		{#if consoleVisible}
			<div
				class="flex max-h-[140px] grow flex-col overflow-y-auto bg-neutral-800 p-4"
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
