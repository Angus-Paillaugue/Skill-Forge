<script>
	import { cn } from '$lib/utils';
	const { class: className, children, href, variant = 'default', ...props } = $props();

	const baseClasses =
		'flex flex-row items-center justify-center text-lg font-medium gap-2 w-fit px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all';

	const variantClasses = {
		default: 'bg-blue-600 text-neutral-100 rounded-xl',
		danger: ' bg-red-600 text-neutral-100 rounded-xl',
		secondary: 'bg-white text-neutral-100 rounded-full',
		ghost: 'bg-transparent text-neutral-100 rounded-xl border border-neutral-300/50',
		link: 'p-0 text-base font-semibold text-neutral-400 hover:text-neutral-100 underline'
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
