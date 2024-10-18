<script>
	import { enhance } from '$app/forms';
	import { Button, Spinner, Input } from '$lib/components';
	import { newToast } from '$lib/stores';

	const { form } = $props();
	let isSendingForm = $state(false);

	$effect(() => {
		if (form?.error) newToast({ type: 'red', title: 'Error', message: form.error });
	});
</script>

<svelte:head>
	<title>Log-in</title>
</svelte:head>

<div class="relative flex h-screen w-full flex-col items-center justify-center gap-10 p-4">
	<form
		class="flex w-full max-w-md flex-col gap-6 rounded-2xl p-6 bg-neutral-800"
		method="POST"
		use:enhance={() => {
			isSendingForm = true;
			return async ({ update }) => {
				await update();
				isSendingForm = false;
			};
		}}
	>
		<h1 class="text-3xl font-bold text-inherit">Log-in</h1>
		<Input id="username" placeholder="Username" />
		<Input id="password" type="password" placeholder="Password" />

		<Button disabled={isSendingForm} type="submit" class="w-full">
			{#if isSendingForm}
				<Spinner />
			{/if}
			Log-in
		</Button>
	</form>

	<div
		class="flex w-full max-w-md flex-row items-center justify-center gap-2 rounded-2xl py-4 text-sm bg-neutral-800"
	>
		<p class="text-base font-normal">No account yet ?</p>
		<Button variant="link" href="/sign-in" class="font-semibold text-neutral-400">Create one</Button
		>
	</div>
</div>
