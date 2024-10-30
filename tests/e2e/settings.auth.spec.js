import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	await page.goto('/app/account/settings');
});

test('should display the settings page title', async ({ page }) => {
	await expect(page).toHaveTitle(/Settings | Skill-Forge/);
});

test('should display the settings header', async ({ page }) => {
	const header = page.locator('h1');
	await expect(header).toBeVisible();
	await expect(header).toHaveText('Settings');
});

test('should display the personal info section', async ({ page }) => {
	const personalInfoHeader = page.locator('h2:has-text("Personal info")');
	await expect(personalInfoHeader).toBeVisible();

	const usernameInput = page.locator('input#username');
	await expect(usernameInput).toBeVisible();
	await expect(usernameInput).toHaveAttribute('placeholder', 'Username');
});

test('should display the save button and be disabled initially', async ({ page }) => {
	const saveButton = page.locator('button:has-text("Save")');
	await expect(saveButton).toBeVisible();
	await expect(saveButton).toBeDisabled();
});

test('should enable the save button when username is changed', async ({ page }) => {
	const usernameInput = page.locator('input#username');
	await usernameInput.fill('newUsername');

	const saveButton = page.locator('button:has-text("Save")');
	await expect(saveButton).toBeEnabled();
});

test('should display the change password section', async ({ page }) => {
	const changePasswordHeader = page.locator('h2:has-text("Change password")');
	await expect(changePasswordHeader).toBeVisible();

	const oldPasswordInput = page.locator('input#oldPassword');
	await expect(oldPasswordInput).toBeVisible();
	await expect(oldPasswordInput).toHaveAttribute('placeholder', 'Current Password');

	const newPasswordInput = page.locator('input#newPassword');
	await expect(newPasswordInput).toBeVisible();
	await expect(newPasswordInput).toHaveAttribute('placeholder', 'New Password');

	const confirmPasswordInput = page.locator('input#confirmPassword');
	await expect(confirmPasswordInput).toBeVisible();
	await expect(confirmPasswordInput).toHaveAttribute('placeholder', 'Confirm password');
});

test('should display the change button and be enabled initially', async ({ page }) => {
	const changeButton = page.locator('button:has-text("Change")');
	await expect(changeButton).toBeVisible();
	await expect(changeButton).toBeEnabled();
});
