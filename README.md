# Dermalogica Sticky Add to Cart

Mobile-only Shopify Plus sticky add-to-cart component with a local Vite preview.

The sticky tray appears when the default product form add-to-cart button leaves
the viewport. It is intentionally minimal: size selector, one-time/subscription
switch, and add-to-cart button.

## Local Preview

```sh
npm install
npm run dev
```

Open `http://127.0.0.1:5173/`.

The preview is a mobile browser mockup for validating the interaction and visual
treatment before installing the Shopify files.

## Shopify Handoff Files

Copy these files into the matching folders in the Shopify theme:

- `sections/dermalogica-sticky-add-to-cart.liquid`
- `snippets/dermalogica-sticky-atc.liquid`
- `assets/dermalogica-sticky-atc.css`
- `assets/dermalogica-sticky-atc.js`

Then add the `Sticky add to cart` section to a product template in Shopify
Customize.

## Preview Source

- `src/App.tsx` - mobile browser mockup and interaction prototype
- `src/styles.css` - preview styling
- `public/images/gallery-1-benefits.jpg` - preview product image

## Checks

```sh
npm run lint
npm run build
```
