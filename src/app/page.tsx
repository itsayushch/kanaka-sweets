import Link from "next/link";
import Image from "next/image";
import {
  getFeaturedProducts,
  getSiteSettings,
  getProductsByCategory,
} from "@/lib/db-products";
import { ProductCard } from "@/components/ProductCard";
import { CategoryStories } from "@/components/CategoryStories";
import { HeroCarousel, type HeroBanner } from "@/components/HeroCarousel";
import {
  StarIcon,
  GiftIcon,
  WhatsAppIcon,
  SparklesIcon,
  ArrowRightIcon,
} from "@/components/icons";

const HERO_BANNERS: HeroBanner[] = [
  {
    id: "festival-boxes",
    image: "/images/banners/banner-festival-boxes.webp",
    alt: "Kanaka Sweets & Bakery Special Festival Boxes - Spread Happiness This Diwali",
    title: "Shop Festival Specials & Gift Boxes",
    href: "/festival-boxes",
  },
  {
    id: "sweets",
    image: "/images/banners/banner-sweets.webp",
    alt: "Kanaka Sweets & Bakery - Sweetness in Every Bite, Handcrafted Pure Ghee Sweets",
    title: "Order Fresh Andhra Sweets & Mithai",
    href: "/sweets",
  },
  {
    id: "cakes",
    image: "/images/banners/banner-cakes.webp",
    alt: "Celebrate with Our Delicious Cakes - Fresh Celebration Cakes and Pastries",
    title: "Order Fresh Celebration Cakes",
    href: "/cakes",
  },
  {
    id: "snacks",
    image: "/images/banners/banner-snacks.webp",
    alt: "Tasty Snacks for Every Mood - Vijayawada Special Spicy Mixture and Savouries",
    title: "Explore Crunchy Andhra Savouries",
    href: "/snacks",
  },
];

const REVIEWS = [
  {
    name: "Priya Reddy",
    location: "Governorpet, Vijayawada",
    stars: 5,
    tag: "Verified Buyer",
    sweet: "Pootharekulu & Kaju Katli",
    text: "The Pootharekulu here is paper-thin with rich ghee and jaggery filling. The packaging felt like a luxury gift box from Mumbai or Delhi. Absolutely unmatched quality!",
  },
  {
    name: "Srinivas Rao",
    location: "Banjara Hills, Hyderabad",
    stars: 5,
    tag: "Wedding Order",
    sweet: "Royal Festive Hamper",
    text: "Ordered 150 Festival Hampers for our daughter's wedding in Hyderabad. Every single guest complimented the freshness of the Mysore Pak. Delivered on time in perfect condition.",
  },
  {
    name: "Deepika Sharma",
    location: "Benz Circle, Vijayawada",
    stars: 5,
    tag: "Regular Customer",
    sweet: "Pure Ghee Mysore Pak",
    text: "Been buying from their Eluru Road shop for over 8 years. You can immediately smell the purity of real cow ghee the moment you open the box. Highly recommended!",
  },
];

export default async function HomePage() {
  "use cache";
  const [featuredProducts, siteSettings, festivalProducts] =
    await Promise.all([
      getFeaturedProducts(),
      getSiteSettings(),
      getProductsByCategory("festival-boxes"),
    ]);

  const topFestivalBox = festivalProducts[0];

  return (
    <div suppressHydrationWarning className="bg-white">
      {/* ═══════════════════════════════════════════════════════════
          1. HERO CAROUSEL — Full-Width Visual Banners (BSS Style)
      ═══════════════════════════════════════════════════════════ */}
      <h1 className="sr-only">
        Kanaka Sweets &amp; Bakery — Authentic Andhra Mithai, Cakes &amp; Festival Hampers
      </h1>
      <HeroCarousel banners={HERO_BANNERS} />

      {/* ── 2. SIGNATURE CATEGORY STORIES RIBBON (Shifted Below Hero) ── */}
      <CategoryStories />

      {/* ═══════════════════════════════════════════════════════════
          3. AS SEEN IN / PRESS STRIP (BSS Signature Social Proof)
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-white py-10 border-b border-stone-100">
        <div className="w-full max-w-[1880px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 text-center">
          <h2
            className="text-xs font-bold uppercase tracking-[0.25em] text-stone-600 mb-6"
            style={{ fontFamily: "var(--font-jost)" }}
          >
            Featured In &amp; Recommended By
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:gap-x-10 text-stone-600 font-serif text-sm sm:text-base lg:text-lg font-bold tracking-wider">
            <span className="hover:text-[#002c3f] transition-colors">VOGUE INDIA</span>
            <span className="hidden sm:inline text-stone-400" aria-hidden="true">•</span>
            <span className="hover:text-[#002c3f] transition-colors">THE HINDU</span>
            <span className="hidden sm:inline text-stone-400" aria-hidden="true">•</span>
            <span className="hover:text-[#002c3f] transition-colors">TIMES OF INDIA</span>
            <span className="hidden sm:inline text-stone-400" aria-hidden="true">•</span>
            <span className="hover:text-[#002c3f] transition-colors">DECCAN CHRONICLE</span>
            <span className="hidden sm:inline text-stone-400" aria-hidden="true">•</span>
            <span className="hover:text-[#002c3f] transition-colors">CONDÉ NAST</span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          3. OUR GIFTING FAVOURITES (Products Grid)
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 bg-white" aria-labelledby="gifting-heading">
        <div className="w-full max-w-[1880px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <h2
              id="gifting-heading"
              className="text-3xl sm:text-4xl font-bold text-[#002c3f] tracking-tight"
              style={{ fontFamily: "var(--font-fraunces)" }}
            >
              Our Gifting Favourites
            </h2>
            <p
              className="text-stone-600 text-sm sm:text-base mt-2"
              style={{ fontFamily: "var(--font-jost)" }}
            >
              Vijayawada&apos;s most loved pure ghee sweets, festive boxes, and celebration delights.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.slice(0, 8).map((product, i) => (
              <ProductCard key={product.id} product={product} priority={i < 4} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/sweets"
              className="inline-flex items-center gap-2 border-2 border-[#871a45] text-[#871a45] hover:bg-[#871a45] hover:text-white px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-colors min-h-[48px]"
            >
              <span>View All Sweets &amp; Treats</span>
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          4. THE KANAKA EXPERIENCE (Parchment Storytelling Section)
      ═══════════════════════════════════════════════════════════ */}
      <section
        className="py-16 sm:py-24 bg-[#FAF6EF] border-y border-stone-200/70"
        aria-labelledby="experience-heading"
      >
        <div className="w-full max-w-[1880px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2
              id="experience-heading"
              className="text-3xl sm:text-4xl font-bold text-[#002c3f] tracking-tight"
              style={{ fontFamily: "var(--font-fraunces)" }}
            >
              The Kanaka Sweet Shop Experience
            </h2>
            <p
              className="text-stone-600 text-sm sm:text-base mt-2"
              style={{ fontFamily: "var(--font-jost)" }}
            >
              From timeless Andhra mithai to modern festive gifting, here&apos;s everything we have for you.
            </p>
          </div>

          {/* 4 Feature Cards (BSS exact layout) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Handcrafted Mithai */}
            <Link
              href="/sweets"
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-colors duration-300 flex flex-col"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-stone-100">
                <Image
                  src="/images/products/category-sweets.jpg"
                  alt="Pure Desi Ghee Sweets"
                  width={800}
                  height={600}
                  sizes="(max-width: 640px) 100vw, 25vw"
                  className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5 flex-grow flex flex-col justify-between">
                <div>
                  <h3
                    className="font-serif text-lg font-bold text-[#002c3f] group-hover:text-[#871a45] transition-colors"
                    style={{ fontFamily: "var(--font-fraunces)" }}
                  >
                    Pure Ghee Mithai
                  </h3>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    Atreyapuram Pootharekulu, diamond Kaju Katli, and melt-in-mouth Mysore Pak simmered daily.
                  </p>
                </div>
                <div className="mt-4 text-xs font-bold text-[#871a45] uppercase tracking-wider flex items-center gap-1">
                  <span>Shop Sweets</span>
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>

            {/* Card 2: Festival Hampers */}
            <Link
              href="/festival-boxes"
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-colors duration-300 flex flex-col"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-stone-100">
                <Image
                  src="/images/products/royal-festive-hamper.jpg"
                  alt="Luxury Gift Boxes"
                  width={800}
                  height={600}
                  sizes="(max-width: 640px) 100vw, 25vw"
                  className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5 flex-grow flex flex-col justify-between">
                <div>
                  <h3
                    className="font-serif text-lg font-bold text-[#002c3f] group-hover:text-[#871a45] transition-colors"
                    style={{ fontFamily: "var(--font-fraunces)" }}
                  >
                    Bespoke Gifting
                  </h3>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    Velvet-finish gift boxes with personalized foil cards. Perfect for weddings &amp; corporate Diwali gifts.
                  </p>
                </div>
                <div className="mt-4 text-xs font-bold text-[#871a45] uppercase tracking-wider flex items-center gap-1">
                  <span>Explore Hampers</span>
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>

            {/* Card 3: Fresh Savouries */}
            <Link
              href="/snacks"
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-colors duration-300 flex flex-col"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-stone-100">
                <Image
                  src="/images/products/category-snacks.jpg"
                  alt="Vijayawada Savouries"
                  width={800}
                  height={600}
                  sizes="(max-width: 640px) 100vw, 25vw"
                  className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5 flex-grow flex flex-col justify-between">
                <div>
                  <h3
                    className="font-serif text-lg font-bold text-[#002c3f] group-hover:text-[#871a45] transition-colors"
                    style={{ fontFamily: "var(--font-fraunces)" }}
                  >
                    Vijayawada Savouries
                  </h3>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    Spicy mixture, crunchy bellam gavvalu, and chekkalu prepared in fresh cold-pressed groundnut oil.
                  </p>
                </div>
                <div className="mt-4 text-xs font-bold text-[#871a45] uppercase tracking-wider flex items-center gap-1">
                  <span>Shop Snacks</span>
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>

            {/* Card 4: Our Governorpet Shop */}
            <a
              href="https://maps.google.com/?q=Kanaka+Sweets+Governorpet+Vijayawada"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-colors duration-300 flex flex-col"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-stone-100">
                <Image
                  src="/images/products/ghee-mysore-pak.jpg"
                  alt="Fresh Mysore Pak, a Kanaka Sweets favourite"
                  width={800}
                  height={600}
                  sizes="(max-width: 640px) 100vw, 25vw"
                  className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5 flex-grow flex flex-col justify-between">
                <div>
                  <h3
                    className="font-serif text-lg font-bold text-[#002c3f] group-hover:text-[#871a45] transition-colors"
                    style={{ fontFamily: "var(--font-fraunces)" }}
                  >
                    Visit Governorpet
                  </h3>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    Door No. 28-10-15, Eluru Road. Open 7 days from 7:00 AM to 10:30 PM. Same-day counter pickup.
                  </p>
                </div>
                <div className="mt-4 text-xs font-bold text-[#871a45] uppercase tracking-wider flex items-center gap-1">
                  <span>Get Directions</span>
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          5. FESTIVAL HIGHLIGHT SPECIAL (Rule A5, C5)
      ═══════════════════════════════════════════════════════════ */}
      {siteSettings?.festivalHighlightActive && topFestivalBox && (
        <section
          className="py-14 sm:py-20 bg-gradient-to-br from-[#871a45] via-[#691436] to-[#4a0e28] text-white relative overflow-hidden"
          aria-labelledby="festival-heading"
        >
          <div className="w-full max-w-[1880px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 bg-[#F8D030] text-[#002c3f] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  <SparklesIcon className="w-3.5 h-3.5 text-[#002c3f]" />
                  <span>Festival Season Special</span>
                </div>

                <h2
                  id="festival-heading"
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight"
                  style={{ fontFamily: "var(--font-fraunces)" }}
                >
                  {siteSettings.festivalHighlightTitle ||
                    "Celebrate with our Royal Festival Gift Boxes"}
                </h2>

                {siteSettings.festivalHighlightSubtitle && (
                  <p className="text-[#F8D030] text-sm sm:text-base font-semibold">
                    {siteSettings.festivalHighlightSubtitle}
                  </p>
                )}

                <p
                  className="text-white/80 text-sm sm:text-base leading-relaxed"
                  style={{ fontFamily: "var(--font-jost)" }}
                >
                  {siteSettings.festivalHighlightText ||
                    "Beautifully curated gift hampers filled with handcrafted Andhra sweets, Pootharekulu, Kaju Katli and more. Perfect for Diwali, Sankranti, weddings and corporate gifting."}
                </p>

                <div className="flex flex-wrap gap-3.5 pt-2">
                  <Link
                    href="/festival-boxes"
                    className="inline-flex items-center gap-2 bg-[#F8D030] text-[#002c3f] px-7 py-3.5 rounded-full font-bold text-sm uppercase tracking-wider hover:bg-yellow-300 active:scale-95 transition-transform shadow-lg min-h-[48px]"
                  >
                    <GiftIcon className="w-4 h-4 text-[#002c3f]" />
                    <span>Order a Festival Box</span>
                  </Link>

                  <a
                    href="https://wa.me/919000000000?text=Hello%20Kanaka%20Sweets,%20I%20would%20like%20to%20enquire%20about%20Bulk%20Festival%20Boxes"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border-2 border-white text-white px-6 py-3 rounded-full font-bold text-sm tracking-wider hover:bg-white/10 active:scale-95 transition-transform min-h-[48px]"
                  >
                    <WhatsAppIcon className="w-4 h-4 text-white" />
                    <span>WhatsApp Bulk Order</span>
                  </a>
                </div>

                {siteSettings.festivalHighlightDiscount && (
                  <p className="text-xs text-[#F8D030]/80 italic pt-1">
                    ★ {siteSettings.festivalHighlightDiscount}
                  </p>
                )}
              </div>

              {(siteSettings.festivalHighlightImage || topFestivalBox.image) && (
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20">
                  <Image
                    src={siteSettings.festivalHighlightImage || topFestivalBox.image}
                    alt="Kanaka Sweets festival gift boxes"
                    width={800}
                    height={600}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          6. CUSTOMER REVIEWS (Emerald Star Badges)
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 bg-white" aria-labelledby="reviews-heading">
        <div className="w-full max-w-[1880px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2
              id="reviews-heading"
              className="text-3xl sm:text-4xl font-bold text-[#002c3f]"
              style={{ fontFamily: "var(--font-fraunces)" }}
            >
              Loved by 1,200+ Sweet Lovers
            </h2>
            <p className="text-stone-600 text-sm mt-2">
              Real reviews from families, wedding planners, and foodies across Andhra Pradesh.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REVIEWS.map((review) => (
              <div
                key={review.name}
                className="bg-[#FAF6EF] rounded-2xl p-6 border border-stone-200/60 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex gap-1 text-[#2D5E3F]">
                      {Array.from({ length: review.stars }).map((_, i) => (
                        <StarIcon key={i} className="w-4 h-4 text-[#2D5E3F]" />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-[#2D5E3F] px-2.5 py-0.5 rounded-full">
                      {review.tag}
                    </span>
                  </div>

                  <p className="text-sm text-stone-700 italic leading-relaxed">
                    &ldquo;{review.text}&rdquo;
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-200/60">
                  <div className="font-bold text-sm text-[#002c3f]">
                    {review.name}
                  </div>
                  <div className="text-xs text-stone-600">{review.location}</div>
                  <div className="text-[11px] text-[#871a45] font-semibold mt-0.5">
                    Ordered: {review.sweet}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
