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
  ClockIcon,
} from "@/components/icons";

const CATEGORY_STORIES = [
  {
    href: "/sweets",
    label: "All Sweets",
    sublabel: "Pure Ghee",
    image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=240&q=80",
    badge: "Bestseller",
  },
  {
    href: "/sweets/ghee-mysore-pak",
    label: "Mysore Pak",
    sublabel: "15-Yr Recipe",
    image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=240&q=80",
    badge: "Signature",
  },
  {
    href: "/sweets/pootharekulu",
    label: "Pootharekulu",
    sublabel: "Atreyapuram",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=240&q=80",
    badge: "Masterpiece",
  },
  {
    href: "/sweets/kaju-katli",
    label: "Kaju Katli",
    sublabel: "Goan Cashew",
    image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=240&q=80",
    badge: "Pure Silver",
  },
  {
    href: "/cakes",
    label: "Fresh Cakes",
    sublabel: "Bakery Daily",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=240&q=80",
    badge: "Fresh",
  },
  {
    href: "/snacks",
    label: "Savouries",
    sublabel: "Crispy Mixture",
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=240&q=80",
    badge: "Spicy",
  },
  {
    href: "/festival-boxes",
    label: "Gift Hampers",
    sublabel: "Festive Velvet",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=240&q=80",
    badge: "Gifting",
  },
  {
    href: "/sweets/bobbatlu",
    label: "Bobbatlu",
    sublabel: "Warm Jaggery",
    image: "https://images.unsplash.com/photo-1627834377411-8da5f4f09de8?w=240&q=80",
    badge: "Heritage",
  },
];

export function Navbar() {
  return (
    <>
      <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-stone-200/80">
        {/* ── 1. Top Announcement Bar (Plum #871a45 - Edge-to-Edge Fluid X-Axis) ── */}
        <div className="bg-[#871a45] text-white text-xs py-2 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="w-full flex items-center justify-between gap-4">
            {/* Left: Free delivery badge */}
            <div className="flex items-center gap-2">
              <SparklesIcon className="w-3.5 h-3.5 text-[#F8D030] shrink-0" />
              <span className="font-semibold tracking-wide">
                Free Delivery in Vijayawada on orders above ₹999 &nbsp;•&nbsp; 100% Pure Desi Cow Ghee
              </span>
            </div>

            {/* Center: Heritage note (desktop) */}
            <div className="hidden 2xl:flex items-center gap-2 text-white/80 text-[11px] font-medium tracking-wide">
              <span>Governorpet, Vijayawada</span>
              <span>•</span>
              <span className="text-[#F8D030]">Estd. 2011</span>
              <span>•</span>
              <span>Handcrafted Fresh Every Morning</span>
            </div>

            {/* Right: Store Hours & Direct Call */}
            <div className="hidden sm:flex items-center gap-5 text-xs font-medium shrink-0">
              <div className="flex items-center gap-1.5 text-white/80">
                <ClockIcon className="w-3.5 h-3.5 text-[#F8D030]" />
                <span>Shop: 7:00 AM – 10:30 PM</span>
              </div>
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

        {/* ── 2. Main Brand Header (Edge-to-Edge, Expansive Search, Full X-Axis) ── */}
        <div className="bg-white border-b border-stone-100">
          <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-3 sm:py-3.5 flex items-center justify-between gap-4 lg:gap-6">
            {/* Brand Logo & Quick Feature Badges */}
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

              {/* BSS-style "Bestsellers" Badge Pill */}
              <Link
                href="/sweets"
                className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-stone-200 text-xs font-semibold text-[#002c3f] hover:border-[#871a45] hover:text-[#871a45] transition-colors bg-stone-50/50"
                style={{ fontFamily: "var(--font-jost)" }}
              >
                <StarIcon className="w-3.5 h-3.5 text-[#F8D030]" />
                <span>Bestsellers</span>
              </Link>

              {/* "Gifting Special" Badge Pill */}
              <Link
                href="/festival-boxes"
                className="hidden 2xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#fce8e8] bg-[#fff5f5] text-xs font-semibold text-[#871a45] hover:bg-[#871a45] hover:text-white transition-colors"
                style={{ fontFamily: "var(--font-jost)" }}
              >
                <GiftIcon className="w-3.5 h-3.5 text-[#871a45]" />
                <span>Festival Hampers</span>
              </Link>
            </div>

            {/* Expansive Fluid Search Bar (Takes all available center space) */}
            <div className="hidden md:flex flex-1 min-w-[280px] mx-2 lg:mx-6 items-center bg-[#f4f4f4] hover:bg-[#eaeaea] rounded-full border border-stone-200/80 focus-within:border-[#871a45] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#871a45]/10 transition-all p-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#002c3f] px-3.5 py-1 border-r border-stone-300 shrink-0 cursor-pointer select-none">
                <span>All Sweets</span>
                <ChevronDownIcon className="w-3 h-3 text-stone-500" />
              </div>
              <input
                type="text"
                readOnly
                placeholder="Search Pootharekulu, Kaju Katli, Mysore Pak, Festival Boxes..."
                className="w-full bg-transparent text-[#002c3f] placeholder-stone-500 text-xs sm:text-sm py-1.5 px-3 focus:outline-none cursor-pointer"
              />
              <button
                type="button"
                className="h-9 px-4 rounded-full bg-[#871a45] hover:bg-[#691436] text-white flex items-center justify-center gap-1.5 shrink-0 shadow-sm transition-colors text-xs font-bold"
                aria-label="Search catalog"
              >
                <SearchIcon className="w-4 h-4" />
                <span className="hidden lg:inline">Search</span>
              </button>
            </div>

            {/* Right Action Items: Visit Shop + WhatsApp + Shopping Cart */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              {/* Store Location Link (desktop) */}
              <a
                href="https://maps.google.com/?q=Kanaka+Sweets+Governorpet+Vijayawada"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:flex items-center gap-2 text-xs text-stone-600 hover:text-[#871a45] transition-colors py-1 px-2.5 rounded-lg border border-transparent hover:border-stone-200"
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

        {/* ── 3. Expansive E-Commerce Secondary Category Navigation Row (Full X-Axis) ── */}
        <nav
          aria-label="Main Navigation"
          className="bg-white border-t border-stone-100 hidden md:block"
          style={{ fontFamily: "var(--font-jost)" }}
        >
          <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
            <div className="flex items-center justify-between gap-4 py-2.5 text-xs sm:text-sm font-semibold text-[#002c3f]">
              {/* Primary Product Categories across width */}
              <div className="flex items-center gap-5 lg:gap-7 xl:gap-8 flex-wrap">
                <Link
                  href="/sweets"
                  className="hover:text-[#871a45] transition-colors py-1 flex items-center gap-1 border-b-2 border-transparent hover:border-[#871a45]"
                >
                  <span>All Sweets &amp; Mithai</span>
                  <ChevronDownIcon className="w-3 h-3 text-stone-400" />
                </Link>

                <Link
                  href="/sweets/ghee-mysore-pak"
                  className="hover:text-[#871a45] transition-colors py-1 text-stone-700 hover:border-b-2 hover:border-[#871a45]"
                >
                  Pure Ghee Mysore Pak
                </Link>

                <Link
                  href="/sweets/pootharekulu"
                  className="hover:text-[#871a45] transition-colors py-1 text-stone-700 hover:border-b-2 hover:border-[#871a45]"
                >
                  Atreyapuram Pootharekulu
                </Link>

                <Link
                  href="/sweets/kaju-katli"
                  className="hidden lg:inline-block hover:text-[#871a45] transition-colors py-1 text-stone-700 hover:border-b-2 hover:border-[#871a45]"
                >
                  Kaju Katli
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

                <Link
                  href="/sweets/bobbatlu"
                  className="hidden xl:inline-block hover:text-[#871a45] transition-colors py-1 text-stone-700"
                >
                  Traditional Bobbatlu
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

              {/* Right utility links to gracefully anchor the row */}
              <div className="flex items-center gap-5 lg:gap-6 text-xs text-stone-500 font-medium shrink-0">
                <span className="hidden 2xl:inline text-[#2D5E3F] font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                  100% Desi Cow Ghee
                </span>
                <Link
                  href="/sweets"
                  className="hover:text-[#871a45] transition-colors text-stone-600 font-semibold"
                >
                  Bulk &amp; Wedding Orders
                </Link>
                <a
                  href="https://maps.google.com/?q=Kanaka+Sweets+Governorpet+Vijayawada"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#871a45] transition-colors font-medium text-[#002c3f]"
                >
                  Store Directions
                </a>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* ── 4. Full-Width Category Stories Ribbon (8 Rich Curated Items, Uses Full X-Axis) ── */}
      <nav
        aria-label="Category Stories"
        className="bg-[#FAF6EF] border-b border-stone-200/80 w-full"
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="flex items-center justify-between gap-3 sm:gap-4 md:gap-6 overflow-x-auto no-scrollbar py-3.5 sm:py-4">
            {CATEGORY_STORIES.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="flex flex-col items-center gap-1.5 group shrink-0 min-w-[76px] sm:min-w-[90px] flex-1 text-center"
              >
                {/* Real High-Resolution Circular Photography Disc */}
                <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 rounded-full overflow-hidden border-2 border-stone-200/90 group-hover:border-[#871a45] group-hover:scale-105 shadow-sm group-hover:shadow-md transition-all duration-300 relative bg-stone-100">
                  <Image
                    src={cat.image}
                    alt={cat.label}
                    fill
                    sizes="80px"
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {cat.badge && (
                    <span className="absolute bottom-0 inset-x-0 bg-[#871a45]/90 text-white text-[8px] font-bold uppercase tracking-wider py-0.5 text-center backdrop-blur-xs">
                      {cat.badge}
                    </span>
                  )}
                </div>

                {/* Category Label and Subtitle */}
                <div className="flex flex-col items-center leading-tight">
                  <span
                    className="text-xs sm:text-sm font-semibold text-[#002c3f] group-hover:text-[#871a45] transition-colors whitespace-nowrap"
                    style={{ fontFamily: "var(--font-jost)" }}
                  >
                    {cat.label}
                  </span>
                  <span className="text-[10px] text-stone-400 font-medium hidden sm:inline whitespace-nowrap">
                    {cat.sublabel}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}
