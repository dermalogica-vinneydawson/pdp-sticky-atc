class DermalogicaStickyAtc extends HTMLElement {
  connectedCallback() {
    this.form = this.querySelector('form.dgo-sticky-atc__form');
    this.variantInput = this.querySelector('[data-sticky-atc-variant-input]');
    this.sellingPlanInput = this.querySelector('[data-sticky-atc-selling-plan-input]');
    this.sizeSelectButton = this.querySelector('[data-sticky-atc-size-button]');
    this.sizeMenu = this.querySelector('[data-sticky-atc-size-menu]');
    this.sizeOptions = Array.from(this.querySelectorAll('[data-sticky-atc-option]'));
    this.purchaseSelectButton = this.querySelector('[data-sticky-atc-purchase-button]');
    this.purchaseMenu = this.querySelector('[data-sticky-atc-purchase-menu]');
    this.purchaseOptions = Array.from(this.querySelectorAll('[data-sticky-atc-purchase-option]'));
    this.submitButton = this.querySelector('[data-sticky-atc-submit]');
    this.submitLabel = this.querySelector('[data-sticky-atc-submit-label]');
    this.statusEl = this.querySelector('[data-sticky-atc-status]');

    this.triggerSelector = this.dataset.triggerSelector || 'form[action*="/cart/add"] [type="submit"]';
    this.defaultVariantSelector = this.dataset.variantSelector || 'form[action*="/cart/add"] [name="id"]';
    this.defaultSellingPlanSelector = this.dataset.sellingPlanSelector || 'form[action*="/cart/add"] [name="selling_plan"]';
    this.cartNotificationSelector = this.dataset.cartNotificationSelector || '';
    this.themeAtcFunctionName = this.dataset.themeAtcFunction || '';
    this.pageVariantAttributeSelector = this.dataset.pageVariantAttributeSelector || '';
    this.productTitle = this.dataset.productTitle || '';
    this.productType = this.dataset.productType || '';
    this.productVendor = this.dataset.productVendor || '';
    this.productPrice = this.dataset.productPrice || '';
    this.productId = this.dataset.productId || '';
    this.pageProductId = this.dataset.pageProductId || '';
    this.overrideActive = this.dataset.overrideActive === 'true';
    this.soldOutLabel = this.dataset.soldOutLabel || 'sold out';
    this.buttonLabel = this.dataset.buttonLabel || 'add to cart';
    this.addingLabel = this.dataset.addingLabel || 'adding...';
    this.addedLabel = this.dataset.addedLabel || 'added';
    this.errorLabel = this.dataset.errorLabel || 'could not add. try again.';

    this.eventNamespace = this.dataset.eventNamespace || 'sticky_atc';
    this.experimentId = this.dataset.experimentId || '';
    this.experimentVariant = this.dataset.experimentVariant || '';

    this.selectedSellingPlanId = '';
    this.selectedPurchaseLabel = '';
    this.hasTrackedShown = false;
    this.isSubmitting = false;

    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    this.handleDefaultVariantChange = this.handleDefaultVariantChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);

    this.bindSizeSelect();
    this.bindPurchaseSelect();
    this.bindDefaultFormSync();
    this.bindTriggerObserver();
    this.bindSubmit();
    this.syncDefaultVariant();
    this.syncDefaultSellingPlan();
    this.updateSellingPlan();
    this.updateAvailabilityState();
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.handleDocumentClick);
    this.observer?.disconnect();
    this.pageVariantObserver?.disconnect();
    this.defaultVariantControl?.removeEventListener('change', this.handleDefaultVariantChange);
    this.defaultSellingPlanControl?.removeEventListener('change', this.handleDefaultSellingPlanChange);
    this.form?.removeEventListener('submit', this.handleSubmit);
    this.removeEventListener('keydown', this.handleKeydown);
  }

  bindSizeSelect() {
    this.sizeSelectButton?.addEventListener('click', () => {
      const willOpen = this.sizeMenu?.hidden;
      this.toggleMenu(this.sizeMenu, this.sizeSelectButton, this.sizeOptions);
      this.closeMenu(this.purchaseMenu, this.purchaseSelectButton);
      if (willOpen) this.track('size_open');
    });

    this.sizeOptions.forEach((option) => {
      option.addEventListener('click', () => {
        if (option.disabled) return;
        this.selectVariant(option.dataset.variantId);
        this.closeMenu(this.sizeMenu, this.sizeSelectButton);
        this.sizeSelectButton?.focus();
        this.track('size_select', { variant_title: option.dataset.variantTitle || '' });
      });
    });

    document.addEventListener('click', this.handleDocumentClick);
    this.addEventListener('keydown', this.handleKeydown);
  }

  bindPurchaseSelect() {
    this.purchaseSelectButton?.addEventListener('click', () => {
      const willOpen = this.purchaseMenu?.hidden;
      this.toggleMenu(this.purchaseMenu, this.purchaseSelectButton, this.purchaseOptions);
      this.closeMenu(this.sizeMenu, this.sizeSelectButton);
      if (willOpen) this.track('delivery_open');
    });

    this.purchaseOptions.forEach((option) => {
      option.addEventListener('click', () => {
        if (option.disabled) return;
        this.selectPurchaseOption(option);
        this.closeMenu(this.purchaseMenu, this.purchaseSelectButton);
        this.purchaseSelectButton?.focus();
        this.track('delivery_select', {
          delivery_label: option.dataset.purchaseLabel || '',
        });
      });
    });
  }

  bindDefaultFormSync() {
    // Skip default-form sync when the section is configured with a product
    // override that differs from the page product — variant IDs would be wrong.
    if (this.overrideActive) return;

    this.defaultVariantControl = this.defaultVariantSelector ? document.querySelector(this.defaultVariantSelector) : null;
    this.defaultSellingPlanControl = this.defaultSellingPlanSelector ? document.querySelector(this.defaultSellingPlanSelector) : null;
    this.defaultVariantControl?.addEventListener('change', this.handleDefaultVariantChange);

    // When the page has no Shopify form (custom PDP using addtoCart()), watch
    // an element whose data-variant-id reflects the active variant.
    if (!this.defaultVariantControl && this.pageVariantAttributeSelector) {
      this.pageVariantAttrEl = document.querySelector(this.pageVariantAttributeSelector);
      if (this.pageVariantAttrEl) {
        const initial = this.pageVariantAttrEl.dataset.variantId;
        if (initial) this.selectVariant(initial, false);

        this.pageVariantObserver = new MutationObserver(() => {
          const vid = this.pageVariantAttrEl?.dataset.variantId;
          if (vid && vid !== this.variantInput?.value) this.selectVariant(vid, false);
        });
        this.pageVariantObserver.observe(this.pageVariantAttrEl, {
          attributes: true,
          attributeFilter: ['data-variant-id'],
        });
      }
    }

    this.handleDefaultSellingPlanChange = () => {
      const value = this.defaultSellingPlanControl?.value || '';
      this.applySellingPlanFromExternal(value);
    };
    this.defaultSellingPlanControl?.addEventListener('change', this.handleDefaultSellingPlanChange);
  }

  bindTriggerObserver() {
    const trigger = document.querySelector(this.triggerSelector);

    if (!trigger) {
      this.classList.add('is-visible');
      this.removeAttribute('inert');
      return;
    }

    this.observer = new IntersectionObserver(
      ([entry]) => {
        const visible = !entry.isIntersecting;
        this.classList.toggle('is-visible', visible);
        // Keep the bar out of the tab order and hidden from assistive tech
        // when not visible — opacity:0 alone leaves controls focusable.
        if (visible) {
          this.removeAttribute('inert');
        } else {
          this.setAttribute('inert', '');
          this.closeMenu(this.sizeMenu, this.sizeSelectButton);
          this.closeMenu(this.purchaseMenu, this.purchaseSelectButton);
        }
        if (visible && !this.hasTrackedShown) {
          this.hasTrackedShown = true;
          this.track('shown');
        }
      },
      { threshold: 0.2 },
    );

    this.observer.observe(trigger);
  }

  track(action, extra = {}) {
    const eventName = `${this.eventNamespace}_${action}`;
    const payload = {
      event: eventName,
      sticky_atc: {
        action,
        product_id: this.productId,
        variant_id: this.variantInput?.value || '',
        selling_plan_id: this.selectedSellingPlanId || '',
        purchase_type: this.selectedSellingPlanId ? 'subscription' : 'one_time',
        purchase_label: this.selectedPurchaseLabel || '',
        experiment_id: this.experimentId,
        experiment_variant: this.experimentVariant,
        ...extra,
      },
    };

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);

    // Direct CustomEvent so Optimize / theme code can listen without GTM.
    document.dispatchEvent(new CustomEvent(eventName, { bubbles: true, detail: payload.sticky_atc }));
  }

  bindSubmit() {
    this.form?.addEventListener('submit', this.handleSubmit);
  }

  toggleMenu(menu, button, options) {
    if (!menu || !button) return;
    if (menu.hidden) {
      this.openMenu(menu, button, options);
    } else {
      this.closeMenu(menu, button);
    }
  }

  openMenu(menu, button, options) {
    menu.hidden = false;
    button.setAttribute('aria-expanded', 'true');
    const selected = (options || []).find((o) => o.getAttribute('aria-selected') === 'true' && !o.disabled);
    const fallback = (options || []).find((o) => !o.disabled);
    (selected || fallback)?.focus();
  }

  closeMenu(menu, button) {
    if (!menu || !button) return;
    menu.hidden = true;
    button.setAttribute('aria-expanded', 'false');
  }

  handleDocumentClick(event) {
    if (!this.contains(event.target)) {
      this.closeMenu(this.sizeMenu, this.sizeSelectButton);
      this.closeMenu(this.purchaseMenu, this.purchaseSelectButton);
    }
  }

  handleKeydown(event) {
    const openMenu = !this.sizeMenu?.hidden ? this.sizeMenu : (!this.purchaseMenu?.hidden ? this.purchaseMenu : null);
    if (!openMenu) return;

    const button = openMenu === this.sizeMenu ? this.sizeSelectButton : this.purchaseSelectButton;
    const options = openMenu === this.sizeMenu ? this.sizeOptions : this.purchaseOptions;
    const enabled = options.filter((o) => !o.disabled);
    if (!enabled.length) return;

    const current = document.activeElement;
    const idx = enabled.indexOf(current);

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        this.closeMenu(openMenu, button);
        button?.focus();
        break;
      case 'ArrowDown':
        event.preventDefault();
        enabled[idx < 0 ? 0 : Math.min(idx + 1, enabled.length - 1)].focus();
        break;
      case 'ArrowUp':
        event.preventDefault();
        enabled[idx <= 0 ? 0 : idx - 1].focus();
        break;
      case 'Home':
        event.preventDefault();
        enabled[0].focus();
        break;
      case 'End':
        event.preventDefault();
        enabled[enabled.length - 1].focus();
        break;
      case 'Enter':
      case ' ':
        if (idx >= 0) {
          event.preventDefault();
          enabled[idx].click();
        }
        break;
      default:
        break;
    }
  }

  handleDefaultVariantChange() {
    this.syncDefaultVariant();
  }

  syncDefaultVariant() {
    const defaultVariantId = this.defaultVariantControl?.value;
    if (defaultVariantId) {
      this.selectVariant(defaultVariantId, false);
    }
  }

  syncDefaultSellingPlan() {
    if (this.overrideActive) return;
    const value = this.defaultSellingPlanControl?.value || '';
    this.applySellingPlanFromExternal(value);
  }

  applySellingPlanFromExternal(value) {
    const match = this.purchaseOptions.find((o) => (o.dataset.sellingPlanId || '') === value);
    if (match && !match.disabled) {
      this.selectPurchaseOption(match, false);
    }
  }

  selectVariant(variantId, syncDefault = true) {
    const option = this.sizeOptions.find((item) => item.dataset.variantId === variantId);
    if (!option || !this.variantInput || !this.sizeSelectButton) return;

    this.variantInput.value = variantId;
    this.sizeOptions.forEach((item) => {
      item.setAttribute('aria-selected', String(item === option));
    });
    this.sizeSelectButton.querySelector('[data-sticky-atc-selected-title]').textContent =
      option.dataset.variantTitle || option.textContent.trim();

    if (syncDefault && !this.overrideActive && this.defaultVariantControl) {
      this.defaultVariantControl.value = variantId;
      this.defaultVariantControl.dispatchEvent(new Event('change', { bubbles: true }));
    }

    this.updateAvailabilityState();
  }

  selectPurchaseOption(option, syncDefault = true) {
    if (!option || !this.purchaseSelectButton) return;

    this.selectedSellingPlanId = option.dataset.sellingPlanId || '';
    this.selectedPurchaseLabel = option.dataset.purchaseLabel || '';
    this.purchaseOptions.forEach((item) => {
      item.setAttribute('aria-selected', String(item === option));
    });
    this.purchaseSelectButton.querySelector('[data-sticky-atc-selected-purchase]').textContent =
      option.dataset.purchaseButtonLabel || option.dataset.purchaseLabel || option.textContent.trim();
    this.updateSellingPlan(syncDefault);
  }

  updateSellingPlan(syncDefault = true) {
    const sellingPlanId = this.selectedSellingPlanId;

    if (this.sellingPlanInput) {
      this.sellingPlanInput.value = sellingPlanId;
      this.sellingPlanInput.disabled = !sellingPlanId;
    }

    if (syncDefault && !this.overrideActive && this.defaultSellingPlanControl) {
      this.defaultSellingPlanControl.value = sellingPlanId;
      this.defaultSellingPlanControl.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  updateAvailabilityState() {
    if (!this.submitButton) return;
    const selected = this.sizeOptions.find((o) => o.getAttribute('aria-selected') === 'true');
    const available = !selected || selected.dataset.variantAvailable !== 'false';
    this.submitButton.disabled = !available || this.isSubmitting;
    if (this.submitLabel && !this.isSubmitting) {
      this.submitLabel.textContent = available ? this.buttonLabel : this.soldOutLabel;
    }
  }

  async handleSubmit(event) {
    if (this.isSubmitting) {
      event.preventDefault();
      return;
    }
    this.track('atc_click');

    // If the theme has a custom ATC function (e.g. addtoCart on the live PDP),
    // delegate so the cart notification, analytics, and any other side
    // effects fire through the theme's existing pipeline. The theme function
    // is responsible for the actual /cart/add request.
    if (this.themeAtcFunctionName && typeof window[this.themeAtcFunctionName] === 'function') {
      event.preventDefault();
      this.delegateToThemeFunction(event);
      return;
    }

    if (!window.fetch || !this.form) {
      // Let the browser perform a normal submit. The button is briefly disabled
      // to prevent a double-submit while navigation kicks in.
      this.setSubmitting(true);
      return;
    }

    event.preventDefault();
    this.setSubmitting(true);
    this.setStatus('');

    try {
      const formData = new FormData(this.form);
      // Some themes expect a `sections` param to refresh cart drawer markup; we
      // omit it to stay theme-agnostic and instead dispatch events the theme
      // can listen for.
      const response = await fetch(`${window.Shopify?.routes?.root || '/'}cart/add.js`.replace(/\/+/g, '/'), {
        method: 'POST',
        headers: { Accept: 'application/javascript', 'X-Requested-With': 'XMLHttpRequest' },
        body: formData,
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message = (data && (data.description || data.message)) || this.errorLabel;
        this.setStatus(message, true);
        this.setSubmitting(false);
        if (data && data.status === 422) {
          this.markVariantUnavailable(this.variantInput?.value);
          this.updateAvailabilityState();
        }
        this.track('atc_error', { reason: message, status: data?.status || response.status });
        return;
      }

      this.track('atc_success', {
        line_item_id: data?.id || '',
        quantity: data?.quantity || 1,
        price: data?.final_price ?? data?.price ?? null,
      });
      this.dispatchEvent(new CustomEvent('sticky-atc:added', { bubbles: true, detail: data }));
      document.dispatchEvent(new CustomEvent('cart:item-added', { bubbles: true, detail: data }));
      // Common Dawn-derived theme events:
      document.dispatchEvent(new CustomEvent('cart:refresh', { bubbles: true }));
      document.dispatchEvent(new CustomEvent('cart:update', { bubbles: true, detail: data }));

      this.showAddedState();
      this.openCartNotification();
    } catch (err) {
      this.setStatus(this.errorLabel, true);
      this.setSubmitting(false);
      this.track('atc_error', { reason: 'network' });
    }
  }

  delegateToThemeFunction(originalEvent) {
    const fn = window[this.themeAtcFunctionName];
    const variantId = Number(this.variantInput?.value) || this.variantInput?.value;
    const selected = this.sizeOptions.find((o) => o.getAttribute('aria-selected') === 'true');
    const price = selected?.dataset.variantPrice || this.productPrice;
    const sellingPlanId = this.selectedSellingPlanId || '';

    this.setSubmitting(true);
    this.setStatus('');

    try {
      // Live PDP signature: addtoCart(event, variantId, title, price, type, vendor)
      // Pass selling_plan as a 7th arg and an options object as 8th so the
      // theme function can opt into subscription support without a breaking
      // signature change.
      const result = fn.call(
        window,
        originalEvent,
        variantId,
        this.productTitle,
        price,
        this.productType,
        this.productVendor,
        sellingPlanId,
        { source: 'sticky-atc', sellingPlanId, properties: { _source: 'sticky-atc' } },
      );

      // If the theme function returns a promise, await it; otherwise treat as
      // fire-and-forget and assume success after a short delay.
      const settle = (data) => {
        this.track('atc_success', { delegated: true, ...(data && typeof data === 'object' ? { line_item_id: data.id || '' } : {}) });
        this.dispatchEvent(new CustomEvent('sticky-atc:added', { bubbles: true, detail: data || null }));
        this.showAddedState();
      };

      if (result && typeof result.then === 'function') {
        result.then(settle).catch((err) => {
          this.setStatus(this.errorLabel, true);
          this.setSubmitting(false);
          this.track('atc_error', { reason: err?.message || 'theme_function', delegated: true });
        });
      } else {
        settle(result);
      }
    } catch (err) {
      this.setStatus(this.errorLabel, true);
      this.setSubmitting(false);
      this.track('atc_error', { reason: err?.message || 'theme_function_threw', delegated: true });
    }
  }

  markVariantUnavailable(variantId) {
    const option = this.sizeOptions.find((o) => o.dataset.variantId === String(variantId));
    if (option) {
      option.dataset.variantAvailable = 'false';
      option.disabled = true;
      option.setAttribute('aria-disabled', 'true');
    }
  }

  setSubmitting(isSubmitting) {
    this.isSubmitting = isSubmitting;
    if (this.submitButton) {
      this.submitButton.disabled = isSubmitting;
      this.submitButton.setAttribute('aria-busy', String(isSubmitting));
    }
    if (isSubmitting && this.submitLabel) this.submitLabel.textContent = this.addingLabel;
    if (!isSubmitting) this.updateAvailabilityState();
  }

  showAddedState() {
    if (this.submitLabel) this.submitLabel.textContent = this.addedLabel;
    setTimeout(() => {
      this.isSubmitting = false;
      this.updateAvailabilityState();
    }, 1200);
  }

  setStatus(message, isError = false) {
    if (!this.statusEl) return;
    this.statusEl.textContent = message || '';
    this.statusEl.classList.toggle('is-error', !!message && isError);
  }

  openCartNotification() {
    // Many themes (Dawn-derived) auto-render the cart notification when they
    // hear cart:item-added on document — that fires upstream of this method.
    // This method is a belt-and-suspenders trigger for themes whose
    // notification element exposes an explicit open/show API.
    if (!this.cartNotificationSelector) return;
    const note = document.querySelector(this.cartNotificationSelector);
    if (!note) return;

    if (typeof note.open === 'function') {
      note.open();
      return;
    }
    if (typeof note.show === 'function') {
      note.show();
      return;
    }
    if (typeof note.renderContents === 'function') {
      // Dawn cart-notification API
      try { note.renderContents({}); } catch (_) { /* theme handles via event */ }
      return;
    }
    note.removeAttribute('hidden');
    note.setAttribute('aria-hidden', 'false');
  }
}

if (!customElements.get('dermalogica-sticky-atc')) {
  customElements.define('dermalogica-sticky-atc', DermalogicaStickyAtc);
}
