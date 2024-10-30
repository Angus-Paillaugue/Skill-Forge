import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	await page.goto('/app/exercises');
});
test('should display the exercises page', async ({ page }) => {
	await expect(page).toHaveTitle(/All exercises | Skill-Forge/);
});

test('should display a list of exercises', async ({ page }) => {
	const noExercises = await page.locator('tbody tr').count();

	await expect(noExercises).toBeGreaterThan(0);
});

test('should filter exercises based on search input', async ({ page }) => {
	await page.fill('#search', 'Sqrt');

	const noFilteredExercises = await page.locator('tbody tr').count();
	await expect(noFilteredExercises).toBeGreaterThan(0);
	await expect(await page.locator('tbody tr').first()).toContainText('Sqrt');
});

test('should sort exercises by title', async ({ page }) => {
	const titleHeader = page.locator('th:has-text("Title") button');
	await titleHeader.click();

	const firstExerciseTitle = await page.locator('tbody tr:first-child td:nth-child(3)').innerText();
	const secondExerciseTitle = await page
		.locator('tbody tr:nth-child(2) td:nth-child(3)')
		.innerText();

	expect(firstExerciseTitle.localeCompare(secondExerciseTitle)).toBeGreaterThanOrEqual(0);

	await titleHeader.click();
	const firstExerciseTitleDesc = await page
		.locator('tbody tr:first-child td:nth-child(3)')
		.innerText();
	const secondExerciseTitleDesc = await page
		.locator('tbody tr:nth-child(2) td:nth-child(3)')
		.innerText();

	expect(firstExerciseTitleDesc.localeCompare(secondExerciseTitleDesc)).toBeLessThanOrEqual(0);
});

test('should sort exercises by difficulty', async ({ page }) => {
	const difficultyHeader = page.locator('th:has-text("Difficulty") button');
	await difficultyHeader.click();

	const firstExerciseDifficulty = await page
		.locator('tbody tr:first-child td:nth-child(4)')
		.innerText();
	const secondExerciseDifficulty = await page
		.locator('tbody tr:nth-child(2) td:nth-child(4)')
		.innerText();

	const difficultyMap = { easy: 1, medium: 2, hard: 3 };
	expect(
		difficultyMap[firstExerciseDifficulty] <= difficultyMap[secondExerciseDifficulty]
	).toBeTruthy();
});

test('should sort exercises by date added', async ({ page }) => {
	const dateHeader = page.locator('th:has-text("Added") button');
	await dateHeader.click();

	const firstExerciseDate = new Date(
		await page.locator('tbody tr:first-child td:nth-child(5)').innerText()
	);
	const secondExerciseDate = new Date(
		await page.locator('tbody tr:nth-child(2) td:nth-child(5)').innerText()
	);

	expect(firstExerciseDate <= secondExerciseDate).toBeTruthy();
});
