<script>
	import { formatDate, cn } from '$lib/utils';
	import { LogOut, Shield, Settings } from 'lucide-svelte';
	import { Tooltip } from '$lib/components';

	const { data } = $props();
	const { user, rank, recentActivity, contributions } = data;

	const activityThresholds = {
		0: 'bg-neutral-900',
		1: 'bg-[#0e4429]',
		3: 'bg-[#006d32]',
		5: 'bg-[#26a641]',
		10: 'bg-[#39d353]'
	};

	/**
	 * Checks if two dates are on the same day.
	 *
	 * @param {Date} d1 - The first date to compare.
	 * @param {Date} d2 - The second date to compare.
	 * @returns {boolean} - Returns true if both dates are on the same day, otherwise false.
	 */
	function sameDay(d1, d2) {
		if (!d1 || !d2) return false;
		return (
			d1.getFullYear() === d2.getFullYear() &&
			d1.getMonth() === d2.getMonth() &&
			d1.getDate() === d2.getDate()
		);
	}
</script>

<svelte:head>
	<title>Account</title>
	<style>
		@keyframes text {
			0%,
			100% {
				background-size: 200% 200%;
				background-position: left center;
			}
			50% {
				background-size: 200% 200%;
				background-position: right center;
			}
		}
	</style>
</svelte:head>

<main
	class="flex flex-col gap-4 md:gap-8 flex-1 items-start p-4 sm:px-6 sm:py-0 max-w-screen-lg w-full mx-auto"
>
	<!-- Hero -->
	<div class="grid gap-4 grid-cols-1 md:grid-cols-3 w-full">
		<div class="bg-neutral-800 text-neutral-100 rounded-lg md:col-span-2">
			<div class="flex flex-row p-6 pb-3 gap-4">
				<img src="/default_avatar.jpg" class="rounded-xl size-20 object-cover" alt="Avatar" />
				<div class="flex flex-col space-y-1.5">
					<h3 class="text-lg font-semibold leading-none tracking-tight">{user.username}</h3>

					<p class="text-neutral-400 max-w-lg text-balance ltexteading-relaxed">
						Rank
						{#if rank.user_rank === 1}
							<span
								class="bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500 bg-clip-text text-xl text-transparent font-black inline-block"
								style="animation: text 5s ease infinite;">{rank.user_rank}</span
							>
						{:else}
							<span class="font-black inline-block text-xl text-neutral-100">{rank.user_rank}</span>
						{/if}
					</p>
				</div>
			</div>

			<div class="flex items-center p-6 pt-0 flex-row gap-4">
				<a
					href="/app/account/log-out"
					class="px-3 py-1 rounded-xl bg-neutral-700 text-base font-medium flex flex-row gap-2 items-center"
				>
					<LogOut class="size-4" />
					Log out
				</a>
				<a
					href="/app/account/settings"
					class="px-3 py-1 rounded-xl bg-neutral-700 text-base font-medium flex flex-row gap-2 items-center"
				>
					<Settings class="size-4" />
					Settings
				</a>
				{#if user.admin}
					<a
						href="/app/account/admin"
						class="px-3 py-1 rounded-xl bg-neutral-700 text-base font-medium flex flex-row gap-2 items-center"
					>
						<Shield class="size-4" />
						Admin dashboard
					</a>
				{/if}
			</div>
		</div>

		<div class="bg-neutral-800 text-neutral-100 rounded-lg">
			<div class="flex flex-col space-y-1.5 p-6 pb-2">
				<p class="text-lg font-semibold leading-none tracking-tight">Solved problems</p>

				<h3 class="font-semibold tracking-tight text-4xl">
					{rank.distinct_exercise_count}<span class="text-neutral-400 text-xl ml-1"
						>/{rank.no_exercises}</span
					>
				</h3>
			</div>

			{#if rank.distinct_exercise_count === rank.no_exercises}
				<div class="p-6 pt-0">
					<div class="text-neutral-400 text-sm">
						Wow, you solved all of the problems on the site ! Congratulation, you have no life.
					</div>
				</div>
			{/if}
		</div>
	</div>

	<!-- Contribution grid -->
	<div class="bg-neutral-800 rounded-xl flex flex-col p-6 gap-4 w-full">
		<h3 class="text-lg font-semibold leading-none tracking-tight">Contributions</h3>
		<div class="w-full overflow-x-auto h-full">
			<div class="flex flex-row flex-nowrap gap-1 w-full">
				{#each { length: 53 } as _, weekNo}
					<div class="flex shrink-0 flex-col gap-1">
						{#each { length: 7 } as _, dayNo}
							{@const today = new Date()}
							{@const thisDay = new Date(
								new Date().setDate(today.getDate() - 366 + weekNo * 7 + dayNo)
							)}
							{#if thisDay <= today}
								{@const formattedDate = formatDate(thisDay)}
								{@const contrib = contributions.find((s) =>
									sameDay(new Date(s.submission_date), thisDay)
								)}
								{@const bg =
									Object.keys(activityThresholds)
										.map(Number)
										.filter((key) => key <= contrib?.submission_count ?? 0)
										.sort((a, b) => b - a)[0] || Object.keys(activityThresholds)[0]}
								<Tooltip
									class="size-[0.85rem] shrink-0"
									content="{contrib?.submission_count ??
										'No'} contribution{contrib?.submission_count > 1
										? 's'
										: ''} the {formattedDate}"
								>
									<button
										aria-label="Activity for {formattedDate}"
										class={cn('size-full aspect-square block rounded', activityThresholds[bg])}
									></button>
								</Tooltip>
							{/if}
						{/each}
					</div>
				{/each}
			</div>
		</div>
		<div class="flex flex-row gap-1 items-center text-xs text-neutral-400 font-base">
			Less
			{#each Object.keys(activityThresholds) as key}
				<div class={cn('size-[0.85rem] rounded', activityThresholds[key])}></div>
			{/each}
			More
		</div>
	</div>

	<!-- Recent activity -->
	<div class="bg-neutral-800 rounded-xl w-full">
		<div class="flex flex-col space-y-1.5 p-6 px-7">
			<h3 class="text-lg font-semibold leading-none tracking-tight">Activity</h3>

			<p class="text-neutral-400 text-sm">Recent activity.</p>
		</div>

		<div class="p-6 pt-0">
			<div class="relative w-full overflow-auto max-h-[300px]">
				{#if recentActivity.length === 0}
					<div class="grow bg-neutral-700 p-4 rounded-lg">
						<h2 class="text-base font-medium">You have no recent activity!</h2>
					</div>
				{:else}
					<table class="w-full caption-bottom text-sm">
						<thead class="border-b border-neutral-700 sticky top-0 bg-neutral-800"
							><tr
								><th class="text-neutral-400 h-12 px-4 text-left align-middle font-medium">Name</th>
								<th class="text-neutral-400 h-12 px-4 align-middle font-medium text-right">Date</th
								></tr
							></thead
						>
						<tbody class="[&amp;_tr:last-child]:border-0">
							{#each recentActivity as activity}
								<tr class="odd:bg-neutral-700/20 border-b border-neutral-700 transition-colors"
									><td class="p-4 align-middle">
										<a href="/app/exercises/{activity.exercise_id}">
											<div class="font-medium">{activity.title}</div>
											<div class="text-neutral-400 hidden text-sm md:inline">
												{activity.exercise_difficulty}
											</div>
										</a>
									</td>
									<td class="p-4 align-middle text-right">{formatDate(activity.completed_at)}</td
									></tr
								>
							{/each}
						</tbody>
					</table>
				{/if}
			</div>
		</div>
	</div>
</main>
