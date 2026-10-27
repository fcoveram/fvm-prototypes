<?php
/**
 * Plugin Name:       New Left Sidebar
 * Plugin URI:        https://github.com/fcoveram/new-left-sidebar
 * Description:       Replaces the wp-admin sidebar with a clean, Site Editor-inspired navigation — grouped folders, a Settings drilldown, and @wordpress/icons throughout.
 * Version:           1.0.0
 * Author:            Francisco Vera
 * Author URI:        https://github.com/fcoveram
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       new-left-sidebar
 * Requires at least: 6.0
 * Requires PHP:      7.4
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Build a base64 SVG data URI for an admin menu icon.
 * Each $paths entry: [ 'd' => '...', 'fillRule' => 'evenodd' (optional) ]
 */
function nls_svg_icon( array $paths ) {
	$tag = '';
	foreach ( $paths as $p ) {
		$attrs = 'd="' . $p['d'] . '"';
		if ( ! empty( $p['fillRule'] ) ) {
			$attrs .= ' fill-rule="' . $p['fillRule'] . '" clip-rule="' . $p['fillRule'] . '"';
		}
		$tag .= '<path ' . $attrs . '/>';
	}
	$svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#a7aaad">'
		. $tag
		. '</svg>';
	return 'data:image/svg+xml;base64,' . base64_encode( $svg );
}

/**
 * All icon paths sourced from @wordpress/icons (official WordPress package).
 */
function nls_icons() {
	return array(
		// styles.js — half-circle (used as the Dashboard identity icon)
		'dashboard'  => nls_svg_icon( array(
			array(
				'd'        => 'M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-1.5 0a6.5 6.5 0 0 1-6.5 6.5v-13a6.5 6.5 0 0 1 6.5 6.5Z',
				'fillRule' => 'evenodd',
			),
		) ),
		// post.js
		'post'       => nls_svg_icon( array(
			array( 'd' => 'm7.3 9.7 1.4 1.4c.2-.2.3-.3.4-.5 0 0 0-.1.1-.1.3-.5.4-1.1.3-1.6L12 7 9 4 7.2 6.5c-.6-.1-1.1 0-1.6.3 0 0-.1 0-.1.1-.3.1-.4.2-.6.4l1.4 1.4L4 11v1h1l2.3-2.3zM4 20h9v-1.5H4V20zm0-5.5V16h16v-1.5H4z' ),
		) ),
		// page.js
		'page'       => nls_svg_icon( array(
			array( 'd' => 'M15.5 7.5h-7V9h7V7.5Zm-7 3.5h7v1.5h-7V11Zm7 3.5h-7V16h7v-1.5Z' ),
			array( 'd' => 'M17 4H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2ZM7 5.5h10a.5.5 0 0 1 .5.5v12a.5.5 0 0 1-.5.5H7a.5.5 0 0 1-.5-.5V6a.5.5 0 0 1 .5-.5Z' ),
		) ),
		// comment.js
		'comment'    => nls_svg_icon( array(
			array( 'd' => 'M18 4H6c-1.1 0-2 .9-2 2v12.9c0 .6.5 1.1 1.1 1.1.3 0 .5-.1.8-.3L8.5 17H18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm.5 11c0 .3-.2.5-.5.5H7.9l-2.4 2.4V6c0-.3.2-.5.5-.5h12c.3 0 .5.2.5.5v9z' ),
		) ),
		// image.js
		'image'      => nls_svg_icon( array(
			array( 'd' => 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM5 4.5h14c.3 0 .5.2.5.5v8.4l-3-2.9c-.3-.3-.8-.3-1 0L11.9 14 9 12c-.3-.2-.6-.2-.8 0l-3.6 2.6V5c-.1-.3.1-.5.4-.5zm14 15H5c-.3 0-.5-.2-.5-.5v-2.4l4.1-3 3 1.9c.3.2.7.2.9-.1L16 12l3.5 3.4V19c0 .3-.2.5-.5.5z' ),
		) ),
		// brush.js — used for Themes
		'brush'      => nls_svg_icon( array(
			array( 'd' => 'M4 20h8v-1.5H4V20zM18.9 3.5c-.6-.6-1.5-.6-2.1 0l-7.2 7.2c-.4-.1-.7 0-1.1.1-.5.2-1.5.7-1.9 2.2-.4 1.7-.8 2.2-1.1 2.7-.1.1-.2.3-.3.4l-.6 1.1H6c2 0 3.4-.4 4.7-1.4.8-.6 1.2-1.4 1.3-2.3 0-.3 0-.5-.1-.7L19 5.7c.5-.6.5-1.6-.1-2.2zM9.7 14.7c-.7.5-1.5.8-2.4 1 .2-.5.5-1.2.8-2.3.2-.6.4-1 .8-1.1.5-.1 1 .1 1.3.3.2.2.3.5.2.8 0 .3-.1.9-.7 1.3z' ),
		) ),
		// styles.js — half circle
		'styles'     => nls_svg_icon( array(
			array(
				'd'        => 'M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-1.5 0a6.5 6.5 0 0 1-6.5 6.5v-13a6.5 6.5 0 0 1 6.5 6.5Z',
				'fillRule' => 'evenodd',
			),
		) ),
		// navigation.js — compass
		'navigation' => nls_svg_icon( array(
			array( 'd' => 'M12 4c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14.5c-3.6 0-6.5-2.9-6.5-6.5S8.4 5.5 12 5.5s6.5 2.9 6.5 6.5-2.9 6.5-6.5 6.5zM9 16l4.5-3L15 8.4l-4.5 3L9 16z' ),
		) ),
		// layout.js — used for Templates
		'layout'     => nls_svg_icon( array(
			array( 'd' => 'M18 5.5H6a.5.5 0 00-.5.5v3h13V6a.5.5 0 00-.5-.5zm.5 5H10v8h8a.5.5 0 00.5-.5v-7.5zm-10 0h-3V18a.5.5 0 00.5.5h2.5v-8zM6 4h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z' ),
		) ),
		// symbol.js — diamond, used for Patterns
		'symbol'     => nls_svg_icon( array(
			array( 'd' => 'M21.3 10.8l-5.6-5.6c-.7-.7-1.8-.7-2.5 0l-5.6 5.6c-.7.7-.7 1.8 0 2.5l5.6 5.6c.3.3.8.5 1.2.5s.9-.2 1.2-.5l5.6-5.6c.8-.7.8-1.9.1-2.5zm-1 1.4l-5.6 5.6c-.1.1-.3.1-.4 0l-5.6-5.6c-.1-.1-.1-.3 0-.4l5.6-5.6s.1-.1.2-.1.1 0 .2.1l5.6 5.6c.1.1.1.3 0 .4zm-16.6-.4L10 5.5l-1-1-6.3 6.3c-.7.7-.7 1.8 0 2.5L9 19.5l1.1-1.1-6.3-6.3c-.2 0-.2-.2-.1-.3z' ),
		) ),
		// plugins.js
		'plugins'    => nls_svg_icon( array(
			array( 'd' => 'M10.5 4v4h3V4H15v4h1.5a1 1 0 011 1v4l-3 4v2a1 1 0 01-1 1h-3a1 1 0 01-1-1v-2l-3-4V9a1 1 0 011-1H9V4h1.5zm.5 12.5v2h2v-2l3-4v-3H8v3l3 4z' ),
		) ),
		// cog.js — single fill-rule:evenodd path (outer gear + inner circle hole)
		'cog'        => nls_svg_icon( array(
			array(
				'd'        => 'M10.289 4.836A1 1 0 0111.275 4h1.306a1 1 0 01.987.836l.244 1.466c.787.26 1.503.679 2.108 1.218l1.393-.522a1 1 0 011.216.437l.653 1.13a1 1 0 01-.23 1.273l-1.148.944a6.025 6.025 0 010 2.435l1.149.946a1 1 0 01.23 1.272l-.653 1.13a1 1 0 01-1.216.437l-1.394-.522c-.605.54-1.32.958-2.108 1.218l-.244 1.466a1 1 0 01-.987.836h-1.306a1 1 0 01-.986-.836l-.244-1.466a5.995 5.995 0 01-2.108-1.218l-1.394.522a1 1 0 01-1.217-.436l-.653-1.131a1 1 0 01.23-1.272l1.149-.946a6.026 6.026 0 010-2.435l-1.148-.944a1 1 0 01-.23-1.272l.653-1.131a1 1 0 011.217-.437l1.393.522a5.994 5.994 0 012.108-1.218l.244-1.466zM14.929 12a3 3 0 11-6 0 3 3 0 016 0z',
				'fillRule' => 'evenodd',
			),
		) ),
	);
}

/**
 * Reorganize the admin menu into the desired structure.
 */
function nls_reorganize_admin_menu() {
	global $menu, $submenu;

	$icons = nls_icons();

	// Index all existing menu items by slug.
	$items_by_slug = array();
	foreach ( $menu as $position => $item ) {
		$items_by_slug[ $item[2] ] = $item;
	}

	// Clear the menu.
	$menu = array();

	// -------------------------------------------------------------------------
	// Root items — Dashboard, Posts, Pages, Comments, Media
	// -------------------------------------------------------------------------
	$root_map = array(
		'index.php'              => $icons['dashboard'],
		'edit.php'               => $icons['post'],
		'edit.php?post_type=page' => $icons['page'],
		'edit-comments.php'      => $icons['comment'],
		'upload.php'             => $icons['image'],
	);
	$pos = 2;
	foreach ( $root_map as $slug => $icon ) {
		if ( isset( $items_by_slug[ $slug ] ) ) {
			$item    = $items_by_slug[ $slug ];
			$item[6] = $icon;
			$menu[ $pos ] = $item;
			$pos         += 3;
		}
	}

	// -------------------------------------------------------------------------
	// Separator + Design folder label
	// -------------------------------------------------------------------------
	$menu[24] = array( '', 'read', 'separator-design', '', 'wp-menu-separator' );
	$menu[25] = array(
		'Design',
		'edit_theme_options',
		'#nls-design-label',
		'',
		'menu-top nls-folder-label',
		'nls-design-label',
		'none',
	);

	// -------------------------------------------------------------------------
	// Design children — Themes, Styles, Navigation, Templates, Patterns
	// -------------------------------------------------------------------------
	$design_pos = 30;

	// Themes.
	if ( isset( $items_by_slug['themes.php'] ) ) {
		$item    = $items_by_slug['themes.php'];
		$item[0] = 'Themes';
		$item[4] = 'menu-top nls-design-item';
		$item[6] = $icons['brush'];
		$menu[ $design_pos ] = $item;
		$design_pos += 2;
	}

	// Styles — block themes only.
	if ( function_exists( 'wp_is_block_theme' ) && wp_is_block_theme() ) {
		$menu[ $design_pos ] = array(
			'Styles',
			'edit_theme_options',
			'site-editor.php?path=%2Fwp_global_styles',
			'',
			'menu-top nls-design-item',
			'nls-styles',
			$icons['styles'],
		);
		$design_pos += 2;
	}

	// Navigation.
	if ( isset( $items_by_slug['themes.php'] ) ) {
		$menu[ $design_pos ] = array(
			'Navigation',
			'edit_theme_options',
			'nav-menus.php',
			'',
			'menu-top nls-design-item',
			'nls-navigation',
			$icons['navigation'],
		);
		$design_pos += 2;
	}

	// Templates — block themes only.
	if ( function_exists( 'wp_is_block_theme' ) && wp_is_block_theme() ) {
		$menu[ $design_pos ] = array(
			'Templates',
			'edit_theme_options',
			'site-editor.php?postType=wp_template',
			'',
			'menu-top nls-design-item',
			'nls-templates',
			$icons['layout'],
		);
		$design_pos += 2;
	}

	// Patterns — block themes only.
	if ( function_exists( 'wp_is_block_theme' ) && wp_is_block_theme() ) {
		$menu[ $design_pos ] = array(
			'Patterns',
			'edit_theme_options',
			'site-editor.php?postType=wp_block',
			'',
			'menu-top nls-design-item',
			'nls-patterns',
			$icons['symbol'],
		);
		$design_pos += 2;
	}

	// -------------------------------------------------------------------------
	// Separator + Plugins, Users, Tools
	// (Users & Tools keep their original WP dashicons — no @wordpress/icons equiv)
	// -------------------------------------------------------------------------
	$menu[44] = array( '', 'read', 'separator-plugins', '', 'wp-menu-separator' );

	$second_root_map = array(
		'plugins.php' => $icons['plugins'],
		'users.php'   => null, // keep original dashicons-admin-users
		'tools.php'   => null, // keep original dashicons-admin-tools
	);
	$pos = 45;
	foreach ( $second_root_map as $slug => $icon ) {
		if ( isset( $items_by_slug[ $slug ] ) ) {
			$item = $items_by_slug[ $slug ];
			if ( null !== $icon ) {
				$item[6] = $icon;
			}
			$menu[ $pos ] = $item;
			$pos         += 5;
		}
	}

	// -------------------------------------------------------------------------
	// Separator + Settings drilldown
	// -------------------------------------------------------------------------
	$menu[59] = array( '', 'read', 'separator-settings', '', 'wp-menu-separator' );

	if ( isset( $items_by_slug['options-general.php'] ) ) {
		$item    = $items_by_slug['options-general.php'];
		$item[4] = ( $item[4] ? $item[4] . ' ' : '' ) . 'nls-drilldown-section';
		$item[6] = $icons['cog'];
		$menu[60] = $item;
	}
}
add_action( 'admin_menu', 'nls_reorganize_admin_menu', 9999 );

/**
 * Enqueue plugin assets on all admin pages.
 */
function nls_enqueue_admin_assets() {
	$plugin_url = plugin_dir_url( __FILE__ );
	wp_enqueue_style( 'nls-sidebar', $plugin_url . 'css/style.css', array(), '1.4.0' );
	wp_enqueue_script( 'nls-sidebar', $plugin_url . 'js/sidebar.js', array(), '1.4.0', true );
}
add_action( 'admin_enqueue_scripts', 'nls_enqueue_admin_assets' );
