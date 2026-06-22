import { useState } from 'react';
import InserterTabs from './InserterTabs.jsx';
import MediaTab from './MediaTab.jsx';

/*
 * The left inserter panel. Holds the active-tab state and renders the matching
 * tab panel below the tab strip. Only the Media tab is built out — Blocks and
 * Patterns show a light placeholder, since this concept is about the Media tab.
 */
export default function InserterSidebar( { onClose } ) {
	const [ activeTab, setActiveTab ] = useState( 'media' );

	return (
		<div className="inserter">
			<InserterTabs
				active={ activeTab }
				onChange={ setActiveTab }
				onClose={ onClose }
			/>
			<div className="inserter__content">
				{ activeTab === 'media' ? (
					<div
						id="inserter-panel-media"
						role="tabpanel"
						aria-labelledby="inserter-tab-media"
					>
						<MediaTab />
					</div>
				) : (
					<div
						id={ `inserter-panel-${ activeTab }` }
						role="tabpanel"
						aria-labelledby={ `inserter-tab-${ activeTab }` }
						className="inserter__placeholder"
					>
						<p>
							The{ ' ' }
							<strong>
								{ activeTab === 'blocks' ? 'Blocks' : 'Patterns' }
							</strong>{ ' ' }
							tab isn’t part of this concept.
						</p>
						<p>
							This prototype explores a redesign of the{ ' ' }
							<strong>Media</strong> tab.
						</p>
					</div>
				) }
			</div>
		</div>
	);
}
