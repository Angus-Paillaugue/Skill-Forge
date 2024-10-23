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
	<div transition:fade class="fixed z-40 inset-0 bg-neutral-900/50 backdrop-blur-md"></div>
	<div
		transition:fly={{ y: '100%' }}
		class="fixed z-40 inset-0 flex flex-col items-center justify-center p-2"
	>
		<div class="p-4 rounded-xl bg-neutral-800 max-w-md w-full flex flex-col gap-4">
			<h2 class="text-2xl font-semibold">Edit exercise</h2>
			<div class="max-h-[500px] flex flex-col gap-2 overflow-y-auto">
				{#each allExercises as exercise}
					<a
						href="/app/account/admin/editExercise/{exercise.id}"
						class="bg-neutral-700 px-4 py-2 rounded-xl flex flex-row gap-4 items-center"
					>
						<p class="text-base font-semibold text-neutral-100">{exercise.title}</p>
					</a>
				{/each}
			</div>
			<button
				type="button"
				class="text-base font-medium md:font-semibold w-full rounded-xl bg-neutral-900 px-4 py-2 text-neutral-100 placeholder:text-neutral-400"
				onclick={() => (editExerciseModalVisible = false)}
			>
				Cancel
			</button>
		</div>
	</div>
{/if}

<main
	class="flex-1 flex flex-col gap-10 p-4 sm:px-6 sm:py-0 md:gap-8 max-w-screen-lg w-full mx-auto"
>
	<div class="bg-neutral-800 text-neutral-100 rounded-lg p-4">
		<div class="flex flex-row gap-4">
			<a href="/app/account" class="bg-neutral-900 rounded-full p-2" arial-label="Go back"
				><Undo2 class="size-5" /></a
			>
			<h1 class="text-3xl font-bold">Admin dashboard</h1>
		</div>
	</div>
	<div
		class="grid items-start gap-4 md:gap-8 lg:grid-cols-2"
	>
		<div class="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
			<!-- Hero -->
			<div class="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
				<div class="bg-neutral-800 flex flex-col gap-4 text-neutral-100 rounded-lg p-6 sm:col-span-2">
					<h1 class="text-3xl font-semibold">Welcome, Angus</h1>
					<div class="flex flex-row gap-4 flex-wrap">
						<a
							href="/app/account/admin/addExercise"
							class="px-3 py-1 rounded-xl bg-neutral-700 text-base font-medium flex flex-row gap-2 items-center"
						>
							<Plus class="size-5" />
							Add exercise
						</a>
						<button
							onclick={() => (editExerciseModalVisible = true)}
							class="px-3 py-1 rounded-xl bg-neutral-700 text-base font-medium flex flex-row gap-2 items-center"
						>
							<Pencil class="size-5" />
							Edit exercise
						</button>
					</div>
				</div>

				<!-- User count -->
				<div class="bg-neutral-800 flex flex-row gap-4 p-6 items-center text-neutral-100 rounded-lg">
					<User class="size-20" />
					<div class="flex flex-col space-y-1.5">
						<p class="text-sm text-neutral-400">Users</p>

						<h3 class="font-semibold tracking-tight text-4xl">
							{noUsers}
						</h3>
					</div>
				</div>

				<!-- Exercises count -->
				<div class="bg-neutral-800 flex flex-row gap-4 p-6 items-center text-neutral-100 rounded-lg">
					<TestTubeDiagonal class="size-20" />
					<div class="flex flex-col space-y-1.5">
						<p class="text-sm text-neutral-400">Exercises</p>

						<h3 class="font-semibold tracking-tight text-4xl">
							{noExercises}
						</h3>
					</div>
				</div>
			</div>
		</div>
	</div>
</main>
