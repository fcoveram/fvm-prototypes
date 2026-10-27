/**
 * TypographyPanel
 *
 * The Styles tab's Typography ToolsPanel. The controls mirror the ones core's
 * own typography panel renders (`block-editor/src/components/global-styles/
 * typography-panel.tsx`), including the Color row — which really does live
 * inside the Typography panel in current trunk, flush at the top, and is not an
 * invention of the design.
 *
 * Nothing here persists a value anywhere. Each control is live so the panel
 * feels real, but the only consequence of changing one is that its style's
 * origin moves from "Inherited" to "On this block" (product condition 8).
 *
 * Two implementation notes:
 *
 *  - The panel is rendered with NO `label`, which makes `ToolsPanelHeader`
 *    return `null`, so `PanelHeader` above it is the header. See PanelHeader.
 *  - Every rendered item passes `isShownByDefault`. Visibility is owned by
 *    `visibleTools` out in StylesTab, and `ToolsPanelItem` only renders its
 *    children when the panel's *internal* bookkeeping agrees — an item marked
 *    optional resolves to `menuItems.optional[ label ] === false` and renders
 *    nothing at all. Since the panel's own header is gone, nothing else reads
 *    that default/optional grouping, so telling it "shown by default" for the
 *    items we have chosen to render is both accurate and the only thing that
 *    works.
 *
 * Figma: node 796:3362.
 */

import {
	ColorIndicator,
	ColorPalette,
	Dropdown,
	FontSizePicker,
	RangeControl,
	SelectControl,
	ToggleControl,
	__experimentalHStack as HStack,
	__experimentalItem as Item,
	__experimentalItemGroup as ItemGroup,
	__experimentalNumberControl as NumberControl,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';
import {
	formatCapitalize,
	formatLowercase,
	formatStrikethrough,
	formatUnderline,
	formatUppercase,
	reset,
	textHorizontal,
	textVertical,
} from '@wordpress/icons';

import {
	APPEARANCES,
	COLOR_PALETTE,
	FONT_FAMILIES,
	FONT_SIZES,
} from '../data/styles.js';

const PANEL_ID = 'inherited-styles-typography';

export default function TypographyPanel( {
	values,
	isSetLocally,
	visibleTools,
	onSetStyle,
	onResetStyle,
	onResetAll,
} ) {
	// Shared props for every item: the panel reads `hasValue` to decide whether
	// a style counts as set, and calls `onDeselect` when it is cleared.
	const itemProps = ( key, label ) => ( {
		panelId: PANEL_ID,
		label,
		hasValue: () => isSetLocally( key ),
		onDeselect: () => onResetStyle( key ),
		isShownByDefault: true,
	} );

	const shows = ( tool ) => visibleTools.includes( tool );
	const set = ( key ) => ( value ) => onSetStyle( key, value );

	return (
		<ToolsPanel
			className="inspector-panel__tools"
			panelId={ PANEL_ID }
			resetAll={ onResetAll }
			__experimentalFirstVisibleItemClass="first"
		>
			{ shows( 'Color' ) && (
				<ToolsPanelItem
					{ ...itemProps( 'textColor', 'Color' ) }
					className="inspector-panel__color-item"
				>
					<ItemGroup isBordered isSeparated>
						<Dropdown
							className="inspector-color"
							contentClassName="inspector-color__popover"
							popoverProps={ {
								placement: 'left-start',
								offset: 36,
								shift: true,
							} }
							renderToggle={ ( { isOpen, onToggle } ) => (
								<Item
									onClick={ onToggle }
									aria-expanded={ isOpen }
									aria-haspopup="true"
								>
									<HStack justify="flex-start">
										<ColorIndicator
											colorValue={
												values.textColor
											}
										/>
										<span>Color</span>
									</HStack>
								</Item>
							) }
							renderContent={ () => (
								<ColorPalette
									colors={ COLOR_PALETTE }
									value={ values.textColor }
									onChange={ set( 'textColor' ) }
									clearable={ false }
								/>
							) }
						/>
					</ItemGroup>
				</ToolsPanelItem>
			) }

			{ shows( 'Font' ) && (
				<ToolsPanelItem { ...itemProps( 'fontFamily', 'Font' ) }>
					<SelectControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label="Font"
						value={ values.fontFamily }
						options={ FONT_FAMILIES }
						onChange={ set( 'fontFamily' ) }
					/>
				</ToolsPanelItem>
			) }

			{ shows( 'Size' ) && (
				<ToolsPanelItem { ...itemProps( 'fontSize', 'Size' ) }>
					<FontSizePicker
						__next40pxDefaultSize
						fontSizes={ FONT_SIZES }
						value={ values.fontSize }
						onChange={ set( 'fontSize' ) }
						withReset={ false }
					/>
				</ToolsPanelItem>
			) }

			{ shows( 'Appearance' ) && (
				<ToolsPanelItem
					{ ...itemProps( 'fontWeight', 'Appearance' ) }
				>
					<SelectControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label="Appearance"
						value={ values.fontWeight }
						options={ APPEARANCES }
						onChange={ set( 'fontWeight' ) }
					/>
				</ToolsPanelItem>
			) }

			{ shows( 'Line height' ) && (
				<ToolsPanelItem
					{ ...itemProps( 'lineHeight', 'Line height' ) }
					className="inspector-panel__half"
				>
					<NumberControl
						__next40pxDefaultSize
						label="Line height"
						value={ values.lineHeight }
						min={ 0 }
						step={ 0.1 }
						spinControls="custom"
						onChange={ set( 'lineHeight' ) }
					/>
				</ToolsPanelItem>
			) }

			{ shows( 'Letter spacing' ) && (
				<ToolsPanelItem
					{ ...itemProps( 'letterSpacing', 'Letter spacing' ) }
					className="inspector-panel__half"
				>
					<UnitControl
						__next40pxDefaultSize
						label="Letter spacing"
						value={ values.letterSpacing }
						onChange={ set( 'letterSpacing' ) }
					/>
				</ToolsPanelItem>
			) }

			{ shows( 'Line indent' ) && (
				<ToolsPanelItem
					{ ...itemProps( 'textIndent', 'Line indent' ) }
				>
					<HStack
						className="inspector-panel__indent"
						alignment="flex-end"
					>
						<UnitControl
							__next40pxDefaultSize
							label="Line indent"
							value={ values.textIndent }
							onChange={ set( 'textIndent' ) }
						/>
						<RangeControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label="Line indent"
							hideLabelFromVision
							withInputField={ false }
							value={ parseFloat( values.textIndent ) || 0 }
							min={ 0 }
							max={ 100 }
							onChange={ ( next ) =>
								onSetStyle( 'textIndent', `${ next }px` )
							}
						/>
					</HStack>
				</ToolsPanelItem>
			) }

			{ shows( 'Columns' ) && (
				<ToolsPanelItem
					{ ...itemProps( 'textColumns', 'Columns' ) }
					className="inspector-panel__half"
				>
					<NumberControl
						__next40pxDefaultSize
						label="Columns"
						value={ values.textColumns }
						min={ 1 }
						max={ 6 }
						spinControls="custom"
						onChange={ ( next ) =>
							onSetStyle( 'textColumns', Number( next ) )
						}
					/>
				</ToolsPanelItem>
			) }

			{ shows( 'Decoration' ) && (
				<ToolsPanelItem
					{ ...itemProps( 'textDecoration', 'Decoration' ) }
					className="inspector-panel__half"
				>
					<ToggleGroupControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label="Decoration"
						value={ values.textDecoration }
						isBlock
						onChange={ set( 'textDecoration' ) }
					>
						<ToggleGroupControlOptionIcon
							value="none"
							icon={ reset }
							label="None"
						/>
						<ToggleGroupControlOptionIcon
							value="underline"
							icon={ formatUnderline }
							label="Underline"
						/>
						<ToggleGroupControlOptionIcon
							value="line-through"
							icon={ formatStrikethrough }
							label="Strikethrough"
						/>
					</ToggleGroupControl>
				</ToolsPanelItem>
			) }

			{ shows( 'Orientation' ) && (
				<ToolsPanelItem
					{ ...itemProps( 'writingMode', 'Orientation' ) }
				>
					<ToggleGroupControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label="Orientation"
						value={ values.writingMode }
						onChange={ set( 'writingMode' ) }
					>
						<ToggleGroupControlOptionIcon
							value="horizontal-tb"
							icon={ textHorizontal }
							label="Horizontal"
						/>
						<ToggleGroupControlOptionIcon
							value="vertical-rl"
							icon={ textVertical }
							label="Vertical"
						/>
					</ToggleGroupControl>
				</ToolsPanelItem>
			) }

			{ shows( 'Letter case' ) && (
				<ToolsPanelItem
					{ ...itemProps( 'textTransform', 'Letter case' ) }
				>
					<ToggleGroupControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label="Letter case"
						value={ values.textTransform }
						onChange={ set( 'textTransform' ) }
					>
						<ToggleGroupControlOptionIcon
							value="none"
							icon={ reset }
							label="None"
						/>
						<ToggleGroupControlOptionIcon
							value="uppercase"
							icon={ formatUppercase }
							label="Uppercase"
						/>
						<ToggleGroupControlOptionIcon
							value="lowercase"
							icon={ formatLowercase }
							label="Lowercase"
						/>
						<ToggleGroupControlOptionIcon
							value="capitalize"
							icon={ formatCapitalize }
							label="Capitalize"
						/>
					</ToggleGroupControl>
				</ToolsPanelItem>
			) }

			{ shows( 'Drop cap' ) && (
				<ToolsPanelItem { ...itemProps( 'dropCap', 'Drop cap' ) }>
					<ToggleControl
						__nextHasNoMarginBottom
						label="Drop cap"
						checked={ !! values.dropCap }
						help="Show a large initial letter."
						onChange={ set( 'dropCap' ) }
					/>
				</ToolsPanelItem>
			) }

			{ shows( 'Fit text' ) && (
				<ToolsPanelItem { ...itemProps( 'fitText', 'Fit text' ) }>
					<ToggleControl
						__nextHasNoMarginBottom
						label="Fit text"
						checked={ !! values.fitText }
						help="The text will resize to fit its container, resetting other font size settings."
						onChange={ set( 'fitText' ) }
					/>
				</ToolsPanelItem>
			) }
		</ToolsPanel>
	);
}
