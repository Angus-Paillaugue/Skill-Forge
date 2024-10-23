<script>
    const { data } = $props();
    const { paths } = data;
</script>

<svelte:head>
    <title>Learning paths</title>
</svelte:head>

<div class="max-w-screen-lg w-full mx-auto mt-10 flex flex-col gap-2">
	<div class="relative overflow-x-auto overflow-y-hidden w-full shadow-md rounded-lg">
		<table class="w-full text-sm text-left rtl:text-right text-neutral-400 table-auto">
			<thead class="text-xs uppercase bg-neutral-800/50 text-neutral-400">
				<tr>
					<th scope="col" class="px-3 md:px-6 py-3">
                        Name
					</th>
					<th scope="col" class="px-3 md:px-6 py-3">
                        Description
                    </th>
                    <th scope="col" class="px-3 md:px-6 py-3">
                        No exercises
                    </th>
				</tr>
			</thead>
			<tbody>
				{#each paths as path}
					<tr
						class="even:bg-neutral-800/50 border-b border-neutral-700"
					>
						<td class="w-2/6 px-3 md:px-6 py-2">
                            <a href="/app/learning-paths/{path.id}" class="text-lg md:text-2xl font-bold">
                                {path.name}
                            </a>
						</td>
						<td class="w-1/3 px-3 md:px-6 py-2 font-mono">
                            {path.description}
						</td>
                        <td class="w-1/6 px-3 md:px-6 py-2 text-lg fonr-bold text-neutral-100">
                            {path.no_exercises}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
