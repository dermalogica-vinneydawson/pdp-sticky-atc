# Project Brief

## Goal

Prototype sticky add-to-cart patterns for a Dermalogica product detail page
before implementing them in a Shopify Plus custom theme based on Dawn 2.0.

## Working Assumptions

- This repo is for fast interaction prototyping, not production Shopify Liquid.
- The prototype should preserve PDP concepts that matter for Shopify: variant
  selection, quantity, current price, primary product form, and scroll position.
- The final Shopify implementation should be portable to a Dawn-style product
  section with minimal conceptual translation.

## Candidate Sticky ATC Behaviors

- Sticky bar remains hidden while the main purchase panel is visible.
- Sticky bar appears after the purchase panel exits the viewport.
- Sticky controls mirror the active variant, quantity, price, and add-to-cart
  state.
- Mobile and desktop may use different density: compact bottom bar on mobile,
  slimmer header-style bar on desktop.
- Add-to-cart should submit through the same product-form logic as the main PDP
  form in the eventual Shopify theme.

## Implementation Notes For Later Shopify Work

- Use `IntersectionObserver` to avoid scroll event churn.
- Reuse Dawn product form events and variant-change data where possible.
- Keep ARIA labels and focus behavior explicit for quantity and variant controls.
- Avoid blocking the standard product form if sticky behavior fails.
