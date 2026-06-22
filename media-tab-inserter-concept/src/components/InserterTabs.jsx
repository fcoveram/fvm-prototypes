import { Button } from '@wordpress/components';
import { close } from '@wordpress/icons';

const TABS = [
	[ 'blocks', 'Blocks' ],
	[ 'patterns', 'Patterns' ],
	[ 'media', 'Media' ],
];

/*
 * The inserter's top row: the Blocks / Patterns / Media tablist plus a close (✕)
 * button on the same row. Built as a custom tablist (rather than the DS TabPanel)
 * so the close button can sit as a true sibling on the row and the tab content
 * can live outside — while keeping proper tab/tablist roles and roving tabindex.
 */
export default function InserterTabs( { active, onChange, onClose } ) {
	return (
		<div className="inserter-tabs">
			<div
				className="inserter-tabs__list"
				role="tablist"
				aria-label="Inserter"
			>
				{ TABS.map( ( [ id, label ] ) => (
					<button
						key={ id }
						type="button"
						role="tab"
						id={ `inserter-tab-${ id }` }
						aria-selected={ active === id }
						aria-controls={ `inserter-panel-${ id }` }
						tabIndex={ active === id ? 0 : -1 }
						className={ `inserter-tabs__tab${
							active === id ? ' is-active' : ''
						}` }
						onClick={ () => onChange( id ) }
					>
						{ label }
					</button>
				) ) }
			</div>
			<Button
				className="inserter-tabs__close"
				icon={ close }
				label="Close inserter"
				onClick={ onClose }
			/>
		</div>
	);
}
