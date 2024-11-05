<script>
	import '../app.css';
	import '../code.css';
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import Toaster from '$lib/components/Toast';

	const { children } = $props();
</script>

<ParaglideJS {i18n}>
	<Toaster />

	{@render children()}
</ParaglideJS>
