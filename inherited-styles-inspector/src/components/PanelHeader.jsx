/**
 * PanelHeader
 *
 * A replacement for `ToolsPanel`'s own header: the panel's title plus TWO 24px
 * header buttons — the new diamond "style origins" trigger and the existing ⋮
 * tools menu.
 *
 * Why replace it rather than extend it: the stock header hard-codes the reset
 * items this proof of concept moves out of the ⋮ menu, and there is no prop to
 * remove them. Driving the stock one from outside is not possible either —
 * `ToolsPanelContext` publishes `menuItems` but not `toggleItem`, which
 * `useToolsPanel` hands straight to the header it renders. So the panel is
 * rendered with no `label` (which makes `ToolsPanelHeader` return `null`) and
 * this sits above it. The design does the same thing: its `_ToolsPanel/Header`
 * frame is a replacement header, not the stock one.
 *
 * This component also owns which menu is open. Both menus are controlled from
 * one piece of state, so opening either closes the other and only one is ever
 * on screen — they overlap, since both fly out from the same edge.
 *
 * Figma: node 796:3638.
 */

import { useState } from 'react';
import { __experimentalHeading as Heading } from '@wordpress/components';
import { Stack } from '@wordpress/ui';

import StyleOriginsMenu from './StyleOriginsMenu.jsx';
import ToolsMenu from './ToolsMenu.jsx';

export default function PanelHeader( {
	anchor,
	localStyles,
	inheritedStyles,
	visibleTools,
	onReset,
	onResetAll,
	onEdit,
	onToggleTool,
} ) {
	// 'origins' | 'tools' | null — one menu at a time.
	const [ openMenu, setOpenMenu ] = useState( null );
	const toggle = ( menu ) => ( isOpen ) =>
		setOpenMenu( isOpen ? menu : null );

	return (
		<Stack
			className="inspector-panel__header"
			direction="row"
			align="center"
			justify="space-between"
		>
			<Heading
				className="inspector-panel__title"
				level={ 2 }
				size={ 13 }
				weight={ 500 }
			>
				Typography
			</Heading>
			<Stack
				className="inspector-panel__actions"
				direction="row"
				align="center"
				gap="xs"
			>
				<StyleOriginsMenu
					anchor={ anchor }
					isOpen={ openMenu === 'origins' }
					onOpenChange={ toggle( 'origins' ) }
					localStyles={ localStyles }
					inheritedStyles={ inheritedStyles }
					onReset={ onReset }
					onResetAll={ onResetAll }
					onEdit={ onEdit }
				/>
				<ToolsMenu
					anchor={ anchor }
					isOpen={ openMenu === 'tools' }
					onOpenChange={ toggle( 'tools' ) }
					visibleTools={ visibleTools }
					onToggleTool={ onToggleTool }
				/>
			</Stack>
		</Stack>
	);
}
