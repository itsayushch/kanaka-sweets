import Link from "next/link";
import Image from "next/image";
import {
  PhoneIcon,
  WhatsAppIcon,
  ShoppingBagIcon,
  SearchIcon,
  SparklesIcon,
  KanakaEmblemIcon,
  ChevronDownIcon,
  GiftIcon,
  ClockIcon,
  UserIcon,
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
      <header className="sticky top-0 z-40 bg-white shadow-xs border-b border-stone-200/80">
        {/* ── 1. Top Announcement Bar (Plum #871a45 - Tight, Clean Padding) ── */}
        <div className="bg-[#871a45] text-white text-xs py-1.5 px-4 sm:px-6 lg:px-8">
          <div className="w-full flex items-center justify-between gap-4">
            {/* Left: Free delivery badge */}
            <div className="flex items-center gap-2">
              <SparklesIcon className="w-3.5 h-3.5 text-[#F8D030] shrink-0" />
              <span className="font-semibold tracking-wide">
                Free Delivery in Vijayawada on orders above ₹999 &nbsp;•&nbsp; 100% Pure Desi Cow Ghee
              </span>
            </div>

            {/* Center: Heritage note (desktop) */}
            <div className="hidden xl:flex items-center gap-2 text-white/80 text-[11px] font-medium tracking-wide">
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
                <span>7:00 AM – 10:30 PM</span>
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

        {/* ── 2. Main Brand Header (Single Unified Line: Logo + Reduced Links + Compact Search + Profile & Cart) ── */}
        <div className="bg-white">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-4 lg:gap-6">
            {/* Left Group: Logo + Reduced Category Links on the SAME LINE */}
            <div className="flex items-center gap-6 lg:gap-8 shrink-0">
              <Link
                href="/"
                className="flex items-center gap-2.5 group shrink-0"
                aria-label="Kanaka Sweets & Bakery Homepage"
              >
                <div className="w-10 h-10 rounded-full bg-[#871a45] flex items-center justify-center text-[#F8D030] shadow-xs group-hover:scale-105 transition-transform">
                  <KanakaEmblemIcon className="w-5 h-5 text-[#F8D030]" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span
                    className="font-serif text-2xl font-extrabold text-[#002c3f] tracking-tight group-hover:text-[#871a45] transition-colors"
                    style={{ fontFamily: "var(--font-fraunces)" }}
                  >
                    Kanaka
                  </span>
                  <div className="flex items-center gap-1 -mt-0.5">
                    <span
                      className="text-[9px] tracking-[0.2em] uppercase text-[#871a45] font-bold"
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

              {/* Reduced Category Links (Same Line!) */}
              <nav
                aria-label="Primary Categories"
                className="hidden lg:flex items-center gap-5 xl:gap-7 text-xs sm:text-sm font-semibold text-[#002c3f]"
                style={{ fontFamily: "var(--font-jost)" }}
              >
                <Link
                  href="/sweets"
                  className="hover:text-[#871a45] transition-colors py-1 flex items-center gap-1 border-b-2 border-transparent hover:border-[#871a45]"
                >
                  <span>All Sweets</span>
                  <ChevronDownIcon className="w-3 h-3 text-stone-400" />
                </Link>

                <Link
                  href="/cakes"
                  className="hover:text-[#871a45] transition-colors py-1 border-b-2 border-transparent hover:border-[#871a45]"
                >
                  Cakes
                </Link>

                <Link
                  href="/snacks"
                  className="hover:text-[#871a45] transition-colors py-1 border-b-2 border-transparent hover:border-[#871a45]"
                >
                  Savouries
                </Link>

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
              </nav>
            </div>

            {/* Center: Sleek & Professional Search Bar */}
            <div className="hidden md:flex items-center w-56 lg:w-72 xl:w-80 h-10 bg-stone-100/70 hover:bg-stone-100 rounded-full border border-stone-200/90 focus-within:border-[#871a45] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#871a45]/10 transition-all px-3.5 gap-2.5 group">
              <SearchIcon className="w-4 h-4 text-stone-400 group-focus-within:text-[#871a45] transition-colors shrink-0" />
              <input
                type="text"
                readOnly
                placeholder="Search Pootharekulu, Kaju Katli..."
                className="w-full bg-transparent text-xs text-[#002c3f] placeholder-stone-400 focus:outline-none cursor-pointer"
              />
              <span className="hidden xl:inline-flex text-[10px] text-stone-400 font-mono bg-white border border-stone-200 rounded px-1.5 py-0.5 shadow-2xs select-none shrink-0">
                ⌘K
              </span>
            </div>

            {/* Right Action Items: WhatsApp + Profile & Cart Icons with short pinpoint title below */}
            <div className="flex items-center gap-4 sm:gap-6 shrink-0">
              {/* WhatsApp Concierge Order Button */}
              <a
                href="https://wa.me/919848022338?text=Hello%20Kanaka%20Sweets,%20I%20would%20like%20to%20order"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold px-3.5 py-2 rounded-full shadow-xs hover:shadow transition-all active:scale-95 shrink-0"
                aria-label="Order on WhatsApp"
              >
                <WhatsAppIcon className="w-4 h-4 text-white" />
                <span>WhatsApp</span>
              </a>

              {/* Profile Icon with Short Title Below */}
              <Link
                href="/admin"
                className="flex flex-col items-center justify-center group text-[#002c3f] hover:text-[#871a45] transition-colors min-w-[38px]"
                aria-label="Profile and Admin Login"
              >
                <div className="w-7 h-7 flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-[#002c3f] group-hover:text-[#871a45] transition-colors" />
                </div>
                <span
                  className="text-[11px] font-semibold leading-none mt-0.5 text-[#002c3f] group-hover:text-[#871a45] transition-colors"
                  style={{ fontFamily: "var(--font-jost)" }}
                >
                  Profile
                </span>
              </Link>

              {/* Cart Icon with Counter Badge & Short Title Below */}
              <Link
                href="/cart"
                className="flex flex-col items-center justify-center group text-[#002c3f] hover:text-[#871a45] transition-colors min-w-[38px]"
                aria-label="Shopping Cart"
              >
                <div className="relative w-7 h-7 flex items-center justify-center">
                  <ShoppingBagIcon className="w-5 h-5 text-[#002c3f] group-hover:text-[#871a45] transition-colors" />
                  <span
                    id="cart-badge-count"
                    className="absolute -top-0.5 -right-1 bg-[#871a45] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs"
                  >
                    0
                  </span>
                </div>
                <span
                  className="text-[11px] font-semibold leading-none mt-0.5 text-[#002c3f] group-hover:text-[#871a45] transition-colors"
                  style={{ fontFamily: "var(--font-jost)" }}
                >
                  Cart
                </span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ── 3. Category Stories Ribbon (8 Curated Visual Stories, Compact Edge Spacing) ── */}
      <nav
        aria-label="Category Stories"
        className="bg-[#FAF6EF] border-b border-stone-200/80 w-full"
      >
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3 sm:gap-4 md:gap-6 overflow-x-auto no-scrollbar py-3 sm:py-3.5">
            {CATEGORY_STORIES.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="flex flex-col items-center gap-1 group shrink-0 min-w-[72px] sm:min-w-[84px] flex-1 text-center"
              >
                {/* Real High-Resolution Circular Photography Disc */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-18 lg:h-18 rounded-full overflow-hidden border-2 border-stone-200/90 group-hover:border-[#871a45] group-hover:scale-105 shadow-xs group-hover:shadow-md transition-all duration-300 relative bg-stone-100">
                  <Image
                    src={cat.image}
                    alt={cat.label}
                    fill
                    sizes="72px"
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {cat.badge && (
                    <span className="absolute bottom-0 inset-x-0 bg-[#871a45]/90 text-white text-[7.5px] font-bold uppercase tracking-wider py-0.5 text-center backdrop-blur-xs">
                      {cat.badge}
                    </span>
                  )}
                </div>

                {/* Category Label and Subtitle */}
                <div className="flex flex-col items-center leading-tight">
                  <span
                    className="text-xs font-semibold text-[#002c3f] group-hover:text-[#871a45] transition-colors whitespace-nowrap"
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
