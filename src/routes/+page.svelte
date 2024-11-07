<script>
	import { enhance } from '$app/forms';
	import { Input, Button, SEO } from '$lib/components';
	import { toast } from '$lib/components/Toast';
	import { cn } from '$lib/utils';
	import { spring } from 'svelte/motion';
	import {
		ArrowBigUpDash,
		Shapes,
		ArrowRight,
		ShieldBan,
		Zap,
		Route,
		Hourglass
	} from 'lucide-svelte';
	import * as m from '$msgs';

	// import { onMount } from 'svelte';
	// import { fly } from 'svelte/transition';

	const { form } = $props();
	// const SECTIONS = [
	//   {
	//     id:'hero',
	//     name:'Home',
	//     icon:House
	//   },
	//   {
	//     id:'about',
	//     name:'About',
	//     icon: SmilePlus
	//   }
	// ];

	let isSendingForm = $state(false);
	let formIndex = $state(0);
	let formSelectContainer = $state();
	let formContainer = $state();
	let carousel = $state();
	let carouselIndex = $state(0);
	// let sideBarVisible = $state(false);
	let formIndicatorPos = spring(0, {
		stiffness: 0.05,
		damping: 0.25
	});
	let formPos = $state(0);

	$effect(() => {
		if (form?.error) toast.error({ message: form.error });
	});

	$effect(() => {
		if (!formSelectContainer) return;
		if (formIndex === 0) {
			$formIndicatorPos = 0;
			formPos = 0;
		} else {
			$formIndicatorPos = formSelectContainer.offsetWidth / 2;
			formPos = formContainer.offsetWidth / -2 - 8;
		}
	});

	// onMount(() => {
	//   carousel.addEventListener('scroll', () => {
	//     carouselIndex = Math.round(carousel.scrollLeft / carousel.offsetWidth);
	//   });
	//   const observer = new IntersectionObserver((entries) => {
	//     entries.forEach((entry) => {
	//       if (entry.isIntersecting) {
	//         const section = entry.target;
	//         const index = SECTIONS.map(s => s.id).indexOf(section.id);
	//         sideBarVisible = index > 0;
	//       }
	//     });
	//   }, { threshold: 0.5 });

	//   const sections = document.querySelectorAll(SECTIONS.map((s) => `#${s.id}`).join(', '));
	//   sections.forEach((section) => {
	//     observer.observe(section);
	//   });
	// });

	const getStarted = () => {
		document.getElementById('hero').scrollIntoView({ behavior: 'smooth' });
		setTimeout(() => {
			document.getElementById('hero').querySelector('form input#username').focus();
		}, 500);
	};
</script>

<SEO title={m.home_page_page_title()} description={m.home_page_page_description()} />

<!-- Navbar -->
<!-- {#if sideBarVisible}
  <div transition:fly={{ y:'100%' }} class="fixed left-1/2 bottom-4 -translate-x-1/2 bg-card backdrop-blur border border-neutral-600/50 px-6 lg:px-5 py-4 rounded-full flex flex-row gap-8 max-lg:pb-8 z-10">
    {#each SECTIONS as section, index (section.id)}
      <button onclick={() => document.getElementById(section.id).scrollIntoView({ behavior: 'smooth' })} class="items-center justify-center capitalize flex flex-col gap-2 size-7 lg:size-9 transition-colors group relative">
        <span class="text-neutral-400 font-semibold text-sm absolute top-full lg:top-1/2 -translate-x-1/2 left-1/2 lg:-translate-y-1/2 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {section.name}
        </span>
        <section.icon class="size-full lg:group-hover:opacity-0 transition-opacity duration-300 text-neutral-100" />
      </button>
    {/each}
  </div>
{/if} -->

<!-- Hero -->
<section
	class="mx-auto grid min-h-screen w-full max-w-screen-xl grid-cols-1 gap-16 px-4 py-10 lg:grid-cols-5"
	id="hero"
>
	<!-- Left column -->
	<div class="flex flex-col justify-center gap-10 lg:col-span-3">
		<!-- Top hero part -->
		<div class="flex flex-col gap-4">
			<!-- Pills -->
			<div class="no-scrollbar flex flex-row flex-nowrap items-center gap-2 overflow-x-auto">
				<div
					class="shrink-0 rounded-lg bg-blue-600/5 px-4 py-1 text-sm font-medium capitalize text-blue-600"
				>
					{m.home_page_hero_pills_join()}
				</div>
				<div
					class="shrink-0 rounded-lg bg-green-600/5 px-4 py-1 text-sm font-medium capitalize text-green-600"
				>
					{m.home_page_hero_pills_start()}
				</div>
				<div
					class="shrink-0 rounded-lg bg-yellow-600/5 px-4 py-1 text-sm font-medium capitalize text-yellow-600"
				>
					{m.home_page_hero_pills_improve()}
				</div>
			</div>
			<!-- Main headings -->
			<div class="flex flex-col gap-2">
				<h1 class="text-4xl font-extrabold text-wrap-balance md:text-5xl lg:text-6xl">
					{m.home_page_hero_title()}
				</h1>
				<h2 class="font-mono text-base font-medium text-neutral-400">
					{m.home_page_hero_subtitle()}
				</h2>
			</div>
		</div>

		<!-- Carousel -->
		<div class="relative mt-10 w-full">
			<div
				class="no-scrollbar relative w-full snap-x snap-mandatory overflow-x-auto"
				bind:this={carousel}
			>
				<div class="grid grid-cols-2 max-md:w-[200%]">
					<div
						class="h-full w-full snap-start border border-neutral-800/50 p-4 md:border-r-0"
						data-index="0"
					>
						<ArrowBigUpDash class="mx-auto my-6 size-20 text-neutral-300 md:my-10 md:size-32" />
						<p class="font-base text-base italic text-neutral-400">
							{m.home_page_hero_carousel_slide1()}
						</p>
					</div>
					<div class="h-full w-full snap-start border border-neutral-800/50 p-4" data-index="0">
						<Shapes class="mx-auto my-6 size-20 text-neutral-300 md:my-10 md:size-32" />
						<p class="font-base text-base italic text-neutral-400">
							{m.home_page_hero_carousel_slide2()}
						</p>
					</div>
				</div>
			</div>
			<button
				onclick={() => {
					carouselIndex = carouselIndex === 0 ? 1 : 0;
					carousel.scrollTo({
						top: 0,
						left: carouselIndex * carousel.offsetWidth,
						behavior: 'smooth'
					});
				}}
				class={cn(
					'absolute right-2 top-2 flex flex-col items-center justify-center rounded-full bg-neutral-800 p-2 transition-all md:hidden',
					carouselIndex === 1 && 'rotate-180'
				)}
			>
				<ArrowRight class="size-5" />
			</button>
		</div>
	</div>

	<!-- Forms -->
	<div
		class="mx-auto flex w-full max-w-lg flex-col items-center justify-center gap-4 lg:col-span-2"
	>
		<!-- Form selector -->
		<div class="relative flex w-full flex-col" bind:this={formSelectContainer}>
			<!-- Indicator -->
			<div
				id="formIndicator"
				class="absolute bottom-0 top-0 w-1/2 rounded-full bg-neutral-50"
				style="left: {$formIndicatorPos}px;"
			></div>
			<!-- Buttons -->
			<div class="relative grid w-full grid-cols-2" id="formSelectors">
				<button
					aria-label={m.home_page_hero_forms_labels_change_to_sign_up()}
					disabled={isSendingForm}
					onclick={() => (formIndex = 0)}
					class={cn(
						'w-full rounded-full p-2 text-lg font-semibold transition-colors',
						formIndex === 0 ? 'text-neutral-900' : 'text-neutral-400'
					)}>{m.home_page_hero_forms_sign_up_title()}</button
				>
				<button
					aria-label={m.home_page_hero_forms_labels_change_to_log_in()}
					disabled={isSendingForm}
					onclick={() => (formIndex = 1)}
					class={cn(
						'w-full rounded-full p-2 text-lg font-semibold transition-colors',
						formIndex === 1 ? 'text-neutral-900' : 'text-neutral-400'
					)}>{m.home_page_hero_forms_log_in_title()}</button
				>
			</div>
		</div>
		<!-- Forms -->
		<div class="w-full overflow-hidden">
			<div
				class="grid w-[calc(200%+1rem)] grid-cols-2 gap-4 transition-all duration-300"
				style="margin-left: {formPos}px;"
				bind:this={formContainer}
			>
				<!-- Sign up form -->
				<form
					class="flex w-full flex-col gap-6 rounded-xl bg-neutral-50 p-6 text-neutral-900"
					method="POST"
					action="?/signUp"
					use:enhance={() => {
						isSendingForm = true;
						return async ({ update }) => {
							await update();
							isSendingForm = false;
						};
					}}
				>
					<h1 class="text-3xl font-bold text-inherit">{m.home_page_hero_forms_sign_up_title()}</h1>
					<Input
						id="signUpUsername"
						class="bg-neutral-200 text-neutral-800 placeholder:text-neutral-600"
						placeholder={m.home_page_hero_forms_inputs_username()}
						tabindex={formIndex === 0 ? 0 : -1}
					/>
					<Input
						id="signUpPassword"
						class="bg-neutral-200 text-neutral-800 placeholder:text-neutral-600"
						type="password"
						placeholder={m.home_page_hero_forms_inputs_password()}
						tabindex={formIndex === 0 ? 0 : -1}
					/>

					<Button
						disabled={isSendingForm}
						type="submit"
						tabindex={formIndex === 0 ? 0 : -1}
						loading={isSendingForm}
					>
						{m.home_page_hero_forms_sign_up_title()}
					</Button>
				</form>

				<!-- Log in form -->
				<form
					class="flex w-full flex-col gap-6 rounded-xl bg-neutral-50 p-6 text-neutral-900"
					method="POST"
					action="?/logIn"
					use:enhance={() => {
						isSendingForm = true;
						return async ({ update }) => {
							await update();
							isSendingForm = false;
						};
					}}
				>
					<h1 class="text-3xl font-bold text-inherit">{m.home_page_hero_forms_log_in_title()}</h1>
					<Input
						id="logInUsername"
						class="bg-neutral-200 text-neutral-800 placeholder:text-neutral-600"
						placeholder={m.home_page_hero_forms_inputs_username()}
						tabindex={formIndex === 1 ? 0 : -1}
					/>
					<Input
						id="logInPassword"
						class="bg-neutral-200 text-neutral-800 placeholder:text-neutral-600"
						type="password"
						placeholder={m.home_page_hero_forms_inputs_password()}
						tabindex={formIndex === 1 ? 0 : -1}
					/>

					<Button
						disabled={isSendingForm}
						tabindex={formIndex === 1 ? 0 : -1}
						type="submit"
						loading={isSendingForm}
					>
						{m.home_page_hero_forms_log_in_title()}
					</Button>
				</form>
			</div>
		</div>
	</div>
</section>

<!-- About -->
<section class="mx-auto mt-10 min-h-screen w-full max-w-screen-2xl space-y-6 p-4" id="about">
	<h1 class="text-center text-4xl font-bold lg:text-6xl">{m.home_page_bento_title()}</h1>
	<div class="grid min-h-[80vh] w-full lg:grid-cols-2">
		<!-- Left column -->
		<div class="flex flex-col">
			<!-- Learn at your own pace section -->
			<div
				class="flex shrink-0 flex-col items-center justify-center gap-4 border border-neutral-800/50 p-4 text-center lg:gap-8 lg:border-b-0 lg:border-r-0 lg:p-8"
			>
				<Hourglass class="size-16 text-[#ED5D45]" />
				<h2 class="text-4xl font-bold text-neutral-100">{m.home_page_bento_card1_title()}</h2>
				<p class="font-mono text-base font-normal leading-6 text-neutral-400">
					{m.home_page_bento_card1_description()}
				</p>
			</div>
			<!-- Free/No ads section -->
			<div
				class="group relative flex shrink-0 flex-col items-center justify-center gap-4 overflow-hidden border border-neutral-800/50 p-4 text-center max-lg:border-y-0 lg:gap-8 lg:border-b-0 lg:border-r-0 lg:p-8"
			>
				<ShieldBan class="size-16 text-[#3F7DDE]" />
				<h2 class="text-4xl font-bold text-neutral-100">{m.home_page_bento_card2_title()}</h2>
				<p class="font-mono text-base font-normal leading-6 text-neutral-400">
					{@html m.home_page_bento_card2_description()}
				</p>
			</div>
			<!-- Get started section -->
			<div
				class="group relative flex grow flex-col items-center justify-center gap-4 overflow-hidden border border-neutral-800/50 p-6 lg:border-r-0"
			>
				<button
					onclick={getStarted}
					class="relative rounded-full px-4 py-2 text-4xl font-bold capitalize transition-all hover:ring-4 hover:ring-neutral-600/50"
				>
					{m.home_page_bento_card3_title()}
					<!-- Moving line -->
					<div
						class="absolute bottom-0 left-2 right-2 h-px [mask-image:linear-gradient(to_right,rgba(217,217,217,0)_0%,#d9d9d9_25%,#d9d9d9_75%,rgba(217,217,217,0)_100%)]"
					>
						<div
							class="h-2 w-full bg-gradient-to-r from-neutral-100/0 via-[#F2B655] to-neutral-100/0"
							style="animation: starlight-right 3s ease-in-out infinite;"
						></div>
					</div>
				</button>
				<!-- Background grid -->
				<svg
					class="absolute inset-0 -z-10 h-full w-full stroke-neutral-800/50 [mask-image:radial-gradient(50%_50%_at_center_center,transparent,white)]"
					aria-hidden="true"
					><defs
						><pattern
							id="heroSvg"
							width="80"
							height="80"
							x="50%"
							y="-1"
							patternUnits="userSpaceOnUse"><path d="M.5 200V.5H200" fill="none"></path></pattern
						></defs
					><rect width="100%" height="100%" stroke-width="0" fill="url(#heroSvg)"></rect></svg
				>
			</div>
		</div>
		<!-- Right column -->
		<div class="flex flex-col">
			<!-- Star -->
			<div
				class="relative min-h-[500px] grow border border-neutral-800/50 p-4 max-lg:border-y-0 lg:p-8"
			>
				<div
					class="absolute inset-8 flex flex-col items-center justify-evenly overflow-hidden blur"
				>
					{#each { length: 3 } as _}
						<h1
							class="inline-block select-none bg-gradient-to-r from-[#ED5D45] via-[#F2B655] to-[#3FBED8] bg-clip-text text-center text-9xl font-extrabold text-transparent"
						>
							Skill
						</h1>
						<h1
							class="inline-block select-none bg-gradient-to-r from-[#ED5D45] via-[#F2B655] to-[#3FBED8] bg-clip-text text-center text-9xl font-extrabold text-transparent"
						>
							Forge
						</h1>
					{/each}
				</div>
				<div class="absolute inset-12 flex flex-col items-center justify-center lg:inset-24">
					<img
						src="/Star.svg"
						draggable="false"
						class="h-full w-full max-w-[400px] object-contain"
						alt=""
					/>
				</div>
			</div>
			<!-- Two cards side to side -->
			<div class="grid w-full shrink-0 lg:grid-cols-2">
				<div
					class="flex flex-col gap-4 border border-neutral-800/50 p-4 lg:border-r-0 lg:border-t-0 lg:p-8"
				>
					<Zap class="size-16 text-[#3FBED8]" />
					<h1 class="text-2xl font-semibold text-neutral-100">{m.home_page_bento_card4_title()}</h1>
					<p class="font-mono text-base font-normal leading-6 text-neutral-400">
						{m.home_page_bento_card4_description()}
					</p>
				</div>
				<div
					class="flex flex-col gap-4 border border-neutral-800/50 p-4 max-lg:border-t-0 lg:border-t-0 lg:p-8"
				>
					<Route class="size-16 text-[#F2B655]" />
					<h1 class="text-2xl font-semibold text-neutral-100">{m.home_page_bento_card5_title()}</h1>
					<p class="font-mono text-base font-normal leading-6 text-neutral-400">
						{m.home_page_bento_card5_description()}
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Footer -->
<div class="mx-auto mb-6 w-full max-w-screen-2xl px-4">
	<footer class="flex flex-row gap-12 rounded-2xl bg-neutral-50 px-6 py-12 text-neutral-900">
		<p class="font-mono text-sm">© {new Date().getFullYear()} {m.footer()}</p>
	</footer>
</div>

<style>
	@keyframes -global-starlight-right {
		0% {
			transform: translate(-100%);
		}
		50%,
		100% {
			transform: translate(100%);
		}
	}
</style>
