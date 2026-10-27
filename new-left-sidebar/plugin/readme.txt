=== New Left Sidebar ===
Contributors:      fcoveram
Tags:              admin, sidebar, navigation, ui, dashboard
Requires at least: 6.0
Tested up to:      6.7
Requires PHP:      7.4
Stable tag:        1.0.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

Replaces the wp-admin sidebar with a clean, Site Editor-inspired navigation.

== Description ==

New Left Sidebar redesigns the WordPress admin navigation to match the look and feel of the Gutenberg Site Editor. It introduces a dark 300 px sidebar, a white rounded content card, and a restructured menu that groups items logically instead of listing everything at once.

**What changes:**

* **Root items** — Dashboard, Posts, Pages, Comments, and Media sit at the top level with crisp @wordpress/icons.
* **Design folder** — Themes, Styles, Navigation, Templates, and Patterns are grouped under a "Design" section label. Styles, Templates, and Patterns are shown only on block themes.
* **Settings drilldown** — Clicking Settings replaces the entire menu with a focused sub-panel (General, Writing, Reading, Discussion, Media, Permalinks, Privacy) and a Back button. The panel opens automatically when you're already on a Settings page.
* **Consistent icons** — All icons are sourced from the official `@wordpress/icons` package and rendered as inline SVG data URIs.
* **No flyout submenus** — Submenus for the active section expand inline; no hover popovers anywhere.

The plugin has no build step, no external dependencies, and writes nothing to the database.

== Installation ==

1. Download the plugin zip file from the [GitHub releases page](https://github.com/fcoveram/new-left-sidebar/releases).
2. In your WordPress admin, go to **Plugins → Add New Plugin**.
3. Click **Upload Plugin** and select the downloaded zip file.
4. Click **Install Now**, then **Activate Plugin**.

Alternatively, you can install it manually:

1. Download and unzip the plugin.
2. Upload the `new-left-sidebar` folder to your `/wp-content/plugins/` directory via FTP or your host's file manager.
3. Go to **Plugins** in your WordPress admin and activate **New Left Sidebar**.

== Frequently Asked Questions ==

= Does this work with classic themes? =

Yes. The sidebar restructuring and drilldown work on all themes. The Design folder items for Styles, Templates, and Patterns are hidden automatically on classic (non-block) themes.

= Will this break any existing plugins that add menu items? =

Items registered by other plugins outside the mapped slugs (Dashboard, Posts, Pages, Comments, Media, Themes, Plugins, Users, Tools, Settings) will not appear in the new sidebar. Support for additional menu items may be added in a future release.

= Does it affect the front end of my site? =

No. The plugin only loads its CSS and JS on admin pages.

== Screenshots ==

1. The redesigned admin sidebar with the Design folder expanded.
2. The Settings drilldown panel with Back button.

== Changelog ==

= 1.0.0 =
* Initial release.

== Upgrade Notice ==

= 1.0.0 =
Initial release — no upgrade steps required.
