<script>
	import { enhance } from '$app/forms';
	import { Button, Spinner } from '$lib/components';

	const { form } = $props();
	let isSendingForm = $state(false);
</script>

<svelte:head>
	<title>Sign-in</title>
</svelte:head>

<div class="relative flex h-screen w-full flex-col items-center justify-center gap-10 p-4">
	<form
		class="flex w-full max-w-md flex-col gap-6 rounded-2xl p-6 bg-neutral-900"
		method="POST"
		use:enhance={() => {
			isSendingForm = true;
			return async ({ update }) => {
				await update();
				isSendingForm = false;
			};
		}}
	>
		<h1 class="text-3xl font-bold text-inherit">Sign-in</h1>
		<input
			type="text"
			class="h-12 text-base font-medium md:font-semibold w-full rounded-xl bg-neutral-800 px-4 py-2 text-text-heading-dark outline-0 placeholder:text-text-body focus:outline-0"
			name="username"
			placeholder="Username"
		/>
		<input
			type="password"
			class="h-12 text-base font-medium md:font-semibold w-full rounded-xl bg-neutral-800 px-4 py-2 text-text-heading-dark outline-0 placeholder:text-text-body focus:outline-0"
			name="password"
			placeholder="Password"
		/>

		{#if form?.error}
			<div class="rounded-full bg-red-600 px-6 py-2 text-base font-semibold text-text-heading-dark">
				{form?.error}
			</div>
		{/if}

		<Button disabled={isSendingForm} type="submit" class="w-full">
			{#if isSendingForm}
				<Spinner />
			{/if}
			Sign-in
		</Button>
	</form>

	<div
		class="flex w-full max-w-md flex-row items-center justify-center gap-2 rounded-2xl py-4 text-sm bg-neutral-900"
	>
		<p class="text-base font-normal">Already an account ?</p>
		<Button variant="link" href="/log-in" class="font-semibold text-neutral-400">Log in</Button>
	</div>
</div>
