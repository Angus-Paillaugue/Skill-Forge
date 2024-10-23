<script>
	import { enhance } from '$app/forms';
	import { Button, Spinner, Input } from '$lib/components';
	import { newToast } from '$lib/stores';
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
		if (form?.error) newToast({ type: 'red', title: 'Error', message: form.error });
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

<svelte:head>
	<title>Skill Forge</title>
</svelte:head>

<!-- Navbar -->
<!-- {#if sideBarVisible}
  <div transition:fly={{ y:'100%' }} class="fixed left-1/2 bottom-4 -translate-x-1/2 bg-neutral-800/50 backdrop-blur-md border border-neutral-600/50 px-6 lg:px-5 py-4 rounded-full flex flex-row gap-8 max-lg:pb-8 z-10">
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
	class="min-h-screen max-w-screen-xl mx-auto w-full grid grid-cols-1 lg:grid-cols-5 gap-16 px-4 py-10"
	id="hero"
>
	<!-- Left column -->
	<div class="lg:col-span-3 justify-center flex flex-col gap-10">
		<!-- Top hero part -->
		<div class="flex flex-col gap-4">
			<!-- Pills -->
			<div class="flex flex-row gap-2 items-center flex-nowrap overflow-x-auto no-scrollbar">
				<div
					class="rounded-lg bg-blue-600/5 text-blue-600 px-4 py-1 text-sm font-medium capitalize shrink-0"
				>
					Join Skill Forge
				</div>
				<div
					class="rounded-lg bg-green-600/5 text-green-600 px-4 py-1 text-sm font-medium capitalize shrink-0"
				>
					Start Learning
				</div>
				<div
					class="rounded-lg bg-yellow-600/5 text-yellow-600 px-4 py-1 text-sm font-medium capitalize shrink-0"
				>
					Improve Your Skills
				</div>
			</div>
			<!-- Main headings -->
			<div class="flex flex-col gap-2">
				<h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold text-wrap-balance">
					Forge Your Skills, Shape Your Future
				</h1>
				<h2 class="text-base font-medium text-neutral-400 font-mono">
					Master coding challenges designed to help you grow. From beginner to expert, Skill Forge
					guides you through real-world problems with instant feedback and progress tracking.
				</h2>
			</div>
		</div>

		<!-- Carousel -->
		<div class="relative mt-10 w-full">
			<div
				class="w-full overflow-x-auto snap-x snap-mandatory no-scrollbar relative"
				bind:this={carousel}
			>
				<div class="grid grid-cols-2 max-md:w-[200%]">
					<div
						class="border border-neutral-800/50 p-4 h-full md:border-r-0 w-full snap-start"
						data-index="0"
					>
						<ArrowBigUpDash class="size-20 md:size-32 mx-auto text-neutral-300 my-6 md:my-10" />
						<p class="text-neutral-400 italic text-base font-base">
							Whether you're just starting out or you're a seasoned pro, Skill Forge offers
							exercises that fit your skill level. Choose from beginner, intermediate, and advanced
							problems to keep pushing your boundaries
						</p>
					</div>
					<div class="border border-neutral-800/50 p-4 h-full w-full snap-start" data-index="0">
						<Shapes class="size-20 md:size-32 mx-auto text-neutral-300 my-6 md:my-10" />
						<p class="text-neutral-400 italic text-base font-base">
							Every step forward counts! Monitor your growth with detailed submission history and
							rankings. See how you improve with each challenge you complete.
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
					'flex md:hidden p-2 absolute right-2 top-2 transition-all flex-col items-center justify-center rounded-full bg-neutral-800',
					carouselIndex === 1 && 'rotate-180'
				)}
			>
				<ArrowRight class="size-5" />
			</button>
		</div>
	</div>

	<!-- Forms -->
	<div
		class="flex flex-col items-center justify-center gap-4 lg:col-span-2 w-full max-w-lg mx-auto"
	>
		<!-- Form selector -->
		<div class="flex flex-col relative w-full" bind:this={formSelectContainer}>
			<!-- Indicator -->
			<div
				class="w-1/2 bg-neutral-200 absolute top-0 bottom-0 rounded-full"
				style="left: {$formIndicatorPos}px;"
			></div>
			<!-- Buttons -->
			<div class="grid grid-cols-2 w-full relative">
				<button
					aria-label="Change form to Sign up"
					disabled={isSendingForm}
					onclick={() => (formIndex = 0)}
					class={cn(
						'font-semibold p-2 text-lg w-full rounded-full transition-colors',
						formIndex === 0 ? 'text-neutral-900' : 'text-neutral-400'
					)}>Sign up</button
				>
				<button
					aria-label="Change form to Log up"
					disabled={isSendingForm}
					onclick={() => (formIndex = 1)}
					class={cn(
						'font-semibold p-2 text-lg w-full rounded-full transition-colors',
						formIndex === 1 ? 'text-neutral-900' : 'text-neutral-400'
					)}>Log in</button
				>
			</div>
		</div>
		<!-- Forms -->
		<div class="overflow-hidden w-full">
			<div
				class="grid grid-cols-2 gap-4 w-[calc(200%+1rem)] transition-all duration-300"
				style="margin-left: {formPos}px;"
				bind:this={formContainer}
			>
				<!-- Sign up form -->
				<form
					class="flex w-full flex-col gap-6 p-6 rounded-xl bg-neutral-200 text-neutral-900"
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
					<h1 class="text-3xl font-bold text-inherit">Sign up</h1>
					<Input
						id="username"
						class="bg-neutral-300 placeholder:text-neutral-600 text-neutral-800"
						placeholder="Username"
						tabindex={formIndex === 0 ? 0 : -1}
					/>
					<Input
						id="password"
						class="bg-neutral-300 placeholder:text-neutral-600 text-neutral-800"
						type="password"
						placeholder="Password"
						tabindex={formIndex === 0 ? 0 : -1}
					/>

					<Button
						disabled={isSendingForm}
						type="submit"
						class="w-full bg-neutral-800"
						tabindex={formIndex === 0 ? 0 : -1}
					>
						{#if isSendingForm}
							<Spinner />
						{/if}
						Sign up
					</Button>
				</form>

				<!-- Log in form -->
				<form
					class="flex w-full flex-col gap-6 p-6 rounded-xl bg-neutral-200 text-neutral-900"
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
					<h1 class="text-3xl font-bold text-inherit">Log in</h1>
					<Input
						id="username"
						class="bg-neutral-300 placeholder:text-neutral-600 text-neutral-800"
						placeholder="Username"
						tabindex={formIndex === 1 ? 0 : -1}
					/>
					<Input
						id="password"
						class="bg-neutral-300 placeholder:text-neutral-600 text-neutral-800"
						type="password"
						placeholder="Password"
						tabindex={formIndex === 1 ? 0 : -1}
					/>

					<Button
						disabled={isSendingForm}
						tabindex={formIndex === 1 ? 0 : -1}
						type="submit"
						class="w-full bg-neutral-800"
					>
						{#if isSendingForm}
							<Spinner />
						{/if}
						Log in
					</Button>
				</form>
			</div>
		</div>
	</div>
</section>

<!-- About -->
<section class="min-h-screen space-y-6 max-w-screen-2xl mx-auto mt-10 w-full p-4" id="about">
	<h1 class="text-4xl lg:text-6xl font-bold text-center">Why Choose Skill Forge?</h1>
	<div class="grid lg:grid-cols-2 w-full min-h-[80vh]">
		<!-- Left column -->
		<div class="flex flex-col">
			<!-- Learn at your own pace section -->
			<div
				class="shrink-0 p-4 lg:p-8 border lg:border-b-0 lg:border-r-0 border-neutral-800/50 flex flex-col gap-4 lg:gap-8 text-center justify-center items-center"
			>
				<Hourglass class="size-16 text-[#ED5D45]" />
				<h2 class="text-4xl font-bold text-neutral-100">Learn at Your Own Pace</h2>
				<p class="font-normal text-base leading-6 font-mono text-neutral-400">
					Whether you're a beginner or an expert, Skill Forge allows you to progress at your own
					pace. Explore bite-sized exercises or dive into complex coding problems.
				</p>
			</div>
			<!-- Free/No ads section -->
			<div
				class="shrink-0 group overflow-hidden relative max-lg:border-y-0 lg:border-b-0 lg:border-r-0 p-4 lg:p-8 border border-neutral-800/50 flex flex-col gap-4 lg:gap-8 text-center justify-center items-center"
			>
				<ShieldBan class="size-16 text-[#3F7DDE]" />
				<h2 class="text-4xl font-bold text-neutral-100">Completely Free, No Ads</h2>
				<p class="font-normal text-base leading-6 font-mono text-neutral-400">
					Skill Forge is a <span class="text-neutral-100 font-semibold">100% free</span> platform with
					no distractions. Focus entirely on your coding journey without any interruptions from ads.
					Learn, practice, and grow without limits.
				</p>
			</div>
			<!-- Get started section -->
			<div
				class="grow relative overflow-hidden lg:border-r-0 group p-6 border border-neutral-800/50 flex flex-col items-center justify-center gap-4"
			>
				<button
					onclick={getStarted}
					class="text-4xl font-bold capitalize relative rounded-full transition-all hover:ring-4 hover:ring-neutral-600/50 py-2 px-4"
				>
					Get Started
					<!-- Moving line -->
					<div
						class="absolute bottom-0 right-2 left-2 h-px [mask-image:linear-gradient(to_right,rgba(217,217,217,0)_0%,#d9d9d9_25%,#d9d9d9_75%,rgba(217,217,217,0)_100%)]"
					>
						<div
							class="h-2 w-full bg-gradient-to-r from-neutral-100/0 via-[#F2B655] to-neutral-100/0"
							style="animation: starlight-right 3s ease-in-out infinite;"
						></div>
					</div>
				</button>
				<!-- Background grid -->
				<svg
					class="absolute -z-10 w-full h-full inset-0 stroke-neutral-800/50 [mask-image:radial-gradient(50%_50%_at_center_center,transparent,white)]"
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
				class="grow p-4 lg:p-8 min-h-[500px] border border-neutral-800/50 max-lg:border-y-0 relative"
			>
				<div
					class="absolute overflow-hidden flex flex-col items-center justify-evenly inset-8 blur-[10px]"
				>
					{#each { length: 3 } as _}
						<h1
							class="text-9xl text-center font-extrabold bg-gradient-to-r from-[#ED5D45] via-[#F2B655] to-[#3FBED8] bg-clip-text text-transparent inline-block select-none"
						>
							Skill
						</h1>
						<h1
							class="text-9xl text-center font-extrabold bg-gradient-to-r from-[#ED5D45] via-[#F2B655] to-[#3FBED8] bg-clip-text text-transparent inline-block select-none"
						>
							Forge
						</h1>
					{/each}
				</div>
				<div class="absolute inset-12 lg:inset-24 flex flex-col items-center justify-center">
					<img
						src="/Star.svg"
						draggable="false"
						class="w-full max-w-[400px] h-full object-contain"
						alt=""
					/>
				</div>
			</div>
			<!-- Two cards side to side -->
			<div class="grid lg:grid-cols-2 w-full shrink-0">
				<div
					class="p-4 lg:p-8 flex flex-col gap-4 border lg:border-t-0 lg:border-r-0 border-neutral-800/50"
				>
					<Zap class="size-16 text-[#3FBED8]" />
					<h1 class="text-2xl font-semibold text-neutral-100">10 + Coding Exercises</h1>
					<p class="text-base leading-6 font-normal font-mono text-neutral-400">
						Practice with a vast collection of coding challenges across various difficulty levels
						and topics.
					</p>
				</div>
				<div
					class="p-4 lg:p-8 flex flex-col gap-4 max-lg:border-t-0 border lg:border-t-0 border-neutral-800/50"
				>
					<Route class="size-16 text-[#F2B655]" />
					<h1 class="text-2xl font-semibold text-neutral-100">Progress Tracking</h1>
					<p class="text-base leading-6 font-normal font-mono text-neutral-400">
						Monitor your progress, identify areas for improvement, and track your coding skills
						growth.
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Footer -->
<footer
	class="flex flex-row gap-12 bg-neutral-200 text-neutral-900 max-w-screen-2xl mx-auto rounded-2xl py-12 px-6 mb-6 w-full"
>
	<p class="text-sm font-mono">© {new Date().getFullYear()} Skill Forge. All rights reserved.</p>
</footer>
1800

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
