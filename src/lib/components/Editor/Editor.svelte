<script>
	import { onDestroy, onMount } from 'svelte';
	import { Tooltip } from '$lib/components';
	import { scale } from 'svelte/transition';
	import { Check, AlignLeft, RotateCcw, Plus, Minus, WrapText } from 'lucide-svelte';

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
	let fontSize = $state(16);
	let wordWrap = $state(true);

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

		const localStorageFontSize = localStorage.getItem('font-size');
		if (localStorageFontSize) fontSize = parseInt(localStorageFontSize);

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
			},
			{
				id: 'toggleWordWrap',
				label: 'Toggle word wrap',
				keybindings: [monaco.KeyMod.Alt | monaco.KeyCode.KeyZ],
				precondition: null,
				keybindingContext: null,
				contextMenuGroupId: 'navigation',
				contextMenuOrder: 1.5,
				run: () => {
					wordWrap = !wordWrap;
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

	const reduceFontSize = () => {
		fontSize = Math.max(8, fontSize - 1);
		localStorage.setItem('font-size', fontSize);
	};
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
		class="flex h-10 shrink-0 flex-row items-center gap-2 border-b border-neutral-700 bg-neutral-800 p-2 text-neutral-400"
	>
		<!-- Format code button -->
		<Tooltip content="Format <kbd>Alt</kbd> <kbd>Shift</kbd> <kbd>F</kbd>" position="bottom">
			<button
				onclick={formatCode}
				class="flex flex-row items-center gap-2"
				aria-label="Format code"
				disabled={formatted}
			>
				{#if formatted}
					<span in:scale>
						<Check class="size-5" />
					</span>
				{:else}
					<span in:scale>
						<AlignLeft class="size-5" />
					</span>
				{/if}
			</button>
		</Tooltip>
		<!-- Word wrap button -->
		<Tooltip content="Toggle word wrap <kbd>Alt</kbd> <kbd>Z</kbd>" position="bottom">
			<button
				onclick={() => (wordWrap = !wordWrap)}
				class="flex flex-row items-center gap-2"
				aria-label="Toggle word wrap"
			>
				<WrapText class="size-5" />
			</button>
		</Tooltip>
		{#if defaultValue}
			<!-- Reset to default configuration button -->
			<Tooltip content="Reset to default configuration" position="bottom">
				<button
					onclick={resetEditor}
					class="flex flex-row items-center gap-2"
					aria-label="Reset to default configuration"
				>
					<RotateCcw class="size-5" />
				</button>
			</Tooltip>
		{/if}

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
	<div class="h-full grow overflow-hidden rounded-b-xl bg-neutral-800 pt-2">
		<div class="h-full" bind:this={editorElement}></div>
	</div>
</div>
