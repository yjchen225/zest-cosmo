import React, { useEffect, useMemo, useRef, useState } from "react";

const A = "/assets/";

const routes = [
  ["Home", "/page-home"],
  ["Shop", "/page-collection"],
  ["Collections", "/page-collection-list"],
  ["Our Story", "/page-content"],
  ["Lookbook", "/page-lookbook"],
];

const utilityRoutes = [
  ["FAQ", "/page-faq"],
  ["Contact", "/page-contact"],
  ["Account", "/page-account"],
];

const products = [
  { id: 1, name: "Dew Reset Serum", price: 68, badge: "BESTSELLER", tone: "amber", crop: "crop-serum", desc: "Bio-fermented peptides + snow mushroom" },
  { id: 2, name: "Cloud Milk Cleanser", price: 34, badge: "NEW", tone: "teal", crop: "crop-cleanser", desc: "Oat lipids + mineral-rich water" },
  { id: 3, name: "Soft Focus Cream", price: 58, badge: "", tone: "cream", crop: "crop-cream", desc: "Ceramides + desert rose" },
  { id: 4, name: "Sunset Recovery Oil", price: 46, badge: "SALE", oldPrice: 54, tone: "coral", crop: "crop-oil", desc: "Sea buckthorn + squalane" },
  { id: 5, name: "Mineral Veil SPF 40", price: 42, badge: "", tone: "stone", crop: "crop-cream", desc: "Zinc oxide + red algae" },
  { id: 6, name: "Night Current Mask", price: 52, badge: "NEW", tone: "ink", crop: "crop-serum", desc: "Bio-retinol + sea fennel" },
  { id: 7, name: "Quiet Eye Concentrate", price: 49, badge: "", tone: "amber", crop: "crop-oil", desc: "Caffeine + evening primrose" },
  { id: 8, name: "Daily Water Essence", price: 38, badge: "", tone: "teal", crop: "crop-cleanser", desc: "Rice ferment + hyaluronic acid" },
];

const collections = [
  { title: "Hydration", sub: "For skin that drinks it in", crop: "collection-one" },
  { title: "Renewal", sub: "Gentle, steady transformation", crop: "collection-two" },
  { title: "Protection", sub: "Your daily atmospheric shield", crop: "collection-three" },
  { title: "Ritual Sets", sub: "A considered routine, together", crop: "collection-four" },
];

function usePath() {
  const initial = window.location.pathname === "/" ? "/page-home" : window.location.pathname;
  const [path, setPath] = useState(initial);
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  const navigate = (to) => {
    window.history.pushState({}, "", to);
    setPath(to);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return [path, navigate];
}

function Icon({ name }) {
  const icons = {
    menu: "☰",
    search: "⌕",
    bag: "□",
    account: "○",
    close: "×",
    arrow: "→",
    filter: "≡",
    plus: "+",
    minus: "−",
    location: "⌖",
  };
  return <span aria-hidden="true">{icons[name]}</span>;
}

function Link({ to, navigate, className = "", children, onClick }) {
  return (
    <a
      className={className}
      href={to}
      onClick={(e) => {
        e.preventDefault();
        onClick?.();
        navigate(to);
      }}
    >
      {children}
    </a>
  );
}

function Drawer({ open, onClose, title, side = "right", children }) {
  const closeRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    document.body.classList.add("drawer-active");
    closeRef.current?.focus();
    const key = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", key);
    return () => {
      document.body.classList.remove("drawer-active");
      window.removeEventListener("keydown", key);
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="drawer-layer">
      <button className="drawer-scrim" aria-label={`Close ${title}`} onClick={onClose} />
      <aside className={`drawer drawer-${side}`} role="dialog" aria-modal="true" aria-label={title}>
        <div className="drawer-head">
          <p className="eyebrow">{title}</p>
          <button ref={closeRef} className="icon-button" aria-label={`Close ${title}`} onClick={onClose}>
            <Icon name="close" />
          </button>
        </div>
        {children}
      </aside>
    </div>
  );
}

function Announcement() {
  return <div className="announcement">COMPLIMENTARY SHIPPING ON ORDERS $75+ <span>—</span> EASY RETURNS WITHIN 30 DAYS</div>;
}

function Header({ home, navigate, cartCount, onMenu, onSearch, onCart }) {
  return (
    <>
      <Announcement />
      <header className={`site-header ${home ? "header-overlay" : "header-solid"}`}>
        <button className="mobile-only bare-icon" aria-label="Open menu" onClick={onMenu}><Icon name="menu" /></button>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {routes.slice(0, 3).map(([label, to]) => <Link key={to} to={to} navigate={navigate}>{label}</Link>)}
        </nav>
        <Link to="/page-home" navigate={navigate} className="logo" aria-label="Cosmo home">COSMO</Link>
        <nav className="desktop-nav nav-right" aria-label="Utility navigation">
          <Link to="/page-content" navigate={navigate}>Journal</Link>
          <button onClick={onSearch}>Search</button>
          <Link to="/page-account" navigate={navigate}>Account</Link>
          <button className="bag-link" onClick={onCart}>Bag <span>{cartCount}</span></button>
        </nav>
        <div className="mobile-actions mobile-only">
          <button className="bare-icon" aria-label="Search" onClick={onSearch}><Icon name="search" /></button>
          <button className="bare-icon cart-mobile" aria-label={`Bag with ${cartCount} items`} onClick={onCart}>
            <Icon name="bag" /><small>{cartCount}</small>
          </button>
        </div>
      </header>
    </>
  );
}

function MenuDrawer({ open, onClose, navigate }) {
  const [shopOpen, setShopOpen] = useState(false);
  return (
    <Drawer open={open} onClose={onClose} title="Menu" side="left">
      <nav className="mobile-menu" aria-label="Mobile navigation">
        <button aria-expanded={shopOpen} onClick={() => setShopOpen(!shopOpen)}>
          Shop <Icon name={shopOpen ? "minus" : "plus"} />
        </button>
        {shopOpen && (
          <div className="submenu">
            <Link to="/page-collection" navigate={navigate} onClick={onClose}>All skincare</Link>
            <Link to="/page-collection-list" navigate={navigate} onClick={onClose}>Shop by concern</Link>
            <Link to="/page-product" navigate={navigate} onClick={onClose}>Bestsellers</Link>
          </div>
        )}
        {routes.slice(2).map(([label, to]) => <Link key={to} to={to} navigate={navigate} onClick={onClose}>{label}</Link>)}
        <Link to="/page-faq" navigate={navigate} onClick={onClose}>FAQ</Link>
      </nav>
      <div className="drawer-bottom">
        <Link to="/page-account" navigate={navigate} onClick={onClose} className="button button-primary">MY ACCOUNT</Link>
        <p className="social-line">Instagram &nbsp; Pinterest &nbsp; TikTok</p>
      </div>
    </Drawer>
  );
}

function SearchDrawer({ open, onClose, navigate }) {
  const [query, setQuery] = useState("");
  const matches = products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())).slice(0, 3);
  return (
    <Drawer open={open} onClose={onClose} title="Search">
      <form
        className="search-form"
        onSubmit={(e) => {
          e.preventDefault();
          onClose();
          navigate(`/page-search?q=${encodeURIComponent(query)}`);
        }}
      >
        <label className="sr-only" htmlFor="drawer-search">Search products</label>
        <input id="drawer-search" autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search COSMO" />
        <button aria-label="Submit search"><Icon name="arrow" /></button>
      </form>
      {!query ? (
        <>
          <p className="drawer-label">POPULAR SEARCHES</p>
          <div className="search-tags"><button onClick={() => setQuery("serum")}>Serum</button><button onClick={() => setQuery("cream")}>Moisturizer</button><button onClick={() => setQuery("night")}>Night ritual</button></div>
          <p className="drawer-label">MOST SEARCHED</p>
          {products.slice(0, 3).map((p) => <MiniProduct key={p.id} product={p} navigate={navigate} onClick={onClose} />)}
        </>
      ) : (
        <>
          <p className="drawer-label">{matches.length} PREDICTIVE RESULTS</p>
          {matches.map((p) => <MiniProduct key={p.id} product={p} navigate={navigate} onClick={onClose} />)}
        </>
      )}
    </Drawer>
  );
}

function MiniProduct({ product, navigate, onClick }) {
  return (
    <Link to="/page-product" navigate={navigate} onClick={onClick} className="mini-product">
      <div className={`mini-image ${product.crop}`} />
      <div><strong>{product.name}</strong><small>${product.price}.00</small></div>
    </Link>
  );
}

function CartDrawer({ open, onClose, navigate, cart, setCart }) {
  const subtotal = cart.reduce((s, p) => s + p.price * p.qty, 0);
  const change = (id, delta) => setCart((items) => items.map((p) => p.id === id ? { ...p, qty: Math.max(0, p.qty + delta) } : p).filter((p) => p.qty));
  return (
    <Drawer open={open} onClose={onClose} title={`Your bag (${cart.reduce((s, p) => s + p.qty, 0)})`}>
      {!cart.length ? (
        <div className="empty-drawer">
          <p className="serif-title">Your ritual is waiting.</p>
          <p>Begin with one of our most-loved collections.</p>
          <Link to="/page-collection" navigate={navigate} onClick={onClose} className="button button-secondary">SHOP BESTSELLERS</Link>
          <Link to="/page-collection-list" navigate={navigate} onClick={onClose} className="button button-secondary">SHOP BY CONCERN</Link>
          <Link to="/page-lookbook" navigate={navigate} onClick={onClose} className="button button-secondary">EXPLORE THE RITUAL</Link>
        </div>
      ) : (
        <>
          <div className="cart-lines">
            {cart.map((p) => (
              <div className="cart-line" key={p.id}>
                <div className={`mini-image ${p.crop}`} />
                <div className="cart-line-copy"><strong>{p.name}</strong><small>50 ml · One size</small>
                  <div className="qty"><button aria-label={`Decrease ${p.name}`} onClick={() => change(p.id, -1)}>−</button><span>{p.qty}</span><button aria-label={`Increase ${p.name}`} onClick={() => change(p.id, 1)}>+</button></div>
                </div>
                <span>${p.price * p.qty}.00</span>
              </div>
            ))}
          </div>
          <div className="cart-progress"><span style={{ width: `${Math.min(100, subtotal / 75 * 100)}%` }} /></div>
          <p className="center-copy">{subtotal >= 75 ? "You unlocked complimentary shipping." : `You're $${75 - subtotal} away from complimentary shipping.`}</p>
          <label className="gift-option"><input type="checkbox" /> Add complimentary gift wrapping</label>
          <div className="cart-total"><span>Subtotal</span><strong>${subtotal}.00 USD</strong></div>
          <button className="button button-primary full">CHECKOUT</button>
          <Link to="/page-cart" navigate={navigate} onClick={onClose} className="underline-link centered">VIEW BAG</Link>
        </>
      )}
    </Drawer>
  );
}

function Footer({ navigate }) {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <p className="eyebrow">SKIN, CONSIDERED</p>
        <h2 className="serif-title">A quieter kind of <em>confidence.</em></h2>
        <p>Thoughtful formulas. Real skin. Daily rituals that meet you where you are.</p>
      </div>
      <div className="footer-links">
        <div><p className="eyebrow">EXPLORE</p>{routes.slice(1).map(([l, to]) => <Link key={to} to={to} navigate={navigate}>{l}</Link>)}</div>
        <div><p className="eyebrow">HELP</p>{utilityRoutes.map(([l, to]) => <Link key={to} to={to} navigate={navigate}>{l}</Link>)}</div>
        <div className="newsletter">
          <p className="eyebrow">THE COSMO LETTER</p>
          <p>Notes on skin, ritual and living well.</p>
          <form onSubmit={(e) => e.preventDefault()}><label className="sr-only" htmlFor="email-footer">Email address</label><input id="email-footer" type="email" required placeholder="Email address" /><button aria-label="Join newsletter"><Icon name="arrow" /></button></form>
        </div>
      </div>
      <div className="footer-bottom"><span>© 2026 COSMO SKINCARE</span><span>TAIWAN / USD &nbsp; · &nbsp; INSTAGRAM &nbsp; PINTEREST</span></div>
    </footer>
  );
}

function SectionHeading({ eyebrow, title, copy, action }) {
  return (
    <div className="section-heading">
      <div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div>
      {copy && <p>{copy}</p>}
      {action && <span className="underline-link">{action}</span>}
    </div>
  );
}

function ProductCard({ product, navigate, onAdd }) {
  return (
    <article className="product-card">
      <Link to="/page-product" navigate={navigate} className={`product-image ${product.crop}`} aria-label={`View ${product.name}`}>
        {product.badge && <span className={`badge badge-${product.badge.toLowerCase()}`}>{product.badge}</span>}
        <span className="quick-view">QUICK VIEW</span>
      </Link>
      <div className="product-meta">
        <div><h3><Link to="/page-product" navigate={navigate}>{product.name}</Link></h3><p>{product.desc}</p></div>
        <p className="price">{product.oldPrice && <del>${product.oldPrice}</del>} ${product.price}.00</p>
      </div>
      {onAdd && <button className="text-add" onClick={() => onAdd(product)}>+ ADD TO BAG</button>}
    </article>
  );
}

function ProductGrid({ items = products.slice(0, 4), navigate, onAdd, className = "" }) {
  return <div className={`product-grid ${className}`}>{items.map((p) => <ProductCard key={p.id} product={p} navigate={navigate} onAdd={onAdd} />)}</div>;
}

function Breadcrumbs({ current, navigate }) {
  return <nav className="breadcrumbs" aria-label="Breadcrumb"><Link to="/page-home" navigate={navigate}>Home</Link><span>/</span><span aria-current="page">{current}</span></nav>;
}

function EditorialSplit({ reverse = false, eyebrow, title, copy, action = "DISCOVER OUR STORY", navigate }) {
  return (
    <section className={`editorial-split ${reverse ? "reverse" : ""}`}>
      <div className="editorial-image ritual-image" />
      <div className="editorial-copy">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="serif-title">{title}</h2>
        <p>{copy}</p>
        <Link to="/page-content" navigate={navigate} className="button button-primary">{action}</Link>
      </div>
    </section>
  );
}

function HomePage({ navigate, onAdd }) {
  const [routine, setRoutine] = useState(0);
  const [before, setBefore] = useState(50);
  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">A NEW ERA OF EVERYDAY SKINCARE</p>
          <h1>Skin, in its most <em>luminous</em> state.</h1>
          <p>High-performance formulas, made gentle enough for every day.</p>
          <Link to="/page-collection" navigate={navigate} className="button button-light">SHOP THE COLLECTION</Link>
        </div>
        <div className="hero-mark" aria-hidden="true">COSMO</div>
        <div className="hero-pager"><span>01</span><i /><span>03</span></div>
      </section>

      <main>
        <section className="section products-section">
          <SectionHeading eyebrow="ESSENTIALS, REFINED" title="Meet your skin's new constants." copy="Four considered formulas for a calm, resilient glow." action="SHOP ALL" />
          <div className="tabs" role="tablist" aria-label="Product categories"><button className="active" role="tab" aria-selected="true">BESTSELLERS</button><button role="tab">NEW ARRIVALS</button><button role="tab">SETS</button></div>
          <ProductGrid navigate={navigate} onAdd={onAdd} />
        </section>

        <EditorialSplit eyebrow="FORMULATED FOR REAL LIFE" title={<>Less noise. More <em>skin.</em></>} copy="We pair clinically studied actives with barrier-loving botanicals, creating formulas that work with your skin—not against it." navigate={navigate} />

        <section className="section routine">
          <div className="routine-intro"><p className="eyebrow">THE DAILY RITUAL</p><h2 className="serif-title">Three minutes.<br />A world of <em>difference.</em></h2><p>A simple rhythm that supports your skin from first light to last.</p></div>
          <div className="routine-list">
            {[
              ["01.", "Cleanse without compromise", "Lift the day away while keeping the barrier soft and balanced."],
              ["02.", "Flood with hydration", "Press in humectants and peptides while skin is still slightly damp."],
              ["03.", "Seal, shield, glow", "Lock in moisture and protect your progress from the everyday."],
            ].map(([n, title, copy], i) => (
              <div className={`routine-item ${routine === i ? "open" : ""}`} key={title}>
                <button aria-expanded={routine === i} onClick={() => setRoutine(i)}><span>{n}</span><strong>{title}</strong><Icon name={routine === i ? "minus" : "plus"} /></button>
                {routine === i && <div className="routine-detail"><p>{copy}</p><Link to="/page-collection" navigate={navigate}>EXPLORE STEP <Icon name="arrow" /></Link></div>}
              </div>
            ))}
          </div>
        </section>

        <section className="section collection-rail">
          <SectionHeading eyebrow="SHOP BY INTENTION" title="Find your skin's rhythm." />
          <div className="collection-cards">
            {collections.map((c) => <Link to="/page-collection" navigate={navigate} className={`collection-card ${c.crop}`} key={c.title}><span><strong>{c.title}</strong><small>{c.sub}</small></span></Link>)}
          </div>
        </section>

        <div className="marquee" aria-label="Service promises"><div>DERMATOLOGIST TESTED · VEGAN FORMULAS · MADE FOR SENSITIVE SKIN · THOUGHTFUL PACKAGING · </div></div>

        <section className="section before-after">
          <div className="comparison" style={{ "--split": `${before}%` }}>
            <div className="comparison-base ritual-image" /><div className="comparison-after hero-image-mask" />
            <span className="before-label">BEFORE</span><span className="after-label">AFTER 28 DAYS</span>
            <input aria-label="Before and after comparison" type="range" min="10" max="90" value={before} onChange={(e) => setBefore(e.target.value)} />
          </div>
          <div className="comparison-copy"><p className="eyebrow">VISIBLE, FELT RESULTS</p><h2 className="serif-title">Radiance that looks like <em>you.</em></h2><p>In a 28-day consumer study, 94% said skin felt smoother, and 89% saw a more even-looking tone.</p><Link to="/page-product" navigate={navigate} className="button button-primary">MEET DEW RESET</Link></div>
        </section>

        <section className="section press">
          <p className="quote-mark">“</p><blockquote>“COSMO understands that the future of beauty is not perfection—it is skin that feels deeply, visibly well.”</blockquote><p className="eyebrow">THE MODERN EDIT</p>
        </section>

        <section className="section social">
          <SectionHeading eyebrow="@COSMOSKIN" title="In the glow." copy="Rituals, textures and real skin from our community." />
          <div className="social-grid"><div className="ritual-image" /><div className="product-contact-image" /><div className="hero-crop" /><div className="ritual-crop-two" /></div>
        </section>
      </main>
    </>
  );
}

function FilterPanel({ filters, setFilters }) {
  return (
    <div className="filter-panel">
      {["Concern", "Product type", "Ingredient"].map((group, idx) => (
        <fieldset key={group}><legend>{group}</legend>
          {(idx === 0 ? ["Dryness", "Dullness", "Sensitivity"] : idx === 1 ? ["Serums", "Cleansers", "Moisturizers"] : ["Peptides", "Ceramides", "Botanicals"]).map((v) =>
            <label key={v}><input type="checkbox" checked={filters.includes(v)} onChange={() => setFilters((f) => f.includes(v) ? f.filter((x) => x !== v) : [...f, v])} /> <span>{v}</span></label>)}
        </fieldset>
      ))}
    </div>
  );
}

function CollectionPage({ navigate, onAdd }) {
  const [filters, setFilters] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sort, setSort] = useState("featured");
  const sorted = [...products].sort((a, b) => sort === "low" ? a.price - b.price : sort === "high" ? b.price - a.price : a.id - b.id);
  return (
    <main>
      <div className="page-container"><Breadcrumbs current="Face care" navigate={navigate} /></div>
      <section className="collection-banner">
        <div><p className="eyebrow">THE FULL RITUAL</p><h1>Face care</h1><p>Intentional formulas for calm, bright, resilient skin.</p></div>
      </section>
      <section className="collection-layout page-container">
        <aside className="desktop-filters"><p className="eyebrow">FILTER BY</p><FilterPanel filters={filters} setFilters={setFilters} /></aside>
        <div className="collection-products">
          <div className="collection-tools"><button className="mobile-filter-button" onClick={() => setFilterOpen(true)}><Icon name="filter" /> FILTER & SORT {filters.length ? `(${filters.length})` : ""}</button><span>{sorted.length} PRODUCTS</span><label className="desktop-sort">SORT BY <select value={sort} onChange={(e) => setSort(e.target.value)}><option value="featured">Featured</option><option value="low">Price, low to high</option><option value="high">Price, high to low</option></select></label></div>
          {filters.length > 0 && <div className="active-filters">{filters.map((f) => <button key={f} onClick={() => setFilters(filters.filter((x) => x !== f))}>{f} ×</button>)}<button onClick={() => setFilters([])}>Clear all</button></div>}
          <ProductGrid items={sorted} navigate={navigate} onAdd={onAdd} />
        </div>
      </section>
      <Drawer open={filterOpen} onClose={() => setFilterOpen(false)} title="Filter & sort">
        <label className="drawer-sort">SORT BY<select value={sort} onChange={(e) => setSort(e.target.value)}><option value="featured">Featured</option><option value="low">Price, low to high</option><option value="high">Price, high to low</option></select></label>
        <FilterPanel filters={filters} setFilters={setFilters} />
        <button className="button button-primary full" onClick={() => setFilterOpen(false)}>SHOW {sorted.length} PRODUCTS</button>
      </Drawer>
    </main>
  );
}

function Accordion({ items }) {
  const [open, setOpen] = useState(null);
  return <div className="accordion">{items.map(([q, a], i) => <div className="accordion-item" key={q}><button aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}><span>{q}</span><Icon name={open === i ? "minus" : "plus"} /></button>{open === i && <div className="accordion-content"><p>{a}</p></div>}</div>)}</div>;
}

function ProductPage({ navigate, onAdd }) {
  const p = products[0];
  const [size, setSize] = useState("50 ML");
  return (
    <main>
      <div className="page-container"><Breadcrumbs current={p.name} navigate={navigate} /></div>
      <section className="product-detail page-container">
        <div className="gallery">
          <div className="gallery-tile crop-serum" /><div className="gallery-tile ritual-product-crop" /><div className="gallery-tile wide product-contact-image" />
        </div>
        <div className="purchase-panel">
          <p className="eyebrow">BARRIER SUPPORT · RADIANCE</p><h1>{p.name}</h1><p className="product-subtitle">{p.desc}</p>
          <div className="rating">★★★★★ <span>4.9 · 124 REVIEWS</span></div>
          <p className="product-price">${p.price}.00 USD</p>
          <p>A silky, water-light concentrate that cushions the skin with deep hydration and supports a brighter, more even-looking glow.</p>
          <fieldset className="variant-field"><legend>SIZE <span>{size}</span></legend><div>{["30 ML", "50 ML"].map((s) => <button className={size === s ? "selected" : ""} key={s} onClick={() => setSize(s)}>{s}</button>)}</div></fieldset>
          <button className="button button-primary full add-main" onClick={() => onAdd(p)}>ADD TO BAG — ${p.price}.00</button>
          <div className="purchase-promises"><span>⌁ Free shipping $75+</span><span>♲ Easy 30-day returns</span></div>
          <Accordion items={[["How to use", "Press 2–3 drops into clean, slightly damp skin morning and evening. Follow with moisturizer."], ["Key ingredients", "Bio-fermented peptides, snow mushroom, beta-glucan and ectoin."], ["Full ingredient list", "Aqua, glycerin, tremella extract, peptide complex, beta-glucan, ectoin and skin-safe preservatives."]]} />
        </div>
      </section>
      <div className="marquee"><div>HYDRATES DEEPLY · SUPPORTS THE BARRIER · SOFTENS TEXTURE · BOOSTS RADIANCE · </div></div>
      <EditorialSplit reverse eyebrow="THE SCIENCE OF SOFTNESS" title={<>Your barrier, <em>better supported.</em></>} copy="Ectoin and beta-glucan help defend against daily stress while fermented peptides support skin's natural renewal process." navigate={navigate} action="READ THE RESEARCH" />
      <section className="section"><SectionHeading eyebrow="PAIRS WELL WITH" title="Complete the ritual." /><ProductGrid items={products.slice(1, 5)} navigate={navigate} onAdd={onAdd} /></section>
    </main>
  );
}

function SearchPage({ navigate, onAdd }) {
  const initial = new URLSearchParams(window.location.search).get("q") || "serum";
  const [query, setQuery] = useState(initial);
  const [submitted, setSubmitted] = useState(initial);
  const matches = submitted ? products.filter((p) => `${p.name} ${p.desc}`.toLowerCase().includes(submitted.toLowerCase())) : products;
  return (
    <main className="page-container search-page">
      <Breadcrumbs current="Search" navigate={navigate} />
      <div className="search-header"><p className="eyebrow">DISCOVER</p><h1>Search</h1>
        <form onSubmit={(e) => { e.preventDefault(); setSubmitted(query); }}><label className="sr-only" htmlFor="page-search">Search products</label><input id="page-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="What are you looking for?" /><button><Icon name="arrow" /></button></form>
      </div>
      {matches.length ? <><div className="results-title"><h2>Results for “{submitted}”</h2><span>{matches.length} PRODUCTS</span></div><ProductGrid items={matches} navigate={navigate} onAdd={onAdd} /></> :
        <div className="no-results"><h2 className="serif-title">Nothing surfaced—<em>yet.</em></h2><p>Try a broader term, or explore our most-loved essentials.</p><button className="button button-secondary" onClick={() => { setQuery(""); setSubmitted(""); }}>CLEAR SEARCH</button><div><p className="eyebrow">POPULAR SEARCHES</p><button onClick={() => { setQuery("serum"); setSubmitted("serum"); }}>Serum</button><button onClick={() => { setQuery("cream"); setSubmitted("cream"); }}>Cream</button><button onClick={() => { setQuery("oil"); setSubmitted("oil"); }}>Oil</button></div></div>}
    </main>
  );
}

function CartPage({ navigate, cart, setCart }) {
  const subtotal = cart.reduce((s, p) => s + p.price * p.qty, 0);
  return (
    <main className="page-container cart-page">
      <Breadcrumbs current="Your bag" navigate={navigate} />
      <div className="page-title-row"><div><p className="eyebrow">YOUR RITUAL</p><h1>Your bag</h1></div><span>{cart.length} {cart.length === 1 ? "ITEM" : "ITEMS"}</span></div>
      {!cart.length ? <div className="cart-empty-page"><h2 className="serif-title">There is room for <em>ritual.</em></h2><p>Your bag is empty. Begin with a formula made to meet your skin where it is.</p><Link to="/page-collection" navigate={navigate} className="button button-primary">EXPLORE SKINCARE</Link></div> :
        <div className="cart-page-grid"><div>{cart.map((p) => <div className="cart-page-line" key={p.id}><div className={`cart-page-img ${p.crop}`} /><div><h2>{p.name}</h2><p>{p.desc}</p><p>50 ml · One size</p><button className="underline-link" onClick={() => setCart(cart.filter((x) => x.id !== p.id))}>REMOVE</button></div><strong>${p.price * p.qty}.00</strong></div>)}</div><aside className="order-summary"><p className="eyebrow">ORDER SUMMARY</p><div><span>Subtotal</span><strong>${subtotal}.00</strong></div><div><span>Shipping</span><span>{subtotal >= 75 ? "Complimentary" : "Calculated at checkout"}</span></div><div className="summary-total"><span>Total</span><strong>${subtotal}.00 USD</strong></div><button className="button button-primary full">CHECKOUT</button><p>Taxes calculated at checkout. Easy returns within 30 days.</p></aside></div>}
      <section className="cart-recommendations"><SectionHeading eyebrow="A CONSIDERED ADDITION" title="You may also love." /><ProductGrid items={products.slice(4, 8)} navigate={navigate} onAdd={(p) => setCart((c) => [...c, { ...p, qty: 1 }])} /></section>
    </main>
  );
}

function NotFoundPage({ navigate }) {
  return <main className="not-found-page"><div className="not-found-art"><span>4</span><div className="moon">0</div><span>4</span></div><p className="eyebrow">THIS PAGE HAS DRIFTED</p><h1 className="serif-title">Let's find your way <em>back.</em></h1><p>The page you were looking for is no longer here, but your next ritual might be.</p><div><Link to="/page-home" navigate={navigate} className="button button-primary">RETURN HOME</Link><Link to="/page-collection" navigate={navigate} className="button button-secondary">SHOP SKINCARE</Link></div></main>;
}

function CollectionListPage({ navigate }) {
  return <main><div className="page-container"><Breadcrumbs current="Collections" navigate={navigate} /><div className="center-heading"><p className="eyebrow">SHOP BY INTENTION</p><h1>Collections</h1><p>Find the formulas that fit your skin, your rhythm and your every day.</p></div><div className="collection-index">{collections.map((c, i) => <Link to="/page-collection" navigate={navigate} className={`collection-index-card ${c.crop}`} key={c.title}><span>0{i + 1}</span><div><h2>{c.title}</h2><p>{c.sub}</p><i>EXPLORE <Icon name="arrow" /></i></div></Link>)}</div></div><section className="promo-banner"><div><p className="eyebrow">THE RITUAL EDIT</p><h2 className="serif-title">Better <em>together.</em></h2><p>Build a three-step routine and receive 15% off the set.</p><Link to="/page-collection" navigate={navigate} className="button button-light">BUILD YOUR SET</Link></div></section></main>;
}

function ContentPage({ navigate }) {
  const [tab, setTab] = useState(0);
  return <main>
    <section className="content-hero"><div><p className="eyebrow">OUR PHILOSOPHY</p><h1 className="serif-title">Care for the skin<br />you're <em>in.</em></h1><p>Not correction. Not perfection. Just considered care for real, changing, lived-in skin.</p></div></section>
    <section className="brand-statement section"><p className="eyebrow">THE COSMO POINT OF VIEW</p><h2 className="serif-title">We believe skin is not a problem to solve. It is an intelligent, living <em>ecosystem</em> to support.</h2></section>
    <EditorialSplit eyebrow="WHY WE BEGAN" title={<>Skincare, brought back to <em>earth.</em></>} copy="COSMO began with a simple frustration: more products were creating more confusion. We wanted fewer, better formulas—ones grounded in evidence, elevated by nature and pleasurable enough to use every day." navigate={navigate} action="OUR FORMULATION STANDARD" />
    <section className="section values"><SectionHeading eyebrow="WHAT GUIDES US" title="Our standard, in three parts." /><div>{[["01", "Proof over promises", "We use clinically studied ingredients at meaningful levels."], ["02", "Gentle is powerful", "Barrier health is the foundation of every visible result."], ["03", "Pleasure has purpose", "Texture, scent and ritual help consistency become second nature."]].map(([n, t, c]) => <article key={n}><span>{n}</span><h3>{t}</h3><p>{c}</p></article>)}</div></section>
    <section className="section philosophy-tabs"><div className="tab-image ritual-image" /><div><p className="eyebrow">INSIDE EVERY FORMULA</p><div className="tab-buttons" role="tablist">{["CLINICAL", "BOTANICAL", "SENSORIAL"].map((x, i) => <button key={x} className={tab === i ? "active" : ""} onClick={() => setTab(i)} role="tab" aria-selected={tab === i}>{x}</button>)}</div><h2 className="serif-title">{["Evidence you can feel.", "Nature, precisely chosen.", "A ritual worth repeating."][tab]}</h2><p>{["Peer-reviewed actives selected for proven benefit, stability and skin compatibility.", "Adaptogenic and barrier-supporting botanicals, sourced with traceability in mind.", "Elegant textures and subtle natural aromas make daily care a moment of return."][tab]}</p></div></section>
  </main>;
}

const faqItems = [
  ["Which products are best for sensitive skin?", "Every COSMO formula is developed with sensitive skin in mind. Start with Cloud Milk Cleanser, Dew Reset Serum and Soft Focus Cream for a simple barrier-first ritual."],
  ["Can I use COSMO during pregnancy?", "Our formulas avoid retinoids unless clearly identified. We always recommend sharing the full ingredient list with your healthcare provider."],
  ["How long until I see results?", "Hydration and comfort may be noticeable immediately. Tone, texture and resilience typically improve with consistent use over four to eight weeks."],
  ["Are your products vegan and cruelty-free?", "Yes. All current COSMO products are vegan and never tested on animals."],
  ["How should I layer my routine?", "Apply products from thinnest to richest: cleanse, essence, serum, eye treatment, moisturizer, then SPF in the morning."],
  ["Do you offer samples?", "Complimentary sachets are included with qualifying orders while supplies last."],
];

function FaqPage({ navigate }) {
  return <main className="page-container narrow-page"><Breadcrumbs current="FAQ" navigate={navigate} /><div className="center-heading"><p className="eyebrow">HERE TO HELP</p><h1>Frequently asked questions</h1><p>Everything you need to make your ritual feel simple.</p></div><div className="faq-layout"><aside><h2 className="serif-title">Need something more <em>personal?</em></h2><p>Our care team is here Monday–Friday, 9am–5pm.</p><Link to="/page-contact" navigate={navigate} className="button button-secondary">CONTACT US</Link></aside><Accordion items={faqItems} /></div></main>;
}

function ContactPage({ navigate }) {
  const [sent, setSent] = useState(false);
  return <main className="page-container narrow-page"><Breadcrumbs current="Contact" navigate={navigate} /><div className="center-heading"><p className="eyebrow">LET'S TALK SKIN</p><h1>Contact us</h1><p>Questions, feedback or ritual advice—we're listening.</p></div><div className="contact-grid"><aside><h2 className="serif-title">We're here to <em>help.</em></h2><div className="contact-detail"><p className="eyebrow">CUSTOMER CARE</p><a href="mailto:hello@cosmoskin.example">hello@cosmoskin.example</a><p>Monday–Friday, 9am–5pm</p></div><div className="contact-detail"><p className="eyebrow">STUDIO</p><p>18 Quiet Light Lane<br />Taipei, Taiwan</p></div><Link to="/page-content" navigate={navigate} className="underline-link"><Icon name="location" /> FIND A STOCKIST</Link></aside>{sent ? <div className="form-success" role="status"><span>✓</span><h2>Message received.</h2><p>Thank you for reaching out. Our care team will reply within two business days.</p><button className="button button-secondary" onClick={() => setSent(false)}>SEND ANOTHER</button></div> : <form className="contact-form" onSubmit={(e) => { e.preventDefault(); setSent(true); }}><div className="field-row"><label>FIRST NAME<input required /></label><label>LAST NAME<input required /></label></div><label>EMAIL<input type="email" required /></label><label>TOPIC<select required defaultValue=""><option value="" disabled>Select a topic</option><option>Product guidance</option><option>Order support</option><option>Press & partnerships</option></select></label><label>MESSAGE<textarea required rows="6" /></label><button className="button button-primary">SEND MESSAGE</button></form>}</div></main>;
}

function AccountPage({ navigate }) {
  const [mode, setMode] = useState("login");
  return <main className="account-page"><div className="account-art ritual-image"><div><p className="eyebrow">YOUR COSMO</p><h2 className="serif-title">Your ritual,<br /><em>remembered.</em></h2></div></div><div className="account-form-wrap"><Link to="/page-home" navigate={navigate} className="account-logo">COSMO</Link>{mode === "login" ? <><p className="eyebrow">WELCOME BACK</p><h1>Sign in</h1><p>Access your orders, preferences and saved ritual.</p><form onSubmit={(e) => e.preventDefault()}><label>EMAIL<input type="email" required /></label><label>PASSWORD<input type="password" required /></label><button className="text-link" type="button" onClick={() => setMode("reset")}>Forgot password?</button><button className="button button-primary full">SIGN IN</button></form><p className="account-switch">New to COSMO? <button onClick={() => setMode("register")}>Create an account</button></p></> : mode === "reset" ? <><button className="back-link" onClick={() => setMode("login")}>← BACK</button><p className="eyebrow">RESET PASSWORD</p><h1>Find your way back.</h1><p>We'll send a secure reset link to your inbox.</p><form onSubmit={(e) => e.preventDefault()}><label>EMAIL<input type="email" required /></label><button className="button button-primary full">SEND RESET LINK</button></form></> : <><button className="back-link" onClick={() => setMode("login")}>← BACK</button><p className="eyebrow">JOIN COSMO</p><h1>Create account</h1><p>Save your ritual and follow every order.</p><form onSubmit={(e) => e.preventDefault()}><label>FIRST NAME<input required /></label><label>EMAIL<input type="email" required /></label><label>PASSWORD<input type="password" required minLength="8" /></label><button className="button button-primary full">CREATE ACCOUNT</button></form></>}</div></main>;
}

function LookbookPage({ navigate }) {
  const [hotspot, setHotspot] = useState(null);
  return <main>
    <section className="lookbook-hero"><div><p className="eyebrow">VOLUME 01 · HIGH TIDE</p><h1 className="serif-title">The ritual of <em>return.</em></h1><p>A study in water, light and the quiet confidence of cared-for skin.</p></div></section>
    <section className="lookbook-intro section"><span>01</span><div><p className="eyebrow">THE MORNING CURRENT</p><h2 className="serif-title">Begin with what the skin already <em>knows.</em></h2><p>Water. Warmth. A few deliberate movements. The first ritual is not about transformation, but return.</p></div></section>
    <section className="hotspot-scene">
      {[{ x: "28%", y: "60%", id: 0 }, { x: "78%", y: "72%", id: 1 }].map((h) => <button key={h.id} className="hotspot" style={{ left: h.x, top: h.y }} aria-label={`Show ${products[h.id].name}`} aria-expanded={hotspot === h.id} onClick={() => setHotspot(hotspot === h.id ? null : h.id)}>+</button>)}
      {hotspot !== null && <div className="hotspot-card" style={{ left: hotspot ? "55%" : "12%", top: hotspot ? "55%" : "38%" }}><div className={`mini-image ${products[hotspot].crop}`} /><div><p className="eyebrow">IN THE RITUAL</p><strong>{products[hotspot].name}</strong><small>${products[hotspot].price}.00</small><Link to="/page-product" navigate={navigate}>VIEW PRODUCT →</Link></div></div>}
    </section>
    <section className="lookbook-grid section"><div className="ritual-crop-two" /><div><span>02</span><p className="eyebrow">MIDDAY LIGHT</p><h2 className="serif-title">Protection without <em>distance.</em></h2><p>Invisible layers that move with the day—never masking the skin beneath.</p><Link to="/page-collection" navigate={navigate} className="underline-link">EXPLORE PROTECTION</Link></div><div className="product-contact-image" /></section>
    <section className="lookbook-end"><p className="eyebrow">END OF VOLUME 01</p><h2 className="serif-title">Carry the ritual <em>home.</em></h2><Link to="/page-collection" navigate={navigate} className="button button-light">SHOP THE EDIT</Link></section>
  </main>;
}

function App() {
  const [path, navigate] = usePath();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [notice, setNotice] = useState("");
  const cartCount = cart.reduce((s, p) => s + p.qty, 0);
  const add = (product) => {
    setCart((items) => items.some((x) => x.id === product.id) ? items.map((x) => x.id === product.id ? { ...x, qty: x.qty + 1 } : x) : [...items, { ...product, qty: 1 }]);
    setNotice(`${product.name} added to your bag.`);
    window.setTimeout(() => setNotice(""), 2200);
  };
  const basePath = path.split("?")[0];
  const page = useMemo(() => {
    const props = { navigate, onAdd: add };
    switch (basePath) {
      case "/page-home": return <HomePage {...props} />;
      case "/page-collection": return <CollectionPage {...props} />;
      case "/page-product": return <ProductPage {...props} />;
      case "/page-search": return <SearchPage {...props} />;
      case "/page-cart": return <CartPage navigate={navigate} cart={cart} setCart={setCart} />;
      case "/page-not-found": return <NotFoundPage navigate={navigate} />;
      case "/page-collection-list": return <CollectionListPage navigate={navigate} />;
      case "/page-content": return <ContentPage navigate={navigate} />;
      case "/page-faq": return <FaqPage navigate={navigate} />;
      case "/page-contact": return <ContactPage navigate={navigate} />;
      case "/page-account": return <AccountPage navigate={navigate} />;
      case "/page-lookbook": return <LookbookPage navigate={navigate} />;
      default: return <NotFoundPage navigate={navigate} />;
    }
  }, [basePath, cart]);
  const noShellFooter = basePath === "/page-account";
  return (
    <div className="app">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Header home={basePath === "/page-home"} navigate={navigate} cartCount={cartCount} onMenu={() => setMenuOpen(true)} onSearch={() => setSearchOpen(true)} onCart={() => setCartOpen(true)} />
      <div id="main-content">{page}</div>
      {!noShellFooter && <Footer navigate={navigate} />}
      <MenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} navigate={navigate} />
      <SearchDrawer open={searchOpen} onClose={() => setSearchOpen(false)} navigate={navigate} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} navigate={navigate} cart={cart} setCart={setCart} />
      <div className={`toast ${notice ? "show" : ""}`} role="status" aria-live="polite">{notice}</div>
    </div>
  );
}

export default App;
