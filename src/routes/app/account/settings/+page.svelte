<script>
	import { enhance } from '$app/forms';
	import { newToast } from '$lib/stores';
	import { Undo2 } from 'lucide-svelte';
	import { Spinner, Input } from '$lib/components';

	const { data, form } = $props();
	const { user } = data;

	let isSavingInfos = $state(false);
	let isChangingPassword = $state(false);

	$effect(() => {
		if (form?.error) {
			newToast({ type: 'red', title: 'Error', message: form.error, timeout: 2000 });
		} else if (form?.success) {
			newToast({ type: 'green', title: 'Success', message: form.success, timeout: 2000 });
		}
	});
</script>

<main
	class="flex-1 flex flex-col gap-10 p-4 sm:px-6 sm:py-0 md:gap-8 max-w-screen-lg w-full mx-auto"
>
	<div class="bg-neutral-800 text-neutral-100 rounded-lg p-4">
		<div class="flex flex-row gap-4">
			<a href="/app/account" class="bg-neutral-900 rounded-full p-2" arial-label="Go back"
				><Undo2 class="size-5" /></a
			>
			<h1 class="text-3xl font-bold">Settings</h1>
		</div>
	</div>
	<div class="bg-neutral-800 text-neutral-100 rounded-lg p-4">
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
				value={user.username}
				placeholder="Username"
				class="h-12"
			/>

			<button
				class="bg-neutral-700 p-2 w-full mt-4 rounded-xl text-base font-semibold flex items-center justify-center flex-row gap-2"
			>
				{#if isSavingInfos}
					<Spinner class="size-5" />
				{/if}
				Save
			</button>
		</form>
	</div>
	<div class="bg-neutral-800 text-neutral-100 rounded-lg p-4">
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
				class="bg-neutral-700 p-2 w-full mt-4 rounded-xl text-base font-semibold flex items-center justify-center flex-row gap-2"
			>
				{#if isChangingPassword}
					<Spinner class="size-5" />
				{/if}
				Change
			</button>
		</form>
	</div>
</main>
