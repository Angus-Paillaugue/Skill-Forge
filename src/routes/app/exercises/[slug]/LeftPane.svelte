<script>
	import { Difficulty } from '$lib/components';
	import { cn, formatDate, formatBytes } from '$lib/utils';
	import { FlaskConical, BookOpen, CircleCheckBig } from 'lucide-svelte';

	let {
		exercise,
		value = $bindable(),
		editor = $bindable(),
		submissions = $bindable(),
		leftPaneActiveIndex = $bindable()
	} = $props();
</script>

<div class="flex grow flex-col justify-center overflow-hidden rounded-xl bg-neutral-800">
	<!-- Tab selection buttons -->
	<div class="flex h-10 shrink-0 flex-row flex-nowrap overflow-x-auto bg-neutral-700 p-1">
		<button
			class={cn(
				'flex shrink-0 flex-row  items-center gap-2 rounded-lg px-3 py-1 transition-all',
				leftPaneActiveIndex != 0 && 'text-neutral-400 hover:bg-neutral-900/50'
			)}
			onclick={() => (leftPaneActiveIndex = 0)}
		>
			<BookOpen class="size-5" />

			Description
		</button>
		<button
			class={cn(
				'flex shrink-0 flex-row items-center gap-2 rounded-lg px-3 py-1 transition-all',
				leftPaneActiveIndex != 1 && 'text-neutral-400 hover:bg-neutral-900/50'
			)}
			onclick={() => (leftPaneActiveIndex = 1)}
		>
			<FlaskConical class="size-5" />
			Solutions
		</button>
	</div>
	<!-- Exercise infos (title, description) -->
	<div class={cn('grow overflow-y-auto', leftPaneActiveIndex === 0 && 'p-4')}>
		<!-- Exercise description -->
		{#if leftPaneActiveIndex === 0}
			<div class="flex flex-row items-center justify-between">
				{#if exercise?.submissions?.length > 0}
					<div class="flex flex-row items-center gap-2">
						Solved
						<CircleCheckBig class="size-5 text-green-600" />
					</div>
				{/if}
			</div>
			<Difficulty class="mt-6" difficulty={exercise.difficulty} />
			<h1 class="text-3xl font-medium leading-[3.5rem] md:font-semibold md:leading-[4rem]">
				{exercise.title}
			</h1>
			<div id="pageContainer">
				{@html exercise.description}
			</div>
		{:else if leftPaneActiveIndex === 1}
			<!-- User submitted solutions -->
			<div class="relative w-full overflow-x-auto">
				{#if submissions.length === 0}
					<div class="mx-4 mt-10 grow rounded-lg bg-neutral-700 p-4">
						<h2 class="text-base font-medium">You have no submissions!</h2>
					</div>
				{:else}
					<table class="w-full table-auto text-left text-sm text-neutral-400 rtl:text-right">
						<thead class="text-xs uppercase text-neutral-400">
							<tr>
								<th scope="col" class="px-6 py-3"> Code </th>
								<th scope="col" class="px-6 py-3"> Date </th>
								<th scope="col" class="px-6 py-3"> RAM usage </th>
							</tr>
						</thead>
						<tbody>
							{#key submissions}
								{#each submissions as submission}
									<tr
										class="border-b border-neutral-700 odd:bg-neutral-700/50 even:bg-neutral-800"
										onclick={() => {
											value = submission.submission;
											editor.loadCode(value);
										}}
									>
										<td class="px-6 py-4">
											<p class="line-clamp-3 whitespace-pre-wrap font-mono text-sm">
												{submission.submission}
											</p>
										</td>
										<td class="px-6 py-4">
											{formatDate(submission.completed_at)}
										</td>
										<td class="px-6 py-4">
											{formatBytes(submission.ram_usage)}
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
