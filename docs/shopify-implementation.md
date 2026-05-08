# Shopify Plus sticky add to cart

This project now includes a reusable Shopify product-page section for the mobile
sticky add-to-cart pattern.

## Files

- `sections/dermalogica-sticky-add-to-cart.liquid`
- `snippets/dermalogica-sticky-atc.liquid`
- `assets/dermalogica-sticky-atc.css`
- `assets/dermalogica-sticky-atc.js`

## Behavior

The component observes the default product form add-to-cart button. When that
button is in the viewport, the sticky tray stays hidden. When the button leaves
the viewport, the tray slides in from the bottom and spans the full viewport
width.

The tray intentionally contains only:

- custom size selector
- purchase dropdown with one-time purchase and 3, 4, 5, and 6 month delivery options
- add-to-cart button without price

The Shopify section also includes a `Show size tag labels` setting. When it is
enabled, each dropdown option can show a secondary variant label such as
`travel`, `standard`, `retail`, `refill`, or `refill bundle`. When disabled,
only the size value is shown.

The purchase dropdown can auto-detect selling plan IDs by plan name when the
product exposes selling plans such as `delivery every 3 months`. The section
also includes explicit backend settings for the 3, 4, 5, and 6 month selling
plan IDs when a theme needs manual mapping.

## Theme setup

Copy the files into the matching folders in a Shopify theme, then add the
`Sticky add to cart` section to a product template in Customize.

The section settings include selectors for the default product button, variant
input, selling plan input, and quantity input so the component can be reused in
Dawn-derived or custom Shopify Plus product templates.
