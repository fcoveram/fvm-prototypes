<?php
/**
 * Plugin Name:       Inherited styles indicator
 * Description:       Shows a diamond next to block style controls while the value is inherited from Styles, the block's styles in Styles → Blocks, or a parent block.
 * Version:           0.9.0
 * Requires at least: 7.1
 * Requires PHP:      7.4
 * Author:            Francisco Vera
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       inherited-styles-indicator
 */

defined( 'ABSPATH' ) || exit;

add_action(
	'enqueue_block_editor_assets',
	function () {
		// Turn on core's experimental Styles inheritance UI: controls display
		// the value resolved from Styles when the block has no value of its own.
		wp_add_inline_script(
			'wp-block-editor',
			'window.__experimentalGlobalStylesInheritanceUI = true;',
			'before'
		);

		// Make every style control optional (see supports.js). Inline so it runs
		// before any block type is registered.
		wp_add_inline_script( 'wp-blocks', file_get_contents( __DIR__ . '/supports.js' ) );

		$ver = filemtime( __DIR__ . '/editor.js' );

		wp_enqueue_script(
			'inherited-styles-editor',
			plugins_url( 'editor.js', __FILE__ ),
			array( 'wp-data', 'wp-blocks', 'wp-block-editor', 'wp-components', 'wp-core-data', 'wp-dom-ready', 'wp-element', 'wp-primitives' ),
			$ver,
			true
		);

		wp_enqueue_style(
			'inherited-styles-editor',
			plugins_url( 'editor.css', __FILE__ ),
			array(),
			filemtime( __DIR__ . '/editor.css' )
		);
	}
);
