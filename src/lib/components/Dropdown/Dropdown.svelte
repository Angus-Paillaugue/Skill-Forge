<script>
	import { setContext } from 'svelte';
	import { accordion } from '$lib/utils';
	import { cn } from '$lib/utils';

	let {
		open = $bindable(false),
		children,
		items,
		position = 'bottom',
		align = 'center',
		class: className,
		...restProps
	} = $props();

	/**
	 * Toggles the state of the dropdown.
	 */
	const toggle = () => (open = !open);

	/**
	 * Handles the click event on the window.
	 *
	 * @param {Event} event - The click event.
	 */
	function onWindowClickHandler(event) {
		if (!event.target.closest('.dropdown')) open = false;
	}

	/**
	 * Handles the keydown event on the window.
	 *
	 * @param {Event} event - The keydown event object.
	 */
	function onWindowKeydownHandler(event) {
		if (event.key === 'Escape') open = false;
	}

	/**
	 * Sets the tab index for the dropdown component.
	 */
	function setTabIndex() {
		const newTabIndex = open ? 0 : -1;
		const dropdown = document.querySelector('.dropdown');
		const listElements = dropdown.querySelectorAll('.dropdown-item');
		listElements.forEach((el) => {
			el.setAttribute('tabindex', newTabIndex);
		});
	}

	// Set the context for the trigger to be able to toggle the dropdown
	setContext('dropdown', { open, toggle });

	// Set the tab index for the dropdown items
	$effect(setTabIndex);

	// Position classes for the dropdown
	const positionClasses = {
		top: {
			pos: 'bottom-full mb-2',
			align: {
				start: 'left-0',
				center: 'left-1/2 -translate-x-1/2',
				end: 'right-0'
			}
		},
		bottom: {
			pos: 'top-full mt-2',
			align: {
				start: 'left-0',
				center: 'left-1/2 -translate-x-1/2',
				end: 'right-0'
			}
		},
		left: {
			pos: 'right-full mr-2',
			align: {
				start: 'top-0',
				center: 'top-1/2 -translate-y-1/2',
				end: 'bottom-0'
			}
		},
		right: {
			pos: 'left-full ml-2',
			align: {
				start: 'top-0',
				center: 'top-1/2 -translate-y-1/2',
				end: 'bottom-0'
			}
		}
	};
</script>

<svelte:window onclick={onWindowClickHandler} onkeydown={onWindowKeydownHandler} />

<div class={cn('dropdown relative w-fit', className)} {...restProps}>
	{@render children()}

	<div
		class={cn(
			'absolute z-30 w-[310px] rounded-xl border border-neutral-700/50 bg-neutral-800/50 text-neutral-100 backdrop-blur-md',
			positionClasses[position].pos,
			positionClasses[position].align[align]
		)}
		style="height: 0; overflow: hidden; border: 0px;"
		use:accordion={open}
	>
		<div class="flex flex-col">
			{@render items()}
		</div>
	</div>
</div>
