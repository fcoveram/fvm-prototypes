=== Inherited styles indicator ===
Contributors: fcoveram
Requires at least: 7.1
Tested up to: 7.1
Requires PHP: 7.4
Stable tag: 0.9.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Design prototype: shows where a block's styles are inherited from.

== Description ==

* Block inspector controls show the value they inherit, and a diamond ◇ after
  the label says where it comes from. Hover it:
  * "Style from Styles element": Styles, including rules that target the
    block's tag (e.g. h3 sizes).
  * "Style from Gallery block" (or any block): that block type's styles
    customised in Styles → Blocks.
  * "Style from parent block": an ancestor sets a value that flows down in
    CSS, directly or through its block style (e.g. a section style) (text color, font, size, appearance, line height, letter spacing,
    line indent, orientation, letter case). A rule that targets the block
    itself wins over its parent, as in CSS.
* The block's default controls show only when they have a value; empty ones
  (like Background Color on a paragraph) are hidden and can be turned on from
  the panel's ⋮ menu, as can every other control. Set a style on the block
  and its diamond disappears; reset it from the ⋮ menu and it comes back.

== Installation ==

1. Plugins → Add New Plugin → Upload Plugin, choose inherited-styles-indicator.zip, then
   Install Now and Activate.
2. Use a block theme (tested with Twenty Twenty-Five), open any post or page in
   the editor, select a block and look at the style panels in the block
   inspector (Typography, Background, Dimensions…).

To remove it, deactivate and delete the plugin. It stores nothing: no options,
no database changes, and nothing is added to your content or Styles.

== Known limitations ==

* Design prototype, not for production sites.
* Needs WordPress 7.1 or later: it turns on an experimental editor flag and
  uses editor internals that may change in future versions.
* Works with the editor in English only (it matches controls by their label).
* Parent values are shown for text color and typography. Inherited link and
  heading colors (Elements panel) show the diamond only.

== Changelog ==

= 0.9.0 =
* A parent's block style (e.g. Twenty Twenty-Five section styles) now counts
  as "Style from parent block", and its value shows in the child's controls.

= 0.8.0 =
* The tooltip for values from Styles now reads "Style from Styles element".

= 0.7.0 =
* Default controls without a value are hidden; other controls are only shown
  when turned on from the ⋮ menu (or set on the block).

= 0.6.0 =
* First shareable version.
