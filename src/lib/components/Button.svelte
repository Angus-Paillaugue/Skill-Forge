<script>
	import { cn } from '$lib/utils';
	const { class: className, children, href, variant = 'default', ...props } = $props();

	const baseClasses =
		'flex flex-row items-center justify-center text-lg font-medium gap-2 w-fit px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all';

	const variantClasses = {
		default: 'bg-blue-600 text-text-heading-dark rounded-lg',
		danger: ' bg-red-600 text-text-heading-dark rounded-xl',
		secondary: 'bg-white text-text-heading rounded-full',
		ghost: 'bg-transparent text-text-heading-dark rounded-xl border border-neutral-300/50',
		link: 'p-0 text-base font-semibold text-text-heading underline w-auto'
	};
</script>

{#if href}
	<a {href} class={cn(baseClasses, variantClasses[variant], className)} {...props}>
		{@render children()}
	</a>
{:else}
	<button class={cn(baseClasses, variantClasses[variant], className)} {...props}>
		{@render children()}
	</button>
{/if}
