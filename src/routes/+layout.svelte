<script>
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import '../app.css';
	import '../code.css';
	import Toaster from '$lib/components/Toast';
	import { page } from '$app/stores';

	const { children } = $props();
</script>

<svelte:head>
	<link rel="canonical" href={$page.url.href.split('#')[0]} />
	<meta property="twitter:domain" content={$page.url.hostname} />
	<meta property="twitter:url" content={$page.url.href.split('#')[0]} />

	<meta property="og:url" content={$page.url.href.split('#')[0]} />
	<meta property="og:locale" content="en_US" />
	<meta property="og:site_name" content="Skill-Forge" />
</svelte:head>

<ParaglideJS {i18n}>
	<Toaster></Toaster>

	{@render children()}
</ParaglideJS>
