<script>
	import '../app.css';
	import '../code.css';
	import { Toasts } from '$lib/components';

	const { children } = $props();
</script>

<Toasts />

{@render children()}
