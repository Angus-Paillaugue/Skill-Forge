<script>
	import { User, TestTubeDiagonal, Plus, Pencil, Undo2 } from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';

	const { data } = $props();
	const { noUsers, noExercises, allExercises } = data;

	let editExerciseModalVisible = $state(false);
</script>

<svelte:head>
	<title>Admin dashboard</title>
</svelte:head>

{#if editExerciseModalVisible}
	<div transition:fade class="fixed inset-0 z-40 bg-neutral-900/50 backdrop-blur"></div>
	<div
		transition:fly={{ y: '100%' }}
		class="fixed inset-0 z-40 flex flex-col items-center justify-center p-2"
	>
		<div class="flex w-full max-w-md flex-col gap-4 rounded-xl bg-neutral-800 p-4">
			<h2 class="text-2xl font-semibold">Edit exercise</h2>
			<div class="flex max-h-[500px] flex-col gap-2 overflow-y-auto">
				{#each allExercises as exercise}
					<a
						href="/app/account/admin/editExercise/{exercise.id}"
						class="flex flex-row items-center gap-4 rounded-xl bg-neutral-700 px-4 py-2"
					>
						<p class="text-base font-semibold text-neutral-100">{exercise.title}</p>
					</a>
				{/each}
			</div>
			<button
				type="button"
				class="w-full rounded-xl bg-neutral-900 px-4 py-2 text-base font-medium text-neutral-100 placeholder:text-neutral-400 md:font-semibold"
				onclick={() => (editExerciseModalVisible = false)}
			>
				Cancel
			</button>
		</div>
	</div>
{/if}

<main
	class="mx-auto flex w-full max-w-screen-lg flex-1 flex-col gap-10 p-4 sm:px-6 sm:py-0 md:gap-8"
>
	<div class="border border-neutral-700/50 bg-neutral-800/50 rounded-xl p-4">
		<div class="flex flex-row gap-4">
			<a href="/app/account" class="flex flex-row items-center gap-2 rounded-full bg-neutral-700 hover:bg-neutral-700/50 transition-colors p-2 text-base font-medium" arial-label="Go back"
				><Undo2 class="size-5" /></a
			>
			<h1 class="text-3xl font-bold">Admin dashboard</h1>
		</div>
	</div>
	<div class="grid items-start gap-4 md:gap-8 lg:grid-cols-2">
		<div class="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
			<!-- Hero -->
			<div class="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
				<div
					class="flex flex-col gap-4 border border-neutral-700/50 bg-neutral-800/50 rounded-xl p-6 sm:col-span-2"
				>
					<h1 class="text-3xl font-semibold">Welcome, Angus</h1>
					<div class="flex flex-row flex-wrap gap-4">
						<a
							href="/app/account/admin/addExercise"
							class="flex flex-row items-center gap-2 rounded-xl bg-neutral-700 hover:bg-neutral-700/50 transition-colors px-3 py-1 text-base font-medium"
						>
							<Plus class="size-5" />
							Add exercise
						</a>
						<button
							onclick={() => (editExerciseModalVisible = true)}
							class="flex flex-row items-center gap-2 rounded-xl bg-neutral-700 hover:bg-neutral-700/50 transition-colors px-3 py-1 text-base font-medium"
						>
							<Pencil class="size-5" />
							Edit exercise
						</button>
					</div>
				</div>

				<!-- User count -->
				<div
					class="flex flex-row items-center gap-4 border border-neutral-700/50 bg-neutral-800/50 rounded-xl p-6"
				>
					<User class="size-20" />
					<div class="flex flex-col space-y-1.5">
						<p class="text-sm text-neutral-400">Users</p>

						<h3 class="text-4xl font-semibold tracking-tight">
							{noUsers}
						</h3>
					</div>
				</div>

				<!-- Exercises count -->
				<div
					class="flex flex-row items-center gap-4 border border-neutral-700/50 bg-neutral-800/50 rounded-xl p-6"
				>
					<TestTubeDiagonal class="size-20" />
					<div class="flex flex-col space-y-1.5">
						<p class="text-sm text-neutral-400">Exercises</p>

						<h3 class="text-4xl font-semibold tracking-tight">
							{noExercises}
						</h3>
					</div>
				</div>
			</div>
		</div>
	</div>
</main>
