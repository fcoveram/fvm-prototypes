import { DropdownMenu, MenuGroup, MenuItemsChoice } from '@wordpress/components';
import { settings } from '@wordpress/icons';

/*
 * The settings/sliders button beside each search field. Opens a single-select
 * radio menu (MenuItemsChoice renders `menuitemradio` items with a check on the
 * selected row). The first choice is treated as the default, so the toggle reads
 * as "pressed" whenever the content is filtered away from it.
 *
 *   Pinned / Media Library → choices: All · Images · Audio  (default All)
 *   From the web           → choices: Images · Audio        (default Images)
 */
export default function FilterMenu( { choices, value, onChange } ) {
	const isFiltered = value !== choices[ 0 ].value;

	return (
		<DropdownMenu
			className="media-filter"
			icon={ settings }
			label="Filter media"
			toggleProps={ { size: 'compact', isPressed: isFiltered } }
			popoverProps={ { placement: 'bottom-end' } }
		>
			{ ( { onClose } ) => (
				<MenuGroup>
					<MenuItemsChoice
						choices={ choices }
						value={ value }
						onSelect={ ( next ) => {
							onChange( next );
							onClose();
						} }
					/>
				</MenuGroup>
			) }
		</DropdownMenu>
	);
}
