<script>
	import { cn } from '$lib/utils';
	const { difficulty = 'easy', class: className } = $props();

	const difficultyClasses = {
		easy: 'text-green-600',
		medium: 'text-yellow-600',
		hard: 'text-red-600'
	};
</script>

<span
	class={cn(
		difficultyClasses[difficulty],
		'inline-block text-sm font-bold',
		className
	)}
>
	{difficulty}
</span>
