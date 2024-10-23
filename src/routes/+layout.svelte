<script>
	import '../app.css';
	import '../code.css';
	import { Toasts, Analytics } from '$lib/components';

	const { children } = $props();
</script>

<Analytics />

<Toasts />

{@render children()}
