<script>
	import { onDestroy, onMount } from 'svelte';
	import { Tooltip } from '$lib/components';
	import { scale } from 'svelte/transition';

	let {
		value = $bindable(''),
		language = 'javascript',
		defaultValue,
		onRunCodeShortcut
	} = $props();

	let editorElement = $state();
	let editor = $state();
	let monaco = $state();
	let formatted = $state(false);

	/**
	 * Retrieves the value of a specified CSS variable.
	 *
	 * @param {string} variable - The name of the CSS variable to retrieve.
	 * @returns {string} The value of the specified CSS variable.
	 */
	function getCSSVariableValue(variable) {
		return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
	}

	/**
	 * Loads the provided code into the editor.
	 *
	 * @param {string} code - The code to be loaded into the editor.
	 * @param {string} [lang=language] - The programming language of the code. Defaults to the current language setting.
	 */
	export function loadCode(code, lang = language) {
		// Dispose of any existing models
		monaco?.editor.getModels().forEach((model) => model.dispose());
		// Create a new model
		const model = monaco.editor.createModel(code, lang);
		editor.setModel(model);
	}

	/**
	 * Resets the editor to its initial state.
	 */
	function resetEditor() {
		if (!defaultValue) return;
		loadCode(defaultValue);
	}

	/**
	 * Resizes the editor.
	 */
	export const resetEditorLayout = () => {
		editor.layout({ width: 0, height: 0 });

		window.requestAnimationFrame(() => {
			const rect = editorElement.getBoundingClientRect();

			editor.layout({ width: rect.width, height: rect.height });
		});
	};

	/**
	 * Formats the code in the editor.
	 */
	export const formatCode = () => {
		editor.getAction('editor.action.formatDocument').run();
		formatted = true;
		setTimeout(() => {
			formatted = false;
		}, 1500);
	};

	onMount(async () => {
		monaco = (await import('./monaco')).default;

		const backgroundColor = getCSSVariableValue('--tw-neutral-800');

		// Create theme with custom background color
		monaco.editor.defineTheme('customTheme', {
			base: 'vs-dark',
			inherit: true,
			rules: [],
			colors: {
				'editor.background': backgroundColor
			}
		});
		const keyBindings = [
			{
				id: 'run-code-shortcut',
				label: 'Run code',
				keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
				precondition: null,
				keybindingContext: null,
				contextMenuGroupId: 'navigation',
				contextMenuOrder: 1.5,
				run: () => {
					onRunCodeShortcut?.();
				}
			},
			{
				id: 'formatCode',
				label: 'Format code',
				keybindings: [monaco.KeyMod.Alt | monaco.KeyMod.Shift | monaco.KeyCode.KeyF],
				precondition: null,
				keybindingContext: null,
				contextMenuGroupId: 'navigation',
				contextMenuOrder: 1.5,
				run: () => {
					formatCode();
				}
			}
		];
		// Create the editor
		editor = monaco.editor.create(editorElement, {
			theme: 'customTheme',
			language,
			value,
			lineNumbers: 'on',
			roundedSelection: true,
			scrollBeyondLastLine: false,
			readOnly: false,
			editor,
			automaticLayout: true,
			autoIndent: true,
			formatOnPaste: true,
			formatOnType: true,
			minimap: { enabled: false }
		});

		// Adding keybindings to the editor
		for (const keyBinding of keyBindings) {
			editor.addAction(keyBinding);
		}

		window.onresize = () => {
			resetEditorLayout();
		};

		// Responsible for updating the value when the editor content changes
		editor.onDidChangeModelContent(() => {
			value = editor.getValue();
		});
	});

	onDestroy(() => {
		monaco?.editor.getModels().forEach((model) => model.dispose());
		editor?.dispose();
	});
</script>

<div class="flex flex-col h-full grow overflow-hidden">
	<div
		class="flex flex-row gap-2 p-2 items-center h-10 shrink-0 border-b border-neutral-700 text-neutral-400 bg-neutral-800"
	>
		<!-- Format code button -->
		<Tooltip
			content="Format <kbd>Alt</kbd> <kbd>Shift</kbd> <kbd>F</kbd>"
			position="bottom"
			delay={100}
		>
			<button
				onclick={formatCode}
				class="flex flex-roe gap-2 items-center"
				aria-label="Format code"
				disabled={formatted}
			>
				{#if formatted}
					<svg
						in:scale
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="size-5"><path d="M20 6 9 17l-5-5" /></svg
					>
				{:else}
					<svg
						in:scale
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="size-5"><path d="M15 12H3" /><path d="M17 18H3" /><path d="M21 6H3" /></svg
					>
				{/if}
			</button>
		</Tooltip>
		{#if defaultValue}
			<!-- Reset to default configuration button -->
			<Tooltip content="Reset to default configuration" position="bottom" delay={100}>
				<button
					onclick={resetEditor}
					class="flex flex-roe gap-2 items-center"
					aria-label="Reset to default configuration"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="size-5"
						><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path
							d="M3 3v5h5"
						/></svg
					>
				</button>
			</Tooltip>
		{/if}
	</div>
	<div class="pt-2 grow h-full bg-neutral-800 rounded-b-xl overflow-hidden">
		<div class="h-full" bind:this={editorElement}></div>
	</div>
</div>
