<script>
	import { Difficulty } from '$lib/components';
	import { cn, formatDate } from '$lib/utils';

	let { exercise, value = $bindable(), editor = $bindable(), submissions = $bindable() } = $props();

	let leftPaneActiveIndex = $state(0);
</script>

<div class="flex flex-col grow justify-center bg-neutral-800 rounded-xl overflow-hidden">
	<!-- Tab selection buttons -->
	<div class="flex flex-row flex-nowrap overflow-x-auto h-10 shrink-0 bg-neutral-700 p-1">
		<button
			class={cn(
				'px-3 py-1 shrink-0  rounded-lg flex flex-row transition-all items-center gap-2',
				leftPaneActiveIndex != 0 && 'text-neutral-400 hover:bg-neutral-900/50'
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
				'px-3 py-1 shrink-0 rounded-lg flex flex-row transition-all items-center gap-2',
				leftPaneActiveIndex != 1 && 'text-neutral-400 hover:bg-neutral-900/50'
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
	<div class={cn('grow overflow-y-auto', leftPaneActiveIndex === 0 && 'p-4')}>
		<!-- Exercise description -->
		{#if leftPaneActiveIndex === 0}
			<div class="flex flex-row items-center justify-between">
				<div class="block px-2 py-2 rounded-lg bg-neutral-700 text-base font-semibold w-fit">
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
			<div class="relative overflow-x-auto w-full">
				{#if submissions.length === 0}
					<div class="w-full bg-neutral-700 p-4 rounded-lg">
						<h2 class="text-base font-medium">You have no submissions!</h2>
					</div>
				{:else}
					<table class="w-full text-sm text-left rtl:text-right text-neutral-400 table-auto">
						<thead class="text-xs uppercase text-neutral-400">
							<tr>
								<th scope="col" class="px-6 py-3"> Code </th>
								<th scope="col" class="px-6 py-3"> Date </th>
							</tr>
						</thead>
						<tbody>
							{#key submissions}
								{#each submissions as submission}
									<tr
										class="odd:bg-neutral-700/50 even:bg-neutral-800 border-b border-neutral-700"
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
