<script>
	import { cn } from '$lib/utils';
	const { difficulty = 'easy', class: className, ...props } = $props();

	const difficultyClasses = {
		easy: 'text-green-600',
		medium: 'text-yellow-600',
		hard: 'text-red-600'
	};
</script>

{#if difficulty in difficultyClasses}
	<span
		class={cn(difficultyClasses[difficulty], 'inline-block text-sm font-bold', className)}
		{...props}
	>
		{difficulty}
	</span>
{:else}
	<span>Unknown difficulty {difficulty}</span>
{/if}
