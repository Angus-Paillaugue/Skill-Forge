<script>
	import { Editor } from '$lib/components';
	import { Code } from 'lucide-svelte';

	let { exercise, editor = $bindable(), value = $bindable(), runCode } = $props();
</script>

<!-- Main code editor -->
<div class="flex flex-col">
	<!-- Full screen button -->
	<div class="flex flex-row items-center p-2 gap-2 h-10 rounded-t-xl bg-neutral-700">
		<div class="flex flex-row items-center px-2 gap-2">
			<Code class="size-5" />
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
