<script>
	import { formatDate } from '$lib/utils';
	import { Button } from '$lib/components';

	const { data } = $props();
	const { user, rank, recentActivity } = data;
</script>

<div class="grow flex flex-row gap-8 max-w-screen-lg mx-auto w-full">
	<!-- Left column -->
	<div class="flex flex-col p-4 rounded-xl bg-neutral-900">
		<!-- Profile -->
		<div class="flex flex-row gap-4">
			<img src="/default_avatar.jpg" class="rounded-lg object-cover size-24" alt="" />
			<div class="flex flex-col gap-2 justify-between">
				<h2 class="font-semibold text-xl">{user.username}</h2>
				<h3 class="text-xl">
					<span class="font-medium text-neutral-400">Rank</span>
					<span class="font-medium">{rank.user_rank}</span>
				</h3>
			</div>
		</div>
		<Button href="/app/account/log-out" class="mt-4 w-full text-base">Log-out</Button>
		{#if user.admin}
			<Button href="/app/account/admin" class="mt-4 w-full text-base">Admin</Button>
		{/if}
	</div>

	<!-- Recent activity -->
	<div class="flex flex-col grow p-4 rounded-xl bg-neutral-900">
		{#each recentActivity as activity}
			<a
				href="/app/exercises/{activity.exercise_id}"
				class="flex flex-row items-center justify-between p-4 odd:bg-neutral-700 rounded-xl"
			>
				<h3 class="font-semibold text-lg">{activity.title}</h3>
				<p class="text-neutral-400">{formatDate(activity.completed_at)}</p>
			</a>
		{/each}
	</div>
</div>
