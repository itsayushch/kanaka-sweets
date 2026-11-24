import Link from "next/link";
import Image from "next/image";
import {
  PhoneIcon,
  ShoppingBagIcon,
  SearchIcon,
  SparklesIcon,
  KanakaEmblemIcon,
  ChevronDownIcon,
  GiftIcon,
  ClockIcon,
  UserIcon,
  HeartIcon,
  StarIcon,
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
      <header className="sticky top-0 z-40 bg-white shadow-xs border-b border-stone-200/80 relative">
        {/* ── 1. Top Announcement Bar (Plum #871a45 - Clean, Crisp Padding) ── */}
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

        {/* ── 2. Main Brand Header (Myntra-Style Mega Menu Navigation Bar) ── */}
        <div className="bg-white">
          <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 lg:gap-6 h-18">
            {/* Left: Logo */}
            <div className="flex items-center gap-6 lg:gap-8 shrink-0 h-full">
              <Link
                href="/"
                className="flex items-center gap-2.5 group shrink-0 py-2"
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

              {/* Myntra-Style Navigation Tabs with Mega Menus */}
              <nav
                aria-label="Store Categories"
                className="hidden lg:flex items-center h-full text-xs font-bold tracking-wider uppercase text-[#002c3f]"
                style={{ fontFamily: "var(--font-jost)" }}
              >
                {/* ── TAB 1: SWEETS & MITHAI (Mega Menu Dropdown) ── */}
                <div className="group/sweets static h-full flex items-center">
                  <Link
                    href="/sweets"
                    className="h-full flex items-center px-3.5 xl:px-4.5 border-b-4 border-transparent group-hover/sweets:border-[#871a45] group-hover/sweets:text-[#871a45] transition-all gap-1"
                  >
                    <span>Sweets</span>
                    <ChevronDownIcon className="w-3 h-3 text-stone-400 group-hover/sweets:text-[#871a45] group-hover/sweets:rotate-180 transition-transform duration-200" />
                  </Link>

                  {/* Mega Menu Dropdown */}
                  <div className="absolute top-full left-0 right-0 w-full bg-white border-b border-stone-200/90 shadow-2xl invisible opacity-0 group-hover/sweets:visible group-hover/sweets:opacity-100 transition-all duration-150 z-50 text-left">
                    <div className="w-full px-6 lg:px-10 xl:px-14 py-8">
                      <div className="grid grid-cols-5 gap-8">
                        {/* Col 1 */}
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-[#871a45] font-bold text-xs uppercase tracking-wider mb-2.5 pb-1 border-b border-stone-100">
                              Pure Ghee Mithai
                            </h3>
                            <ul className="space-y-2 text-xs text-stone-600 font-normal">
                              <li>
                                <Link href="/sweets/ghee-mysore-pak" className="hover:text-[#871a45] hover:font-semibold transition-colors block">
                                  Pure Ghee Mysore Pak
                                </Link>
                              </li>
                              <li>
                                <Link href="/sweets/pootharekulu" className="hover:text-[#871a45] hover:font-semibold transition-colors block">
                                  Atreyapuram Pootharekulu
                                </Link>
                              </li>
                              <li>
                                <Link href="/sweets/ariselu" className="hover:text-[#871a45] hover:font-semibold transition-colors block">
                                  Ghee Ariselu (Nethi Ariselu)
                                </Link>
                              </li>
                              <li>
                                <Link href="/sweets/boondi-ladoo" className="hover:text-[#871a45] hover:font-semibold transition-colors block">
                                  Tirupati Style Boondi Ladoo
                                </Link>
                              </li>
                              <li>
                                <Link href="/sweets/bobbatlu" className="hover:text-[#871a45] hover:font-semibold transition-colors block">
                                  Traditional Bobbatlu (Puran Poli)
                                </Link>
                              </li>
                            </ul>
                          </div>

                          <div>
                            <h4 className="text-[#871a45] font-bold text-[11px] uppercase tracking-wider mb-2">
                              Laddus &amp; Halwas
                            </h4>
                            <ul className="space-y-1.5 text-xs text-stone-600 font-normal">
                              <li><Link href="/sweets" className="hover:text-[#871a45] block">Besan Ladoo</Link></li>
                              <li><Link href="/sweets" className="hover:text-[#871a45] block">Moong Dal Halwa</Link></li>
                              <li><Link href="/sweets" className="hover:text-[#871a45] block">Dry Fruit Halwa</Link></li>
                            </ul>
                          </div>
                        </div>

                        {/* Col 2 */}
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-[#871a45] font-bold text-xs uppercase tracking-wider mb-2.5 pb-1 border-b border-stone-100">
                              Kaju &amp; Dry Fruits
                            </h3>
                            <ul className="space-y-2 text-xs text-stone-600 font-normal">
                              <li>
                                <Link href="/sweets/kaju-katli" className="hover:text-[#871a45] hover:font-semibold transition-colors block">
                                  Diamond Kaju Katli
                                </Link>
                              </li>
                              <li><Link href="/sweets" className="hover:text-[#871a45] block">Kaju Pista Roll</Link></li>
                              <li><Link href="/sweets" className="hover:text-[#871a45] block">Anjeer Dry Fruit Barfi</Link></li>
                              <li><Link href="/sweets" className="hover:text-[#871a45] block">Badam Katli &amp; Halwa</Link></li>
                              <li><Link href="/sweets" className="hover:text-[#871a45] block">Roasted Cashew Bites</Link></li>
                            </ul>
                          </div>

                          <div>
                            <h4 className="text-[#871a45] font-bold text-[11px] uppercase tracking-wider mb-2">
                              Milk &amp; Khoya Mithai
                            </h4>
                            <ul className="space-y-1.5 text-xs text-stone-600 font-normal">
                              <li><Link href="/sweets" className="hover:text-[#871a45] block">Kesar Peda</Link></li>
                              <li><Link href="/sweets" className="hover:text-[#871a45] block">Malai Kalakand</Link></li>
                              <li><Link href="/sweets" className="hover:text-[#871a45] block">Gulab Jamun &amp; Rasgulla</Link></li>
                            </ul>
                          </div>
                        </div>

                        {/* Col 3 */}
                        <div>
                          <h3 className="text-[#871a45] font-bold text-xs uppercase tracking-wider mb-2.5 pb-1 border-b border-stone-100">
                            Andhra Traditional
                          </h3>
                          <ul className="space-y-2 text-xs text-stone-600 font-normal">
                            <li><Link href="/sweets/pootharekulu" className="hover:text-[#871a45] block">Bellam Pootharekulu</Link></li>
                            <li><Link href="/sweets/pootharekulu" className="hover:text-[#871a45] block">Sugar Dry Fruit Pootharekulu</Link></li>
                            <li><Link href="/sweets/ariselu" className="hover:text-[#871a45] block">Sankranti Nethi Ariselu</Link></li>
                            <li><Link href="/sweets" className="hover:text-[#871a45] block">Kakinada Gottam Khaja</Link></li>
                            <li><Link href="/sweets" className="hover:text-[#871a45] block">Tapeswaram Madatha Khaja</Link></li>
                            <li><Link href="/sweets" className="hover:text-[#871a45] block">Bandar Thokkudu Laddu</Link></li>
                            <li><Link href="/sweets" className="hover:text-[#871a45] block">Sunnundalu (Urad Dal)</Link></li>
                            <li><Link href="/sweets" className="hover:text-[#871a45] block">Bellam Jalebi</Link></li>
                          </ul>
                        </div>

                        {/* Col 4 */}
                        <div>
                          <h3 className="text-[#871a45] font-bold text-xs uppercase tracking-wider mb-2.5 pb-1 border-b border-stone-100">
                            Gifting Collections
                          </h3>
                          <ul className="space-y-2 text-xs text-stone-600 font-normal">
                            <li><Link href="/festival-boxes" className="hover:text-[#871a45] block">Royal Vijayawada Hamper</Link></li>
                            <li><Link href="/festival-boxes" className="hover:text-[#871a45] block">Diwali Delight Box</Link></li>
                            <li><Link href="/festival-boxes" className="hover:text-[#871a45] block">Sankranti Celebration Box</Link></li>
                            <li><Link href="/festival-boxes" className="hover:text-[#871a45] block">Classic Assorted Box</Link></li>
                            <li><Link href="/festival-boxes" className="hover:text-[#871a45] block">Wedding Return Gift Trays</Link></li>
                            <li><Link href="/festival-boxes" className="hover:text-[#871a45] block">Custom Velvet Gift Tins</Link></li>
                            <li><Link href="/festival-boxes" className="hover:text-[#871a45] block">Corporate Bulk Mithai Packs</Link></li>
                          </ul>
                        </div>

                        {/* Col 5: Promo Card */}
                        <div className="bg-[#FAF6EF] rounded-xl p-4 border border-stone-200/80 flex flex-col justify-between">
                          <div>
                            <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
                              <Image
                                src="https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=320&q=80"
                                alt="Fresh Mithai"
                                fill
                                sizes="200px"
                                className="object-cover"
                              />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#871a45]">
                              100% Pure Cow Ghee
                            </span>
                            <h4 className="font-serif text-sm font-bold text-[#002c3f] mt-0.5">
                              15 Years of Governorpet Heritage
                            </h4>
                            <p className="text-[11px] text-stone-600 font-normal mt-1 leading-relaxed">
                              Simmered fresh daily in Vijayawada with zero preservatives.
                            </p>
                          </div>
                          <Link
                            href="/sweets"
                            className="mt-3 text-xs font-bold text-[#871a45] hover:text-[#691436] flex items-center gap-1"
                          >
                            <span>Explore All Sweets</span>
                            <span>→</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── TAB 2: CAKES & BAKERY (Mega Menu Dropdown) ── */}
                <div className="group/cakes static h-full flex items-center">
                  <Link
                    href="/cakes"
                    className="h-full flex items-center px-3.5 xl:px-4.5 border-b-4 border-transparent group-hover/cakes:border-[#871a45] group-hover/cakes:text-[#871a45] transition-all gap-1"
                  >
                    <span>Cakes</span>
                    <ChevronDownIcon className="w-3 h-3 text-stone-400 group-hover/cakes:text-[#871a45] group-hover/cakes:rotate-180 transition-transform duration-200" />
                  </Link>

                  {/* Mega Menu Dropdown */}
                  <div className="absolute top-full left-0 right-0 w-full bg-white border-b border-stone-200/90 shadow-2xl invisible opacity-0 group-hover/cakes:visible group-hover/cakes:opacity-100 transition-all duration-150 z-50 text-left">
                    <div className="w-full px-6 lg:px-10 xl:px-14 py-8">
                      <div className="grid grid-cols-4 gap-8">
                        <div>
                          <h3 className="text-[#871a45] font-bold text-xs uppercase tracking-wider mb-2.5 pb-1 border-b border-stone-100">
                            Celebration Cakes
                          </h3>
                          <ul className="space-y-2 text-xs text-stone-600 font-normal">
                            <li><Link href="/cakes/plum-cake" className="hover:text-[#871a45] block">Rich Holiday Plum Cake (Best for Gifting)</Link></li>
                            <li><Link href="/cakes/black-forest" className="hover:text-[#871a45] block">Black Forest Delight</Link></li>
                            <li><Link href="/cakes/butterscotch-cake" className="hover:text-[#871a45] block">Butterscotch Crunch Cake</Link></li>
                            <li><Link href="/cakes/pineapple-pastry" className="hover:text-[#871a45] block">Fresh Pineapple Pastry</Link></li>
                            <li><Link href="/cakes" className="hover:text-[#871a45] block">Dutch Truffle Dark Chocolate</Link></li>
                            <li><Link href="/cakes" className="hover:text-[#871a45] block">Red Velvet Cream Cheese</Link></li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="text-[#871a45] font-bold text-xs uppercase tracking-wider mb-2.5 pb-1 border-b border-stone-100">
                            Pastries &amp; Tea Cakes
                          </h3>
                          <ul className="space-y-2 text-xs text-stone-600 font-normal">
                            <li><Link href="/cakes" className="hover:text-[#871a45] block">Eggless Cupcakes (Box of 4)</Link></li>
                            <li><Link href="/cakes" className="hover:text-[#871a45] block">Almond Tea Cake</Link></li>
                            <li><Link href="/cakes" className="hover:text-[#871a45] block">Fruit &amp; Nut Bar Cake</Link></li>
                            <li><Link href="/cakes" className="hover:text-[#871a45] block">Choco Lava Cake</Link></li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="text-[#871a45] font-bold text-xs uppercase tracking-wider mb-2.5 pb-1 border-b border-stone-100">
                            Bakery &amp; Puffs
                          </h3>
                          <ul className="space-y-2 text-xs text-stone-600 font-normal">
                            <li><Link href="/cakes" className="hover:text-[#871a45] block">Warm Spiced Veg Puff</Link></li>
                            <li><Link href="/cakes" className="hover:text-[#871a45] block">Paneer Tikka Puff</Link></li>
                            <li><Link href="/cakes" className="hover:text-[#871a45] block">Milk Toast &amp; Rusk</Link></li>
                            <li><Link href="/cakes" className="hover:text-[#871a45] block">Butter Cashew Cookies</Link></li>
                          </ul>
                        </div>

                        <div className="bg-[#FAF6EF] rounded-xl p-4 border border-stone-200/80 flex flex-col justify-between">
                          <div>
                            <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
                              <Image
                                src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=320&q=80"
                                alt="Fresh Celebration Cakes"
                                fill
                                sizes="200px"
                                className="object-cover"
                              />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#871a45]">
                              Baked Fresh Daily
                            </span>
                            <h4 className="font-serif text-sm font-bold text-[#002c3f] mt-0.5">
                              Custom Birthday &amp; Event Cakes
                            </h4>
                            <p className="text-[11px] text-stone-600 font-normal mt-1 leading-relaxed">
                              Order same-day counter pickup at our Governorpet shop.
                            </p>
                          </div>
                          <Link
                            href="/cakes"
                            className="mt-3 text-xs font-bold text-[#871a45] hover:text-[#691436] flex items-center gap-1"
                          >
                            <span>View All Cakes</span>
                            <span>→</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── TAB 3: SAVOURIES & MIXTURE (Mega Menu Dropdown) ── */}
                <div className="group/snacks static h-full flex items-center">
                  <Link
                    href="/snacks"
                    className="h-full flex items-center px-3.5 xl:px-4.5 border-b-4 border-transparent group-hover/snacks:border-[#871a45] group-hover/snacks:text-[#871a45] transition-all gap-1"
                  >
                    <span>Savouries</span>
                    <ChevronDownIcon className="w-3 h-3 text-stone-400 group-hover/snacks:text-[#871a45] group-hover/snacks:rotate-180 transition-transform duration-200" />
                  </Link>

                  {/* Mega Menu Dropdown */}
                  <div className="absolute top-full left-0 right-0 w-full bg-white border-b border-stone-200/90 shadow-2xl invisible opacity-0 group-hover/snacks:visible group-hover/snacks:opacity-100 transition-all duration-150 z-50 text-left">
                    <div className="w-full px-6 lg:px-10 xl:px-14 py-8">
                      <div className="grid grid-cols-4 gap-8">
                        <div>
                          <h3 className="text-[#871a45] font-bold text-xs uppercase tracking-wider mb-2.5 pb-1 border-b border-stone-100">
                            Spicy Andhra Mixtures
                          </h3>
                          <ul className="space-y-2 text-xs text-stone-600 font-normal">
                            <li><Link href="/snacks/vijayawada-mixture" className="hover:text-[#871a45] block">Special Vijayawada Mixture</Link></li>
                            <li><Link href="/snacks" className="hover:text-[#871a45] block">Spicy Karapusa (Fine Sev)</Link></li>
                            <li><Link href="/snacks/ribbon-pakoda" className="hover:text-[#871a45] block">Ribbon Pakoda</Link></li>
                            <li><Link href="/snacks" className="hover:text-[#871a45] block">Cornflakes Chivda</Link></li>
                            <li><Link href="/snacks" className="hover:text-[#871a45] block">Boondi Mixture</Link></li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="text-[#871a45] font-bold text-xs uppercase tracking-wider mb-2.5 pb-1 border-b border-stone-100">
                            Traditional Crunch
                          </h3>
                          <ul className="space-y-2 text-xs text-stone-600 font-normal">
                            <li><Link href="/snacks/bellam-gavvalu" className="hover:text-[#871a45] block">Crunchy Bellam Gavvalu</Link></li>
                            <li><Link href="/snacks/chekkalu" className="hover:text-[#871a45] block">Crispy Andhra Chekkalu</Link></li>
                            <li><Link href="/snacks" className="hover:text-[#871a45] block">Nethi Murukulu</Link></li>
                            <li><Link href="/snacks" className="hover:text-[#871a45] block">Masala Roasted Kaju</Link></li>
                            <li><Link href="/snacks" className="hover:text-[#871a45] block">Salted Cashew Nuts</Link></li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="text-[#871a45] font-bold text-xs uppercase tracking-wider mb-2.5 pb-1 border-b border-stone-100">
                            Tea-Time Favorites
                          </h3>
                          <ul className="space-y-2 text-xs text-stone-600 font-normal">
                            <li><Link href="/snacks" className="hover:text-[#871a45] block">Onion Pakoda (Counter Fresh)</Link></li>
                            <li><Link href="/snacks" className="hover:text-[#871a45] block">Garelu &amp; Vada Mix</Link></li>
                            <li><Link href="/snacks" className="hover:text-[#871a45] block">Kara Boondi</Link></li>
                            <li><Link href="/snacks" className="hover:text-[#871a45] block">Peanut Masala Fry</Link></li>
                          </ul>
                        </div>

                        <div className="bg-[#FAF6EF] rounded-xl p-4 border border-stone-200/80 flex flex-col justify-between">
                          <div>
                            <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
                              <Image
                                src="https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=320&q=80"
                                alt="Vijayawada Savouries"
                                fill
                                sizes="200px"
                                className="object-cover"
                              />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#871a45]">
                              Cold-Pressed Oil
                            </span>
                            <h4 className="font-serif text-sm font-bold text-[#002c3f] mt-0.5">
                              Famous Vijayawada Mixture
                            </h4>
                            <p className="text-[11px] text-stone-600 font-normal mt-1 leading-relaxed">
                              Crunchy curry leaves, cashews, and peanuts fried in fresh groundnut oil.
                            </p>
                          </div>
                          <Link
                            href="/snacks"
                            className="mt-3 text-xs font-bold text-[#871a45] hover:text-[#691436] flex items-center gap-1"
                          >
                            <span>Shop Savouries</span>
                            <span>→</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── TAB 4: FESTIVAL BOXES (GIFTING) ── */}
                <div className="group/boxes static h-full flex items-center">
                  <Link
                    href="/festival-boxes"
                    className="h-full flex items-center px-3.5 xl:px-4.5 border-b-4 border-transparent group-hover/boxes:border-[#871a45] text-[#871a45] transition-all gap-1.5"
                  >
                    <GiftIcon className="w-3.5 h-3.5 text-[#871a45]" />
                    <span>Festival Boxes</span>
                    <span className="bg-[#fce8e8] text-[#c93b3b] text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                      Gifting
                    </span>
                  </Link>

                  {/* Mega Menu Dropdown */}
                  <div className="absolute top-full left-0 right-0 w-full bg-white border-b border-stone-200/90 shadow-2xl invisible opacity-0 group-hover/boxes:visible group-hover/boxes:opacity-100 transition-all duration-150 z-50 text-left">
                    <div className="w-full px-6 lg:px-10 xl:px-14 py-8">
                      <div className="grid grid-cols-4 gap-8">
                        <div>
                          <h3 className="text-[#871a45] font-bold text-xs uppercase tracking-wider mb-2.5 pb-1 border-b border-stone-100">
                            Curated Gift Hampers
                          </h3>
                          <ul className="space-y-2 text-xs text-stone-600 font-normal">
                            <li><Link href="/festival-boxes/royal-vijayawada-hamper" className="hover:text-[#871a45] block">Royal Vijayawada Gift Hamper</Link></li>
                            <li><Link href="/festival-boxes/diwali-delight-box" className="hover:text-[#871a45] block">Diwali Delight Box</Link></li>
                            <li><Link href="/festival-boxes/sankranti-celebration-box" className="hover:text-[#871a45] block">Sankranti Celebration Box</Link></li>
                            <li><Link href="/festival-boxes/classic-assorted-box" className="hover:text-[#871a45] block">Classic Assorted Sweets Box</Link></li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="text-[#871a45] font-bold text-xs uppercase tracking-wider mb-2.5 pb-1 border-b border-stone-100">
                            Wedding &amp; Occasions
                          </h3>
                          <ul className="space-y-2 text-xs text-stone-600 font-normal">
                            <li><Link href="/festival-boxes" className="hover:text-[#871a45] block">Pellikoduku / Pellikuthuru Gift Trays</Link></li>
                            <li><Link href="/festival-boxes" className="hover:text-[#871a45] block">Housewarming (Gruhapravesam) Sweets</Link></li>
                            <li><Link href="/festival-boxes" className="hover:text-[#871a45] block">Baby Shower (Seemantham) Hampers</Link></li>
                            <li><Link href="/festival-boxes" className="hover:text-[#871a45] block">Custom Velvet Tins with Foil Names</Link></li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="text-[#871a45] font-bold text-xs uppercase tracking-wider mb-2.5 pb-1 border-b border-stone-100">
                            Corporate Gifting
                          </h3>
                          <ul className="space-y-2 text-xs text-stone-600 font-normal">
                            <li><Link href="/festival-boxes" className="hover:text-[#871a45] block">Diwali Corporate Boxes (50+ units)</Link></li>
                            <li><Link href="/festival-boxes" className="hover:text-[#871a45] block">Client Appreciation Sweet Tins</Link></li>
                            <li><Link href="/festival-boxes" className="hover:text-[#871a45] block">Dry Fruit &amp; Kaju Executive Hampers</Link></li>
                            <li><Link href="/festival-boxes" className="hover:text-[#871a45] block">Custom Logo Ribbon Sleeves</Link></li>
                          </ul>
                        </div>

                        <div className="bg-[#FAF6EF] rounded-xl p-4 border border-stone-200/80 flex flex-col justify-between">
                          <div>
                            <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
                              <Image
                                src="https://images.unsplash.com/photo-1601050690597-df0568f70950?w=320&q=80"
                                alt="Royal Festive Hampers"
                                fill
                                sizes="200px"
                                className="object-cover"
                              />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#871a45]">
                              Premium Velvet Packaging
                            </span>
                            <h4 className="font-serif text-sm font-bold text-[#002c3f] mt-0.5">
                              Festive Delivery Across Vijayawada
                            </h4>
                            <p className="text-[11px] text-stone-600 font-normal mt-1 leading-relaxed">
                              Order boxes with same-day shop pickup or doorstep delivery.
                            </p>
                          </div>
                          <Link
                            href="/festival-boxes"
                            className="mt-3 text-xs font-bold text-[#871a45] hover:text-[#691436] flex items-center gap-1"
                          >
                            <span>Explore Hampers</span>
                            <span>→</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── TAB 5: BULK & WEDDINGS ── */}
                <Link
                  href="/sweets"
                  className="h-full flex items-center px-3.5 xl:px-4.5 border-b-4 border-transparent hover:border-[#871a45] hover:text-[#871a45] transition-all whitespace-nowrap"
                >
                  <span>Bulk &amp; Weddings</span>
                </Link>
              </nav>
            </div>

            {/* Right: Search Bar + Profile + Wishlist + Cart (Myntra Triad) */}
            <div className="flex items-center gap-4 sm:gap-5 lg:gap-6 shrink-0">
              {/* Search Bar on the RHS (Myntra Style, Clean & Wide) */}
              <div className="hidden md:flex items-center w-64 lg:w-80 xl:w-96 h-10 bg-stone-100/70 hover:bg-stone-100 rounded-full border border-stone-200/90 focus-within:border-[#871a45] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#871a45]/10 transition-all px-3.5 gap-2.5 group">
                <SearchIcon className="w-4 h-4 text-stone-400 group-focus-within:text-[#871a45] transition-colors shrink-0" />
                <input
                  type="text"
                  readOnly
                  placeholder="Search for sweets, gift boxes, cakes..."
                  className="w-full bg-transparent text-xs text-[#002c3f] placeholder-stone-400 focus:outline-none cursor-pointer"
                />
                <span className="hidden xl:inline-flex text-[10px] text-stone-400 font-mono bg-white border border-stone-200 rounded px-1.5 py-0.5 shadow-2xs select-none shrink-0">
                  ⌘K
                </span>
              </div>

              {/* Profile Icon with Short Title Below */}
              <Link
                href="/admin"
                className="flex flex-col items-center justify-center group text-[#002c3f] hover:text-[#871a45] transition-colors min-w-[38px]"
                aria-label="Profile and Admin Login"
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-[#002c3f] group-hover:text-[#871a45] transition-colors" />
                </div>
                <span
                  className="text-[10px] font-semibold leading-none mt-1 text-[#002c3f] group-hover:text-[#871a45] transition-colors"
                  style={{ fontFamily: "var(--font-jost)" }}
                >
                  Profile
                </span>
              </Link>

              {/* Wishlist Icon with Short Title Below (Myntra Triad) */}
              <Link
                href="/sweets"
                className="flex flex-col items-center justify-center group text-[#002c3f] hover:text-[#871a45] transition-colors min-w-[38px]"
                aria-label="Wishlist"
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <HeartIcon className="w-5 h-5 text-[#002c3f] group-hover:text-[#871a45] transition-colors" />
                </div>
                <span
                  className="text-[10px] font-semibold leading-none mt-1 text-[#002c3f] group-hover:text-[#871a45] transition-colors"
                  style={{ fontFamily: "var(--font-jost)" }}
                >
                  Wishlist
                </span>
              </Link>

              {/* Cart Icon with Counter Badge & Short Title Below */}
              <Link
                href="/cart"
                className="flex flex-col items-center justify-center group text-[#002c3f] hover:text-[#871a45] transition-colors min-w-[38px]"
                aria-label="Shopping Cart"
              >
                <div className="relative w-6 h-6 flex items-center justify-center">
                  <ShoppingBagIcon className="w-5 h-5 text-[#002c3f] group-hover:text-[#871a45] transition-colors" />
                  <span
                    id="cart-badge-count"
                    className="absolute -top-1 -right-1.5 bg-[#871a45] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs"
                  >
                    0
                  </span>
                </div>
                <span
                  className="text-[10px] font-semibold leading-none mt-1 text-[#002c3f] group-hover:text-[#871a45] transition-colors"
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
