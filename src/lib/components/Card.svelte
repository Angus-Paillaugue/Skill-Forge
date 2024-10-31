<script>
	import { cn } from '$lib/utils';

	const { children, class: className, ...restProps } = $props();
	const tagName = 'href' in restProps ? 'a' : 'div';
</script>

<svelte:element
	this={tagName}
	class={cn(
		'space-y-4 rounded-xl border border-neutral-700/50 bg-neutral-800/50 p-4 text-neutral-100 lg:p-6',
		className
	)}
	{...restProps}
>
	{@render children()}
</svelte:element>
