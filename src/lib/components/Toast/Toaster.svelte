<script>
	import Toast from './Toast.svelte';
	import { toasts } from './index.js';
	import { flip } from 'svelte/animate';
</script>

<div
	class="fixed left-1/2 z-30 flex w-full max-w-[300px] -translate-x-1/2 flex-col gap-2 max-md:bottom-2 md:top-2 md:z-50 md:flex-col-reverse"
>
	{#each $toasts.slice(0, 4) as t (t.id)}
		<div animate:flip={{ duration: 500 }}>
			<Toast toast={t} />
		</div>
	{/each}
</div>
