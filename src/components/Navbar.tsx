import Link from "next/link";
import Image from "next/image";
import {
  PhoneIcon,
  WhatsAppIcon,
  ShoppingBagIcon,
  SearchIcon,
  SparklesIcon,
  KanakaEmblemIcon,
  MapPinIcon,
  StarIcon,
  ChevronDownIcon,
  GiftIcon,
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
      <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-stone-200/80">
        {/* ── Top Announcement Bar (Plum #871a45) ── */}
        <div className="bg-[#871a45] text-white text-xs py-2 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 mx-auto sm:mx-0">
              <SparklesIcon className="w-3.5 h-3.5 text-[#F8D030]" />
              <span className="font-semibold tracking-wide">
                Free Delivery in Vijayawada on orders above ₹999 &nbsp;•&nbsp; 100% Pure Desi Cow Ghee
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-5 text-xs font-medium">
              <span className="text-white/80">Governorpet Shop: 7:00 AM – 10:30 PM</span>
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

        {/* ── Main Brand Header (Logo + Integrated Search + Concierge + Cart) ── */}
        <div className="bg-white border-b border-stone-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 flex items-center justify-between gap-4 lg:gap-8">
            {/* Brand Logo & Bestsellers Pill */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              <Link
                href="/"
                className="flex items-center gap-3 group"
                aria-label="Kanaka Sweets & Bakery Homepage"
              >
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

              {/* BSS-style "Bestsellers" Badge Pill (desktop) */}
              <Link
                href="/sweets"
                className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-stone-200 text-xs font-semibold text-[#002c3f] hover:border-[#871a45] hover:text-[#871a45] transition-colors"
                style={{ fontFamily: "var(--font-jost)" }}
              >
                <StarIcon className="w-3.5 h-3.5 text-[#F8D030]" />
                <span>Bestsellers</span>
              </Link>
            </div>

            {/* E-Commerce Search Bar with Category Dropdown & Button */}
            <div className="hidden md:flex flex-1 max-w-lg items-center bg-[#f4f4f4] hover:bg-[#eaeaea] rounded-full border border-stone-200/60 focus-within:border-[#871a45] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#871a45]/10 transition-all p-1">
              <div className="flex items-center gap-1 text-xs font-semibold text-[#002c3f] px-3 border-r border-stone-300 shrink-0 cursor-pointer select-none">
                <span>All Sweets</span>
                <ChevronDownIcon className="w-3 h-3 text-stone-500" />
              </div>
              <input
                type="text"
                readOnly
                placeholder="Search Pootharekulu, Kaju Katli, Mysore Pak..."
                className="w-full bg-transparent text-[#002c3f] placeholder-stone-400 text-xs sm:text-sm py-1.5 px-3 focus:outline-none cursor-pointer"
              />
              <button
                type="button"
                className="w-9 h-9 rounded-full bg-[#871a45] hover:bg-[#691436] text-white flex items-center justify-center shrink-0 shadow-sm transition-colors"
                aria-label="Search"
              >
                <SearchIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Right Action Items: Visit Shop + WhatsApp + Shopping Cart */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              {/* Store Location Link (desktop) */}
              <a
                href="https://maps.google.com/?q=Kanaka+Sweets+Governorpet+Vijayawada"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:flex items-center gap-1.5 text-xs text-stone-600 hover:text-[#871a45] transition-colors py-1 px-2 rounded-lg"
                style={{ fontFamily: "var(--font-jost)" }}
              >
                <MapPinIcon className="w-4 h-4 text-[#871a45]" />
                <div className="text-left leading-tight">
                  <div className="font-bold text-[#002c3f]">Governorpet</div>
                  <div className="text-[10px] text-stone-400">Vijayawada Shop</div>
                </div>
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

              {/* Shopping Bag Pill with Counter */}
              <Link
                href="/cart"
                className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-full border border-stone-200 hover:border-[#871a45] hover:text-[#871a45] transition-all text-[#002c3f] bg-stone-50/50 hover:bg-white min-h-[44px]"
                aria-label="Shopping Cart"
              >
                <div className="relative flex items-center justify-center">
                  <ShoppingBagIcon className="w-5 h-5 text-[#002c3f]" />
                  <span
                    id="cart-badge-count"
                    className="absolute -top-1.5 -right-2 bg-[#871a45] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm"
                  >
                    0
                  </span>
                </div>
                <div className="hidden sm:flex flex-col text-left leading-tight">
                  <span className="text-xs font-bold text-[#002c3f]">Cart</span>
                  <span className="text-[10px] text-stone-400">0 items</span>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* ── E-Commerce Secondary Category Navigation Row ── */}
        <nav
          aria-label="Main Navigation"
          className="bg-white border-t border-stone-100 hidden md:block"
          style={{ fontFamily: "var(--font-jost)" }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-6 py-2.5 text-xs sm:text-sm font-semibold text-[#002c3f]">
              <div className="flex items-center gap-6 lg:gap-8">
                <Link
                  href="/sweets"
                  className="hover:text-[#871a45] transition-colors py-1 flex items-center gap-1 border-b-2 border-transparent hover:border-[#871a45]"
                >
                  <span>All Sweets &amp; Mithai</span>
                  <ChevronDownIcon className="w-3 h-3 text-stone-400" />
                </Link>

                <Link
                  href="/cakes"
                  className="hover:text-[#871a45] transition-colors py-1 border-b-2 border-transparent hover:border-[#871a45]"
                >
                  Fresh Cakes &amp; Bakery
                </Link>

                <Link
                  href="/snacks"
                  className="hover:text-[#871a45] transition-colors py-1 border-b-2 border-transparent hover:border-[#871a45]"
                >
                  Vijayawada Savouries
                </Link>

                {/* Festival Boxes with glowing pill */}
                <Link
                  href="/festival-boxes"
                  className="hover:text-[#871a45] transition-colors py-1 flex items-center gap-1.5 text-[#871a45] font-bold"
                >
                  <GiftIcon className="w-3.5 h-3.5 text-[#871a45]" />
                  <span>Festival Boxes</span>
                  <span className="bg-[#fce8e8] text-[#c93b3b] text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                    Gifting
                  </span>
                </Link>
              </div>

              {/* Right utility links */}
              <div className="flex items-center gap-6 text-xs text-stone-500 font-medium">
                <Link href="/sweets" className="hover:text-[#871a45] transition-colors">
                  Pure Ghee Promise
                </Link>
                <a
                  href="https://maps.google.com/?q=Kanaka+Sweets+Governorpet+Vijayawada"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#871a45] transition-colors"
                >
                  Store Hours &amp; Directions
                </a>
              </div>
            </div>
          </div>
        </nav>
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
