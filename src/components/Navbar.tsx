import Link from "next/link";
import Image from "next/image";
import { CartBadge } from "@/components/CartBadge";
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
  LeafIcon,
  ShieldCheckIcon,
  TruckIcon,
  ArrowRightIcon,
} from "@/components/icons";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-white shadow-xs border-b border-stone-200/80 relative">
        {/* ── 1. Top Announcement Bar (Plum #871a45 - Clean, Crisp Padding) ── */}
        <div className="bg-[#871a45] text-white text-xs py-1.5 px-4 sm:px-6 lg:px-8">
          <div className="w-full flex items-center justify-between gap-4">
            {/* Left: Free delivery badge */}
            <div className="flex items-center gap-2">
              <SparklesIcon className="w-3.5 h-3.5 text-[#F8D030] shrink-0" />
              <span className="font-semibold tracking-wide">
                Home delivery across Vijayawada &nbsp;•&nbsp; 100% Pure Desi Cow Ghee
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
                {/* ── TAB 1: SWEETS & MITHAI (Deluxe Multi-Column Visual Mega Menu) ── */}
                <div className="group/sweets static h-full flex items-center px-2 xl:px-2.5">
                  <Link
                    href="/sweets"
                    className="py-1 flex items-center gap-1 border-b-2 border-transparent group-hover/sweets:border-[#871a45] group-hover/sweets:text-[#871a45] transition-all"
                  >
                    <span>Sweets</span>
                    <ChevronDownIcon className="w-3 h-3 text-stone-400 group-hover/sweets:text-[#871a45] group-hover/sweets:rotate-180 transition-transform duration-200" />
                  </Link>

                  {/* Mega Menu Dropdown */}
                  <div className="absolute top-full left-0 right-0 w-full bg-white border-b border-stone-200/90 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.18)] invisible opacity-0 group-hover/sweets:visible group-hover/sweets:opacity-100 transition-all duration-200 z-50 text-left">
                    <div className="w-full px-6 lg:px-10 xl:px-14 py-8">
                      <div className="grid grid-cols-5 gap-8">
                        {/* Col 1: Pure Ghee Mithai with Visual Micro-Rows */}
                        <div className="space-y-6">
                          <div>
                            <div className="flex items-center gap-2 mb-3 pb-1.5 border-b border-stone-200/80">
                              <div className="w-5 h-5 rounded-md bg-[#871a45]/10 flex items-center justify-center text-[#871a45]">
                                <SparklesIcon className="w-3 h-3 text-[#871a45]" />
                              </div>
                              <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#871a45]">
                                Pure Ghee Mithai
                              </h3>
                            </div>
                            <ul className="space-y-1">
                              <li>
                                <Link
                                  href="/sweets/ghee-mysore-pak"
                                  className="group/item flex items-center justify-between p-2 -mx-2 rounded-xl hover:bg-[#FAF6EF] transition-all"
                                >
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-lg overflow-hidden relative shrink-0 border border-stone-200/80 bg-stone-100">
                                      <Image
                                        src="https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=80&q=80"
                                        alt="Mysore Pak"
                                        fill
                                        sizes="32px"
                                        className="object-cover group-hover/item:scale-110 transition-transform duration-200"
                                      />
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-xs font-semibold text-[#002c3f] group-hover/item:text-[#871a45] transition-colors">
                                        Pure Ghee Mysore Pak
                                      </span>
                                      <span className="text-[10px] text-stone-400 font-normal">
                                        Melt-in-mouth golden sweet
                                      </span>
                                    </div>
                                  </div>
                                  <span className="text-[9px] font-bold text-[#871a45] bg-[#fce8e8] px-1.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                                    Bestseller
                                  </span>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/sweets/pootharekulu"
                                  className="group/item flex items-center justify-between p-2 -mx-2 rounded-xl hover:bg-[#FAF6EF] transition-all"
                                >
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-lg overflow-hidden relative shrink-0 border border-stone-200/80 bg-stone-100">
                                      <Image
                                        src="https://images.unsplash.com/photo-1601050690597-df0568f70950?w=80&q=80"
                                        alt="Pootharekulu"
                                        fill
                                        sizes="32px"
                                        className="object-cover group-hover/item:scale-110 transition-transform duration-200"
                                      />
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-xs font-semibold text-[#002c3f] group-hover/item:text-[#871a45] transition-colors">
                                        Atreyapuram Pootharekulu
                                      </span>
                                      <span className="text-[10px] text-stone-400 font-normal">
                                        Authentic paper sweet
                                      </span>
                                    </div>
                                  </div>
                                  <span className="text-[9px] font-bold text-[#2D5E3F] bg-emerald-50 px-1.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                                    Artisan
                                  </span>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/sweets/ariselu"
                                  className="group/item flex items-center justify-between p-2 -mx-2 rounded-xl hover:bg-[#FAF6EF] transition-all"
                                >
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-lg overflow-hidden relative shrink-0 border border-stone-200/80 bg-stone-100">
                                      <Image
                                        src="https://images.unsplash.com/photo-1627834377411-8da5f4f09de8?w=80&q=80"
                                        alt="Ariselu"
                                        fill
                                        sizes="32px"
                                        className="object-cover group-hover/item:scale-110 transition-transform duration-200"
                                      />
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-xs font-semibold text-[#002c3f] group-hover/item:text-[#871a45] transition-colors">
                                        Ghee Ariselu
                                      </span>
                                      <span className="text-[10px] text-stone-400 font-normal">
                                        Organic jaggery &amp; sesame
                                      </span>
                                    </div>
                                  </div>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/sweets/boondi-ladoo"
                                  className="group/item flex items-center justify-between p-2 -mx-2 rounded-xl hover:bg-[#FAF6EF] transition-all"
                                >
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-lg overflow-hidden relative shrink-0 border border-stone-200/80 bg-stone-100">
                                      <Image
                                        src="https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=80&q=80"
                                        alt="Boondi Ladoo"
                                        fill
                                        sizes="32px"
                                        className="object-cover group-hover/item:scale-110 transition-transform duration-200"
                                      />
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-xs font-semibold text-[#002c3f] group-hover/item:text-[#871a45] transition-colors">
                                        Tirupati Boondi Ladoo
                                      </span>
                                      <span className="text-[10px] text-stone-400 font-normal">
                                        Rich cow ghee &amp; cashews
                                      </span>
                                    </div>
                                  </div>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/sweets/bobbatlu"
                                  className="group/item flex items-center justify-between p-2 -mx-2 rounded-xl hover:bg-[#FAF6EF] transition-all"
                                >
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-lg overflow-hidden relative shrink-0 border border-stone-200/80 bg-stone-100">
                                      <Image
                                        src="https://images.unsplash.com/photo-1627834377411-8da5f4f09de8?w=80&q=80"
                                        alt="Bobbatlu"
                                        fill
                                        sizes="32px"
                                        className="object-cover group-hover/item:scale-110 transition-transform duration-200"
                                      />
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-xs font-semibold text-[#002c3f] group-hover/item:text-[#871a45] transition-colors">
                                        Traditional Bobbatlu
                                      </span>
                                      <span className="text-[10px] text-stone-400 font-normal">
                                        Slow-cooked puran poli
                                      </span>
                                    </div>
                                  </div>
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </div>

                        {/* Col 2: Kaju & Dry Fruits */}
                        <div className="space-y-6">
                          <div>
                            <div className="flex items-center gap-2 mb-3 pb-1.5 border-b border-stone-200/80">
                              <div className="w-5 h-5 rounded-md bg-[#871a45]/10 flex items-center justify-center text-[#871a45]">
                                <StarIcon className="w-3 h-3 text-[#871a45]" />
                              </div>
                              <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#871a45]">
                                Kaju &amp; Dry Fruits
                              </h3>
                            </div>
                            <ul className="space-y-1">
                              <li>
                                <Link
                                  href="/sweets/kaju-katli"
                                  className="group/item flex items-center justify-between p-2 -mx-2 rounded-xl hover:bg-[#FAF6EF] transition-all"
                                >
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-lg overflow-hidden relative shrink-0 border border-stone-200/80 bg-stone-100">
                                      <Image
                                        src="https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=80&q=80"
                                        alt="Kaju Katli"
                                        fill
                                        sizes="32px"
                                        className="object-cover group-hover/item:scale-110 transition-transform duration-200"
                                      />
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-xs font-semibold text-[#002c3f] group-hover/item:text-[#871a45] transition-colors">
                                        Diamond Kaju Katli
                                      </span>
                                      <span className="text-[10px] text-stone-400 font-normal">
                                        100% Goan cashew &amp; silver
                                      </span>
                                    </div>
                                  </div>
                                  <span className="text-[9px] font-bold text-[#871a45] bg-[#fce8e8] px-1.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                                    Top Gift
                                  </span>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/sweets"
                                  className="group/item flex items-center justify-between p-2 -mx-2 rounded-xl hover:bg-[#FAF6EF] transition-all"
                                >
                                  <span className="text-xs font-semibold text-[#002c3f] group-hover/item:text-[#871a45] transition-colors">
                                    Kaju Pista Roll
                                  </span>
                                  <span className="text-[10px] text-stone-400">Pistachio Core</span>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/sweets"
                                  className="group/item flex items-center justify-between p-2 -mx-2 rounded-xl hover:bg-[#FAF6EF] transition-all"
                                >
                                  <span className="text-xs font-semibold text-[#002c3f] group-hover/item:text-[#871a45] transition-colors">
                                    Anjeer Dry Fruit Barfi
                                  </span>
                                  <span className="text-[10px] text-stone-400">Sugar-free Fig</span>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/sweets"
                                  className="group/item flex items-center justify-between p-2 -mx-2 rounded-xl hover:bg-[#FAF6EF] transition-all"
                                >
                                  <span className="text-xs font-semibold text-[#002c3f] group-hover/item:text-[#871a45] transition-colors">
                                    Badam Halwa &amp; Katli
                                  </span>
                                  <span className="text-[10px] text-stone-400">Mamra Almonds</span>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/sweets"
                                  className="group/item flex items-center justify-between p-2 -mx-2 rounded-xl hover:bg-[#FAF6EF] transition-all"
                                >
                                  <span className="text-xs font-semibold text-[#002c3f] group-hover/item:text-[#871a45] transition-colors">
                                    Roasted Cashew Bites
                                  </span>
                                  <span className="text-[10px] text-stone-400">Caramelized</span>
                                </Link>
                              </li>
                            </ul>
                          </div>

                          <div>
                            <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-[#002c3f] mb-2 pb-1 border-b border-stone-100">
                              Milk &amp; Khoya Mithai
                            </h4>
                            <ul className="space-y-1.5 text-xs text-stone-600 font-normal">
                              <li><Link href="/sweets" className="hover:text-[#871a45] block transition-colors">Kesar Peda &amp; Mathura Peda</Link></li>
                              <li><Link href="/sweets" className="hover:text-[#871a45] block transition-colors">Malai Kalakand &amp; Milk Cake</Link></li>
                              <li><Link href="/sweets" className="hover:text-[#871a45] block transition-colors">Gulab Jamun &amp; Bengali Rasgulla</Link></li>
                            </ul>
                          </div>
                        </div>

                        {/* Col 3: Andhra Heritage Specials */}
                        <div className="space-y-6">
                          <div>
                            <div className="flex items-center gap-2 mb-3 pb-1.5 border-b border-stone-200/80">
                              <div className="w-5 h-5 rounded-md bg-[#871a45]/10 flex items-center justify-center text-[#871a45]">
                                <LeafIcon className="w-3 h-3 text-[#871a45]" />
                              </div>
                              <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#871a45]">
                                Andhra Heritage
                              </h3>
                            </div>
                            <ul className="space-y-2 text-xs text-stone-600 font-normal">
                              <li>
                                <Link href="/sweets/pootharekulu" className="hover:text-[#871a45] hover:font-semibold transition-colors flex items-center justify-between">
                                  <span>Organic Bellam Pootharekulu</span>
                                  <span className="text-[10px] text-stone-400">Godavari</span>
                                </Link>
                              </li>
                              <li>
                                <Link href="/sweets" className="hover:text-[#871a45] hover:font-semibold transition-colors flex items-center justify-between">
                                  <span>Kakinada Gottam Khaja</span>
                                  <span className="text-[10px] text-stone-400">Juicy</span>
                                </Link>
                              </li>
                              <li>
                                <Link href="/sweets" className="hover:text-[#871a45] hover:font-semibold transition-colors flex items-center justify-between">
                                  <span>Tapeswaram Madatha Khaja</span>
                                  <span className="text-[10px] text-stone-400">Flaky</span>
                                </Link>
                              </li>
                              <li>
                                <Link href="/sweets" className="hover:text-[#871a45] hover:font-semibold transition-colors flex items-center justify-between">
                                  <span>Bandar Thokkudu Laddu</span>
                                  <span className="text-[10px] text-stone-400">Heritage</span>
                                </Link>
                              </li>
                              <li>
                                <Link href="/sweets" className="hover:text-[#871a45] hover:font-semibold transition-colors flex items-center justify-between">
                                  <span>Bellam Sunnundalu (Urad Dal)</span>
                                  <span className="text-[10px] text-stone-400">Nourishing</span>
                                </Link>
                              </li>
                              <li>
                                <Link href="/sweets" className="hover:text-[#871a45] hover:font-semibold transition-colors flex items-center justify-between">
                                  <span>Golden Bellam Jalebi</span>
                                  <span className="text-[10px] text-stone-400">Warm</span>
                                </Link>
                              </li>
                            </ul>
                          </div>

                          <div className="bg-[#FAF6EF] p-3 rounded-xl border border-stone-200/80">
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#871a45] block">
                              Artisan Guarantee
                            </span>
                            <p className="text-[11px] text-stone-600 mt-0.5 leading-relaxed">
                              Rolled with pure unadulterated cow ghee and local organic palm jaggery.
                            </p>
                          </div>
                        </div>

                        {/* Col 4: Gifting Hampers & Wedding Trays */}
                        <div>
                          <div className="flex items-center gap-2 mb-3 pb-1.5 border-b border-stone-200/80">
                            <div className="w-5 h-5 rounded-md bg-[#871a45]/10 flex items-center justify-center text-[#871a45]">
                              <GiftIcon className="w-3 h-3 text-[#871a45]" />
                            </div>
                            <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#871a45]">
                              Gifting &amp; Hampers
                            </h3>
                          </div>
                          <ul className="space-y-2 text-xs text-stone-600 font-normal">
                            <li>
                              <Link href="/festival-boxes/royal-vijayawada-hamper" className="hover:text-[#871a45] hover:font-semibold transition-colors block">
                                Royal Vijayawada Hamper (1kg)
                              </Link>
                            </li>
                            <li>
                              <Link href="/festival-boxes/diwali-delight-box" className="hover:text-[#871a45] hover:font-semibold transition-colors block">
                                Diwali Delight Sweet Box
                              </Link>
                            </li>
                            <li>
                              <Link href="/festival-boxes/sankranti-celebration-box" className="hover:text-[#871a45] hover:font-semibold transition-colors block">
                                Sankranti Celebration Box
                              </Link>
                            </li>
                            <li>
                              <Link href="/festival-boxes/classic-assorted-box" className="hover:text-[#871a45] hover:font-semibold transition-colors block">
                                Classic Assorted Sweets Box
                              </Link>
                            </li>
                            <li>
                              <Link href="/festival-boxes" className="hover:text-[#871a45] hover:font-semibold transition-colors block">
                                Pellikoduku / Wedding Return Trays
                              </Link>
                            </li>
                            <li>
                              <Link href="/festival-boxes" className="hover:text-[#871a45] hover:font-semibold transition-colors block">
                                Custom Velvet Gift Tins with Foil Names
                              </Link>
                            </li>
                            <li>
                              <Link href="/festival-boxes" className="hover:text-[#871a45] hover:font-semibold transition-colors block">
                                Corporate Bulk Sweets (50+ units)
                              </Link>
                            </li>
                          </ul>
                        </div>

                        {/* Col 5: Editorial Showcase Card */}
                        <div className="bg-gradient-to-br from-[#FAF6EF] to-[#F5EFE6] rounded-2xl p-5 border border-amber-200/70 shadow-xs flex flex-col justify-between">
                          <div>
                            <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-3.5 shadow-sm border border-stone-200/60">
                              <Image
                                src="https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80"
                                alt="Royal Festive Hamper"
                                fill
                                sizes="240px"
                                className="object-cover"
                              />
                              <div className="absolute top-2.5 left-2.5 bg-[#871a45] text-[#F8D030] text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                                <SparklesIcon className="w-2.5 h-2.5 text-[#F8D030]" />
                                <span>Fresh Morning Batch</span>
                              </div>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#871a45]">
                              15 Years of Heritage
                            </span>
                            <h4
                              className="font-serif text-base font-bold text-[#002c3f] mt-0.5 leading-snug"
                              style={{ fontFamily: "var(--font-fraunces)" }}
                            >
                              Royal Vijayawada Gift Hamper
                            </h4>
                            <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                              Handcrafted with Kaju Katli, Pootharekulu, Mysore Pak &amp; Dry Fruits in a regal box.
                            </p>
                            <div className="mt-3 flex items-baseline gap-2">
                              <span className="text-sm font-bold text-[#002c3f]">₹1,450</span>
                              <span className="text-[11px] text-stone-400">· 1kg Luxury Box</span>
                            </div>
                          </div>
                          <Link
                            href="/festival-boxes/royal-vijayawada-hamper"
                            className="mt-4 w-full inline-flex items-center justify-center gap-1.5 bg-[#871a45] hover:bg-[#691436] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-all active:scale-98"
                          >
                            <span>Order This Hamper</span>
                            <span>→</span>
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Trust Guarantee Strip */}
                    <div className="bg-[#FAF6EF] border-t border-stone-200/80 px-6 lg:px-10 xl:px-14 py-3 flex items-center justify-between text-xs text-[#002c3f]">
                      <div className="flex items-center gap-6 text-[11px] font-semibold text-stone-600">
                        <div className="flex items-center gap-2">
                          <LeafIcon className="w-3.5 h-3.5 text-emerald-600" />
                          <span>100% Pure Desi Cow Ghee</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ShieldCheckIcon className="w-3.5 h-3.5 text-[#871a45]" />
                          <span>Zero Preservatives &amp; Handcrafted Daily</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TruckIcon className="w-3.5 h-3.5 text-[#002c3f]" />
                          <span>Same-Day Shop Pickup in Governorpet</span>
                        </div>
                      </div>
                      <a
                        href="tel:+919848022338"
                        className="font-bold text-[#871a45] hover:text-[#691436] flex items-center gap-1.5 text-xs transition-colors"
                      >
                        <PhoneIcon className="w-3.5 h-3.5" />
                        <span>Wedding &amp; Bulk Orders: +91 98480 22338</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* ── TAB 2: CAKES & BAKERY (Mega Menu Dropdown) ── */}
                <div className="group/cakes static h-full flex items-center px-2 xl:px-2.5">
                  <Link
                    href="/cakes"
                    className="py-1 flex items-center gap-1 border-b-2 border-transparent group-hover/cakes:border-[#871a45] group-hover/cakes:text-[#871a45] transition-all"
                  >
                    <span>Cakes</span>
                    <ChevronDownIcon className="w-3 h-3 text-stone-400 group-hover/cakes:text-[#871a45] group-hover/cakes:rotate-180 transition-transform duration-200" />
                  </Link>

                  {/* Mega Menu Dropdown */}
                  <div className="absolute top-full left-0 right-0 w-full bg-white border-b border-stone-200/90 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.18)] invisible opacity-0 group-hover/cakes:visible group-hover/cakes:opacity-100 transition-all duration-200 z-50 text-left">
                    <div className="w-full px-6 lg:px-10 xl:px-14 py-8">
                      <div className="grid grid-cols-4 gap-8">
                        <div>
                          <div className="flex items-center gap-2 mb-3 pb-1.5 border-b border-stone-200/80">
                            <div className="w-5 h-5 rounded-md bg-[#871a45]/10 flex items-center justify-center text-[#871a45]">
                              <SparklesIcon className="w-3 h-3 text-[#871a45]" />
                            </div>
                            <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#871a45]">
                              Celebration Cakes
                            </h3>
                          </div>
                          <ul className="space-y-1.5">
                            <li>
                              <Link
                                href="/cakes/plum-cake"
                                className="group/item flex items-center justify-between p-2 -mx-2 rounded-xl hover:bg-[#FAF6EF] transition-all"
                              >
                                <div>
                                  <span className="text-xs font-semibold text-[#002c3f] group-hover/item:text-[#871a45] transition-colors block">
                                    Rich Holiday Plum Cake
                                  </span>
                                  <span className="text-[10px] text-stone-400">15-Year Winter Recipe</span>
                                </div>
                                <span className="text-[9px] font-bold text-[#871a45] bg-[#fce8e8] px-1.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                                  Gifting
                                </span>
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/cakes/black-forest"
                                className="group/item flex items-center justify-between p-2 -mx-2 rounded-xl hover:bg-[#FAF6EF] transition-all"
                              >
                                <div>
                                  <span className="text-xs font-semibold text-[#002c3f] group-hover/item:text-[#871a45] transition-colors block">
                                    Black Forest Delight
                                  </span>
                                  <span className="text-[10px] text-stone-400">Whipped cream &amp; cherries</span>
                                </div>
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/cakes/butterscotch-cake"
                                className="group/item flex items-center justify-between p-2 -mx-2 rounded-xl hover:bg-[#FAF6EF] transition-all"
                              >
                                <div>
                                  <span className="text-xs font-semibold text-[#002c3f] group-hover/item:text-[#871a45] transition-colors block">
                                    Butterscotch Crunch
                                  </span>
                                  <span className="text-[10px] text-stone-400">Praline caramel crunch</span>
                                </div>
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/cakes/pineapple-pastry"
                                className="group/item flex items-center justify-between p-2 -mx-2 rounded-xl hover:bg-[#FAF6EF] transition-all"
                              >
                                <div>
                                  <span className="text-xs font-semibold text-[#002c3f] group-hover/item:text-[#871a45] transition-colors block">
                                    Fresh Pineapple Pastry
                                  </span>
                                  <span className="text-[10px] text-stone-400">Tender sponge &amp; fruit</span>
                                </div>
                              </Link>
                            </li>
                          </ul>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-3 pb-1.5 border-b border-stone-200/80">
                            <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#002c3f]">
                              Pastries &amp; Tea Cakes
                            </h3>
                          </div>
                          <ul className="space-y-2 text-xs text-stone-600 font-normal">
                            <li><Link href="/cakes" className="hover:text-[#871a45] block transition-colors">Eggless Cupcakes (Box of 4)</Link></li>
                            <li><Link href="/cakes" className="hover:text-[#871a45] block transition-colors">Almond Honey Tea Cake</Link></li>
                            <li><Link href="/cakes" className="hover:text-[#871a45] block transition-colors">Rich Fruit &amp; Nut Bar Cake</Link></li>
                            <li><Link href="/cakes" className="hover:text-[#871a45] block transition-colors">Warm Choco Lava Cup</Link></li>
                          </ul>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-3 pb-1.5 border-b border-stone-200/80">
                            <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#002c3f]">
                              Bakery &amp; Savouries
                            </h3>
                          </div>
                          <ul className="space-y-2 text-xs text-stone-600 font-normal">
                            <li><Link href="/cakes" className="hover:text-[#871a45] block transition-colors">Warm Spiced Veg Puff</Link></li>
                            <li><Link href="/cakes" className="hover:text-[#871a45] block transition-colors">Paneer Tikka Puff</Link></li>
                            <li><Link href="/cakes" className="hover:text-[#871a45] block transition-colors">Crispy Milk Toast &amp; Rusk</Link></li>
                            <li><Link href="/cakes" className="hover:text-[#871a45] block transition-colors">Butter Cashew Bakery Cookies</Link></li>
                          </ul>
                        </div>

                        <div className="bg-gradient-to-br from-[#FAF6EF] to-[#F5EFE6] rounded-2xl p-5 border border-amber-200/70 shadow-xs flex flex-col justify-between">
                          <div>
                            <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-3.5 shadow-sm border border-stone-200/60">
                              <Image
                                src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80"
                                alt="Fresh Celebration Cakes"
                                fill
                                sizes="240px"
                                className="object-cover"
                              />
                              <div className="absolute top-2.5 left-2.5 bg-[#871a45] text-[#F8D030] text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                                Baked Fresh Daily
                              </div>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#871a45]">
                              Custom Celebrations
                            </span>
                            <h4
                              className="font-serif text-base font-bold text-[#002c3f] mt-0.5 leading-snug"
                              style={{ fontFamily: "var(--font-fraunces)" }}
                            >
                              Birthday &amp; Event Cakes
                            </h4>
                            <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                              Order same-day counter pickup at our Governorpet shop.
                            </p>
                          </div>
                          <Link
                            href="/cakes"
                            className="mt-4 w-full inline-flex items-center justify-center gap-1.5 bg-[#871a45] hover:bg-[#691436] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-all active:scale-98"
                          >
                            <span>View All Cakes</span>
                            <span>→</span>
                          </Link>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#FAF6EF] border-t border-stone-200/80 px-6 lg:px-10 xl:px-14 py-2.5 text-xs text-stone-600 font-semibold flex items-center justify-between">
                      <span>100% Pure Vegetarian &amp; Eggless Recipes Available Daily</span>
                      <Link href="/cakes" className="text-[#871a45] font-bold hover:underline">
                        Same-Day Cake Customization &rarr;
                      </Link>
                    </div>
                  </div>
                </div>

                {/* ── TAB 3: SAVOURIES & MIXTURE (Mega Menu Dropdown) ── */}
                <div className="group/snacks static h-full flex items-center px-2 xl:px-2.5">
                  <Link
                    href="/snacks"
                    className="py-1 flex items-center gap-1 border-b-2 border-transparent group-hover/snacks:border-[#871a45] group-hover/snacks:text-[#871a45] transition-all"
                  >
                    <span>Savouries</span>
                    <ChevronDownIcon className="w-3 h-3 text-stone-400 group-hover/snacks:text-[#871a45] group-hover/snacks:rotate-180 transition-transform duration-200" />
                  </Link>

                  {/* Mega Menu Dropdown */}
                  <div className="absolute top-full left-0 right-0 w-full bg-white border-b border-stone-200/90 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.18)] invisible opacity-0 group-hover/snacks:visible group-hover/snacks:opacity-100 transition-all duration-200 z-50 text-left">
                    <div className="w-full px-6 lg:px-10 xl:px-14 py-8">
                      <div className="grid grid-cols-4 gap-8">
                        <div>
                          <div className="flex items-center gap-2 mb-3 pb-1.5 border-b border-stone-200/80">
                            <div className="w-5 h-5 rounded-md bg-[#871a45]/10 flex items-center justify-center text-[#871a45]">
                              <SparklesIcon className="w-3 h-3 text-[#871a45]" />
                            </div>
                            <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#871a45]">
                              Spicy Andhra Mixtures
                            </h3>
                          </div>
                          <ul className="space-y-1.5">
                            <li>
                              <Link
                                href="/snacks/vijayawada-mixture"
                                className="group/item flex items-center justify-between p-2 -mx-2 rounded-xl hover:bg-[#FAF6EF] transition-all"
                              >
                                <div>
                                  <span className="text-xs font-semibold text-[#002c3f] group-hover/item:text-[#871a45] transition-colors block">
                                    Special Vijayawada Mixture
                                  </span>
                                  <span className="text-[10px] text-stone-400">Fried cashews, curry leaves &amp; sev</span>
                                </div>
                                <span className="text-[9px] font-bold text-[#871a45] bg-[#fce8e8] px-1.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                                  Signature
                                </span>
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/snacks/ribbon-pakoda"
                                className="group/item flex items-center justify-between p-2 -mx-2 rounded-xl hover:bg-[#FAF6EF] transition-all"
                              >
                                <div>
                                  <span className="text-xs font-semibold text-[#002c3f] group-hover/item:text-[#871a45] transition-colors block">
                                    Crispy Ribbon Pakoda
                                  </span>
                                  <span className="text-[10px] text-stone-400">Besan &amp; red chili ribbon crisp</span>
                                </div>
                              </Link>
                            </li>
                            <li>
                              <Link href="/snacks" className="p-2 -mx-2 rounded-xl hover:bg-[#FAF6EF] block transition-colors text-xs font-semibold text-[#002c3f] hover:text-[#871a45]">
                                Spicy Karapusa (Fine Sev)
                              </Link>
                            </li>
                            <li>
                              <Link href="/snacks" className="p-2 -mx-2 rounded-xl hover:bg-[#FAF6EF] block transition-colors text-xs font-semibold text-[#002c3f] hover:text-[#871a45]">
                                Crunchy Cornflakes Chivda
                              </Link>
                            </li>
                          </ul>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-3 pb-1.5 border-b border-stone-200/80">
                            <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#002c3f]">
                              Traditional Andhra Crunch
                            </h3>
                          </div>
                          <ul className="space-y-1.5">
                            <li>
                              <Link
                                href="/snacks/bellam-gavvalu"
                                className="group/item flex items-center justify-between p-2 -mx-2 rounded-xl hover:bg-[#FAF6EF] transition-all"
                              >
                                <div>
                                  <span className="text-xs font-semibold text-[#002c3f] group-hover/item:text-[#871a45] transition-colors block">
                                    Crunchy Bellam Gavvalu
                                  </span>
                                  <span className="text-[10px] text-stone-400">Sweet jaggery shell bites</span>
                                </div>
                                <span className="text-[9px] font-bold text-[#2D5E3F] bg-emerald-50 px-1.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                                  Sweet
                                </span>
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/snacks/chekkalu"
                                className="group/item flex items-center justify-between p-2 -mx-2 rounded-xl hover:bg-[#FAF6EF] transition-all"
                              >
                                <div>
                                  <span className="text-xs font-semibold text-[#002c3f] group-hover/item:text-[#871a45] transition-colors block">
                                    Authentic Andhra Chekkalu
                                  </span>
                                  <span className="text-[10px] text-stone-400">Crisp rice discs with chana dal</span>
                                </div>
                              </Link>
                            </li>
                            <li>
                              <Link href="/snacks" className="p-2 -mx-2 rounded-xl hover:bg-[#FAF6EF] block transition-colors text-xs font-semibold text-[#002c3f] hover:text-[#871a45]">
                                Nethi Murukulu &amp; Chakli
                              </Link>
                            </li>
                            <li>
                              <Link href="/snacks" className="p-2 -mx-2 rounded-xl hover:bg-[#FAF6EF] block transition-colors text-xs font-semibold text-[#002c3f] hover:text-[#871a45]">
                                Masala Roasted Cashew Nuts
                              </Link>
                            </li>
                          </ul>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-3 pb-1.5 border-b border-stone-200/80">
                            <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#002c3f]">
                              Fresh Counter Snacks
                            </h3>
                          </div>
                          <ul className="space-y-2 text-xs text-stone-600 font-normal">
                            <li><Link href="/snacks" className="hover:text-[#871a45] block transition-colors">Golden Onion Pakoda</Link></li>
                            <li><Link href="/snacks" className="hover:text-[#871a45] block transition-colors">Crispy Kara Boondi</Link></li>
                            <li><Link href="/snacks" className="hover:text-[#871a45] block transition-colors">Spicy Peanut Masala Fry</Link></li>
                            <li><Link href="/snacks" className="hover:text-[#871a45] block transition-colors">Salted Pepper Cashews</Link></li>
                          </ul>
                        </div>

                        <div className="bg-gradient-to-br from-[#FAF6EF] to-[#F5EFE6] rounded-2xl p-5 border border-amber-200/70 shadow-xs flex flex-col justify-between">
                          <div>
                            <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-3.5 shadow-sm border border-stone-200/60">
                              <Image
                                src="https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&q=80"
                                alt="Vijayawada Savouries"
                                fill
                                sizes="240px"
                                className="object-cover"
                              />
                              <div className="absolute top-2.5 left-2.5 bg-[#871a45] text-[#F8D030] text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                                Fresh Groundnut Oil
                              </div>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#871a45]">
                              Zero Palm Oil
                            </span>
                            <h4
                              className="font-serif text-base font-bold text-[#002c3f] mt-0.5 leading-snug"
                              style={{ fontFamily: "var(--font-fraunces)" }}
                            >
                              Vijayawada Signature Mixture
                            </h4>
                            <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                              Crunchy curry leaves, toasted cashews and roasted peanuts in cold-pressed oil.
                            </p>
                          </div>
                          <Link
                            href="/snacks"
                            className="mt-4 w-full inline-flex items-center justify-center gap-1.5 bg-[#871a45] hover:bg-[#691436] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-all active:scale-98"
                          >
                            <span>Shop Savouries</span>
                            <span>→</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── TAB 4: FESTIVAL BOXES (GIFTING) (Mega Menu Dropdown) ── */}
                <div className="group/boxes static h-full flex items-center px-2 xl:px-2.5">
                  <Link
                    href="/festival-boxes"
                    className="py-1 flex items-center gap-1.5 border-b-2 border-transparent group-hover/boxes:border-[#871a45] text-[#871a45] transition-all"
                  >
                    <GiftIcon className="w-3.5 h-3.5 text-[#871a45]" />
                    <span>Festival Boxes</span>
                    <span className="bg-[#fce8e8] text-[#c93b3b] text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                      Gifting
                    </span>
                  </Link>

                  {/* Mega Menu Dropdown */}
                  <div className="absolute top-full left-0 right-0 w-full bg-white border-b border-stone-200/90 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.18)] invisible opacity-0 group-hover/boxes:visible group-hover/boxes:opacity-100 transition-all duration-200 z-50 text-left">
                    <div className="w-full px-6 lg:px-10 xl:px-14 py-8">
                      <div className="grid grid-cols-4 gap-8">
                        <div>
                          <div className="flex items-center gap-2 mb-3 pb-1.5 border-b border-stone-200/80">
                            <div className="w-5 h-5 rounded-md bg-[#871a45]/10 flex items-center justify-center text-[#871a45]">
                              <GiftIcon className="w-3 h-3 text-[#871a45]" />
                            </div>
                            <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#871a45]">
                              Curated Festive Hampers
                            </h3>
                          </div>
                          <ul className="space-y-1.5">
                            <li>
                              <Link
                                href="/festival-boxes/royal-vijayawada-hamper"
                                className="group/item flex items-center justify-between p-2 -mx-2 rounded-xl hover:bg-[#FAF6EF] transition-all"
                              >
                                <div>
                                  <span className="text-xs font-semibold text-[#002c3f] group-hover/item:text-[#871a45] transition-colors block">
                                    Royal Vijayawada Hamper
                                  </span>
                                  <span className="text-[10px] text-stone-400">1kg assortment in velvet tin</span>
                                </div>
                                <span className="text-[9px] font-bold text-[#871a45] bg-[#fce8e8] px-1.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                                  Bestseller
                                </span>
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/festival-boxes/diwali-delight-box"
                                className="group/item flex items-center justify-between p-2 -mx-2 rounded-xl hover:bg-[#FAF6EF] transition-all"
                              >
                                <div>
                                  <span className="text-xs font-semibold text-[#002c3f] group-hover/item:text-[#871a45] transition-colors block">
                                    Diwali Delight Sweet Box
                                  </span>
                                  <span className="text-[10px] text-stone-400">Kaju Katli, Mysore Pak &amp; Diyas</span>
                                </div>
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/festival-boxes/sankranti-celebration-box"
                                className="group/item flex items-center justify-between p-2 -mx-2 rounded-xl hover:bg-[#FAF6EF] transition-all"
                              >
                                <div>
                                  <span className="text-xs font-semibold text-[#002c3f] group-hover/item:text-[#871a45] transition-colors block">
                                    Sankranti Celebration Box
                                  </span>
                                  <span className="text-[10px] text-stone-400">Ariselu, Pootharekulu &amp; Bobbatlu</span>
                                </div>
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/festival-boxes/classic-assorted-box"
                                className="group/item flex items-center justify-between p-2 -mx-2 rounded-xl hover:bg-[#FAF6EF] transition-all"
                              >
                                <div>
                                  <span className="text-xs font-semibold text-[#002c3f] group-hover/item:text-[#871a45] transition-colors block">
                                    Classic Assorted Box
                                  </span>
                                  <span className="text-[10px] text-stone-400">500g family favourite sweets</span>
                                </div>
                              </Link>
                            </li>
                          </ul>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-3 pb-1.5 border-b border-stone-200/80">
                            <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#002c3f]">
                              Weddings &amp; Occasions
                            </h3>
                          </div>
                          <ul className="space-y-2 text-xs text-stone-600 font-normal">
                            <li><Link href="/festival-boxes" className="hover:text-[#871a45] block transition-colors">Pellikoduku / Pellikuthuru Trays</Link></li>
                            <li><Link href="/festival-boxes" className="hover:text-[#871a45] block transition-colors">Gruhapravesam Sweet Trays</Link></li>
                            <li><Link href="/festival-boxes" className="hover:text-[#871a45] block transition-colors">Baby Shower (Seemantham) Hampers</Link></li>
                            <li><Link href="/festival-boxes" className="hover:text-[#871a45] block transition-colors">Custom Velvet Tins with Foil Names</Link></li>
                          </ul>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-3 pb-1.5 border-b border-stone-200/80">
                            <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#002c3f]">
                              Corporate Gifting
                            </h3>
                          </div>
                          <ul className="space-y-2 text-xs text-stone-600 font-normal">
                            <li><Link href="/festival-boxes" className="hover:text-[#871a45] block transition-colors">Diwali Corporate Boxes (50+ units)</Link></li>
                            <li><Link href="/festival-boxes" className="hover:text-[#871a45] block transition-colors">Client Appreciation Sweet Tins</Link></li>
                            <li><Link href="/festival-boxes" className="hover:text-[#871a45] block transition-colors">Dry Fruit Executive Hampers</Link></li>
                            <li><Link href="/festival-boxes" className="hover:text-[#871a45] block transition-colors">Custom Logo Ribbon Sleeves</Link></li>
                          </ul>
                        </div>

                        <div className="bg-gradient-to-br from-[#FAF6EF] to-[#F5EFE6] rounded-2xl p-5 border border-amber-200/70 shadow-xs flex flex-col justify-between">
                          <div>
                            <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-3.5 shadow-sm border border-stone-200/60">
                              <Image
                                src="https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80"
                                alt="Royal Festive Hampers"
                                fill
                                sizes="240px"
                                className="object-cover"
                              />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#871a45]">
                              Premium Velvet Packaging
                            </span>
                            <h4
                              className="font-serif text-base font-bold text-[#002c3f] mt-0.5 leading-snug"
                              style={{ fontFamily: "var(--font-fraunces)" }}
                            >
                              Festive Delivery in Vijayawada
                            </h4>
                            <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                              Order bespoke boxes with same-day shop pickup or doorstep delivery.
                            </p>
                          </div>
                          <Link
                            href="/festival-boxes"
                            className="mt-4 w-full inline-flex items-center justify-center gap-1.5 bg-[#871a45] hover:bg-[#691436] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-all active:scale-98"
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
                <div className="h-full flex items-center px-2 xl:px-2.5">
                  <Link
                    href="/sweets"
                    className="py-1 flex items-center border-b-2 border-transparent hover:border-[#871a45] hover:text-[#871a45] transition-all whitespace-nowrap"
                  >
                    <span>Bulk &amp; Weddings</span>
                  </Link>
                </div>
              </nav>
            </div>

            {/* Right: Search Bar + Profile + Wishlist + Cart (search/profile/wishlist are dummies for now) */}
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
                  <CartBadge />
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
  );
}
