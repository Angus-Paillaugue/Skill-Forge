<script>
	import { Editor } from '$lib/components';
	import { onMount } from 'svelte';

	let { exercise, editor = $bindable(), value = $bindable(), runCode } = $props();

	onMount(async () => {
		window.addEventListener('keydown', handleShortcut);
	});

	/**
	 * Handles keyboard shortcuts for the exercise page.
	 *
	 * @param {Event} event - The keyboard event triggered by the user.
	 */
	function handleShortcut(event) {
		if (event.ctrlKey && event.key === 'Enter') {
			runCode();
		}
	}
</script>

<!-- Main code editor -->
<div class="flex flex-col">
	<!-- Full screen button -->
	<div class="flex flex-row items-center p-2 gap-2 h-10 rounded-t-xl bg-neutral-700">
		<div class="flex flex-row items-center px-2 gap-2">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="size-5"
				><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg
			>
			Code
		</div>
	</div>
</div>
<Editor
	language="javascript"
	defaultValue={exercise.content}
	bind:value
	bind:this={editor}
	onRunCodeShortcut={runCode}
/>
