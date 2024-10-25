<script>
	import { cn, formatBytes } from '$lib/utils';
	import { scale } from 'svelte/transition';
	import { TestTubeDiagonal, MemoryStick } from 'lucide-svelte';
	import { Tooltip } from '$lib/components';

	let { exercise, latestRunnedTestsResults = $bindable() } = $props();

	let selectedTestIndex = $state(0);
	let isSolutionAccepted = $state(false);

	$effect(() => {
		if (!isSolutionAccepted) return;
		isSolutionAccepted = latestRunnedTestsResults.results.every((test) => test.passed);
	});
</script>

<!-- Tests cases -->
<div class="flex flex-col rounded-xl overflow-hidden max-lg:grow shrink-0 lg:mt-2">
	<div
		class="flex flex-row items-center px-2 justify-between flex-nowrap overflow-x-auto h-10 shrink-0 bg-neutral-700 p-1"
	>
		<div class="flex flex-row items-center gap-2">
			<TestTubeDiagonal class="size-5" />
			Testcase
		</div>
		{#if latestRunnedTestsResults}
			<div class="flex flex-row gap-2">
				<Tooltip class="flex flex-row gap-2 items-center" content="RAM Usage">
					<MemoryStick class="size-5" />
					{formatBytes(latestRunnedTestsResults.averageRamUsage)}
				</Tooltip>
			</div>
		{/if}
	</div>

	<div class="flex flex-col p-4 bg-neutral-800 max-lg:grow">
		<div class="flex flex-row flex-no-wrap overflow-x-auto gap-2">
			{#each exercise.tests as _test, index}
				<button
					class={cn(
						'px-3 py-1 shrink-0 transition-colors rounded-xl flex flex-row items-center gap-2',
						index === selectedTestIndex && 'bg-neutral-700'
					)}
					onclick={() => (selectedTestIndex = index)}
				>
					{#if latestRunnedTestsResults}
						<div
							transition:scale
							class={cn(
								'size-2 rounded-full',
								latestRunnedTestsResults.results[index].passed ? 'bg-green-600' : 'bg-red-600'
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
					latestRunnedTestsResults.results[selectedTestIndex].passed
						? 'text-green-600'
						: 'text-red-600'
				)}
			>
				{latestRunnedTestsResults.results[selectedTestIndex].passed ? 'Accepted' : 'Wrong Answer'}
			</h2>
			{#if latestRunnedTestsResults.results[selectedTestIndex]?.error}
				<div transition:scale class="mt-2 p-2 bg-red-600 text-white rounded-xl">
					{latestRunnedTestsResults.results[selectedTestIndex].error}
				</div>
			{/if}
		{/if}
		<div class="mt-4">
			<h6 class="text-base font-medium">Input</h6>
			<div class="font-mono whitespace-pre-wrap p-2 mt-1 rounded-xl w-full bg-neutral-700">
				{exercise.tests[selectedTestIndex].input}
			</div>

			<h6 class="text-base font-medium mt-4">Expected Output</h6>
			<div class="font-mono whitespace-pre-wrap p-2 mt-1 rounded-xl w-full bg-neutral-700">
				{exercise.tests[selectedTestIndex].expected_output}
			</div>

			{#if latestRunnedTestsResults && !latestRunnedTestsResults[selectedTestIndex].passed}
				<h6 class="text-base font-medium mt-4">Actual Output</h6>
				<div class="font-mono whitespace-pre-wrap p-2 mt-1 rounded-xl w-full bg-neutral-700">
					{latestRunnedTestsResults.results[selectedTestIndex].actual_output}
				</div>
			{/if}
		</div>
	</div>
</div>
