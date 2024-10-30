import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	await page.goto('/app/learning-paths');
});

test('should display the learning paths page', async ({ page }) => {
	await expect(page).toHaveTitle(/Learning paths | Skill-Forge/);
});

test('should display started learning paths', async ({ page }) => {
	const startedPathsHeader = page.locator('h1:has-text("Continue Learning")');
	await expect(startedPathsHeader).toBeVisible();

	const startedPathsCount = await page.locator('h1:has-text("Continue Learning") + div a').count();
	await expect(startedPathsCount).toBeGreaterThan(0);
});

test('should display not started learning paths', async ({ page }) => {
	const notStartedPathsHeader = page.locator('h1:has-text("Continue Learning")');
	await expect(notStartedPathsHeader).toBeVisible();

	const notStartedPathsCount = await page
		.locator('h1:has-text("Continue Learning") + div a')
		.count();
	await expect(notStartedPathsCount).toBeGreaterThan(0);
});

test('should navigate to a learning path detail page when a path is clicked', async ({ page }) => {
	const firstPath = page.locator('h1:has-text("Continue Learning") + div a').first();
	await firstPath.click();

	await expect(page).toHaveURL(/\/app\/learning-paths\/\d+/);
	await expect(page.locator('h1')).toBeVisible();
});

test('should display progress bar for started paths', async ({ page }) => {
	const progressBar = page.locator(
		'h1:has-text("Continue Learning") + div a:first-child .progress-bar'
	);
	await expect(progressBar).toBeVisible();
});

test('should display correct progress text for started paths', async ({ page }) => {
	const progressText = page.locator(
		'h1:has-text("Continue Learning") + div a:first-child div.flex-row span.text-lg'
	);
	await expect(progressText).toBeVisible();

	const textContent = await progressText.innerText();
	expect(parseInt(textContent)).toBeGreaterThan(0);
});
