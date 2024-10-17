<script>
	import { cn } from '$lib/utils';
	import { scale } from 'svelte/transition';

	let { exercise, latestRunnedTestsResults = $bindable() } = $props();

	let selectedTestIndex = $state(0);
</script>

<!-- Tests cases -->
<div class="flex flex-col rounded-xl overflow-hidden max-lg:grow shrink-0 mt-2">
	<div class="flex flex-row flex-nowrap overflow-x-auto h-10 shrink-0 bg-neutral-700 p-1">
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
				><path d="M21 7 6.82 21.18a2.83 2.83 0 0 1-3.99-.01a2.83 2.83 0 0 1 0-4L17 3" /><path
					d="m16 2 6 6"
				/><path d="M12 16H4" /></svg
			>
			Testcase
		</div>
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
			<div class="font-mono whitespace-pre-wrap p-2 mt-1 rounded-xl w-full bg-neutral-700">
				{exercise.tests[selectedTestIndex].input}
			</div>

			<h6 class="text-base font-medium mt-4">Expected Output</h6>
			<div class="font-mono whitespace-pre-wrap p-2 mt-1 rounded-xl w-full bg-neutral-700">
				{exercise.tests[selectedTestIndex].expected_output}
			</div>
		</div>
	</div>
</div>
