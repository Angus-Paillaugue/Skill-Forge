<script>
	import { enhance } from '$app/forms';
	import { Button, Spinner, Input } from '$lib/components';
	import { newToast } from '$lib/stores';
  import { cn } from '$lib/utils';
  import { spring } from 'svelte/motion';
  import { ArrowBigUpDash, Shapes, ArrowRight } from 'lucide-svelte'
	import { onMount } from 'svelte';

	const { form } = $props();
	let isSendingForm = $state(false);
  let formIndex = $state(0);
  let formSelectContainer = $state();
  let formContainer = $state();
  let carousel = $state();
  let carouselIndex = $state(0);
  let formIndicatorPos = spring(0, {
    stiffness: 0.05,
    damping: 0.25
  });
  let formPos = spring(0, {
    stiffness: 0.05,
    damping: 0.25
  });

	$effect(() => {
		if (form?.error) newToast({ type: 'red', title: 'Error', message: form.error });
	});

  $effect(() => {
    if(!formSelectContainer) return;
    if(formIndex === 0) {
      $formIndicatorPos = 0;
      $formPos = 0;
    }else {
      $formIndicatorPos = formSelectContainer.offsetWidth/2;
      $formPos = formContainer.offsetWidth / -2 - 8;
    }
  });

  onMount(() => {
    carousel.addEventListener('scroll', () => {
      carouselIndex = Math.round(carousel.scrollLeft / carousel.offsetWidth);
    });
  });
</script>

<svelte:head>
  <title>Skill Forge</title>
</svelte:head>

<main class="min-h-screen max-w-screen-xl mx-auto w-full grid grid-cols-1 lg:grid-cols-5 gap-16 px-4 py-10 overflow-hidden">
  <!-- Hero -->
  <div class="lg:col-span-3 justify-center flex flex-col gap-10">
    <!-- Top hero part -->
    <div class="flex flex-col gap-4">
      <!-- Pills -->
      <div class="flex flex-row gap-2 items-center flex-nowrap overflow-x-auto no-scrollbar">
        <div class="rounded-lg bg-blue-600/5 text-blue-600 px-4 py-1 text-sm font-medium capitalize shrink-0">Join Skill Forge</div>
        <div class="rounded-lg bg-green-600/5 text-green-600 px-4 py-1 text-sm font-medium capitalize shrink-0">Start Learning</div>
        <div class="rounded-lg bg-yellow-600/5 text-yellow-600 px-4 py-1 text-sm font-medium capitalize shrink-0">Improve Your Skills</div>
      </div>
      <!-- Main headings -->
      <div class="flex flex-col gap-2">
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold text-wrap-balance">Forge Your Skills, Shape Your Future</h1>
        <h2 class="text-base font-medium text-neutral-400 font-mono">Master coding challenges designed to help you grow. From beginner to expert, Skill Forge guides you through real-world problems with instant feedback and progress tracking.</h2>
      </div>
    </div>

    <!-- Carousel -->
     <div class="relative mt-10 w-full">
       <div class="w-full overflow-x-auto snap-x snap-mandatory no-scrollbar relative" bind:this={carousel}>
         <div class="grid grid-cols-2 max-md:w-[200%]">
           <div class="border border-neutral-800/50 p-4 h-full md:border-r-0 w-full snap-start" data-index="0">
            <ArrowBigUpDash class="size-20 md:size-32 mx-auto text-neutral-300 my-6 md:my-10" />
            <p class="text-neutral-400 italic text-base font-base">
              Whether you're just starting out or you're a seasoned pro, Skill Forge offers exercises that fit your skill level. Choose from beginner, intermediate, and advanced problems to keep pushing your boundaries
             </p>
            </div>
            <div class="border border-neutral-800/50 p-4 h-full w-full snap-start" data-index="0">
              <Shapes class="size-20 md:size-32 mx-auto text-neutral-300 my-6 md:my-10" />
              <p class="text-neutral-400 italic text-base font-base">
                Every step forward counts! Monitor your growth with detailed submission history and rankings. See how you improve with each challenge you complete.
              </p>
            </div>
          </div>
        </div>
        <button onclick={() => {carouselIndex = carouselIndex === 0 ? 1 : 0;carousel.scrollTo({top: 0, left: carouselIndex * carousel.offsetWidth, behavior: "smooth"});}} class={cn("flex md:hidden p-2 absolute right-2 top-2 transition-all flex-col items-center justify-center rounded-full bg-neutral-800", carouselIndex === 1 && 'rotate-180')}>
          <ArrowRight class="size-5" />
        </button>
     </div>
  </div>

  <!-- Forms -->
  <div class="flex flex-col items-center justify-center gap-4 lg:col-span-2">
    <div class="flex flex-col relative w-full" bind:this={formSelectContainer}>
      <div class="w-1/2 bg-neutral-200 absolute top-0 bottom-0 rounded-full" style="left: {$formIndicatorPos}px;"></div>
      <div class="grid grid-cols-2 w-full relative">
        <button aria-label="Change form to Sign up" disabled={isSendingForm} onclick={() => (formIndex = 0)} class={cn("font-semibold p-2 text-lg w-full rounded-full transition-colors", formIndex === 0 ? "text-neutral-900" : "text-neutral-400")}>Sign up</button>
        <button aria-label="Change form to Log up" disabled={isSendingForm} onclick={() => (formIndex = 1)} class={cn("font-semibold p-2 text-lg w-full rounded-full transition-colors", formIndex === 1 ? "text-neutral-900" : "text-neutral-400")}>Log in</button>
      </div>
    </div>
    <div class="overflow-hidden w-full">
      <div class="grid grid-cols-2 gap-4 w-[calc(200%+1rem)]" style="margin-left: {$formPos}px;" bind:this={formContainer}>
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
          <Input id="username" class="bg-neutral-300 placeholder:text-neutral-600 text-neutral-800" placeholder="Username" tabindex={formIndex === 0 ? 0 : -1} />
          <Input id="password" class="bg-neutral-300 placeholder:text-neutral-600 text-neutral-800" type="password" placeholder="Password" tabindex={formIndex === 0 ? 0 : -1} />

          <Button disabled={isSendingForm} type="submit" class="w-full bg-neutral-800" tabindex={formIndex === 0 ? 0 : -1}>
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
          <Input id="username" class="bg-neutral-300 placeholder:text-neutral-600 text-neutral-800" placeholder="Username" tabindex={formIndex === 1 ? 0 : -1} />
          <Input id="password" class="bg-neutral-300 placeholder:text-neutral-600 text-neutral-800" type="password" placeholder="Password" tabindex={formIndex === 1 ? 0 : -1} />

          <Button disabled={isSendingForm} tabindex={formIndex === 1 ? 0 : -1} type="submit" class="w-full bg-neutral-800">
            {#if isSendingForm}
              <Spinner />
            {/if}
            Log in
          </Button>
        </form>
      </div>
    </div>
  </div>
</main>
