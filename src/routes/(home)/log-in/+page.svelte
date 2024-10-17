<script>
	import { enhance } from '$app/forms';
	import { Button, Spinner } from '$lib/components';

	const { form } = $props();
	let isSendingForm = $state(false);
</script>

<svelte:head>
	<title>Log-in</title>
</svelte:head>

<div class="relative flex h-screen w-full flex-col items-center justify-center gap-10 p-4">
	<form
		class="flex w-full max-w-md flex-col gap-6 rounded-2xl p-6 text-text-heading"
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
		<input
			type="text"
			class="h-12 w-full rounded-full bg-neutral-800 px-6 py-3 text-base font-medium text-text-heading-dark outline-0 placeholder:text-text-body focus:outline-0"
			name="username"
			placeholder="Username"
		/>
		<input
			type="password"
			class="h-12 w-full rounded-full bg-neutral-800 px-6 py-3 text-base font-medium text-text-heading-dark outline-0 placeholder:text-text-body focus:outline-0"
			name="password"
			placeholder="Password"
		/>

		{#if form?.error}
			<div class="rounded-full bg-red-600 px-6 py-2 text-base font-semibold text-text-heading-dark">
				{form?.error}
			</div>
		{/if}

		<Button disabled={isSendingForm} type="submit">
			{#if isSendingForm}
				<Spinner />
			{/if}
			Log-in
		</Button>
	</form>

	<div
		class="flex w-full max-w-md flex-row items-center justify-center gap-2 rounded-2xl py-4 text-sm"
	>
		<p class="text-text-body">No account yet ?</p>
		<Button variant="link" href="/sign-in" class="font-semibold text-text-heading"
			>Create one</Button
		>
	</div>
</div>
