<script>
	import { cn } from '$lib/utils';

	const { children, class: className, name, ...restProps } = $props();

	const classes = cn(
		'list-none py-2 font-medium transition-colors text-sm px-4 flex flex-row items-center gap-2 hover:bg-neutral-700/50 -outline-offset-1 dropdown-item',
		className
	);

	const tagname = 'href' in restProps ? 'a' : 'button';
</script>

<svelte:element this={tagname} class={classes} {name} aria-label={name} {...restProps}>
	{@render children?.()}
</svelte:element>
