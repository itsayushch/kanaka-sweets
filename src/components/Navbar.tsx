import Link from "next/link";

const CATEGORIES = [
  { slug: "sweets", label: "Sweets", emoji: "🍬" },
  { slug: "cakes", label: "Cakes", emoji: "🎂" },
  { slug: "snacks", label: "Snacks", emoji: "🌶️" },
  { slug: "festival-boxes", label: "Festival Boxes", emoji: "🪔" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      {/* ── Announcement Bar ── */}
      <div className="bg-[#871a45] text-white text-xs text-center py-2 px-4 flex items-center justify-between gap-4">
        <span className="hidden sm:inline font-medium tracking-wide">
          🎁&nbsp; Free delivery on orders above ₹999 &nbsp;•&nbsp; Pure Desi
          Ghee, Zero Preservatives
        </span>
        <span className="sm:hidden font-medium">
          Free delivery above ₹999 &nbsp;•&nbsp; Pure Ghee
        </span>
        {/* 1-tap call (Rule B3) */}
        <a
          href="tel:+919848022338"
          className="flex items-center gap-1.5 font-semibold hover:text-yellow-200 transition-colors whitespace-nowrap py-1 touch-manipulation"
          aria-label="Call Kanaka Sweets at +91 98480 22338"
        >
          📞 <span className="hidden sm:inline">+91 98480 22338</span>
          <span className="sm:hidden">Call Now</span>
        </a>
      </div>

      {/* ── Main Header ── */}
      <div className="border-b border-stone-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex flex-col leading-tight shrink-0"
            aria-label="Kanaka Sweets & Bakery — Home"
          >
            <span
              className="font-serif text-[#871a45] text-xl sm:text-2xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-fraunces)" }}
            >
              Kanaka
            </span>
            <span
              className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-[#002c3f] font-semibold -mt-0.5"
              style={{ fontFamily: "var(--font-jost)" }}
            >
              Sweets &amp; Bakery
            </span>
          </Link>

          {/* Desktop category nav */}
          <nav
            className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#002c3f]"
            style={{ fontFamily: "var(--font-jost)" }}
            aria-label="Main Navigation"
          >
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className={`hover:text-[#871a45] transition-colors py-1 border-b-2 border-transparent hover:border-[#871a45] ${
                  cat.slug === "festival-boxes"
                    ? "text-[#871a45] font-bold"
                    : ""
                }`}
              >
                {cat.slug === "festival-boxes" ? `🪔 ${cat.label}` : cat.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* WhatsApp (B3) */}
            <a
              href="https://wa.me/919848022338?text=Hello%20Kanaka%20Sweets,%20I%20would%20like%20to%20place%20an%20order"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 bg-[#25D366] text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-[#20ba59] transition-colors min-h-[44px] shadow-sm"
              aria-label="Chat with Kanaka Sweets on WhatsApp"
            >
              💬 <span className="hidden md:inline">WhatsApp</span>
            </a>

            {/* Cart badge (Phase 2 will wire Zustand count) */}
            <Link
              href="/cart"
              className="relative inline-flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-stone-200 hover:border-[#871a45] hover:text-[#871a45] transition-colors"
              aria-label="View Shopping Cart"
            >
              <span className="text-lg">🛒</span>
              <span
                id="cart-badge-count"
                className="absolute -top-1 -right-1 bg-[#871a45] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
              >
                0
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Category Strip (mobile + desktop) ── */}
      <div className="bg-[#FAF6EF] border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2.5 lg:hidden">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className={`flex-shrink-0 flex flex-col items-center gap-1 group`}
              >
                <span className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-xl border border-stone-100 group-hover:border-[#871a45] transition-colors">
                  {cat.emoji}
                </span>
                <span
                  className="text-[10px] font-semibold text-[#002c3f] group-hover:text-[#871a45] transition-colors whitespace-nowrap"
                  style={{ fontFamily: "var(--font-jost)" }}
                >
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
