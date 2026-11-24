import Link from "next/link";
import Image from "next/image";
import {
  getAllCategories,
  getFeaturedProducts,
  getSiteSettings,
  getProductsByCategory,
} from "@/lib/db-products";
import { ProductCard } from "@/components/ProductCard";

const REVIEWS = [
  {
    name: "Priya Reddy",
    location: "Vijayawada",
    stars: 5,
    text: "The Pootharekulu here is absolutely divine — paper-thin rice sheets, pure ghee filling. We order every Diwali without fail.",
  },
  {
    name: "Srinivas Rao",
    location: "Hyderabad",
    stars: 5,
    text: "Drove all the way from Hyderabad just for their Mysore Pak. Worth every kilometre. The ghee quality is unmatched anywhere in AP.",
  },
  {
    name: "Deepika Sharma",
    location: "Governorpet",
    stars: 5,
    text: "Ordered a custom Festival Box for my wedding — beautifully presented, fresh, and all guests asked where we got the sweets from!",
  },
];

export default async function HomePage() {
  "use cache";
  const [categories, featuredProducts, siteSettings, festivalProducts] =
    await Promise.all([
      getAllCategories(),
      getFeaturedProducts(),
      getSiteSettings(),
      getProductsByCategory("festival-boxes"),
    ]);

  const topFestivalBox = festivalProducts[0];

  return (
    <div>
      {/* ═══════════════════════════════════
          1. HERO — navy bg, editorial layout
      ═══════════════════════════════════ */}
      <section
        className="bg-[#002c3f] text-white overflow-hidden"
        aria-labelledby="hero-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left: copy */}
            <div className="space-y-6 text-center lg:text-left">
              {/* Eyebrow */}
              <p
                className="text-[#F8D030] text-xs sm:text-sm font-bold uppercase tracking-[0.2em]"
                style={{ fontFamily: "var(--font-jost)" }}
              >
                Kanaka Sweets &amp; Bakery · Vijayawada · Est. 2011
              </p>

              {/* H1 — Rule E4 */}
              <h1
                id="hero-heading"
                className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight"
                style={{ fontFamily: "var(--font-fraunces)" }}
              >
                Pure Ghee Sweets,
                <br />
                <span className="italic text-[#F8D030]">
                  Handcrafted Daily
                </span>
              </h1>

              <p
                className="text-white/75 text-sm sm:text-base leading-relaxed max-w-lg mx-auto lg:mx-0"
                style={{ fontFamily: "var(--font-jost)" }}
              >
                From our Governorpet kitchen to your doorstep — Pootharekulu,
                Kaju Katli, Mysore Pak and celebration cakes made fresh every
                morning with pure cow ghee and zero preservatives.
              </p>

              {/* CTAs */}
              <div
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3"
                style={{ fontFamily: "var(--font-jost)" }}
              >
                <Link
                  href="/sweets"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F8D030] text-[#002c3f] px-7 py-3.5 rounded-full font-bold text-sm sm:text-base shadow-lg hover:bg-yellow-300 transition-colors min-h-[52px]"
                >
                  🛒 Shop Now
                </Link>
                <Link
                  href="/festival-boxes"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/30 text-white px-7 py-3.5 rounded-full font-semibold text-sm sm:text-base hover:bg-white/10 transition-colors min-h-[52px]"
                >
                  🪔 Festival Boxes
                </Link>
              </div>

              {/* Trust badges row */}
              <div
                className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-white/60 pt-2"
                style={{ fontFamily: "var(--font-jost)" }}
              >
                {[
                  { icon: "🥛", label: "100% Vegetarian" },
                  { icon: "🧈", label: "Pure Desi Ghee" },
                  { icon: "🌿", label: "No Preservatives" },
                  { icon: "⚡", label: "Same-Day Pickup" },
                ].map(({ icon, label }) => (
                  <span key={label} className="flex items-center gap-1.5">
                    <span>{icon}</span>
                    <span className="font-medium text-white/80">{label}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Right: 2×2 product image grid */}
            <div className="hidden lg:grid grid-cols-2 gap-3">
              {featuredProducts.slice(0, 4).map((p, i) => (
                <Link
                  key={p.id}
                  href={`/${p.categorySlug}/${p.slug}`}
                  className="relative aspect-square rounded-2xl overflow-hidden group border border-white/10"
                >
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    priority={i < 2}
                    sizes="(max-width: 1280px) 25vw, 240px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div
                    className="absolute bottom-2.5 left-3 text-xs text-white font-semibold"
                    style={{ fontFamily: "var(--font-jost)" }}
                  >
                    {p.name}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          2. TRUST STATS BAR
      ═══════════════════════════════════ */}
      <section
        className="bg-[#FAF6EF] border-b border-stone-200"
        aria-label="Trust statistics"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div
            className="flex items-center justify-around gap-6 text-center flex-wrap"
            style={{ fontFamily: "var(--font-jost)" }}
          >
            {[
              { stat: "15+", label: "Years in Vijayawada" },
              { stat: "1,200+", label: "Happy Reviews" },
              { stat: "100%", label: "Pure Desi Ghee" },
              { stat: "Fresh", label: "Every Morning" },
            ].map(({ stat, label }) => (
              <div key={stat} className="flex flex-col items-center gap-0.5">
                <span
                  className="text-2xl sm:text-3xl font-bold text-[#871a45]"
                  style={{ fontFamily: "var(--font-fraunces)" }}
                >
                  {stat}
                </span>
                <span className="text-xs text-stone-500 font-medium uppercase tracking-wide">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          3. FEATURED SWEETS GRID (Rule A6, B2)
      ═══════════════════════════════════ */}
      <section
        className="py-14 sm:py-20 bg-white"
        aria-labelledby="featured-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8 sm:mb-10">
            <div>
              <p
                className="text-[#871a45] text-xs font-bold uppercase tracking-[0.2em] mb-2"
                style={{ fontFamily: "var(--font-jost)" }}
              >
                Our Kitchen, Daily
              </p>
              <h2
                id="featured-heading"
                className="text-3xl sm:text-4xl font-bold text-[#002c3f]"
                style={{ fontFamily: "var(--font-fraunces)" }}
              >
                Signature Sweets
              </h2>
            </div>
            <Link
              href="/sweets"
              className="text-sm font-bold text-[#871a45] hover:text-[#691436] transition-colors whitespace-nowrap"
              style={{ fontFamily: "var(--font-jost)" }}
            >
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.slice(0, 8).map((product, i) => (
              <ProductCard key={product.id} product={product} priority={i < 4} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          4. CATEGORY EXPERIENCE GRID
      ═══════════════════════════════════ */}
      <section
        className="py-14 sm:py-20 bg-[#FAF6EF]"
        aria-labelledby="categories-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 sm:mb-10 text-center">
            <p
              className="text-[#871a45] text-xs font-bold uppercase tracking-[0.2em] mb-2"
              style={{ fontFamily: "var(--font-jost)" }}
            >
              Browse by Category
            </p>
            <h2
              id="categories-heading"
              className="text-3xl sm:text-4xl font-bold text-[#002c3f]"
              style={{ fontFamily: "var(--font-fraunces)" }}
            >
              The Kanaka Experience
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/${cat.slug}`}
                className="relative aspect-[3/4] sm:aspect-square rounded-2xl overflow-hidden group shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Image
                  src={cat.image}
                  alt={`${cat.name} at Kanaka Sweets Vijayawada`}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#002c3f]/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3
                    className="text-white font-bold text-lg sm:text-xl"
                    style={{ fontFamily: "var(--font-fraunces)" }}
                  >
                    {cat.name}
                  </h3>
                  <span
                    className="text-white/70 text-xs font-medium"
                    style={{ fontFamily: "var(--font-jost)" }}
                  >
                    Shop now →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          5. FESTIVAL HIGHLIGHT (Rule A5, C5)
      ═══════════════════════════════════ */}
      {siteSettings?.festivalHighlightActive && topFestivalBox && (
        <section
          className="py-14 sm:py-20 bg-gradient-to-br from-[#871a45] to-[#4a0e28] text-white overflow-hidden"
          aria-labelledby="festival-heading"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-5">
                <p
                  className="text-[#F8D030] text-xs font-bold uppercase tracking-[0.2em]"
                  style={{ fontFamily: "var(--font-jost)" }}
                >
                  🪔 Festival Season Special
                </p>
                <h2
                  id="festival-heading"
                  className="text-3xl sm:text-4xl font-bold leading-tight"
                  style={{ fontFamily: "var(--font-fraunces)" }}
                >
                  {siteSettings.festivalHighlightTitle ||
                    "Celebrate Every Occasion with Our Festival Gift Boxes"}
                </h2>
                <p
                  className="text-white/75 text-sm sm:text-base leading-relaxed"
                  style={{ fontFamily: "var(--font-jost)" }}
                >
                  {siteSettings.festivalHighlightText ||
                    "Beautifully curated gift hampers filled with handcrafted Andhra sweets, Pootharekulu, Kaju Katli and more. Perfect for Diwali, Ugadi, weddings and corporate gifting."}
                </p>
                <div
                  className="flex flex-wrap gap-3"
                  style={{ fontFamily: "var(--font-jost)" }}
                >
                  <Link
                    href="/festival-boxes"
                    className="inline-flex items-center gap-2 bg-[#F8D030] text-[#002c3f] px-6 py-3 rounded-full font-bold text-sm hover:bg-yellow-300 transition-colors min-h-[48px]"
                  >
                    🎁 Order a Festival Box
                  </Link>
                  <a
                    href="https://wa.me/919848022338?text=Hello,%20I%20would%20like%20to%20enquire%20about%20Festival%20Gift%20Boxes"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-white/30 text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-white/10 transition-colors min-h-[48px]"
                  >
                    💬 Custom Order via WhatsApp
                  </a>
                </div>
                {/* Best for Gifting label (C5) */}
                <p
                  className="text-xs text-white/50 italic"
                  style={{ fontFamily: "var(--font-jost)" }}
                >
                  ★ &ldquo;Best for Gifting&rdquo; — our most popular choice for weddings &amp; corporate events
                </p>
              </div>

              {topFestivalBox.image && (
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-white/20">
                  <Image
                    src={topFestivalBox.image}
                    alt={`${topFestivalBox.name} — Kanaka Sweets Festival Gift Box`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════
          6. CUSTOMER REVIEWS (Rule B5)
      ═══════════════════════════════════ */}
      <section
        className="py-14 sm:py-20 bg-white"
        aria-labelledby="reviews-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p
              className="text-[#871a45] text-xs font-bold uppercase tracking-[0.2em] mb-2"
              style={{ fontFamily: "var(--font-jost)" }}
            >
              Real Customers · Google &amp; Instagram
            </p>
            <h2
              id="reviews-heading"
              className="text-3xl sm:text-4xl font-bold text-[#002c3f]"
              style={{ fontFamily: "var(--font-fraunces)" }}
            >
              What Our Customers Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REVIEWS.map((review) => (
              <div
                key={review.name}
                className="bg-[#FAF6EF] rounded-2xl p-6 border border-stone-100 space-y-3"
                style={{ fontFamily: "var(--font-jost)" }}
              >
                <div className="flex gap-0.5">
                  {Array.from({ length: review.stars }).map((_, i) => (
                    <span key={i} className="text-[#2D5E3F] text-sm">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-sm text-stone-700 leading-relaxed italic">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div>
                  <div className="font-bold text-[#002c3f] text-sm">
                    {review.name}
                  </div>
                  <div className="text-xs text-stone-400">{review.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          7. CONTACT STRIP (Rule B3, B5)
      ═══════════════════════════════════ */}
      <section
        className="bg-[#FAF6EF] border-t border-stone-200 py-10 sm:py-12"
        aria-label="Contact and visit"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left"
            style={{ fontFamily: "var(--font-jost)" }}
          >
            <div>
              <h2
                className="text-xl sm:text-2xl font-bold text-[#002c3f] mb-1"
                style={{ fontFamily: "var(--font-fraunces)" }}
              >
                Visit Us in Governorpet
              </h2>
              <p className="text-sm text-stone-600">
                📍 Door No. 28-10-15, Eluru Road, Vijayawada AP 520002
              </p>
              <p className="text-xs text-stone-400 mt-0.5">
                Open Daily 7:00 AM – 10:30 PM
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <a
                href="tel:+919848022338"
                className="inline-flex items-center gap-2 bg-[#002c3f] text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-[#023e5a] transition-colors min-h-[48px]"
              >
                📞 +91 98480 22338
              </a>
              <a
                href="https://wa.me/919848022338?text=Hello%20Kanaka%20Sweets,%20I%20would%20like%20to%20order"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-[#20ba59] transition-colors min-h-[48px]"
              >
                💬 WhatsApp Order
              </a>
              <a
                href="https://maps.google.com/?q=Kanaka+Sweets+Governorpet+Vijayawada"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-[#002c3f] border border-stone-200 px-5 py-3 rounded-xl font-semibold text-sm hover:bg-stone-50 transition-colors min-h-[48px]"
              >
                🗺️ Get Directions
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
