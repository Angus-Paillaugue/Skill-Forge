import { test as setup } from '@playwright/test';
import path from 'path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

dotenv.config();
const __dirname = dirname(fileURLToPath(import.meta.url));
const authFile = path.join(__dirname, '.auth/user.json');

setup('authenticate', async ({ page }) => {
	await page.goto('/');
	// Fill in the login form
	await page.click('#formSelectors button:nth-child(2)');
	await page.fill('form:nth-child(2) input[type="text"]', process.env.TEST_USER_USERNAME);
	await page.fill('form:nth-child(2) input[type="password"]', process.env.TEST_USER_PASSWORD);
	await page.click('form:nth-child(2) button[type="submit"]');

	await page.waitForNavigation();
	await page.goto('/app/exercises');

	await page.context().storageState({ path: authFile });
});
