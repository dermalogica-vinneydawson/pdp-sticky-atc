# Shopify Plus sticky add-to-cart

Plug-and-play product-page section for the mobile sticky add-to-cart pattern.

## Files

- `sections/dermalogica-sticky-add-to-cart.liquid`
- `snippets/dermalogica-sticky-atc.liquid`
- `assets/dermalogica-sticky-atc.css`
- `assets/dermalogica-sticky-atc.js`

## Behavior

The component observes the default product form add-to-cart button. While that
button is in the viewport the tray stays hidden; once it leaves the viewport
the tray slides up from the bottom and spans the full width.

The tray contains:

- size selector (auto-detects which option is "Size" by name; falls back to
  option1)
- delivery dropdown: one-time + 3 / 4 / 5 / 6 month subscription cadences
- add-to-cart button (no price)

Add-to-cart submits via AJAX (`/cart/add.js`). On success it dispatches:

- `sticky-atc:added` (on the element)
- `cart:item-added`, `cart:refresh`, `cart:update` (on `document`)

…then opens the cart drawer if the configured selector resolves. On a 422
response (sold-out / inventory) the offending variant is marked unavailable in
the dropdown and the submit button is disabled.

If `fetch` is unavailable, the form falls back to a normal browser submit.

## Subscriptions (Recharge)

Dermalogica uses **Recharge Checkout on Shopify**, which exposes subscriptions
through Shopify's native `selling_plan_groups` API. No Recharge-specific
JavaScript or hidden inputs are required — the sticky bar writes
`selling_plan=<id>` to the form, and Recharge picks it up at checkout.

The section auto-detects 3 / 4 / 5 / 6 month plan IDs by name (matches `month`,
`mois`, `monat`, `mes`). If your plan names don't follow that pattern, set the
explicit selling plan IDs in section settings (`3 month selling plan ID`, etc.).

## Multi-option products (size + variant class)

For products with two options (e.g. `[Size, Variant Class]` or
`[Variant Class, Size]`), the snippet finds the size option by name match.
The other option is shown as a small tag label beside each size (e.g. `travel`,
`retail`, `refill`). If `Show size tag labels` is unchecked, only the size
value is shown.

## Product override

Setting `Product override` on the section renders the sticky bar for a
different product than the page product. In that mode the bar does **not**
sync with the page's default product form (variant IDs would be wrong); it is
a standalone form that submits its own product to the cart.

## Cart drawer integration

The `Cart drawer trigger selector` setting accepts any CSS selector — typically
your theme's `<cart-drawer>` element or a toggle button. The script tries
`element.open()`, `element.show()`, `setAttribute('open', '')`, then
`element.click()` in order. Most Dawn-derived and Shopify Plus themes hit one
of these paths.

## Selector settings (theme overrides)

If your theme's product form doesn't match the default `form[action*="/cart/add"]`
pattern, override these on the section:

- `Default add-to-cart button selector`
- `Default variant input selector`
- `Default selling plan input selector`
- `Default quantity input selector`

## Accessibility

- Dropdowns expose `role="listbox"` / `role="option"` with `aria-selected`,
  `aria-expanded`, and `aria-haspopup`.
- Keyboard support: `ArrowUp`/`ArrowDown` to move, `Home`/`End` to jump,
  `Enter`/`Space` to select, `Escape` to close.
- Disabled (sold-out) options are skipped during keyboard navigation.
- Submit status is announced via `aria-live="polite"`.

## A/B testing & tracking (Webflow Optimize / GA4)

Every interaction emits a `dataLayer` push **and** a `CustomEvent` on
`document`, so you can wire goals via GTM, Optimize's data-layer listener, or a
direct `addEventListener`. No re-deploy needed to add new goals — just listen
for the event names below.

### Event names

Default namespace is `sticky_atc`; override via the section's `Event namespace`
setting (useful when running concurrent variants). Events emitted:

| Event | When |
|---|---|
| `sticky_atc_shown` | Bar enters viewport (fires once per page) |
| `sticky_atc_size_open` | User opens size dropdown |
| `sticky_atc_size_select` | User picks a size |
| `sticky_atc_delivery_open` | User opens delivery dropdown |
| `sticky_atc_delivery_select` | User picks one-time / 3 / 4 / 5 / 6 month |
| `sticky_atc_atc_click` | User clicks add-to-cart |
| `sticky_atc_atc_success` | `/cart/add.js` returned 200 |
| `sticky_atc_atc_error` | Add failed (sold-out, network, validation) |

### Payload shape

Each event carries the same structured object:

```js
{
  event: 'sticky_atc_atc_success',
  sticky_atc: {
    action: 'atc_success',
    product_id: '1234567',
    variant_id: '9876543',
    selling_plan_id: '',          // empty for one-time
    purchase_type: 'one_time',    // 'one_time' | 'subscription'
    purchase_label: 'one-time purchase',
    experiment_id: 'wfopt-sticky-atc-001',  // from section setting
    experiment_variant: 'treatment-a',       // from section setting
    line_item_id: 12345,           // success only
    quantity: 1,                   // success only
    price: 6800,                   // success only, in cents
    reason: '...',                 // error only
  }
}
```

### Suggested test setup

1. **Set `Experiment ID` and `Experiment variant`** on each variant of the
   section in Customize. Every event will be tagged, so you can segment cleanly.
2. **Primary goal**: count `sticky_atc_atc_success` events per session.
3. **Funnel diagnostics**: `sticky_atc_shown` → `sticky_atc_atc_click` →
   `sticky_atc_atc_success`. Drop-off between shown→click reveals UI issues;
   click→success reveals inventory or trust issues.
4. **Revenue attribution post-checkout**: items added via the sticky bar carry
   `properties[_source]=sticky-atc` (toggle in section settings). Filter Shopify
   orders / GA4 by line-item property to attribute revenue without relying on
   client-side events surviving checkout.
5. **Engagement signals** (secondary): `sticky_atc_size_select`,
   `sticky_atc_delivery_select` with `purchase_type=subscription` are useful
   leading indicators of subscription propensity.

### Listening without GTM

```js
document.addEventListener('sticky_atc_atc_success', (e) => {
  // e.detail = { action, product_id, variant_id, selling_plan_id, ... }
});
```

### Disabling attribution

If you don't want the line-item property (some line-item-based discounts
reject items with custom properties), uncheck `Tag added items with source` in
the section settings.

## Z-index

Default is `60`. Most themes use `30–50` for headers and `40–55` for
announcement bars; if the bar is hidden behind your header, raise this in
section settings.
