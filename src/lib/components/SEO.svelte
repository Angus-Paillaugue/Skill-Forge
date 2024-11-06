<script>
	import { page } from '$app/stores';

	const { children, title, description } = $props();
	const SITE_NAME = 'Skill Forge';
</script>

<svelte:head>
	<link rel="canonical" href={$page.url.href.split('#')[0]} />
	<meta property="twitter:domain" content={$page.url.hostname} />
	<meta property="twitter:url" content={$page.url.href.split('#')[0]} />
	<meta property="og:url" content={$page.url.href.split('#')[0]} />
	<meta property="og:locale" content="en_US" />
	<meta property="og:site_name" content={SITE_NAME} />

	<!-- Dynamic data -->
	<title>{title} | {SITE_NAME}</title>
	<meta property="og:title" content="{title} | {SITE_NAME}" />
	<meta property="twitter:title" content="{title} | {SITE_NAME}" />

	<meta name="description" content={description} />
	<meta property="og:description" content={description} />
	<meta property="twitter:description" content={description} />

	{@render children?.()}
</svelte:head>
