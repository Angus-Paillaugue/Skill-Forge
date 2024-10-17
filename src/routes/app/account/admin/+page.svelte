<script>
	import { Button } from '$lib/components';
</script>

<div class="flex flex-col gap-8 max-w-screen-lg mx-auto w-full bg-neutral-800 p-4 rounded-xl">
	<h1 class="font-bold text-3xl">Admin dashboard</h1>
	<Button href="/app/account/admin/addExercise">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="size-6"><path d="M5 12h14" /><path d="M12 5v14" /></svg
		>
		Add new exercise
	</Button>
</div>
