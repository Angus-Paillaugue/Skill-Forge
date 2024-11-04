<script>
	import { enhance } from '$app/forms';
	import { toast } from '$lib/components/Toast';
	import { Undo2, Upload } from 'lucide-svelte';
	import { Input, Button, Card } from '$lib/components';
	import { fade, fly, scale } from 'svelte/transition';
	import { backIn, quintOut } from 'svelte/easing';

	const { data, form } = $props();
	const { IMAGE_EXTENSIONS } = data;
	let user = $state(data.user);

	let isSavingInfos = $state(false);
	let isChangingPassword = $state(false);
	// svelte-ignore state_referenced_locally
	let updatedUser = $state({ ...user });
	let hasUploadedProfilePicture = $state(false);
	let hasChangedInfos = $state(false);
	let isSavingProfilePicture = $state(false);
	let isDeletingAccount = $state(false);
	let confirmAccountDeletion = $state(false);

	$effect(() => {
		hasChangedInfos = Object.entries(updatedUser).some(([k, v]) => v !== user[k]);
	});

	$effect(() => {
		if (form?.error) {
			toast.error({ title: 'Error', message: form.error, timeout: 2000 });
		} else if (form?.success) {
			toast.success({ title: 'Success', message: form.success, timeout: 2000 });
			if (form.type === 'saveProfilePicture') {
				hasUploadedProfilePicture = false;
				updatedUser.profile_picture = form.profile_picture;
			}
			user = updatedUser;
		}
	});
</script>

<!-- SEO -->
<svelte:head>
	<!-- Normal tags -->
	<title>Settings | Skill-Forge</title>
	<meta name="description" content="Your account settings page on Skill-Forge." />

	<!-- Open Graph tags -->
	<meta property="og:title" content="Settings | Skill-Forge" />
	<meta property="og:description" content="Your account settings page on Skill-Forge." />

	<!-- Twitter / X tags -->
	<meta property="twitter:title" content="Settings | Skill-Forge" />
	<meta property="twitter:description" content="Your account settings page on Skill-Forge." />
</svelte:head>

<main class="mx-auto w-full max-w-screen-lg space-y-4 md:space-y-8">
	<!-- Heading -->
	<Card class="flex flex-row gap-4 space-y-0">
		<Button href="/app/account" variant="backButton" arial-label="Go back"
			><Undo2 class="size-5" /></Button
		>
		<h1 class="text-3xl font-bold">Settings</h1>
	</Card>

	<!-- Personal info/Profile picture -->
	<Card class="space-y-6">
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

			<Button class="mt-4" variant="primary" disabled={!hasChangedInfos} loading={isSavingInfos}>
				Save
			</Button>
		</form>
		<form
			class="flex flex-col gap-2"
			method="POST"
			enctype="multipart/form-data"
			action="?/saveProfilePicture"
			use:enhance={() => {
				isSavingProfilePicture = true;
				return async ({ update }) => {
					await update();
					isSavingProfilePicture = false;
				};
			}}
		>
			<h2 class="text-2xl font-semibold">Profile picture</h2>
			<div class="flex flex-row items-center gap-4">
				<label
					for="uploadProfilePicture"
					class="group relative block size-20 overflow-hidden rounded-xl"
				>
					<!-- svelte-ignore a11y_img_redundant_alt -->
					<img
						src={updatedUser.profile_picture}
						alt="Your profile picture"
						class="size-full object-cover"
					/>
					<div
						class="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900/70 opacity-0 transition-opacity group-hover:opacity-100"
					>
						<Upload class="size-8 text-neutral-100" />
					</div>
				</label>
				<input
					type="file"
					accept={IMAGE_EXTENSIONS.map((e) => 'image/' + e).join(',')}
					id="uploadProfilePicture"
					name="uploadProfilePicture"
					class="hidden"
					onchange={() => (hasUploadedProfilePicture = true)}
				/>
				{#if hasUploadedProfilePicture}
					<div transition:scale={{ start: 0.5, easing: backIn, duration: 400 }}>
						<Button
							variant="secondary"
							class="w-fit"
							disabled={isSavingProfilePicture}
							loading={isSavingProfilePicture}
						>
							Save
						</Button>
					</div>
				{/if}
			</div>
		</form>
	</Card>

	<!-- Password -->
	<Card>
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

			<Button class="mt-4" loading={isChangingPassword} variant="primary">Change</Button>
		</form>
	</Card>

	<!-- Delete account -->
	<Card>
		<h2 class="text-2xl font-semibold">Delete account</h2>
		<Button onclick={() => (confirmAccountDeletion = true)} class="mt-4 w-fit" variant="danger"
			>Delete</Button
		>
	</Card>
</main>

{#if confirmAccountDeletion}
	<div
		transition:fade={{ duration: 300, ease: quintOut }}
		class="fixed inset-0 z-40 flex flex-col items-center justify-center bg-neutral-900/90 p-4"
	></div>
	<form
		transition:fly={{ y: '100%', duration: 300, ease: quintOut }}
		method="POST"
		action="?/deleteAccount"
		class="fixed left-1/2 top-1/2 z-40 flex -translate-x-1/2 -translate-y-1/2 flex-col gap-2"
		use:enhance={() => {
			isDeletingAccount = true;
			return async ({ update }) => {
				await update();
				isDeletingAccount = false;
			};
		}}
	>
		<Card class="space-y-4">
			<h2 class="text-2xl font-semibold">Are you sure?</h2>
			<p class="text-lg">Deleting your account is irreversible. All your data will be lost.</p>
			<div class="grid grid-cols-2 gap-4">
				<Button
					class="mt-4 w-full"
					variant="secondary"
					type="button"
					onclick={() => (confirmAccountDeletion = false)}
				>
					Cancel
				</Button>
				<Button class="mt-4" loading={isDeletingAccount} type="submit" variant="danger"
					>Delete</Button
				>
			</div>
		</Card>
	</form>
{/if}
