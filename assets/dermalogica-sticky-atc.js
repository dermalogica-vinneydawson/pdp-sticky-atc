class DermalogicaStickyAtc extends HTMLElement {
  connectedCallback() {
    this.variantInput = this.querySelector('[data-sticky-atc-variant-input]');
    this.sellingPlanInput = this.querySelector('[data-sticky-atc-selling-plan-input]');
    this.sizeSelectButton = this.querySelector('[data-sticky-atc-size-button]');
    this.sizeMenu = this.querySelector('[data-sticky-atc-size-menu]');
    this.sizeOptions = Array.from(this.querySelectorAll('[data-sticky-atc-option]'));
    this.purchaseSelectButton = this.querySelector('[data-sticky-atc-purchase-button]');
    this.purchaseMenu = this.querySelector('[data-sticky-atc-purchase-menu]');
    this.purchaseOptions = Array.from(this.querySelectorAll('[data-sticky-atc-purchase-option]'));
    this.triggerSelector = this.dataset.triggerSelector || 'form[action*="/cart/add"] [type="submit"]';
    this.defaultVariantSelector = this.dataset.variantSelector || 'form[action*="/cart/add"] [name="id"]';
    this.defaultSellingPlanSelector = this.dataset.sellingPlanSelector || 'form[action*="/cart/add"] [name="selling_plan"]';
    this.selectedSellingPlanId = '';
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    this.handleDefaultVariantChange = this.handleDefaultVariantChange.bind(this);

    this.bindSizeSelect();
    this.bindPurchaseSelect();
    this.bindDefaultFormSync();
    this.bindTriggerObserver();
    this.syncDefaultVariant();
    this.updateSellingPlan();
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.handleDocumentClick);
    this.observer?.disconnect();
    this.defaultVariantControl?.removeEventListener('change', this.handleDefaultVariantChange);
  }

  bindSizeSelect() {
    this.sizeSelectButton?.addEventListener('click', () => {
      this.toggleMenu(this.sizeMenu, this.sizeSelectButton);
      this.closeMenu(this.purchaseMenu, this.purchaseSelectButton);
    });

    this.sizeOptions.forEach((option) => {
      option.addEventListener('click', () => {
        this.selectVariant(option.dataset.variantId);
        this.closeMenu(this.sizeMenu, this.sizeSelectButton);
      });
    });

    document.addEventListener('click', this.handleDocumentClick);
  }

  bindPurchaseSelect() {
    this.purchaseSelectButton?.addEventListener('click', () => {
      this.toggleMenu(this.purchaseMenu, this.purchaseSelectButton);
      this.closeMenu(this.sizeMenu, this.sizeSelectButton);
    });

    this.purchaseOptions.forEach((option) => {
      option.addEventListener('click', () => {
        this.selectPurchaseOption(option);
        this.closeMenu(this.purchaseMenu, this.purchaseSelectButton);
      });
    });
  }

  bindDefaultFormSync() {
    this.defaultVariantControl = document.querySelector(this.defaultVariantSelector);
    this.defaultSellingPlanControl = document.querySelector(this.defaultSellingPlanSelector);
    this.defaultVariantControl?.addEventListener('change', this.handleDefaultVariantChange);
  }

  bindTriggerObserver() {
    const trigger = document.querySelector(this.triggerSelector);

    if (!trigger) {
      this.classList.add('is-visible');
      return;
    }

    this.observer = new IntersectionObserver(
      ([entry]) => {
        this.classList.toggle('is-visible', !entry.isIntersecting);
      },
      { threshold: 0.2 },
    );

    this.observer.observe(trigger);
  }

  toggleMenu(menu, button) {
    if (!menu || !button) return;
    if (menu.hidden) {
      this.openMenu(menu, button);
    } else {
      this.closeMenu(menu, button);
    }
  }

  openMenu(menu, button) {
    menu.hidden = false;
    button.setAttribute('aria-expanded', 'true');
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

  handleDefaultVariantChange() {
    this.syncDefaultVariant();
  }

  syncDefaultVariant() {
    const defaultVariantId = this.defaultVariantControl?.value;
    if (defaultVariantId) {
      this.selectVariant(defaultVariantId, false);
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

    if (syncDefault && this.defaultVariantControl) {
      this.defaultVariantControl.value = variantId;
      this.defaultVariantControl.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  selectPurchaseOption(option) {
    if (!option || !this.purchaseSelectButton) return;

    this.selectedSellingPlanId = option.dataset.sellingPlanId || '';
    this.purchaseOptions.forEach((item) => {
      item.setAttribute('aria-selected', String(item === option));
    });
    this.purchaseSelectButton.querySelector('[data-sticky-atc-selected-purchase]').textContent =
      option.dataset.purchaseButtonLabel || option.dataset.purchaseLabel || option.textContent.trim();
    this.updateSellingPlan();
  }

  updateSellingPlan() {
    const sellingPlanId = this.selectedSellingPlanId;

    if (this.sellingPlanInput) {
      this.sellingPlanInput.value = sellingPlanId;
      this.sellingPlanInput.disabled = !sellingPlanId;
    }

    if (this.defaultSellingPlanControl) {
      this.defaultSellingPlanControl.value = sellingPlanId;
      this.defaultSellingPlanControl.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }
}

if (!customElements.get('dermalogica-sticky-atc')) {
  customElements.define('dermalogica-sticky-atc', DermalogicaStickyAtc);
}
