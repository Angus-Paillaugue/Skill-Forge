import fs from 'node:fs/promises';
import chalk from 'chalk';

const PARAMS = {
	checkEmptyFields: true,
	missingTranslations: true,
	snakeCase: true
};

const GREEN = chalk.green;
const RED = chalk.red;

async function checkTranslations() {
	let hasErrors = [];
	const translationFiles = await fs.readdir('messages');
	const filePaths = translationFiles.map((file) => `messages/${file}`);

	const translations = await Promise.all(
		filePaths.map(async (filePath) => {
			const content = await fs.readFile(filePath, 'utf-8');
			return JSON.parse(content);
		})
	);

	const allKeys = new Set();
	translations.forEach((translation) => {
		Object.keys(translation).forEach((key) => allKeys.add(key));
	});

	allKeys.delete('$schema');

	if (PARAMS.checkEmptyFields) {
		translations.forEach((translation, index) => {
			const emptyKeys = Object.entries(translation)
				.filter(([, value]) => value === '')
				.map(([key]) => key);
			if (emptyKeys.length > 0) {
				hasErrors.push({
					type: 'empty field',
					file: translationFiles[index],
					message: emptyKeys.join('\n')
				});
			}
		});
	}

	if (PARAMS.snakeCase) {
		const snakeCaseKeys = [...allKeys].filter((key) => !/^[a-z0-9_]+$/.test(key));
		if (snakeCaseKeys.length > 0) {
			hasErrors.push({
				type: 'snakeCase',
				message:
					RED('✖') +
					` Keys in translation files should be in snake_case:\n${snakeCaseKeys.join('\n')}`
			});
		}
	}

	if (PARAMS.missingTranslations) {
		translations.forEach((translation, index) => {
			const missingKeys = [...allKeys].filter((key) => !(key in translation));
			if (missingKeys.length > 0) {
				hasErrors.push({
					type: 'missing translation',
					file: translationFiles[index],
					message: missingKeys.join('\n')
				});
			}
		});
	}

	if (hasErrors.length === 0) {
		console.log(GREEN('✓') + ' All translations are OK!');
	} else {
		hasErrors.forEach(({ type, file, message }) => {
			console.log(RED('✖') + ` ${file} has errors:`);
			console.log(type + ': ' + message);
		});
		process.exit(1);
	}
}

checkTranslations();
