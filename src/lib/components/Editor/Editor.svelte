<script>
	import { onDestroy, onMount } from 'svelte';
	import { Dropdown, Spinner } from '$lib/components';
	import { scale } from 'svelte/transition';
	import {
		Check,
		AlignLeft,
		RotateCcw,
		Plus,
		Minus,
		WrapText,
		Save,
		AlignJustify
	} from 'lucide-svelte';

	let {
		value = $bindable(''),
		saveId,
		language = 'javascript',
		defaultValue,
		onRunCodeShortcut
	} = $props();

	let editorElement = $state();
	let editor = $state();
	let monaco = $state();
	let loaded = $state(false);
	let formatted = $state(false);
	let fontSize = $state(16);
	let wordWrap = $state(true);
	let saved = $state(false);

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

	/**
	 * Saves the current value being edited.
	 * This function is typically called when the user attempts to save their changes.
	 */
	function saveTryValue() {
		if (saved) return;
		localStorage.setItem(saveId, value);
		saved = true;
		setTimeout(() => {
			saved = false;
		}, 1500);
	}

	/**
	 * Retrieves the value from the last attempt or try.
	 * This function is used to fetch and return the value that was last attempted.
	 *
	 * @returns {any} The value from the last try.
	 */
	function getLastTryValue() {
		return localStorage.getItem(saveId);
	}

	onMount(async () => {
		loaded = true;
		monaco = (await import('./monaco')).default;

		const localStorageFontSize = localStorage.getItem('font-size');
		if (localStorageFontSize) fontSize = parseInt(localStorageFontSize);

		// If the user has saved, set the last save value to the editor value
		if (getLastTryValue()) {
			value = getLastTryValue();
		}

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
				run: () => {
					onRunCodeShortcut?.();
				}
			},
			{
				id: 'formatCode',
				label: 'Format code',
				keybindings: [monaco.KeyMod.Alt | monaco.KeyMod.Shift | monaco.KeyCode.KeyF],
				run: () => {
					formatCode();
				}
			},
			{
				id: 'toggleWordWrap',
				label: 'Toggle word wrap',
				keybindings: [monaco.KeyMod.Alt | monaco.KeyCode.KeyZ],
				run: () => {
					wordWrap = !wordWrap;
				}
			},
			{
				id: 'saveState',
				label: 'Save',
				keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
				run: () => {
					saveTryValue();
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
			fontSize,
			fontFamily: 'JetBrains Mono',
			fontLigatures: true,
			wordWrap,
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

	/**
	 * Reduces the font size of the editor content.
	 */
	const reduceFontSize = () => {
		fontSize = Math.max(8, fontSize - 1);
		localStorage.setItem('font-size', fontSize);
	};

	/**
	 * Increases the font size of the editor content.
	 */
	const increaseFontSize = () => {
		fontSize = Math.min(25, fontSize + 1);
		localStorage.setItem('font-size', fontSize);
	};

	// Update the font size
	$effect(() => {
		if (!editor) return;
		editor.updateOptions({ fontSize });
	});

	// Update the word wrap setting
	$effect(() => {
		if (!editor) return;
		editor.updateOptions({ wordWrap });
	});
</script>

<div class="flex h-full grow flex-col overflow-hidden">
	<div
		class="flex h-10 shrink-0 flex-row items-center border-b border-neutral-700 bg-neutral-800 p-2 text-neutral-400"
	>
		<!-- File dropdown -->
		<Dropdown align="start">
			<Dropdown.Trigger
				variant="none"
				class="w-fit gap-2 rounded-lg px-3 py-1 text-base text-neutral-100 hover:bg-neutral-700/50"
				>File</Dropdown.Trigger
			>
			{#snippet items()}
				<!-- Save -->
				<Dropdown.Item aria-label="Save" onclick={saveTryValue}>
					{#if saved}
						<span in:scale>
							<Check class="size-5" />
						</span>
					{:else}
						<span in:scale>
							<Save class="size-5" />
						</span>
					{/if}
					Save
					<div class="ml-auto">
						<kbd class="px-1 py-0.5 text-xs">Ctrl</kbd>
						<kbd class="px-1 py-0.5 text-xs">S</kbd>
					</div>
				</Dropdown.Item>
				<!-- Format -->
				<Dropdown.Item onclick={formatCode} aria-label="Format code" disabled={formatted}>
					{#if formatted}
						<span in:scale>
							<Check class="size-5" />
						</span>
					{:else}
						<span in:scale>
							<AlignLeft class="size-5" />
						</span>
					{/if}
					Format
					<div class="ml-auto">
						<kbd class="px-1 py-0.5 text-xs">Alt</kbd>
						<kbd class="px-1 py-0.5 text-xs">Shift</kbd>
						<kbd class="px-1 py-0.5 text-xs">F</kbd>
					</div>
				</Dropdown.Item>
				<!-- Word wrap -->
				<Dropdown.Item aria-label="Toggle word wrap" onclick={() => (wordWrap = !wordWrap)}>
					{#if wordWrap}
						<WrapText class="size-5" />
					{:else}
						<AlignJustify class="size-5" />
					{/if}
					<p>Turn {wordWrap ? 'off' : 'on'} word wrap</p>
					<div class="ml-auto">
						<kbd class="px-1 py-0.5 text-xs">Alt</kbd>
						<kbd class="px-1 py-0.5 text-xs">Z</kbd>
					</div>
				</Dropdown.Item>
				<!-- Reset -->
				{#if defaultValue}
					<Dropdown.Item onclick={resetEditor} aria-label="Reset to default configuration">
						<RotateCcw class="size-5" />
						Reset
					</Dropdown.Item>
				{/if}
			{/snippet}
		</Dropdown>

		<!-- Font size selector -->
		<div class="ml-auto flex h-full flex-row gap-px overflow-hidden rounded">
			<button
				class="flex aspect-square h-full shrink-0 flex-col items-center justify-center bg-neutral-700 text-neutral-400"
				onclick={reduceFontSize}
				aria-label="Decrease editor font size"
			>
				<Minus class="size-4" />
			</button>
			<div
				class="flex h-full shrink-0 flex-col items-center justify-center bg-neutral-700 px-2 text-sm font-medium"
			>
				{fontSize}
			</div>
			<button
				class="flex aspect-square h-full shrink-0 flex-col items-center justify-center bg-neutral-700 text-neutral-400"
				onclick={increaseFontSize}
				aria-label="Increase editor font size"
			>
				<Plus class="size-4" />
			</button>
		</div>
	</div>
	<div class="relative h-full grow overflow-hidden rounded-b-xl bg-neutral-800 pt-2">
		{#if loaded}
			<div class="h-full" bind:this={editorElement}></div>
		{:else}
			<div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
				<Spinner class="size-10" />
			</div>
		{/if}
	</div>
</div>
