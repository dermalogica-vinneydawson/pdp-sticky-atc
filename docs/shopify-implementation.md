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
- one-time / subscription switch
- add-to-cart button without price

The Shopify section also includes a `Show size tag labels` setting. When it is
enabled, each dropdown option can show a secondary variant label such as
`travel`, `standard`, `retail`, `refill`, or `refill bundle`. When disabled,
only the size value is shown.

## Theme setup

Copy the files into the matching folders in a Shopify theme, then add the
`Sticky add to cart` section to a product template in Customize.

The section settings include selectors for the default product button, variant
input, selling plan input, and quantity input so the component can be reused in
Dawn-derived or custom Shopify Plus product templates.
