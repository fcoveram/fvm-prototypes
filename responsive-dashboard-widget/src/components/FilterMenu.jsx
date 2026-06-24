import { privateApis as componentsPrivateApis } from '@wordpress/components';
import { __dangerousOptInToUnstableAPIsOnlyForCoreModules } from '@wordpress/private-apis';

// `Menu` is a 🔒 private API of `@wordpress/components` (the new Ariakit-based menu that
// supersedes `DropdownMenu`). Opt in the same way a core editor package would — the
// module name must be an allow-listed core module and the consent string is verbatim.
// Storybook: https://wordpress.github.io/gutenberg/?path=/story/components-menu--with-radios
const { unlock } = __dangerousOptInToUnstableAPIsOnlyForCoreModules(
	'I acknowledge private features are not for use in themes or plugins and doing so will break in the next version of WordPress.',
	'@wordpress/editor'
);
const { Menu } = unlock( componentsPrivateApis );

// At Micro/Small the content controls collapse behind the filter icon button: clicking it
// opens a menu with two radio sections (metric + period). `Menu.TriggerButton render={...}`
// makes the supplied filter button the menu's trigger/anchor. Radios keep the menu open
// on selection (hideOnClick defaults to false).
export default function FilterMenu( {
	trigger,
	metric,
	setMetric,
	period,
	setPeriod,
	metrics,
	periods,
} ) {
	return (
		<Menu placement="bottom-end">
			<Menu.TriggerButton render={ trigger } />
			<Menu.Popover>
				<Menu.Group>
					<Menu.GroupLabel>Metric</Menu.GroupLabel>
					{ metrics.map( ( o ) => (
						<Menu.RadioItem
							key={ o.value }
							name="metric"
							value={ o.value }
							checked={ metric === o.value }
							onChange={ () => setMetric( o.value ) }
						>
							<Menu.ItemLabel>{ o.label }</Menu.ItemLabel>
						</Menu.RadioItem>
					) ) }
				</Menu.Group>
				<Menu.Group>
					<Menu.GroupLabel>Time period</Menu.GroupLabel>
					{ periods.map( ( o ) => (
						<Menu.RadioItem
							key={ o.value }
							name="period"
							value={ o.value }
							checked={ period === o.value }
							onChange={ () => setPeriod( o.value ) }
						>
							<Menu.ItemLabel>{ o.label }</Menu.ItemLabel>
						</Menu.RadioItem>
					) ) }
				</Menu.Group>
			</Menu.Popover>
		</Menu>
	);
}
