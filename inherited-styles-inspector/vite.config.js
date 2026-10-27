import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig( {
	// Relative asset paths so the SAME build works both at the Vercel root and
	// under a subpath (e.g. prototypes.fvm.house/inherited-styles-inspector/).
	// Safe here: the prototype has no client-side routing.
	base: './',
	plugins: [ react() ],
	// Pinned so the port never drifts away from .claude/launch.json.
	server: { port: 5176, strictPort: true },
	resolve: {
		// Prevent duplicate React instances when @wordpress packages internally
		// import their own copy.
		//
		// Note: unlike `editor-header-breadcrumb`, this prototype does NOT need
		// to dedupe `@wordpress/private-apis`/`@wordpress/components` or
		// pre-bundle them. Its menus use the PUBLIC `Menu` from
		// `@wordpress/ui`, so there is no private-APIs lock/unlock to keep on a
		// single module-scoped WeakMap.
		dedupe: [ 'react', 'react-dom', '@wordpress/element' ],
	},
} );
