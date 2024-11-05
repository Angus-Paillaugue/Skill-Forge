<script>
	import { getContext } from 'svelte';
	import { Button } from '$lib/components';
	import * as m from '$msgs';

	const { children, ...restProps } = $props();
	const { toggle } = getContext('dropdown');
</script>

<Button onclick={toggle} name={m.components_dropdown_toggle_label()} {...restProps}>
	{@render children()}
</Button>
