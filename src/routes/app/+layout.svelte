<script>
	import Header from './Header.svelte';
	import Aside from './Aside.svelte';
	import { afterNavigate } from '$app/navigation';
	import { onMount } from 'svelte';

	const { children, data } = $props();
	const { user } = data;

	let mobileMenuOpened = $state(false);
	let pageName = $state('');

	const getPageTitle = () => document.title.split('|').slice(0, -1).join('|');

	afterNavigate(() => {
		mobileMenuOpened = false;
		pageName = getPageTitle();
	});

	onMount(() => {
		pageName = getPageTitle();
	});
</script>

<div class="flex h-screen w-full flex-row bg-body lg:p-2">
	<Aside {user} bind:pageName bind:mobileMenuOpened />

	<!-- Content -->
	<div class="no-scrollbar flex h-full grow flex-col overflow-auto">
		<!-- Page title and back button on mobile -->
		<Header bind:pageName bind:mobileMenuOpened />
		<div class="flex grow flex-col max-lg:p-2 max-lg:pt-0">
			{@render children()}
		</div>
	</div>
</div>
