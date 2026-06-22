import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig( {
	// Relative asset paths so the SAME build works both at the Vercel root and
	// under a subpath (e.g. prototypes.fvm.house/media-tab-inserter-concept/).
	// Safe here: the prototype has no client-side routing.
	base: './',
	plugins: [ react() ],
	resolve: {
		// Prevent duplicate React instances when @wordpress packages internally
		// import their own copy. This prototype uses only PUBLIC @wordpress
		// component APIs (no private `Menu`/`Tabs` unlock), so — unlike the
		// editor-header-breadcrumb sibling — it does NOT need to dedupe
		// `@wordpress/private-apis`/`@wordpress/components` or pre-bundle them.
		dedupe: [ 'react', 'react-dom', '@wordpress/element' ],
	},
} );
