<script>
	import { formatDate, cn, urlHealer } from '$lib/utils';
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

<!-- SEO -->
<svelte:head>
  <!-- Normal tags -->
  <title>Account | Skill-Forge</title>
  <meta
    property="description"
    content='Your account page on Skill-Forge.'
  />

  <!-- Open Graph tags -->
  <meta property="og:title" content='Account | Skill-Forge' />
  <meta
    property="og:description"
    content='Your account page on Skill-Forge.'
  />

  <!-- Twitter / X tags -->
  <meta property="twitter:title" content='Account | Skill-Forge' />
  <meta
    property="twitter:description"
    content='Your account page on Skill-Forge.'
  />

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
	class="mx-auto flex w-full max-w-screen-lg flex-1 flex-col items-start gap-4 md:gap-8"
>
	<!-- Hero -->
	<div class="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
		<div class="border border-neutral-700/50 bg-neutral-800/50 rounded-xl text-neutral-100 md:col-span-2">
			<div class="flex flex-row gap-4 p-6 pb-3">
				<img src="/default_avatar.jpg" class="size-20 rounded-xl object-cover" alt="Avatar" />
				<div class="flex flex-col space-y-1.5">
					<h3 class="text-lg font-semibold leading-none tracking-tight">{user.username}</h3>

					<p class="ltexteading-relaxed max-w-lg text-balance text-neutral-400">
						Rank
						{#if rank.user_rank === 1}
							<span
								class="inline-block bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500 bg-clip-text text-xl font-black text-transparent"
								style="animation: text 5s ease infinite;">{rank.user_rank}</span
							>
						{:else}
							<span class="inline-block text-xl font-black text-neutral-100">{rank.user_rank}</span>
						{/if}
					</p>
				</div>
			</div>

			<div class="flex flex-row flex-wrap items-center gap-4 p-6 pt-0">
				<a
					href="/app/account/log-out"
					class="flex flex-row items-center gap-2 rounded-xl bg-neutral-700 hover:bg-neutral-700/50 transition-colors px-3 py-1 text-base font-medium"
				>
					<LogOut class="size-4" />
					Log out
				</a>
				<a
					href="/app/account/settings"
					class="flex flex-row items-center gap-2 rounded-xl bg-neutral-700 hover:bg-neutral-700/50 transition-colors px-3 py-1 text-base font-medium"
				>
					<Settings class="size-4" />
					Settings
				</a>
				{#if user.admin}
					<a
						href="/app/account/admin"
						class="flex flex-row items-center gap-2 rounded-xl bg-neutral-700 hover:bg-neutral-700/50 transition-colors px-3 py-1 text-base font-medium"
					>
						<Shield class="size-4" />
						Admin dashboard
					</a>
				{/if}
			</div>
		</div>

		<div class="border border-neutral-700/50 bg-neutral-800/50 rounded-xl text-neutral-100">
			<div class="flex flex-col space-y-1.5 p-6 pb-2">
				<p class="text-lg font-semibold leading-none tracking-tight">Solved problems</p>

				<h3 class="text-4xl font-semibold tracking-tight">
					{rank.distinct_exercise_count}<span class="ml-1 text-xl text-neutral-400"
						>/{rank.no_exercises}</span
					>
				</h3>
			</div>

			{#if rank.distinct_exercise_count === rank.no_exercises}
				<div class="p-6 pt-0">
					<div class="text-sm text-neutral-400">
						Wow, you solved all of the problems on the site ! Congratulation, you have no life.
					</div>
				</div>
			{/if}
		</div>
	</div>

	<!-- Contribution grid -->
	<div class="flex w-full flex-col gap-4 border border-neutral-700/50 bg-neutral-800/50 rounded-xl p-6">
		<h3 class="text-lg font-semibold leading-none tracking-tight">Contributions</h3>
		<div class="h-full w-full overflow-x-auto">
			<div class="flex w-full flex-row flex-nowrap gap-1">
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
										.filter((key) => key <= contrib?.submission_count || 0)
										.sort((a, b) => b - a)[0] || Object.keys(activityThresholds)[0]}
								<Tooltip
									class="size-[0.85rem] shrink-0"
									delay={0}
									content="{contrib?.submission_count ??
										'No'} contribution{contrib?.submission_count > 1
										? 's'
										: ''} the {formattedDate}"
								>
									<button
										aria-label="Activity for {formattedDate}"
										class={cn('block aspect-square size-full rounded', activityThresholds[bg])}
									></button>
								</Tooltip>
							{/if}
						{/each}
					</div>
				{/each}
			</div>
		</div>
		<div class="font-base flex flex-row items-center gap-1 text-xs text-neutral-400">
			Less
			{#each Object.keys(activityThresholds) as key}
				<div class={cn('size-[0.85rem] rounded', activityThresholds[key])}></div>
			{/each}
			More
		</div>
	</div>

	<!-- Recent activity -->
	<div class="w-full border border-neutral-700/50 bg-neutral-800/50 rounded-xl">
		<div class="flex flex-col space-y-1.5 p-6 px-7">
			<h3 class="text-lg font-semibold leading-none tracking-tight">Activity</h3>

			<p class="text-sm text-neutral-400">Recent activity.</p>
		</div>

		<div class="p-6 pt-0">
			<div class="relative max-h-[300px] w-full rounded-xl overflow-auto">
				{#if recentActivity.length === 0}
					<div class="grow rounded-lg bg-neutral-700 p-4">
						<h2 class="text-base font-medium">You have no recent activity!</h2>
					</div>
				{:else}
					<table class="w-full table-auto text-sm">
						<thead class="sticky top-0 border-b border-neutral-700 bg-neutral-800"
							><tr
								><th class="h-12 px-4 text-left align-middle font-medium text-neutral-400">Name</th>
								<th class="h-12 px-4 text-right align-middle font-medium text-neutral-400">Date</th
								></tr
							></thead
						>
						<tbody class="[&amp;_tr:last-child]:border-0">
							{#each recentActivity as activity}
								<tr class="border-b border-neutral-700 transition-colors odd:bg-neutral-800"
									><td class="p-4 align-middle">
										<a
											href="/app/exercises/{urlHealer.identifier.join(
												activity.slug,
												activity.exercise_id
											)}"
										>
											<div class="font-medium">{activity.title}</div>
											<div class="hidden text-sm text-neutral-400 md:inline">
												{activity.exercise_difficulty}
											</div>
										</a>
									</td>
									<td class="p-4 text-right align-middle">{formatDate(activity.completed_at)}</td
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
