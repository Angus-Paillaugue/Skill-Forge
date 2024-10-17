<script>
	import { cn } from '$lib/utils';
	const { difficulty = 'easy', class: className } = $props();

	const difficultyClasses = {
		easy: 'bg-green-600 text-white',
		medium: 'bg-yellow-600 text-black',
		hard: 'bg-red-600 text-white'
	};
</script>

<span
	class={cn(
		difficultyClasses[difficulty],
		'block px-2 py-1 rounded-full text-sm w-fit font-semibold',
		className
	)}
>
	{difficulty}
</span>
