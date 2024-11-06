<script>
	import { enhance } from '$app/forms';
	import { toast } from '$lib/components/Toast';
	import { Undo2, Upload, ArrowDownUp } from 'lucide-svelte';
	import { Input, Button, Card, Dropdown, SEO } from '$lib/components';
	import { fade, fly, scale } from 'svelte/transition';
	import { backIn, quintOut } from 'svelte/easing';
	import * as m from '$msgs';
	import { availableLanguageTags, languageTag } from '$lib/paraglide/runtime';
	import { page } from '$app/stores';
	import { i18n } from '$lib/i18n.js';

	const { data, form } = $props();
	const { IMAGE_EXTENSIONS } = data;

	let user = $state(data.user);
	let currentPathWithoutLanguage = $derived(i18n.route($page.url.pathname));
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
			toast.error({ message: form.error, timeout: 2000 });
		} else if (form?.success) {
			toast.success({
				message: form.success,
				timeout: 3000,
				action: {
					text: 'Refresh',
					callback: () => {
						location.reload();
					}
				}
			});
			if (form.type === 'saveProfilePicture') {
				hasUploadedProfilePicture = false;
				updatedUser.profile_picture = form.profile_picture;
			}
			user = updatedUser;
		}
	});
</script>

<SEO title={m.app_account_settings_title()} description={m.app_account_settings_description()} />

<main class="mx-auto w-full max-w-screen-lg space-y-4 md:space-y-8">
	<!-- Heading -->
	<Card class="flex flex-row gap-4 space-y-0">
		<Button href="/app/account" variant="backButton" arial-label="Go back"
			><Undo2 class="size-5" /></Button
		>
		<h1 class="text-3xl font-bold">{m.app_account_settings_title()}</h1>
	</Card>

	<!-- Personal info/Profile picture -->
	<Card class="space-y-6">
		<h2 class="text-2xl font-semibold">{m.app_account_settings_language_title()}</h2>
		<Dropdown align="start">
			<Dropdown.Trigger>
				<ArrowDownUp class="size-5" />
				{m.app_account_settings_language_button()}
			</Dropdown.Trigger>
			{#snippet items()}
				{#each availableLanguageTags.filter((e) => e !== languageTag()) as lang}
					<Dropdown.Item href={currentPathWithoutLanguage} hreflang={lang}>
						{lang}
					</Dropdown.Item>
				{/each}
			{/snippet}
		</Dropdown>
		<hr />
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
			<h2 class="text-2xl font-semibold">{m.app_account_settings_personal_info_title()}</h2>
			<Input
				id="username"
				label={m.app_account_settings_personal_info_inputs_username()}
				bind:value={updatedUser.username}
				placeholder={m.app_account_settings_personal_info_inputs_username()}
				class="h-12"
			/>

			<Button class="mt-4" variant="primary" disabled={!hasChangedInfos} loading={isSavingInfos}>
				{m.app_account_settings_personal_info_inputs_save()}
			</Button>
		</form>
		<hr />
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
			<h2 class="text-2xl font-semibold">{m.app_account_settings_profile_picture_title()}</h2>
			<div class="flex flex-row items-center gap-4">
				<label
					for="uploadProfilePicture"
					class="group relative block size-20 overflow-hidden rounded-xl"
				>
					<!-- svelte-ignore a11y_img_redundant_alt -->
					<img
						src={updatedUser.profile_picture}
						alt={m.app_account_settings_profile_picture_title_img_alt()}
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
							{m.app_account_settings_profile_picture_inputs_save()}
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
			<h2 class="text-2xl font-semibold">{m.app_account_settings_change_password_title()}</h2>
			<Input
				id="oldPassword"
				label={m.app_account_settings_change_password_inputs_current_password()}
				placeholder={m.app_account_settings_change_password_inputs_current_password()}
				type="password"
				class="h-12"
			/>
			<div class="h-2"></div>
			<Input
				id="newPassword"
				label={m.app_account_settings_change_password_inputs_new_password()}
				placeholder={m.app_account_settings_change_password_inputs_new_password()}
				type="password"
				class="h-12"
			/>
			<Input
				id="confirmPassword"
				label={m.app_account_settings_change_password_inputs_confirm_password()}
				placeholder={m.app_account_settings_change_password_inputs_confirm_password()}
				type="password"
				class="h-12"
			/>

			<Button class="mt-4" loading={isChangingPassword} variant="primary"
				>{m.app_account_settings_change_password_inputs_change_button()}</Button
			>
		</form>
	</Card>

	<!-- Delete account -->
	<Card>
		<h2 class="text-2xl font-semibold">{m.app_account_settings_delete_account_title()}</h2>
		<Button onclick={() => (confirmAccountDeletion = true)} class="mt-4 w-fit" variant="danger"
			>{m.app_account_settings_delete_account_button()}</Button
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
			<h2 class="text-2xl font-semibold">
				{m.app_account_settings_delete_account_confirm_modal_title()}
			</h2>
			<p class="text-lg">{m.app_account_settings_delete_account_confirm_modal_description()}</p>
			<div class="grid grid-cols-2 gap-4">
				<Button
					class="mt-4 w-full"
					variant="secondary"
					type="button"
					onclick={() => (confirmAccountDeletion = false)}
				>
					{m.app_account_settings_delete_account_confirm_modal_cancel()}
				</Button>
				<Button class="mt-4" loading={isDeletingAccount} type="submit" variant="danger"
					>{m.app_account_settings_delete_account_confirm_modal_delete()}</Button
				>
			</div>
		</Card>
	</form>
{/if}
