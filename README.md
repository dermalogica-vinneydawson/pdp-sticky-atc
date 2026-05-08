# Dermalogica Sticky Add to Cart

Mobile-first Shopify Plus sticky add-to-cart section with a local Vite preview.

The sticky tray slides in when the default product form add-to-cart button leaves
the viewport. It contains a size selector, a delivery-frequency dropdown
(one-time + 3 / 4 / 5 / 6 month subscription cadences), and an add-to-cart
button. Subscription support assumes Recharge Checkout on Shopify (i.e. native
Shopify `selling_plan_groups` / `selling_plan` flow), which is what Dermalogica
runs.

## Local Preview

```sh
npm install
npm run dev
```

Open `http://127.0.0.1:5173/`. The preview is a Dermalogica-specific mockup for
validating interaction and visual treatment — it does not consume real Shopify
product data.

## Shopify Handoff Files

Copy these into the matching folders in the theme:

- `sections/dermalogica-sticky-add-to-cart.liquid`
- `snippets/dermalogica-sticky-atc.liquid`
- `assets/dermalogica-sticky-atc.css`
- `assets/dermalogica-sticky-atc.js`

Add the `Sticky add to cart` section to the product template in Customize.

See `docs/shopify-implementation.md` for setting reference, Recharge notes, and
selector overrides for non-Dawn themes.

## Checks

```sh
npm run lint
npm run build
```
