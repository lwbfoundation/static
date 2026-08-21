# Wiring the WordPress "Main Menu" into the site

The site navigation is rendered by `src/components/main-menu.tsx`, which reads the
WordPress menu with the slug `main-menu` over WPGraphQL:

```graphql
wpMenu(slug: { eq: "main-menu" }) {
  menuItems {
    nodes { id label url target parentId connectedNode { node { ... on WpContentNode { uri } } } }
  }
}
```

Top-level items render as the nav; any item with a parent renders as a submenu
(a dropdown on desktop, an indented nested list on mobile).

## WordPress needs one change before this works

WPGraphQL treats a nav menu as **private unless it is assigned to a registered
menu location**. As of this writing the CMS reports no locations at all:

```bash
curl -s -X POST https://admin.lewiswbutlerfoundation.org/graphql \
  -H 'Content-Type: application/json' \
  -d '{"query":"{ menus { nodes { name slug } } }"}'
# => {"data":{"menus":{"nodes":[]}}}
```

and `MenuLocationEnum` contains only `EMPTY`, meaning the active (headless)
theme never calls `register_nav_menus()`.

### Fix

The active theme is `headless-wp`. Its `headless_wp_setup()` in `functions.php`
is already hooked to `after_setup_theme` but never calls `register_nav_menus()`.

1. In **Appearance -> Theme File Editor -> functions.php**, add the following
   inside `headless_wp_setup()`, after the `add_theme_support( 'post-formats', ... )`
   block:

   ```php
   /*
    * Register a nav menu location. WPGraphQL keeps a menu private
    * unless it is assigned to a registered location.
    */
   register_nav_menus( array(
       'primary' => __( 'Primary Menu', 'headless-wp' ),
   ) );
   ```

   If the Theme File Editor is unavailable (some hosts set `DISALLOW_FILE_EDIT`),
   the same call works from a snippets plugin such as Code Snippets, or from a
   must-use plugin at `wp-content/mu-plugins/lwbf-menu-locations.php`:

   ```php
   <?php
   /**
    * Plugin Name: LWBF Menu Locations
    */
   add_action( 'after_setup_theme', function () {
       register_nav_menus( [ 'primary' => 'Primary Menu' ] );
   } );
   ```

   Do not switch to a stock theme to get menu locations for free. `functions.php`
   holds the `deploy_on_publish()` Netlify build hook, and it requires
   `includes/settings.php`, which is where this site's custom post types and ACF
   configuration most likely live.

2. In **Appearance -> Menus**, open "Main Menu", and under **Display location**
   check **Primary Menu**. Save.
3. Confirm the menu is public -- the `curl` above should now return the menu with
   `locations: ["PRIMARY"]`.
4. Rebuild with a clean cache so the new `WpMenu` / `WpMenuItem` nodes are
   sourced: `npm run clean-build` (or `npm run clean-develop` locally). A plain
   restart is not enough.

## Until then

`useMainMenu()` falls back to the previously hard-coded items (Donate, For
Students, Newsletter, About, Board, Mentors) so the site is never left without
navigation. Once the WordPress menu is exposed, the fallback stops being used
automatically — you can then delete `FALLBACK_ITEMS` from
`src/components/main-menu.tsx` if you'd rather the nav fail loudly.

## Link handling

`src/utils/menu-link.ts` normalizes what WordPress stores:

- Items connected to a page/post use that node's `uri`.
- Absolute URLs on `*.lewiswbutlerfoundation.org` (including the `admin.`
  CMS host) are rewritten to site-relative paths.
- Custom links that are bare anchors (`#donate`) become `/#donate`, so the
  homepage's existing `hashchange` handling keeps working.
- `mailto:` / `tel:` and off-domain links open in a new tab with `rel="noreferrer"`.
