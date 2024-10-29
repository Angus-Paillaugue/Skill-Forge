<script>
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { backOut } from 'svelte/easing';
	import { cn } from '$lib/utils';

	const {
		children,
		content,
		position = 'top',
		class: className,
		delay = 300,
		...restProps
	} = $props();

	let isHovered = $state(false);
	let tooltipCoords = $state({ x: 0, y: 0, width: 0 });
	let tooltip = $state();
	let tooltipContent = $state();
	let delayTimeout = $state();
	let hideTimeout = $state();

	/**
	 * Show the tooltip.
	 */
	const showTooltip = () => {
		clearTimeout(hideTimeout);
		if (!isHovered) {
			clearTimeout(delayTimeout);
			delayTimeout = setTimeout(() => {
				isHovered = true;
			}, delay);
		}
		const rect = tooltip.getBoundingClientRect();

		tooltipCoords = {
			x: rect.left + window.scrollX,
			y: rect.top + window.scrollY,
			width: rect.width,
			height: rect.height
		};
	};

	/**
	 * Hides the tooltip.
	 */
	const hideTooltip = () => {
		clearTimeout(delayTimeout);
		hideTimeout = setTimeout(() => {
			isHovered = false;
		}, 100); // Small delay to handle quick mouse movements
	};

	onMount(() => {
		tooltip.addEventListener('mouseenter', showTooltip);
		tooltip.addEventListener('mouseleave', hideTooltip);
		tooltip.addEventListener('focus', showTooltip);
		tooltip.addEventListener('blur', hideTooltip);
		tooltip.addEventListener('click', showTooltip);

		// Hide tooltip when clicking outside of it
		document.addEventListener('click', (e) => {
			if (!tooltip) return;
			if (isHovered && !tooltip.contains(e.target) && !tooltipContent.contains(e.target))
				hideTooltip();
		});

		window.addEventListener('scroll', hideTooltip);
		window.addEventListener('resize', hideTooltip);
		window.onmousemove = (e) => {
			if (isHovered && !tooltip.contains(e.target) && !tooltipContent.contains(e.target)) {
				hideTooltip();
			}
		};

		return () => {
			tooltip.removeEventListener('mouseenter', showTooltip);
			tooltip.removeEventListener('mouseleave', hideTooltip);
			tooltip.removeEventListener('focus', showTooltip);
			tooltip.removeEventListener('blur', hideTooltip);
			tooltip.removeEventListener('click', showTooltip);
			document.removeEventListener('click', hideTooltip);
			window.removeEventListener('scroll', hideTooltip);
			window.removeEventListener('resize', hideTooltip);
			window.onmousemove = null;
		};
	});

	/**
	 * Retrieves the styles for the Tooltip component.
	 *
	 * @returns {Object} The styles object.
	 */
	const getStyles = () => {
		if (!tooltip) return;
		const tooltipRect = tooltip.getBoundingClientRect();
		const top = tooltipRect.y;
		const left = tooltipRect.x;

		if (position === 'top') {
			return `top: ${top}px; left: ${left + tooltipCoords.width / 2}px;`;
		} else if (position === 'bottom') {
			return `top: ${top + tooltipCoords.height}px; left: ${left + tooltipCoords.width / 2}px;`;
		} else if (position === 'left') {
			return `top: ${top + tooltipCoords.height / 2}px; left: ${left}px;`;
		} else if (position === 'right') {
			return `top: ${top + tooltipCoords.height / 2}px; left: ${left + tooltipCoords.width}px;`;
		}
	};
	const positionClasses = {
		top: '-translate-y-full -translate-x-1/2',
		bottom: '-translate-x-1/2',
		left: '-translate-x-full -translate-y-1/2',
		right: '-translate-y-1/2'
	};

	// Animation of the tooltip
	const FLY_AMOUNT = 3;
	const flyOptions = {
		y: position === 'top' ? FLY_AMOUNT : position === 'bottom' ? -FLY_AMOUNT : 0,
		x: position === 'left' ? FLY_AMOUNT : position === 'right' ? -FLY_AMOUNT : 0,
		duration: 200,
		easing: backOut
	};
</script>

<div
	name="Open tooltip"
	aria-label="Open tooltip"
	class={cn(className)}
	{...restProps}
	bind:this={tooltip}
>
	{@render children()}
</div>

{#if isHovered}
	<div
		class={cn('fixed z-40 w-max max-w-[250px] p-2', positionClasses[position])}
		style={getStyles()}
		transition:fly={flyOptions}
		role="tooltip"
		bind:this={tooltipContent}
		onmouseleave={hideTooltip}
	>
		<div
			class="pointer-events-none relative gap-2 rounded-lg border border-neutral-700 bg-neutral-800 p-2 text-sm text-neutral-400"
		>
			{@html content}
		</div>
	</div>
{/if}
