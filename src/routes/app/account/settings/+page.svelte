<script>
	import { enhance } from '$app/forms';
	import { newToast } from '$lib/stores';
	import { Undo2 } from 'lucide-svelte';
	import { Spinner, Input } from '$lib/components';

	const { data, form } = $props();
	const { user } = data;

	let isSavingInfos = $state(false);
	let isChangingPassword = $state(false);
	let updatedUser = $state(user);
	let hasChangedInfos = $state(false);

	$effect(() => {
		hasChangedInfos = Object.entries(updatedUser).some(([k, v]) => v !== user[k]);
	});

	$effect(() => {
		if (form?.error) {
			newToast({ type: 'red', title: 'Error', message: form.error, timeout: 2000 });
		} else if (form?.success) {
			newToast({ type: 'green', title: 'Success', message: form.success, timeout: 2000 });
		}
	});
</script>

<!-- SEO -->
<svelte:head>
  <!-- Normal tags -->
  <title>Settings | Skill-Forge</title>
  <meta
    property="description"
    content='Your account settings page on Skill-Forge.'
  />

  <!-- Open Graph tags -->
  <meta property="og:title" content='Settings | Skill-Forge' />
  <meta
    property="og:description"
    content='Your account settings page on Skill-Forge.'
  />

  <!-- Twitter / X tags -->
  <meta property="twitter:title" content='Settings | Skill-Forge' />
  <meta
    property="twitter:description"
    content='Your account settings page on Skill-Forge.'
  />
</svelte:head>

<main class="mx-auto flex w-full max-w-screen-lg flex-col gap-10 md:gap-8">
	<div class="border border-neutral-700/50 bg-neutral-800/50 rounded-xl p-4">
		<div class="flex flex-row gap-4">
			<a href="/app/account" class="rounded-full bg-neutral-900 p-2" arial-label="Go back"
				><Undo2 class="size-5" /></a
			>
			<h1 class="text-3xl font-bold">Settings</h1>
		</div>
	</div>
	<div class="border border-neutral-700/50 bg-neutral-800/50 rounded-xl p-4">
		<form
			method="POST"
			action="?/saveInfos"
			class="flex flex-col gap-2"
			use:enhance={() => {
				isSavingInfos = true;
				return async ({ update }) => {
					await update();
					isSavingInfos = false;
				};
			}}
		>
			<h2 class="text-2xl font-semibold">Personal info</h2>
			<Input
				id="username"
				label="Username"
				bind:value={updatedUser.username}
				placeholder="Username"
				class="h-12"
			/>

			<button
				class="mt-4 flex w-full flex-row items-center justify-center gap-2 rounded-xl bg-neutral-700 hover:bg-neutral-700/50 p-2 text-base font-semibold transition-all disabled:cursor-not-allowed disabled:bg-neutral-700/50"
				disabled={!hasChangedInfos}
			>
				{#if isSavingInfos}
					<Spinner class="size-5" />
				{/if}
				Save
			</button>
		</form>
	</div>
	<div class="border border-neutral-700/50 bg-neutral-800/50 rounded-xl p-4">
		<form
			method="POST"
			action="?/changePassword"
			class="flex flex-col gap-2"
			use:enhance={() => {
				isChangingPassword = true;
				return async ({ update }) => {
					await update();
					isChangingPassword = false;
				};
			}}
		>
			<h2 class="text-2xl font-semibold">Change password</h2>
			<Input
				id="oldPassword"
				label="Current Password"
				placeholder="Current Password"
				type="password"
				class="h-12"
			/>
			<div class="h-2"></div>
			<Input
				id="newPassword"
				label="New Password"
				placeholder="New Password"
				type="password"
				class="h-12"
			/>
			<Input
				id="confirmPassword"
				label="Confirm password"
				placeholder="Confirm password"
				type="password"
				class="h-12"
			/>

			<button
				class="mt-4 flex w-full flex-row items-center justify-center gap-2 rounded-xl bg-neutral-700 hover:bg-neutral-700/50 p-2 text-base font-semibold"
			>
				{#if isChangingPassword}
					<Spinner class="size-5" />
				{/if}
				Change
			</button>
		</form>
	</div>
</main>
