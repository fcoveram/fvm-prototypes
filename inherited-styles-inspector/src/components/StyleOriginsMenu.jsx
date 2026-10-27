/**
 * StyleOriginsMenu
 *
 * The proof of concept itself: the menu behind the panel header's diamond
 * button, which answers "where does each of these styles actually come from?"
 *
 * Two groups, as designed:
 *
 *   BLOCK STYLES      styles set locally, each with a Reset, plus a Reset all
 *                     on the group's own label row. Absent entirely when
 *                     nothing is set locally — the design's "no block styles"
 *                     state.
 *   INHERITED STYLES  styles coming from Styles, each with an Edit that would
 *                     take you there.
 *
 * Both groups list only styles whose control is currently visible in the panel:
 * the menu inventories what the inspector is showing, whatever each style's
 * origin, and hiding a tool hides its style here too.
 *
 * ROWS ARE NOT `Menu.Item`
 * ────────────────────────
 * A `Menu.Item` *is* the interactive element: it takes the hover highlight and
 * it cannot contain a button, because that would nest one button inside
 * another. The design calls for the opposite — a quiet row with a single real
 * button at its end — so each row is laid out with `Stack` and `Text` and the
 * only interactive thing in it is a WordPress Design System `Button`. The rows
 * are therefore reached with Tab rather than the arrow keys.
 *
 * Everything around the rows is still the documented `Menu` composition:
 * `Menu.Root` → `Menu.Trigger` + `Menu.Popup` (placed via its `positioner`
 * prop), with `Menu.Group`, `Menu.GroupLabel` and `Menu.Separator` inside.
 *
 * Figma: nodes 796:52032 (no block styles) and 796:52033 (with block styles).
 */

import { Button as ComponentsButton } from '@wordpress/components';
import { Button, Menu, Stack, Text } from '@wordpress/ui';

import DiamondIcon from './DiamondIcon.jsx';
import { flyoutProps } from './flyout.js';

/**
 * One row: the style's name, the Global Styles section beneath it when it has
 * one, and the row's single action button.
 */
function OriginRow( { label, description, action, onAction } ) {
	return (
		<Stack
			className="style-origins__row"
			direction="row"
			align="center"
			justify="space-between"
			gap="sm"
		>
			<Stack direction="column" gap="xs">
				{ /* Body/md in the design: 13px regular. */ }
				<Text variant="body-md">{ label }</Text>
				{ description && (
					/* Body/sm in the design: 12px, neutral-weak. */
					<Text
						className="style-origins__source"
						variant="body-sm"
					>
						{ description }
					</Text>
				) }
			</Stack>
			{ /*
			  * The design system's `minimal` Button. Its tokens are exactly the
			  * ones the design uses for this control:
			  * `--wpds-color-foreground-interactive-brand` (#3858e9) on
			  * `--wpds-color-background-interactive-brand-weak` (transparent),
			  * which is what `variant="minimal" tone="brand"` resolves to.
			  * `compact` is the 32px height the design draws
			  * (`wpds-dimension/size/md`).
			  */ }
			<Button
				variant="minimal"
				tone="brand"
				size="compact"
				aria-label={ `${ action } ${ label }` }
				onClick={ onAction }
			>
				{ action }
			</Button>
		</Stack>
	);
}

export default function StyleOriginsMenu( {
	anchor,
	isOpen,
	onOpenChange,
	localStyles,
	inheritedStyles,
	onReset,
	onResetAll,
	onEdit,
} ) {
	const hasLocalStyles = localStyles.length > 0;
	const hasInheritedStyles = inheritedStyles.length > 0;

	return (
		<Menu.Root open={ isOpen } onOpenChange={ onOpenChange }>
			<Menu.Trigger
				render={
					// A 24px header control, matching the panel's ⋮ button.
					// eslint-disable-next-line @wordpress/components-no-missing-40px-size-prop
					<ComponentsButton
						__next40pxDefaultSize={ false }
						size="small"
						icon={ DiamondIcon }
						label="Style origins"
					/>
				}
			/>
			<Menu.Popup
				className="style-origins"
				positioner={ <Menu.Positioner { ...flyoutProps( anchor ) } /> }
			>
				{ hasLocalStyles && (
					<Menu.Group>
						<Stack
							className="style-origins__group-label"
							direction="row"
							align="center"
							justify="space-between"
						>
							<Menu.GroupLabel>Block styles</Menu.GroupLabel>
							<Button
								variant="minimal"
								tone="brand"
								size="compact"
								onClick={ onResetAll }
							>
								Reset all
							</Button>
						</Stack>
						{ localStyles.map( ( style ) => (
							<OriginRow
								key={ style.key }
								label={ style.label }
								action="Reset"
								onAction={ () => onReset( style.key ) }
							/>
						) ) }
					</Menu.Group>
				) }

				{ hasLocalStyles && hasInheritedStyles && <Menu.Separator /> }

				{ hasInheritedStyles && (
					<Menu.Group>
						<Menu.GroupLabel className="style-origins__group-label">
							Inherited styles
						</Menu.GroupLabel>
						{ inheritedStyles.map( ( style ) => (
							<OriginRow
								key={ style.key }
								label={ style.label }
								description={ style.inheritedFrom }
								action="Edit"
								onAction={ () => onEdit( style ) }
							/>
						) ) }
					</Menu.Group>
				) }
			</Menu.Popup>
		</Menu.Root>
	);
}
