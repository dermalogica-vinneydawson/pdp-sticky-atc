import { useEffect, useRef, useState } from 'react';

type Size = {
  id: string;
  label: string;
  meta: string;
};

const sizes: Size[] = [
  { id: 'travel', label: '0.45 oz', meta: 'travel' },
  { id: 'standard', label: '1.4 oz', meta: 'standard' },
  { id: 'retail', label: '2.6 oz', meta: 'retail' },
  { id: 'refill', label: '2.6 oz', meta: 'refill' },
  { id: 'bundle', label: '2.6 oz + refill', meta: 'refill bundle' },
];

const productImage = `${import.meta.env.BASE_URL}images/gallery-1-benefits.jpg`;

function App() {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const defaultButtonRef = useRef<HTMLButtonElement | null>(null);
  const [selectedSize, setSelectedSize] = useState(sizes[2]);
  const [purchaseType, setPurchaseType] = useState<'one-time' | 'subscription'>('one-time');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isStickyVisible, setIsStickyVisible] = useState(false);
  const [showSizeTags, setShowSizeTags] = useState(true);

  useEffect(() => {
    const viewport = viewportRef.current;
    const defaultButton = defaultButtonRef.current;

    if (!viewport || !defaultButton) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsStickyVisible(!entry.isIntersecting);
      },
      {
        root: viewport,
        threshold: 0.2,
      },
    );

    observer.observe(defaultButton);

    return () => observer.disconnect();
  }, []);

  return (
    <main className="prototype-shell">
      <div className="preview-controls" aria-label="Preview settings">
        <span>size tag labels</span>
        <div className="preview-toggle">
          <button
            className={showSizeTags ? 'is-active' : ''}
            type="button"
            onClick={() => setShowSizeTags(true)}
          >
            on
          </button>
          <button
            className={!showSizeTags ? 'is-active' : ''}
            type="button"
            onClick={() => setShowSizeTags(false)}
          >
            off
          </button>
        </div>
      </div>

      <section className="phone-frame" aria-label="Mobile sticky add to cart prototype">
        <div className="browser-bar" aria-hidden="true">
          <span />
          dermalogica.com
        </div>

        <div className="phone-viewport" ref={viewportRef}>
          <header className="mobile-header">
            <strong>dermalogica</strong>
            <button type="button" aria-label="Open bag">
              bag
            </button>
          </header>

          <section className="mock-product">
            <img
              src={productImage}
              alt="Daily Microfoliant product"
            />
            <div className="mock-product-copy">
              <p>daily exfoliant</p>
              <h1>daily microfoliant</h1>
              <span>Rice-based powder exfoliant for smoother, brighter-looking skin.</span>
            </div>

            <div className="default-form">
              <label>
                size
                <select defaultValue="retail">
                  {sizes.map((size) => (
                    <option key={size.id} value={size.id}>
                      {size.label}
                    </option>
                  ))}
                </select>
              </label>
              <button ref={defaultButtonRef} type="button">
                add to cart
              </button>
            </div>
          </section>

          <section className="content-block">
            <p>clinical proof</p>
            <h2>skin looks brighter after one use</h2>
            <span>
              The default product form has scrolled away. The sticky component now
              keeps the purchase action available without repeating product detail.
            </span>
          </section>

          <section className="content-block contrast">
            <p>routine</p>
            <h2>use before serum or moisturizer</h2>
            <span>
              The local preview uses the same trigger model as the Shopify asset:
              an observer watches the default add-to-cart button.
            </span>
          </section>

        </div>

        <aside className={`sticky-atc ${isStickyVisible ? 'is-visible' : ''}`}>
          <div className="sticky-atc-inner">
            <div className="custom-select">
              <button
                aria-expanded={isDropdownOpen}
                aria-haspopup="listbox"
                type="button"
                onClick={() => setIsDropdownOpen((open) => !open)}
              >
                <span>
                  <small>size</small>
                  {selectedSize.label}
                </span>
                <i aria-hidden="true" />
              </button>
              {isDropdownOpen ? (
                <div className="select-menu" role="listbox">
                  {sizes.map((size) => (
                    <button
                      aria-selected={selectedSize.id === size.id}
                      key={size.id}
                      role="option"
                      type="button"
                      onClick={() => {
                        setSelectedSize(size);
                        setIsDropdownOpen(false);
                      }}
                    >
                      <span>{size.label}</span>
                      {showSizeTags ? <small>{size.meta}</small> : null}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="purchase-switch" aria-label="Purchase option">
              <button
                className={purchaseType === 'one-time' ? 'is-active' : ''}
                type="button"
                onClick={() => setPurchaseType('one-time')}
              >
                one-time
              </button>
              <button
                className={purchaseType === 'subscription' ? 'is-active' : ''}
                type="button"
                onClick={() => setPurchaseType('subscription')}
              >
                subscribe
              </button>
            </div>

            <button className="sticky-button" type="button">
              <CartIcon />
              add to cart
            </button>
          </div>
        </aside>
      </section>
    </main>
  );
}

function CartIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="22"
      viewBox="0 0 22 22"
      width="22"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.5835 12.8333H16.6246C17.553 12.8333 18.0172 12.8333 18.3868 12.6602C18.7123 12.5078 18.9858 12.2629 19.1733 11.9562C19.3862 11.608 19.4374 11.1467 19.54 10.2239L20.0762 5.39764C20.1075 5.1158 20.1232 4.97488 20.0779 4.86581C20.0381 4.77001 19.967 4.69055 19.8761 4.64041C19.7727 4.58333 19.631 4.58333 19.3474 4.58333H4.12517M1.83337 1.83333H2.97778C3.22035 1.83333 3.34163 1.83333 3.43652 1.87946C3.52006 1.92007 3.58928 1.9851 3.63503 2.06594C3.68698 2.15777 3.69455 2.27882 3.70968 2.52092L4.5404 15.8124C4.55553 16.0545 4.5631 16.1756 4.61506 16.2674C4.6608 16.3482 4.73002 16.4133 4.81356 16.4539C4.90845 16.5 5.02973 16.5 5.2723 16.5H17.4167M6.87504 19.7083H6.88421M15.125 19.7083H15.1342M7.33337 19.7083C7.33337 19.9615 7.12817 20.1667 6.87504 20.1667C6.62191 20.1667 6.41671 19.9615 6.41671 19.7083C6.41671 19.4552 6.62191 19.25 6.87504 19.25C7.12817 19.25 7.33337 19.4552 7.33337 19.7083ZM15.5834 19.7083C15.5834 19.9615 15.3782 20.1667 15.125 20.1667C14.8719 20.1667 14.6667 19.9615 14.6667 19.7083C14.6667 19.4552 14.8719 19.25 15.125 19.25C15.3782 19.25 15.5834 19.4552 15.5834 19.7083Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.83333"
      />
    </svg>
  );
}

export default App;
