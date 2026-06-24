import { useState } from 'react';
import {
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	Button,
	SelectControl,
	__experimentalHStack as HStack,
} from '@wordpress/components';
import { moreVertical } from '@wordpress/icons';
import WidgetContent from './WidgetContent.jsx';
import FilterMenu from './FilterMenu.jsx';

// A "filter" glyph drawn as decreasing horizontal lines, matching the Figma header.
// (The @wordpress/icons `filter` glyph is a half-filled triangle, which reads differently.)
const filterLines = (
	<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
		<rect x="4" y="6.2" width="16" height="1.6" rx="0.8" fill="currentColor" />
		<rect x="6.5" y="11.2" width="11" height="1.6" rx="0.8" fill="currentColor" />
		<rect x="9" y="16.2" width="6" height="1.6" rx="0.8" fill="currentColor" />
	</svg>
);

// Dumb options for the header content controls.
const PERIODS = [
	{ label: 'Last 7 days', value: '7' },
	{ label: 'Last 30 days', value: '30' },
	{ label: 'Last 90 days', value: '90' },
];
const METRICS = [
	{ label: 'By views', value: 'views' },
	{ label: 'By visitors', value: 'visitors' },
];

// A self-contained dashboard widget: Header / Content / Footer. The content zone fills the
// available height so the footer stays pinned to the bottom; the widget is fully white (no
// header/footer dividers). What changes per tier (per the Figma "Full responsive widget"):
//   - Header: at Micro/Small the content controls collapse to a filter icon button that
//     opens a radio menu, alongside settings; at Medium+ they expand to two SelectControls.
//   - Footer: button fills width at Micro/Small; fits its label (right-aligned) at Medium+.
//   - Content: builder-defined; grows from a glanceable stat up to a multi-column view.
export default function Widget( { tier } ) {
	const [ period, setPeriod ] = useState( '7' );
	const [ metric, setMetric ] = useState( 'views' );

	const minimal = tier.controls === 'minimal';
	const fillFooter = tier.footer === 'fill';

	return (
		<Card className="widget" size="small">
			<CardHeader className="widget__header" size="small">
				<h2 className="widget__title">Top locations</h2>
				<HStack className="widget__controls" spacing={ 2 } justify="flex-end" expanded={ false }>
					{ minimal ? (
						// Minimal: filter icon button opens a radio menu of the controls.
						<FilterMenu
							metric={ metric }
							setMetric={ setMetric }
							period={ period }
							setPeriod={ setPeriod }
							metrics={ METRICS }
							periods={ PERIODS }
							trigger={
								<Button
									className="widget__icon"
									icon={ filterLines }
									label="Filter"
									__next40pxDefaultSize
								/>
							}
						/>
					) : (
						// Full: all content controls — metric + period selectors.
						<>
							<SelectControl
								className="widget__control widget__control--metric"
								__nextHasNoMarginBottom
								__next40pxDefaultSize
								hideLabelFromVision
								label="Metric"
								value={ metric }
								options={ METRICS }
								onChange={ setMetric }
							/>
							<SelectControl
								className="widget__control widget__control--period"
								__nextHasNoMarginBottom
								__next40pxDefaultSize
								hideLabelFromVision
								label="Time period"
								value={ period }
								options={ PERIODS }
								onChange={ setPeriod }
							/>
						</>
					) }
					{ /* Settings action is always visible, at every size. */ }
					<Button
						className="widget__icon"
						icon={ moreVertical }
						label="Widget settings"
						__next40pxDefaultSize
					/>
				</HStack>
			</CardHeader>

			<CardBody className="widget__body" size="small">
				<WidgetContent tier={ tier } />
			</CardBody>

			<CardFooter
				className={ `widget__footer ${ fillFooter ? 'is-fill' : 'is-fit' }` }
				size="small"
				justify={ fillFooter ? 'center' : 'flex-end' }
			>
				<Button className="widget__cta" variant="secondary" __next40pxDefaultSize>
					View all
				</Button>
			</CardFooter>
		</Card>
	);
}
