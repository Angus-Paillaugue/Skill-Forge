<script>
	import { Editor } from '$lib/components';
	import { Code } from 'lucide-svelte';

	let { exercise, editor = $bindable(), value = $bindable(), runCode } = $props();
</script>

<!-- Main code editor -->
<div class="flex flex-col">
	<!-- Full screen button -->
	<div class="flex h-10 flex-row items-center gap-2 rounded-t-xl bg-neutral-700 p-2">
		<div class="flex flex-row items-center gap-2 px-2">
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
