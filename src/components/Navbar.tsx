import Link from "next/link";
import Image from "next/image";

const CATEGORIES = [
  {
    slug: "sweets",
    label: "Sweets & Mithai",
    badge: "Pure Ghee",
    bg: "bg-[#fce7f3]", // pastel pink
    border: "border-pink-200",
    image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=200&q=80",
    emoji: "🍬",
  },
  {
    slug: "cakes",
    label: "Fresh Cakes",
    badge: "Eggless",
    bg: "bg-[#fef9c3]", // pastel yellow
    border: "border-yellow-200",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&q=80",
    emoji: "🎂",
  },
  {
    slug: "snacks",
    label: "Spicy Savouries",
    badge: "Crunchy",
    bg: "bg-[#ffedd5]", // pastel peach
    border: "border-orange-200",
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=200&q=80",
    emoji: "🌶️",
  },
  {
    slug: "festival-boxes",
    label: "Festival Hampers",
    badge: "Best for Gifting",
    bg: "bg-[#fef08a]", // pastel gold
    border: "border-amber-300",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=200&q=80",
    emoji: "🪔",
  },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-stone-100">
      {/* ── Top Announcement Bar (Bombay Sweet Shop plum) ── */}
      <div className="bg-[#871a45] text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <span className="text-[#F8D030]">✨</span>
            <span className="font-semibold tracking-wide">
              Free Delivery in Vijayawada on orders above ₹999 &nbsp;•&nbsp; 100% Pure Desi Cow Ghee
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-xs font-medium">
            <span className="text-white/70">Governorpet Shop: 7:00 AM – 10:30 PM</span>
            <a
              href="tel:+919848022338"
              className="flex items-center gap-1.5 text-[#F8D030] hover:text-white transition-colors font-bold touch-manipulation"
              aria-label="Call Kanaka Sweets"
            >
              <span>📞</span> +91 98480 22338
            </a>
          </div>
        </div>
      </div>

      {/* ── Main White Header ── */}
      <div className="bg-white border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4 sm:gap-8">
          {/* Brand Logo with Artisanal Emblem Lockup */}
          <Link
            href="/"
            className="flex items-center gap-3 shrink-0 group"
            aria-label="Kanaka Sweets & Bakery Homepage"
          >
            {/* Retro emblem badge */}
            <div className="w-11 h-11 rounded-full bg-[#871a45] flex items-center justify-center text-[#F8D030] shadow-sm group-hover:scale-105 transition-transform">
              <span className="text-xl">🪔</span>
            </div>
            <div className="flex flex-col leading-tight">
              <span
                className="font-serif text-2xl sm:text-3xl font-extrabold text-[#002c3f] tracking-tight group-hover:text-[#871a45] transition-colors"
                style={{ fontFamily: "var(--font-fraunces)" }}
              >
                Kanaka
              </span>
              <div className="flex items-center gap-1.5 -mt-0.5">
                <span
                  className="text-[10px] tracking-[0.25em] uppercase text-[#871a45] font-bold"
                  style={{ fontFamily: "var(--font-jost)" }}
                >
                  Sweets &amp; Bakery
                </span>
                <span className="text-[9px] text-stone-400 font-medium hidden sm:inline">
                  • Estd. 2011
                </span>
              </div>
            </div>
          </Link>

          {/* BSS-style Pill Search Bar (Center) */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <input
              type="text"
              readOnly
              placeholder="Search for Pootharekulu, Kaju Katli, Mysore Pak..."
              className="w-full bg-[#f4f4f4] hover:bg-[#eaeaea] text-[#002c3f] placeholder-stone-400 text-sm py-2.5 pl-4 pr-10 rounded-full border border-transparent focus:border-[#871a45] focus:outline-none transition-all cursor-pointer"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-base">
              🔍
            </span>
          </div>

          {/* Right Action Icons & WhatsApp */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Quick call link (mobile only) */}
            <a
              href="tel:+919848022338"
              className="sm:hidden p-2 rounded-full border border-stone-200 text-[#002c3f] hover:text-[#871a45] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Call shop"
            >
              📞
            </a>

            {/* WhatsApp Concierge Order Button */}
            <a
              href="https://wa.me/919848022338?text=Hello%20Kanaka%20Sweets,%20I%20would%20like%20to%20place%20an%20order"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 bg-[#25D366] text-white text-xs font-bold px-4 py-2.5 rounded-full hover:bg-[#20ba59] transition-all shadow-sm min-h-[44px]"
              aria-label="Chat with Kanaka Sweets on WhatsApp"
            >
              <span className="text-sm">💬</span>
              <span>WhatsApp Order</span>
            </a>

            {/* Shopping Bag with Counter */}
            <Link
              href="/cart"
              className="relative inline-flex items-center justify-center w-11 h-11 rounded-full border border-stone-200 hover:border-[#871a45] hover:text-[#871a45] transition-colors text-stone-800"
              aria-label="Shopping Cart"
            >
              <span className="text-xl">🛍️</span>
              <span
                id="cart-badge-count"
                className="absolute -top-1 -right-1 bg-[#871a45] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm"
              >
                0
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Signature BSS Category Stories Ribbon (Full Width Cream Strip) ── */}
      <div className="bg-[#FAF6EF] border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-start sm:justify-center gap-6 sm:gap-10 overflow-x-auto no-scrollbar py-3.5">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className="flex flex-col items-center gap-1.5 group shrink-0 min-w-[76px]"
              >
                {/* Circular Illustrated Avatar Disc (BSS Style) */}
                <div
                  className={`w-16 h-16 sm:w-18 sm:h-18 rounded-full ${cat.bg} border ${cat.border} shadow-sm group-hover:scale-105 group-hover:shadow-md transition-all duration-200 flex items-center justify-center relative overflow-hidden`}
                >
                  <span className="text-2xl sm:text-3xl select-none group-hover:scale-110 transition-transform">
                    {cat.emoji}
                  </span>
                </div>

                {/* Category Label */}
                <span
                  className="text-xs sm:text-sm font-semibold text-[#002c3f] group-hover:text-[#871a45] transition-colors text-center whitespace-nowrap"
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
