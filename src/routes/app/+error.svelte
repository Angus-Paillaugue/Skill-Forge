<script>
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>Error {$page.status}</title>
</svelte:head>

{#if $page.status === 404}
	<div class="mx-auto w-full grow p-4 md:max-w-[888px] md:p-6 lg:max-w-screen-xl">
		<div
			class="mt-40 flex w-full flex-col items-center justify-center space-y-2 md:flex-row md:space-x-[20px] md:space-y-0"
		>
			<img
				class="w-[270px]"
				src="https://leetcode.com/static/images/404_face.png"
				alt={$page.status}
			/>
			<div class="text-center md:text-left">
				<h1 class="text-xl font-bold text-neutral-100">{$page.error.message}</h1>
				<p class="mt-2 max-w-[300px] text-sm text-neutral-400">
					Sorry, but we can't find the page you are looking for...
				</p>
			</div>
		</div>
	</div>
{:else}
	<div class="mx-auto w-full grow p-4 md:max-w-[888px] md:p-6 lg:max-w-screen-xl">
		<div class="mt-40 flex w-full flex-col items-center justify-center space-y-2">
			<h1 class="text-8xl font-black">{$page.status}</h1>
			<p class="max-w-[300px] text-lg font-medium text-neutral-100">
				{$page.error.message}
			</p>
		</div>
	</div>
{/if}
