import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	webServer: {
		command: 'pnpm preview',
		port: 4173,
		timeout: 5 * 60 * 60 * 1000
	},
	testDir: 'tests/e2e',
	projects: [
		// Setup project
		{ name: 'setup', testMatch: /tests\/e2e\/.*\.setup\.js/ },

		{
			name: 'requiresAuth',
			use: {
				...devices['Desktop Chrome'],
				// Use prepared auth state.
				storageState: 'tests/e2e/.auth/user.json'
			},
			dependencies: ['setup'],
			testMatch: /.*\.auth.spec\.js/
		},
		{
			name: 'NoAuth',
			use: {
				...devices['Desktop Chrome']
			},
			testMatch: /.*\.no-auth.spec\.js/
		}
	]
});
