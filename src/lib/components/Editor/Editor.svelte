<script>
	import { onDestroy, onMount } from 'svelte';

	let { value = $bindable(''), language = 'javascript', onRunCodeShortcut } = $props();

	let editorElement = $state();
	let editor = $state();
	let monaco = $state();
	const INITIAL_CODE_VALUE = value;

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
	 *
	 * @param {string} [lang=language] - The language to reset the editor to. Defaults to the current language.
	 */
	function resetEditor(lang = language) {
		loadCode(INITIAL_CODE_VALUE, lang);
	}

	export const resetEditorLayout = () => {
		editor.layout({ width: 0, height: 0 });

		window.requestAnimationFrame(() => {
			const rect = editorElement.getBoundingClientRect();

			editor.layout({ width: rect.width, height: rect.height });
		});
	};

	onMount(async () => {
		monaco = (await import('./monaco')).default;

		const backgroundColor = getCSSVariableValue('--tw-neutral-900');

		monaco.editor.defineTheme('customTheme', {
			base: 'vs-dark',
			inherit: true,
			rules: [],
			colors: {
				'editor.background': backgroundColor
			}
		});

		editor = monaco.editor.create(editorElement, {
			theme: 'customTheme',
			language,
			value,
			lineNumbers: 'on',
			roundedSelection: true,
			scrollBeyondLastLine: false,
			readOnly: false,
			editor,
			automaticLayout: true
		});
		editor.addAction({
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
		});

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

<div class="h-full rounded-xl overflow-hidden" bind:this={editorElement}></div>
