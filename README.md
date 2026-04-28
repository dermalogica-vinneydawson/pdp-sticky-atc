# PDP Sticky Add to Cart Prototype

Local React/Vite prototype for exploring a sticky add-to-cart experience on a
Dermalogica-style Shopify Plus product detail page.

The prototype is intentionally separate from the Shopify theme so interaction
ideas can move quickly before being translated into the custom Dawn 2.0-derived
theme.

## Stack

- Vite
- React
- TypeScript
- Plain CSS

## Commands

```bash
npm install
npm run dev
npm test
npm run build
npm run lint
```

If npm reports permission problems with the global cache, use a local temporary
cache:

```bash
npm_config_cache=/private/tmp/pdp-sticky-npm-cache npm install
```

## Prototype Scope

The starter screen includes a mock PDP with:

- Product gallery area
- Product title, rating, description, and benefits
- Variant-like size selection
- Quantity control
- Price-synchronized add-to-cart button
- Long page content for testing scroll behavior

Expected next step: add a sticky add-to-cart layer that appears after the primary
product form scrolls out of view and stays synchronized with the selected size,
quantity, and subtotal.

## Shopify Translation Notes

When this moves into the Shopify theme, the React state in this prototype maps
roughly to:

- `selectedSize` -> selected product variant
- `quantity` -> product form quantity input
- `subtotal` -> selected variant price times quantity
- primary add-to-cart action -> Dawn product form submit handler
- sticky visibility -> `IntersectionObserver` watching the main product form

Keep the Shopify implementation progressive-enhancement friendly: the standard
product form should remain usable if JavaScript fails.
