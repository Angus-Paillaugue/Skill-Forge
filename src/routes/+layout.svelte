<script>
	import '../app.css';
	import '../code.css';
	import { Toasts } from '$lib/components';
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

<Toasts />

{@render children()}
