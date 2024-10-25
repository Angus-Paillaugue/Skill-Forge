<script>
	const { data } = $props();
	const { paths } = data;
</script>

<svelte:head>
	<title>Learning paths</title>
</svelte:head>

<div class="mx-auto mt-10 flex w-full max-w-screen-lg flex-col gap-2">
	<div class="relative w-full overflow-x-auto overflow-y-hidden rounded-lg shadow-md">
		<table class="w-full table-auto text-left text-sm text-neutral-400 rtl:text-right">
			<thead class="bg-neutral-800/50 text-xs uppercase text-neutral-400">
				<tr>
					<th scope="col" class="px-3 py-3 md:px-6"> Name </th>
					<th scope="col" class="px-3 py-3 md:px-6"> Description </th>
					<th scope="col" class="px-3 py-3 md:px-6"> No exercises </th>
				</tr>
			</thead>
			<tbody>
				{#each paths as path}
					<tr class="border-b border-neutral-700 even:bg-neutral-800/50">
						<td class="w-2/6 px-3 py-2 md:px-6">
							<a href="/app/learning-paths/{path.id}" class="text-lg font-bold md:text-2xl">
								{path.name}
							</a>
						</td>
						<td class="w-1/3 px-3 py-2 font-mono md:px-6">
							{path.description}
						</td>
						<td class="fonr-bold w-1/6 px-3 py-2 text-lg text-neutral-100 md:px-6">
							{path.no_exercises}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
