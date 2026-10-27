( function () {
	document.addEventListener( 'DOMContentLoaded', function () {
		var settingsMenu = document.getElementById( 'menu-settings' );
		if ( ! settingsMenu ) {
			return;
		}

		var adminMenu = document.getElementById( 'adminmenu' );
		if ( ! adminMenu ) {
			return;
		}

		// Settings sub-pages definition.
		var settingsPages = [
			{ label: 'General', href: 'options-general.php' },
			{ label: 'Writing', href: 'options-writing.php' },
			{ label: 'Reading', href: 'options-reading.php' },
			{ label: 'Discussion', href: 'options-discussion.php' },
			{ label: 'Media', href: 'options-media.php' },
			{ label: 'Permalinks', href: 'options-permalink.php' },
			{ label: 'Privacy', href: 'options-privacy.php' },
		];

		var currentPage = window.location.pathname.split( '/' ).pop() +
			window.location.search;

		// Build drilldown items (not yet in DOM).
		var drilldownItems = [];

		// Back button as an <li>.
		var backLi = document.createElement( 'li' );
		backLi.className = 'nls-back-button';
		backLi.innerHTML =
			'<a href="#" role="button">' +
				'<div class="wp-menu-image">' +
					'<span class="dashicons dashicons-arrow-left-alt2"></span>' +
				'</div>' +
				'<div class="wp-menu-name">Back</div>' +
			'</a>';
		drilldownItems.push( backLi );

		// Settings page items as <li>.
		settingsPages.forEach( function ( page ) {
			var li = document.createElement( 'li' );
			li.className = 'nls-settings-item';
			if ( currentPage.indexOf( page.href ) !== -1 ) {
				li.classList.add( 'nls-current' );
			}
			li.innerHTML =
				'<a href="' + page.href + '">' +
					'<div class="wp-menu-name">' + page.label + '</div>' +
				'</a>';
			drilldownItems.push( li );
		} );

		// Store original menu children.
		var originalItems = Array.prototype.slice.call( adminMenu.children );

		function isFolded() {
			return document.body.classList.contains( 'folded' ) ||
				( document.body.classList.contains( 'auto-fold' ) &&
				window.innerWidth <= 960 );
		}

		function showPanel() {
			if ( isFolded() ) {
				return;
			}
			// Hide all original items.
			originalItems.forEach( function ( item ) {
				item.style.display = 'none';
			} );
			// Append drilldown items.
			drilldownItems.forEach( function ( item ) {
				adminMenu.appendChild( item );
			} );
		}

		function hidePanel() {
			// Remove drilldown items.
			drilldownItems.forEach( function ( item ) {
				if ( item.parentNode === adminMenu ) {
					adminMenu.removeChild( item );
				}
			} );
			// Restore original items.
			originalItems.forEach( function ( item ) {
				item.style.display = '';
			} );
		}

		// Intercept Settings top-level click.
		var settingsLink = settingsMenu.querySelector( 'a.menu-top' );
		if ( settingsLink ) {
			settingsLink.addEventListener( 'click', function ( e ) {
				if ( isFolded() ) {
					return;
				}
				e.preventDefault();
				showPanel();
			} );
		}

		// Back button click.
		backLi.querySelector( 'a' ).addEventListener( 'click', function ( e ) {
			e.preventDefault();
			hidePanel();
		} );

		// Auto-open panel when on a Settings sub-page.
		var isSettingsPage = settingsPages.some( function ( page ) {
			return currentPage.indexOf( page.href ) !== -1;
		} );
		if ( isSettingsPage && ! isFolded() ) {
			showPanel();
		}
	} );
} )();
