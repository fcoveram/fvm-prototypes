import { Button } from '@wordpress/ui';

// The four prototype variants shown above the grid. "Full responsive" is the active
// default; the others switch the active state but share its behavior for now (their
// distinct per-zone behavior is defined in later iterations).
const OPTIONS = [
	{ value: 'full', label: 'Full responsive' },
	{ value: 'header', label: 'Header' },
	{ value: 'content', label: 'Content' },
	{ value: 'footer', label: 'Footer' },
];

export default function ControlsBar( { variant, onChange } ) {
	return (
		<div className="controls-bar" role="group" aria-label="Prototype variant">
			{ OPTIONS.map( ( opt ) => {
				const isActive = variant === opt.value;
				// @wordpress/ui Button: the selected variant is solid; the rest are
				// "minimal" — both in the brand tone, per the design.
				return (
					<Button
						key={ opt.value }
						variant={ isActive ? 'solid' : 'minimal' }
						tone="brand"
						onClick={ () => onChange( opt.value ) }
					>
						{ opt.label }
					</Button>
				);
			} ) }
		</div>
	);
}
