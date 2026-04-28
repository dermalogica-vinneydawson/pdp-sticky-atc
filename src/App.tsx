import { useEffect, useRef, useState } from 'react'
import './App.css'

// ─── Types ───────────────────────────────────────────────────
type PurchaseType = 'subscribe' | 'one-time'

type GalleryImage = {
  src: string
  alt: string
}

// ─── Gallery images (local public/images/ — original from dermalogica.com CDN) ──
const galleryImages: GalleryImage[] = [
  { src: '/images/gallery-1-benefits.jpg',   alt: 'daily microfoliant exfoliator — benefits' },
  { src: '/images/gallery-2-powertofoam.jpg',alt: 'daily microfoliant exfoliator — powder to foam' },
  { src: '/images/gallery-3-clinical.jpg',   alt: 'daily microfoliant exfoliator — clinical proof' },
  { src: '/images/gallery-4-model.jpg',      alt: 'daily microfoliant exfoliator — model application' },
  { src: '/images/gallery-5-body.jpg',       alt: 'daily microfoliant exfoliator — body use' },
  { src: '/images/gallery-6-ba1.jpg',        alt: 'daily microfoliant exfoliator — before and after 1' },
  { src: '/images/gallery-7-ba2.jpg',        alt: 'daily microfoliant exfoliator — before and after 2' },
  { src: '/images/gallery-8-routine.jpg',    alt: 'daily microfoliant exfoliator — routine' },
]

type Size = {
  label: string
  oneTimePrice: number
  subscribePrice: number
}

// ─── Data ────────────────────────────────────────────────────
const sizes: Size[] = [
  { label: '0.45 oz',                oneTimePrice: 19.50, subscribePrice: 19.50 },
  { label: '1.4 oz',                 oneTimePrice: 49.00, subscribePrice: 49.00 },
  { label: '2.6 oz',                 oneTimePrice: 69.00, subscribePrice: 69.00 },
  { label: '2.6 oz - refill',        oneTimePrice: 63.00, subscribePrice: 63.00 },
  { label: '2.6 oz + refill bundle', oneTimePrice: 112.00, subscribePrice: 112.00 },
]

const frequencies = [
  'Delivery every 3 months',
  'Delivery every 4 months',
  'Delivery every 5 months',
  'Delivery every 6 months',
]

const subscribePerks = [
  'earn 2× rewards points on every order',
  'free shipping',
  'free 30-day returns',
  'easy cancellations',
  'exclusive subscriber-only offers',
]

const faqItems = [
  {
    q: 'What skin types is Daily Microfoliant recommended for?',
    a: 'Recommended for all skin types — commonly used to address dullness, uneven texture and uneven skin tone.',
  },
  {
    q: 'How do I use this exfoliant?',
    a: 'Dispense about ½ teaspoon into very wet hands, rub to form a creamy paste, massage onto face in circular motions for about 1 minute (avoid eyes), then rinse thoroughly.',
  },
  {
    q: 'Can I use Daily Microfoliant every day?',
    a: 'Yes — the formula is described as gentle enough for daily use. Adjust frequency if you experience irritation.',
  },
  {
    q: 'What are the key active ingredients?',
    a: 'Key ingredients include Papain, Salicylic Acid and Rice Enzymes to polish skin to perfection. A Skin Brightening Complex of Phytic Acid from Rice Bran, White Tea and Licorice helps balance uneven skin tone while a super-soothing blend of Colloidal Oatmeal and Allantoin helps calm skin.',
  },
  {
    q: 'Does it have added fragrance?',
    a: 'Dermalogica formulas never use artificial fragrances. However, botanical extracts and essential oils included for skin benefits may have a natural scent. Some users may notice a subtle fragrance.',
  },
  {
    q: 'Is this suitable for acne-prone or oily skin?',
    a: 'Many users report it helps remove dead skin and reduce clogged pores; it\'s frequently used by people with oily or acne-prone skin to clarify texture.',
  },
  {
    q: 'What is the product texture like?',
    a: 'It is a rice-based powder that activates upon contact with water, turning into a creamy paste and gentle foam, releasing Papain, Salicylic Acid and Rice Enzymes to polish skin to perfection.',
  },
  {
    q: 'How do I recycle the packaging?',
    a: 'The bottle and cap are recyclable (PP resin code 5); remove the desiccant bag and follow local recycling rules. The carton is paper and recyclable.',
  },
  {
    q: 'Are there any professional tips for this product?',
    a: '"I use daily microfoliant as a shaving medium because I am allergic to shaving creams. It\'s soothing, brightening and prevents razor bumps and ingrown hairs." — Wendy Schemper, Instructor',
  },
]

const researchCitations = [
  'Clinical, Cosmetic and Investigational Dermatology. 2015;8:455–461.',
  'Journal of the American Academy of Dermatology. 2014;70(4):788–792.',
  'Journal of the American Academy of Dermatology. 2016;74(5):945–973.',
  'Applied Sciences. 2025;15(5):2637.',
  'International Journal of Cosmetic Science. 2022;44(5):542–554.',
  'Journal of Investigative Dermatology. 2015;135(7):1790–1800.',
  'Journal of Cosmetic Dermatology. 2022;21(11):6056–6060.',
  'Jundishapur Journal of Natural Pharmaceutical Products. 2021;16(4):e114152.',
  'Pharmaceutical Biology. 2012;50(2):208–224.',
]

const reviewHighlights = [
  { quote: 'Gentle enough for daily use.', author: 'Andrea B.' },
  { quote: 'Skin feels polished and fresh.', author: 'Paige D.' },
  { quote: 'Brightens and smooths skin.', author: 'Olivia J.' },
  { quote: 'Leaves no residue, just glow.', author: 'Hannah L.' },
  { quote: 'A staple in my routine.', author: 'Madison W.' },
]

const complementaryProducts = [
  {
    name: "a good night's rest set",
    benefit: '2 full-size + 1 travel-size',
    price: '$89.00',
    img: '/images/product-good-night-set.jpg',
  },
  {
    name: 'special cleansing gel',
    benefit: 'washes away impurities',
    price: 'Starting at $44',
    img: '/images/product-cleansing-gel.jpg',
  },
  {
    name: 'precleanse cleansing oil',
    benefit: 'dissolves makeup & debris',
    price: '$47.00',
    img: '/images/product-precleanse2.jpg',
  },
]

const recommendedProducts = [
  {
    name: 'phyto nature e² regenerating daily exosome leave-on treatment',
    tagline: 'renew + resurface',
    price: '$132.00',
    soldOut: true,
    img: 'https://www.dermalogica.com/cdn/shop/files/PNE2_Benefits_92aeec8b-55f6-43af-a393-2e7a21c8425e.jpg?v=1763775042&width=533',
  },
  {
    name: 'dynamic skin sculptor body serum',
    tagline: 'tightens, tones, sculpts',
    price: '$89.00',
    soldOut: true,
    img: 'https://www.dermalogica.com/cdn/shop/files/DynamicSkinSculptor_Main_33cf9a69-08b3-411b-a6ac-f2bd73c46b5a.jpg?width=533',
  },
  {
    name: 'daily microfoliant exfoliator',
    tagline: 'exfoliates, smooths, brightens',
    price: '$19.50',
    soldOut: false,
    img: '/images/gallery-1-benefits.jpg',
  },
  {
    name: 'dynamic skin recovery spf50 moisturizer',
    tagline: 'hydrates and combats skin aging',
    price: '$80.00',
    soldOut: false,
    img: '/images/product-dynamic-spf50.jpg',
  },
]

// ─── Helpers ─────────────────────────────────────────────────
function fmt(n: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(n))
}

// ─── Sub-components ───────────────────────────────────────────
function SizeSelect({ sizes, selected, onSelect, purchaseType, variant = 'default' }: {
  sizes: Size[]
  selected: Size
  onSelect: (s: Size) => void
  purchaseType: PurchaseType
  variant?: 'default' | 'compact'
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const priceFor = (s: Size) => purchaseType === 'subscribe' ? s.subscribePrice : s.oneTimePrice

  return (
    <div ref={ref} className={`size-select size-select--${variant}${open ? ' open' : ''}`}>
      <button
        type="button"
        className="size-select__trigger"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="size-select__label">
          <span className="size-select__caption">size</span>
          <span className="size-select__value">{selected.label}</span>
        </span>
        <span className="size-select__price">{fmt(priceFor(selected))}</span>
        <span className="size-select__chevron" aria-hidden="true">▾</span>
      </button>
      {open && (
        <ul className="size-select__menu" role="listbox" aria-label="Select size">
          {sizes.map(s => (
            <li key={s.label}>
              <button
                type="button"
                role="option"
                aria-selected={s.label === selected.label}
                className={`size-select__option${s.label === selected.label ? ' selected' : ''}`}
                onClick={() => { onSelect(s); setOpen(false) }}
              >
                <span className="size-select__option-label">{s.label}</span>
                <span className="size-select__option-price">{fmt(priceFor(s))}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function Accordion({ title, defaultOpen = false, children }: {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="accordion-item">
      <details open={defaultOpen}>
        <summary className="accordion-summary">
          <span className="accordion-headline">{title}</span>
          <span className="accordion-chevron" aria-hidden="true">+</span>
        </summary>
        <div className="accordion-body">
          {children}
        </div>
      </details>
    </div>
  )
}

function ClinicalResults() {
  return (
    <>
      <p className="clinical-period">after 1–7 days of use:</p>
      <ul>
        <li>improves skin smoothness</li>
        <li>reduces the appearance of blackheads*</li>
      </ul>
      <p className="clinical-period">after 1–4 weeks of daily use:</p>
      <ul>
        <li>brightens skin</li>
        <li>minimizes look of dark spots*</li>
      </ul>
      <p className="footnote">*Results based on a 4-week clinical study.</p>
    </>
  )
}

function HowToUse() {
  return (
    <>
      <p className="accordion-label">Brighter &amp; Smoother</p>
      <p><strong>When to Apply</strong></p>
      <p>
        Use Daily Microfoliant® after cleansing, once daily morning or night.
        If you're new to exfoliation or have sensitive skin, start every other day and build to daily use as tolerated.
        For daytime, always follow with SPF; at night, follow with your toner and moisturizer.
      </p>
      <p>
        Do not use on sunburned, irritated, or recently waxed/resurfaced skin, or while using prescribed acne or Vitamin A–derived exfoliants.
      </p>
      <p><strong>How to Apply Powder:</strong></p>
      <p>
        Dispense about a half-teaspoon of Daily Microfoliant® into very wet hands and rub together to create a creamy paste.
        Apply to face and neck in circular motions, avoiding the eye area. Massage gently for 1 minute, then rinse thoroughly.
        Follow with your Dermalogica toner and moisturizer.
      </p>
    </>
  )
}

function Ingredients() {
  return (
    <>
      <p className="accordion-label">Key Ingredients</p>
      <div className="ingredients-grid">
        <div className="ingredient-card">
          <img src="/images/ingredient-papain.jpg" alt="Papain ingredient" className="ingredient-img" />
          <h4>Papain</h4>
          <p>Papaya-derived enzyme that helps break down dead skin cells for smoother-looking skin.</p>
        </div>
        <div className="ingredient-card">
          <img src="/images/ingredient-salicylic.png" alt="Salicylic Acid ingredient" className="ingredient-img" />
          <h4>Salicylic Acid</h4>
          <p>Oil-soluble exfoliant that helps clear pores and refine skin texture.</p>
        </div>
        <div className="ingredient-card">
          <div className="ingredient-img ingredient-img--placeholder" aria-hidden="true" />
          <h4>Oryza Sativa (Rice) Bran Extract</h4>
          <p>Antioxidant-rich extract that may help condition and protect skin from environmental stressors.</p>
        </div>
      </div>
      <div className="ingredients-full">
        <p className="accordion-label">All Ingredients</p>
        <p>
          Microcrystalline Cellulose, Magnesium Oxide, Sodium Cocoyl Isethionate, Colloidal Oatmeal,
          Disodium Lauryl Sulfosuccinate, Sodium Lauroyl Glutamate, Oryza Sativa (Rice) Bran Extract,
          Oryza Sativa (Rice) Starch, Hydrogenated Coconut Acid, Allantoin, Papain, Salicylic Acid,
          Ginkgo Biloba Leaf Extract, Camellia Sinensis Leaf Extract, Glycyrrhiza Glabra (Licorice)
          Root Extract, PCA, Populus Tremuloides Bark Extract, Cyclodextrin, Sodium Isethionate,
          Lauryl Methacrylate/Glycol Dimethacrylate Copolymer, Maltodextrin, Melaleuca Alternifolia
          (Tea Tree) Leaf Oil, Citrus Paradisi (Grapefruit) Peel Oil, Sodium Dehydroacetate,
          Hydrolyzed Corn Starch Hydroxyethyl Ether, Water/Aqua/Eau, Limonene, Citric Acid.
        </p>
        <p className="footnote">
          Dermalogica is dedicated to maintaining the accuracy of the ingredient lists on this website.
          However, because ingredients are subject to change, we cannot guarantee that these lists are
          complete, up-to-date and/or error-free. For an accurate listing of ingredients in each product,
          please refer to your product packaging.
        </p>
      </div>
    </>
  )
}

function Sustainability() {
  return (
    <>
      <p>
        <strong>2.6 oz:</strong> Bottle: PP (resin code 5), Sifter: PP (resin code 5), Cap: PP (resin code 5),
        Desiccant Bag: Mixed Material, Carton: Paper. The bottle and cap are fully recyclable.
        The paper carton is recyclable and comes from FSC-certified responsibly managed forests.
      </p>
      <p>
        <strong>To recycle:</strong> Ensure bottle is as empty as possible. Open the sifter and discard desiccant bag.
        Place back sifter and cap on the bottle before placing in its recycling bin. Place carton in its recycling bin.
      </p>
      <p>
        <strong>2.6 oz Refill:</strong> Plastic Laminate (White PE + EVOH). Dispose bag in waste bin or collection point if available.
      </p>
      <p>
        <strong>0.45 oz:</strong> Bottle: PP (resin code 5), Sifter: PP (resin code 5), Cap: PP (resin code 5),
        Desiccant Bag: Mixed Material, Carton: Paper. The bottle, sifter and cap are fully recyclable.
        The paper carton is recyclable and comes from FSC-certified forests.
      </p>
      <p className="footnote">Recycling is subject to local policies and facilities.</p>
    </>
  )
}

function FaqAccordion() {
  return (
    <>
      {faqItems.map(({ q, a }) => (
        <details className="faq-item" key={q}>
          <summary className="faq-summary">
            <span className="faq-question">{q}</span>
            <span className="accordion-chevron" aria-hidden="true">+</span>
          </summary>
          <p className="faq-answer">{a}</p>
        </details>
      ))}
    </>
  )
}

function AwardsContent() {
  return (
    <ul className="awards-list">
      <li>2025 Mamamia (You Beauty) Awards – Best Exfoliant (Winner)</li>
      <li>2025 <em>Woman &amp; Home</em> Beauty Awards – Best Scrub</li>
      <li>ShopTODAY 2025 Beauty Awards – Best Overall Exfoliator</li>
      <li>2024 <em>Allure</em> Best of Beauty Awards – Best Exfoliating Powder</li>
      <li>2024 <em>Who What Wear</em> Beauty Awards – Best Exfoliator</li>
      <li>2024 WWD Beauty Inc "100 Greatest Skincare Products of All Time" – List Honoree</li>
      <li>2021 <em>Marie Claire</em> UK Skin Awards – Skincare Icon (Cleanse Category)</li>
      <li>2015 <em>InStyle</em> Best Beauty Buys – Best Facial Exfoliator</li>
    </ul>
  )
}

function ResearchContent() {
  return (
    <ol className="research-list">
      {researchCitations.map(c => <li key={c}><em>{c}</em></li>)}
    </ol>
  )
}

// ─── Main component ───────────────────────────────────────────
export default function App() {
  const [selectedSize, setSelectedSize] = useState(sizes[2])
  const [purchaseType, setPurchaseType] = useState<PurchaseType>('subscribe')
  const [frequency, setFrequency]     = useState(frequencies[0])
  const [quantity, setQuantity]       = useState(1)
  const [isStickyVisible, setIsStickyVisible] = useState(false)
  const [reviewIdx, setReviewIdx]     = useState(0)
  const [activeImg, setActiveImg]     = useState(0)
  const purchaseRef = useRef<HTMLDivElement>(null)

  const unitPrice = purchaseType === 'subscribe' ? selectedSize.subscribePrice : selectedSize.oneTimePrice
  const subtotal  = unitPrice * quantity

  // Rotate review highlights
  useEffect(() => {
    const id = setInterval(() => setReviewIdx(i => (i + 1) % reviewHighlights.length), 4000)
    return () => clearInterval(id)
  }, [])

  // Sticky bar visibility
  useEffect(() => {
    const el = purchaseRef.current
    if (!el || !('IntersectionObserver' in window)) return
    const obs = new IntersectionObserver(
      ([e]) => setIsStickyVisible(!e.isIntersecting),
      { threshold: 0, rootMargin: '0px 0px -10% 0px' },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <>
      {/* ── Announcement bar ── */}
      <div className="announcement-bar" role="banner">
        You've unlocked 3 free gifts + free shipping.
      </div>

      {/* ── Header ── */}
      <header className="site-header">
        <a className="brand" href="/" aria-label="Dermalogica home">dermalogica</a>

        <nav className="header-nav" aria-label="Primary navigation">
          <a href="#shop">shop</a>
          <a href="#shop">clear start</a>
          <a href="#shop">pro treatments</a>
          <a href="#about">about</a>
          <a href="#shop">face mapping</a>
          <a href="#shop">offers</a>
          <a href="#shop">rewards</a>
        </nav>

        <div className="header-actions">
          <button type="button" aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8.5" cy="8.5" r="5.75" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M13 13L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
          <button type="button" aria-label="Sign in">sign in</button>
          <button type="button" aria-label="Cart">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 3h2l2.5 9h8l2-6H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="8.5" cy="16" r="1" fill="currentColor"/>
              <circle cx="14.5" cy="16" r="1" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </header>

      {/* ── Breadcrumb ── */}
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <div className="breadcrumb-inner">
          <a href="/">home</a>
          <span aria-hidden="true"> / </span>
          <a href="/collections/exfoliants">exfoliants</a>
          <span aria-hidden="true"> / </span>
          <span aria-current="page">daily microfoliant exfoliator</span>
        </div>
      </nav>

      {/* ── Product ── */}
      <section className="product-shell" id="product">

        {/* Gallery */}
        <div className="gallery-wrapper">
          <div className="gallery-main">
            <img
              key={activeImg}
              src={galleryImages[activeImg].src}
              alt={galleryImages[activeImg].alt}
              className="gallery-main-img"
            />
          </div>
          <div className="gallery-thumbs" role="list" aria-label="Product images">
            {galleryImages.map((img, i) => (
              <button
                key={img.src}
                className={`gallery-thumb${i === activeImg ? ' active' : ''}`}
                onClick={() => setActiveImg(i)}
                type="button"
                aria-label={img.alt}
                aria-pressed={i === activeImg}
                role="listitem"
              >
                <img src={img.src} alt="" aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>

        {/* Product info */}
        <div className="product-info-wrapper">
          <div className="product-info-inner">

            {/* Title block */}
            <div className="product-title-block">
              <h1>daily microfoliant<sup>®</sup> exfoliator</h1>
              <p className="pdp-benefits">exfoliates, smooths, brightens</p>
              <div className="product-rating">
                <span className="stars" aria-label="4.8 out of 5 stars">★★★★★</span>
                <span className="rating-score">4.8</span>
                <a href="#reviews" className="rating-count">4,214 reviews</a>
              </div>
            </div>

            {/* Shipping info box */}
            <div className="shipping-box">
              <div className="shipping-row">
                <span className="shipping-icon">✓</span>
                <span>Enjoy free shipping on orders $20+</span>
              </div>
              <div className="shipping-row">
                <span className="shipping-icon">✓</span>
                <span>Free Brighten Day + Night Trio on orders $100+</span>
              </div>
            </div>

            {/* Description */}
            <div className="product-description">
              <p className="recommended-label">recommended for:</p>
              <ul className="recommended-list">
                <li>dullness</li>
                <li>uneven texture</li>
                <li>uneven skin tone</li>
              </ul>
              <p>
                Achieve brighter, smoother skin every day with this iconic exfoliating powder.
                Rice-based powder, rich in Alpha Hydroxy Acids (AHAs), activates upon contact with water,
                releasing Papain, Salicylic Acid and Rice Bran to polish skin to perfection.
                A Skin Brightening Complex of Phytic Acid from Rice Bran, White Tea and Licorice
                helps balance uneven skin tone while a super-soothing blend of Colloidal Oatmeal
                and Allantoin helps calm skin. Gentle enough for daily use.
              </p>
            </div>

            {/* Purchase widget */}
            <div ref={purchaseRef} className="purchase-section">

              {/* Subscribe / one-time radio group */}
              <div className="purchase-widget" role="group" aria-label="Purchase type">

                {/* Subscribe option */}
                <button
                  className={`purchase-option${purchaseType === 'subscribe' ? ' active subscribe-active' : ''}`}
                  onClick={() => setPurchaseType('subscribe')}
                  type="button"
                  aria-pressed={purchaseType === 'subscribe'}
                >
                  <span className="purchase-radio-dot" aria-hidden="true">
                    {purchaseType === 'subscribe' ? '●' : '○'}
                  </span>
                  <span className="purchase-option__body">
                    <span className="purchase-option__row">
                      <span className="purchase-option__label">Subscribe &amp; Earn Rewards</span>
                      <span className="save-badge">2× points</span>
                    </span>
                    <span className="purchase-option__sub">
                      auto-refills · cancel anytime · earn 2× rewards points
                    </span>
                  </span>
                </button>

                {/* Frequency + perks panel */}
                {purchaseType === 'subscribe' && (
                  <div className="subscribe-panel">
                    <label className="freq-label" htmlFor="frequency">
                      select your frequency:
                    </label>
                    <select
                      id="frequency"
                      className="freq-select"
                      value={frequency}
                      onChange={e => setFrequency(e.target.value)}
                    >
                      {frequencies.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                    <ul className="subscribe-perks">
                      {subscribePerks.map(p => <li key={p}>{p}</li>)}
                    </ul>
                  </div>
                )}

                {/* One-time option */}
                <button
                  className={`purchase-option onetime${purchaseType === 'one-time' ? ' active' : ''}`}
                  onClick={() => setPurchaseType('one-time')}
                  type="button"
                  aria-pressed={purchaseType === 'one-time'}
                >
                  <span className="purchase-radio-dot" aria-hidden="true">
                    {purchaseType === 'one-time' ? '●' : '○'}
                  </span>
                  <span className="purchase-option__body">
                    <span className="purchase-option__row">
                      <span className="purchase-option__label">One Time Purchase</span>
                    </span>
                    <span className="purchase-option__sub">{fmt(selectedSize.oneTimePrice)}</span>
                  </span>
                </button>

              </div>

              {/* Size selector */}
              <fieldset className="size-fieldset">
                <legend className="size-legend">Select Size:</legend>
                <SizeSelect
                  sizes={sizes}
                  selected={selectedSize}
                  onSelect={setSelectedSize}
                  purchaseType={purchaseType}
                />
              </fieldset>

              {/* Price */}
              <div className="price-display">
                <span className="price-main">{fmt(unitPrice)}</span>
                <span className="price-installment">
                  or 4 payments of {fmt(selectedSize.oneTimePrice / 4)} with Afterpay
                </span>
              </div>

              {/* Quantity + ATC */}
              <div className="purchase-row">
                <div className="qty-widget" aria-label="Quantity">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    disabled={quantity === 1}
                    onClick={() => setQuantity(v => Math.max(1, v - 1))}
                  >−</button>
                  <output aria-label="Quantity value">{quantity}</output>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => setQuantity(v => v + 1)}
                  >+</button>
                </div>
                <button className="atc-btn" type="button">
                  {purchaseType === 'subscribe' ? 'Subscribe' : 'Add to cart'}
                </button>
              </div>

              {/* Trust line */}
              <div className="trust-line">
                <span>HSA / FSA eligible</span>
                <span className="trust-sep">·</span>
                <a href="#" className="trust-link">learn how it works</a>
              </div>

            </div>

            {/* Review highlight */}
            <div className="review-highlights" id="reviews" aria-live="polite">
              <p className="review-highlights__label">review highlights</p>
              <p className="review-highlights__quote">
                "{reviewHighlights[reviewIdx].quote}" — {reviewHighlights[reviewIdx].author}
              </p>
            </div>

            {/* Accordions */}
            <div className="product-accordions">
              <Accordion title="clinical results" defaultOpen>
                <ClinicalResults />
              </Accordion>
              <Accordion title="how to use">
                <HowToUse />
              </Accordion>
              <Accordion title="ingredients">
                <Ingredients />
              </Accordion>
              <Accordion title="sustainability">
                <Sustainability />
              </Accordion>
              <Accordion title="FAQ">
                <FaqAccordion />
              </Accordion>
              <Accordion title="awards">
                <AwardsContent />
              </Accordion>
              <Accordion title="research">
                <ResearchContent />
              </Accordion>
            </div>

          </div>
        </div>
      </section>

      {/* ── Complementary products ── */}
      <section className="complementary-section" aria-label="Pairs well with">
        <h2 className="section-label">pairs well with</h2>
        <div className="complementary-grid">
          {complementaryProducts.map(p => (
            <div className="complementary-card" key={p.name}>
              <img src={p.img} alt={p.name} className="complementary-img" />
              <div className="complementary-info">
                <p className="complementary-name">{p.name}</p>
                <p className="complementary-benefit">{p.benefit}</p>
                <p className="complementary-price">{p.price}</p>
                <button className="complementary-atc" type="button">+ add</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── You May Also Like ── */}
      <section className="recommendations-section" aria-label="You may also like">
        <div className="recommendations-inner">
          <h2 className="recommendations-heading">you may also like</h2>
          <div className="recommendations-grid">
            {recommendedProducts.map(p => (
              <article key={p.name} className="product-card">
                <img src={p.img} alt={p.name} className="product-card__img" />
                <p className="product-card__name">{p.name}</p>
                <p className="product-card__tagline">{p.tagline}</p>
                {p.soldOut
                  ? <span className="sold-out-badge">sold out</span>
                  : <p className="product-card__price">{p.price}</p>
                }
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-grid">
            <div className="footer-col">
              <h4>Account</h4>
              <ul>
                <li><a href="#">My Account</a></li>
                <li><a href="#">Rewards</a></li>
                <li><a href="#">Subscription</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Customer Service</h4>
              <ul>
                <li><a href="#">Contact Us</a></li>
                <li><a href="#">Returns &amp; Exchanges</a></li>
                <li><a href="#">Shipping Info</a></li>
                <li><a href="#">Find a Retailer</a></li>
                <li><a href="#">Store Locator</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>About Us</h4>
              <ul>
                <li><a href="#">Our Story</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Sustainability</a></li>
                <li><a href="#">Social Impact</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>For Professionals</h4>
              <ul>
                <li><a href="#">DermalogicaPRO</a></li>
                <li><a href="#">Pro Insider</a></li>
                <li><a href="#">IDI Community</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-legal">
              <a href="#">Privacy Notice</a>
              <a href="#">Terms of Use</a>
              <a href="#">Do Not Sell My Data</a>
            </div>
            <p className="footer-copy">© 2026 Dermalogica</p>
          </div>
        </div>
      </footer>

      {/* ── Sticky ATC bar ── */}
      <div
        className={`sticky-atc${isStickyVisible ? ' visible' : ''}`}
        role="region"
        aria-label="Sticky add to cart"
      >
        <div className="sticky-atc__product">
          <div className="sticky-atc__thumb-wrap">
            <img
              src={galleryImages[0].src}
              alt=""
              aria-hidden="true"
              className="sticky-atc__thumb"
            />
          </div>
          <div className="sticky-atc__info">
            <p className="sticky-atc__name">daily microfoliant<sup>®</sup></p>
            <p className="sticky-atc__meta">
              <span className="sticky-atc__rating" aria-hidden="true">★ 4.8</span>
              <span className="sticky-atc__sep" aria-hidden="true">·</span>
              <span>
                {selectedSize.label}
                {purchaseType === 'subscribe' ? ` · ${frequency}` : ''}
              </span>
            </p>
          </div>
        </div>

        <div className="sticky-atc__top">
          <div
            className={`sticky-atc__type sticky-atc__type--${purchaseType === 'subscribe' ? 'subscribe' : 'onetime'}`}
            role="tablist"
            aria-label="Purchase type"
          >
            <button
              type="button"
              role="tab"
              className={`sticky-type-btn${purchaseType === 'one-time' ? ' active' : ''}`}
              aria-selected={purchaseType === 'one-time'}
              onClick={() => setPurchaseType('one-time')}
            >
              One-time
            </button>
            <button
              type="button"
              role="tab"
              className={`sticky-type-btn${purchaseType === 'subscribe' ? ' active' : ''}`}
              aria-selected={purchaseType === 'subscribe'}
              onClick={() => setPurchaseType('subscribe')}
            >
              <span>Subscribe</span>
              <span className="sticky-type-badge" aria-hidden="true">2× pts</span>
            </button>
          </div>

          <SizeSelect
            sizes={sizes}
            selected={selectedSize}
            onSelect={setSelectedSize}
            purchaseType={purchaseType}
            variant="compact"
          />

          <div className="sticky-qty" aria-label="Quantity">
            <button
              type="button"
              aria-label="Decrease quantity"
              disabled={quantity === 1}
              onClick={() => setQuantity(v => Math.max(1, v - 1))}
            >−</button>
            <output aria-label="Quantity value">{quantity}</output>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQuantity(v => v + 1)}
            >+</button>
          </div>

          <button className="sticky-atc__btn" type="button">
            <span className="sticky-atc__btn-label">
              {purchaseType === 'subscribe' ? 'Subscribe' : 'Add to cart'}
            </span>
            <span className="sticky-atc__btn-price">{fmt(subtotal)}</span>
            <svg
              className="sticky-atc__btn-arrow"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
            >
              <path d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </>
  )
}
