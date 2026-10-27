/**
 * ToolsMenu
 *
 * The panel header's ⋮ menu — and the half of the proof of concept that is a
 * *subtraction*. In today's block editor this menu does two jobs at once: it
 * shows and hides tools, and it resets values ("Reset padding", "Hide and reset
 * padding", "Reset all"). Here it does one: show and hide. Every reset
 * affordance has moved into the "Style origins" menu next door, where the
 * origin a reset returns a style to is actually visible.
 *
 * Hiding a tool does NOT clear its value, which is the other departure from
 * core. A style set on the block whose control is hidden simply stops being
 * listed, since both groups of the origins menu are filtered to visible tools.
 *
 * Built strictly to the documented composition of the new `Menu`
 * (`@wordpress/ui`): `Menu.Root` wraps one `Menu.Trigger` and one
 * `Menu.Popup`; `Menu.Popup` takes its placement through a `positioner`
 * element rather than nesting `Menu.Portal`/`Menu.Positioner` by hand; and
 * every item's children are exactly one `Menu.ItemLabel` (optionally followed
 * by `Menu.ItemDescription`), which is the contract `ItemProps` states.
 *
 * The group label is the panel's own name, matching the editor's menu.
 */

import { Button } from '@wordpress/components';
import { Menu } from '@wordpress/ui';
import { moreVertical } from '@wordpress/icons';

import { ALL_TOOLS, DEFAULT_TOOLS } from '../data/styles.js';
import { flyoutProps } from './flyout.js';

export default function ToolsMenu( {
	anchor,
	isOpen,
	onOpenChange,
	visibleTools,
	onToggleTool,
} ) {
	return (
		<Menu.Root open={ isOpen } onOpenChange={ onOpenChange }>
			<Menu.Trigger
				render={
					// A 24px header control, like the editor's own panel menu.
					// eslint-disable-next-line @wordpress/components-no-missing-40px-size-prop
					<Button
						__next40pxDefaultSize={ false }
						size="small"
						icon={ moreVertical }
						label="Typography options"
					/>
				}
			/>
			<Menu.Popup positioner={ <Menu.Positioner { ...flyoutProps( anchor ) } /> }>
				<Menu.Group>
					<Menu.GroupLabel>Typography</Menu.GroupLabel>
					{ ALL_TOOLS.map( ( tool ) => (
						<Menu.CheckboxItem
							key={ tool }
							checked={ visibleTools.includes( tool ) }
							// Color and Size are the block's default controls;
							// core shows such items checked and inoperable.
							disabled={ DEFAULT_TOOLS.includes( tool ) }
							closeOnClick={ false }
							onCheckedChange={ () => onToggleTool( tool ) }
						>
							<Menu.ItemLabel>{ tool }</Menu.ItemLabel>
						</Menu.CheckboxItem>
					) ) }
				</Menu.Group>
			</Menu.Popup>
		</Menu.Root>
	);
}
