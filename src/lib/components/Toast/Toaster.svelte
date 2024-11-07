<script>
	import Toast from './Toast.svelte';
	import { toasts } from './index.js';
	import { flip } from 'svelte/animate';
</script>

<div
	class="fixed bottom-4 z-50 flex w-full max-w-[300px] flex-col gap-2 max-md:left-1/2 max-md:-translate-x-1/2 md:right-4 md:flex-col-reverse"
>
	{#each $toasts.slice(0, 4) as t (t.id)}
		<div animate:flip={{ duration: 500 }}>
			<Toast toast={t} />
		</div>
	{/each}
</div>
