class DermalogicaStickyAtc extends HTMLElement {
  connectedCallback() {
    this.form = this.querySelector('form');
    this.variantInput = this.querySelector('[data-sticky-atc-variant-input]');
    this.sellingPlanInput = this.querySelector('[data-sticky-atc-selling-plan-input]');
    this.selectButton = this.querySelector('[data-sticky-atc-select-button]');
    this.menu = this.querySelector('[data-sticky-atc-menu]');
    this.options = Array.from(this.querySelectorAll('[data-sticky-atc-option]'));
    this.purchaseButtons = Array.from(this.querySelectorAll('[data-sticky-atc-purchase]'));
    this.submitButton = this.querySelector('[data-sticky-atc-submit]');
    this.triggerSelector = this.dataset.triggerSelector || 'form[action*="/cart/add"] [type="submit"]';
    this.defaultVariantSelector = this.dataset.variantSelector || 'form[action*="/cart/add"] [name="id"]';
    this.defaultSellingPlanSelector = this.dataset.sellingPlanSelector || 'form[action*="/cart/add"] [name="selling_plan"]';
    this.defaultQuantitySelector = this.dataset.quantitySelector || 'form[action*="/cart/add"] [name="quantity"]';
    this.selectedPurchase = 'one-time';
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    this.handleDefaultVariantChange = this.handleDefaultVariantChange.bind(this);

    this.bindSelect();
    this.bindPurchaseSwitch();
    this.bindDefaultFormSync();
    this.bindTriggerObserver();
    this.syncDefaultVariant();
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.handleDocumentClick);
    this.observer?.disconnect();
    this.defaultVariantControl?.removeEventListener('change', this.handleDefaultVariantChange);
  }

  bindSelect() {
    this.selectButton?.addEventListener('click', () => this.toggleMenu());
    this.options.forEach((option) => {
      option.addEventListener('click', () => {
        this.selectVariant(option.dataset.variantId);
        this.closeMenu();
      });
    });
    document.addEventListener('click', this.handleDocumentClick);
  }

  bindPurchaseSwitch() {
    this.purchaseButtons.forEach((button) => {
      button.addEventListener('click', () => {
        this.selectedPurchase = button.dataset.purchaseType || 'one-time';
        this.purchaseButtons.forEach((item) => {
          item.setAttribute('aria-pressed', String(item === button));
        });
        this.updateSellingPlan();
      });
    });
    this.updateSellingPlan();
  }

  bindDefaultFormSync() {
    this.defaultVariantControl = document.querySelector(this.defaultVariantSelector);
    this.defaultSellingPlanControl = document.querySelector(this.defaultSellingPlanSelector);
    this.defaultQuantityControl = document.querySelector(this.defaultQuantitySelector);
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

  toggleMenu() {
    const isOpen = !this.menu?.hidden;
    if (isOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  openMenu() {
    if (!this.menu || !this.selectButton) return;
    this.menu.hidden = false;
    this.selectButton.setAttribute('aria-expanded', 'true');
  }

  closeMenu() {
    if (!this.menu || !this.selectButton) return;
    this.menu.hidden = true;
    this.selectButton.setAttribute('aria-expanded', 'false');
  }

  handleDocumentClick(event) {
    if (!this.contains(event.target)) {
      this.closeMenu();
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
    const option = this.options.find((item) => item.dataset.variantId === variantId);
    if (!option || !this.variantInput || !this.selectButton) return;

    this.variantInput.value = variantId;
    this.options.forEach((item) => {
      item.setAttribute('aria-selected', String(item === option));
    });
    this.selectButton.querySelector('[data-sticky-atc-selected-title]').textContent =
      option.dataset.variantTitle || option.textContent.trim();

    if (syncDefault && this.defaultVariantControl) {
      this.defaultVariantControl.value = variantId;
      this.defaultVariantControl.dispatchEvent(new Event('change', { bubbles: true }));
    }

    this.updateSellingPlan();
  }

  updateSellingPlan() {
    const selectedOption = this.options.find(
      (option) => option.getAttribute('aria-selected') === 'true',
    );
    const sellingPlanId =
      this.selectedPurchase === 'subscription'
        ? selectedOption?.dataset.sellingPlanId || this.dataset.fallbackSellingPlanId || ''
        : '';

    if (this.sellingPlanInput) {
      this.sellingPlanInput.value = sellingPlanId;
      this.sellingPlanInput.disabled = !sellingPlanId;
    }

    if (this.defaultSellingPlanControl && sellingPlanId) {
      this.defaultSellingPlanControl.value = sellingPlanId;
      this.defaultSellingPlanControl.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }
}

if (!customElements.get('dermalogica-sticky-atc')) {
  customElements.define('dermalogica-sticky-atc', DermalogicaStickyAtc);
}
