<script>
	import { cn } from '$lib/utils';

	const { class: className, ...restProps } = $props();
</script>

<div
	class={cn('border-main dark:border-main-dark my-2 h-0 w-full border-b', className)}
	{...restProps}
></div>
