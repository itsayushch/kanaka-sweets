import Link from "next/link";
import Image from "next/image";
import {
  PhoneIcon,
  WhatsAppIcon,
  ShoppingBagIcon,
  SearchIcon,
  SparklesIcon,
  KanakaEmblemIcon,
} from "@/components/icons";

const CATEGORIES = [
  {
    slug: "sweets",
    label: "Sweets & Mithai",
    image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=240&q=80",
  },
  {
    slug: "cakes",
    label: "Fresh Cakes",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=240&q=80",
  },
  {
    slug: "snacks",
    label: "Spicy Savouries",
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=240&q=80",
  },
  {
    slug: "festival-boxes",
    label: "Festival Hampers",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=240&q=80",
  },
];

export function Navbar() {
  return (
    <>
      <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-stone-100">
      {/* ── Top Announcement Bar (Plum #871a45) ── */}
      <div className="bg-[#871a45] text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <SparklesIcon className="w-3.5 h-3.5 text-[#F8D030]" />
            <span className="font-semibold tracking-wide">
              Free Delivery in Vijayawada on orders above ₹999 &nbsp;•&nbsp; 100% Pure Desi Cow Ghee
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-xs font-medium">
            <span className="text-white/70">Governorpet Shop: 7:00 AM – 10:30 PM</span>
            <a
              href="tel:+919848022338"
              className="flex items-center gap-1.5 text-[#F8D030] hover:text-white transition-colors font-bold touch-manipulation"
              aria-label="Call Kanaka Sweets at +91 98480 22338"
            >
              <PhoneIcon className="w-3.5 h-3.5" />
              <span>+91 98480 22338</span>
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
              <KanakaEmblemIcon className="w-6 h-6 text-[#F8D030]" />
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
            <SearchIcon className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4 pointer-events-none" />
          </div>

          {/* Right Action Icons & WhatsApp */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Quick call link (mobile only) */}
            <a
              href="tel:+919848022338"
              className="sm:hidden p-2 rounded-full border border-stone-200 text-[#002c3f] hover:text-[#871a45] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Call shop directly"
            >
              <PhoneIcon className="w-5 h-5" />
            </a>

            {/* WhatsApp Concierge Order Button */}
            <a
              href="https://wa.me/919848022338?text=Hello%20Kanaka%20Sweets,%20I%20would%20like%20to%20place%20an%20order"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 bg-[#25D366] text-white text-xs font-bold px-4 py-2.5 rounded-full hover:bg-[#20ba59] transition-all shadow-sm min-h-[44px]"
              aria-label="Chat with Kanaka Sweets on WhatsApp"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>WhatsApp Order</span>
            </a>

            {/* Shopping Bag with Counter */}
            <Link
              href="/cart"
              className="relative inline-flex items-center justify-center w-11 h-11 rounded-full border border-stone-200 hover:border-[#871a45] hover:text-[#871a45] transition-colors text-stone-800"
              aria-label="Shopping Cart"
            >
              <ShoppingBagIcon className="w-5 h-5 text-[#002c3f]" />
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
    </header>

      {/* ── Signature BSS Category Stories Ribbon (Scrolls naturally with page, NOT sticky) ── */}
      <nav aria-label="Category Stories" className="bg-[#FAF6EF] border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-start sm:justify-center gap-6 sm:gap-10 overflow-x-auto no-scrollbar py-3.5">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className="flex flex-col items-center gap-1.5 group shrink-0 min-w-[76px]"
              >
                {/* Real High-Resolution Circular Photography Disc (BSS Style) */}
                <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full overflow-hidden border-2 border-stone-200/90 group-hover:border-[#871a45] group-hover:scale-105 shadow-sm group-hover:shadow-md transition-all duration-300 relative bg-stone-100">
                  <Image
                    src={cat.image}
                    alt={cat.label}
                    fill
                    sizes="72px"
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
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
      </nav>
    </>
  );
}
