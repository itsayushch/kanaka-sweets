import Link from "next/link";
import Image from "next/image";
import {
  getAllCategories,
  getFeaturedProducts,
  getSiteSettings,
  getProductsByCategory,
} from "@/lib/db-products";
import { ProductCard } from "@/components/ProductCard";

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
    <div className="space-y-12 sm:space-y-16 pb-12">
      {/* 1. Hero Section (Rule B1, B5, D1, E4) */}
      <section className="relative bg-gradient-to-b from-[#4c0e17] via-[#5e121d] to-[#380b11] text-[#fdfbf7] pt-8 pb-14 sm:pt-14 sm:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background decorative watermark */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fbbf24_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Heading, Trust Badges, CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Trust Badge Bar (Rule B5) */}
              <div className="inline-flex items-center gap-2 bg-[#380b11]/80 border border-amber-500/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-amber-200">
                <span className="text-amber-400">🏛️ Since 2011</span>
                <span>•</span>
                <span>15 Years in Vijayawada</span>
                <span>•</span>
                <span className="text-amber-300">★ 4.8 (1,200+ Reviews)</span>
              </div>

              {/* Single H1 per page (Rule E4) */}
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]">
                Pure Desi Ghee Sweets & Fresh Bakery in{" "}
                <span className="text-amber-300 underline decoration-amber-500/50 underline-offset-8">
                  Vijayawada
                </span>
              </h1>

              {/* Subtitle / Value proposition (Rule B1 & C4) */}
              <p className="text-sm sm:text-base md:text-lg text-amber-100/90 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Handcrafted every morning at our Governorpet shop using authentic
                Andhra recipes, pure cow ghee, and zero preservatives. Famous for
                Atreyapuram Pootharekulu, Kaju Katli, and customized celebration boxes.
              </p>

              {/* Primary Call to Actions (Rule B1 & B2) */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  href="/festival-boxes"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 text-maroon-950 px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base shadow-lg hover:from-amber-300 hover:to-amber-400 transition-all transform hover:-translate-y-0.5 min-h-[48px]"
                >
                  <span>🪔</span>
                  <span>Order Festival Boxes</span>
                </Link>

                <Link
                  href="/sweets"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#691421] text-amber-200 border border-amber-400/30 px-6 py-3.5 rounded-xl font-semibold text-sm sm:text-base hover:bg-[#86162a] transition-all min-h-[48px]"
                >
                  <span>🍬</span>
                  <span>Explore All Sweets</span>
                </Link>

                <a
                  href="tel:+919848022338"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-black/30 text-stone-200 px-4 py-3.5 rounded-xl font-medium text-xs sm:text-sm hover:bg-black/40 transition-colors min-h-[48px]"
                  aria-label="Call shop directly"
                >
                  <span>📞</span>
                  <span>Call: +91 98480 22338</span>
                </a>
              </div>

              {/* Quick Trust Highlights (Rule B5) */}
              <div className="pt-4 grid grid-cols-3 gap-2 text-center text-xs text-amber-200/80 border-t border-amber-500/20 max-w-lg mx-auto lg:mx-0">
                <div className="p-2">
                  <div className="font-bold text-amber-300 text-sm">100%</div>
                  <div className="text-[11px]">Pure Desi Ghee</div>
                </div>
                <div className="p-2 border-x border-amber-500/20">
                  <div className="font-bold text-amber-300 text-sm">Same-Day</div>
                  <div className="text-[11px]">Shop Pickup</div>
                </div>
                <div className="p-2">
                  <div className="font-bold text-amber-300 text-sm">Governorpet</div>
                  <div className="text-[11px]">Eluru Road Shop</div>
                </div>
              </div>
            </div>

            {/* Right Column: LCP Hero Image (Rule D1 & D5) */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/3] sm:aspect-square w-full rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-400/30">
                <Image
                  src="https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=900&q=80"
                  alt="Assorted handcrafted pure desi ghee sweets from Kanaka Sweets Vijayawada"
                  fill
                  priority // Only priority image for LCP (Rule D1)
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white text-xs bg-black/60 backdrop-blur-sm p-3 rounded-xl border border-white/10">
                  <span className="font-bold text-amber-300">Fresh Daily Batch: </span>
                  Kaju Katli, Pootharekulu & Pure Ghee Mysore Pak prepared every morning.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Festival Highlight Section (Rule A5 & B2) - Controlled by SiteSettings */}
      {siteSettings.festivalHighlightActive && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#4c0e17] to-[#731524] text-white border-2 border-amber-500/40 shadow-xl p-6 sm:p-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 bg-amber-500 text-maroon-950 font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                  <span>🪔</span> Festive Highlight
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-amber-200">
                  {siteSettings.festivalHighlightTitle}
                </h2>
                <p className="text-amber-100 font-medium text-sm sm:text-base">
                  {siteSettings.festivalHighlightSubtitle}
                </p>
                <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
                  {siteSettings.festivalHighlightText}
                </p>
                {siteSettings.festivalHighlightDiscount && (
                  <div className="text-xs font-semibold text-amber-300 bg-black/30 p-2.5 rounded-lg border border-amber-400/20 inline-block">
                    🏷️ {siteSettings.festivalHighlightDiscount}
                  </div>
                )}
                <div className="pt-2 flex flex-wrap gap-3">
                  <Link
                    href="/festival-boxes"
                    className="inline-flex items-center justify-center gap-2 bg-amber-400 text-maroon-950 px-5 py-3 rounded-xl font-bold text-sm hover:bg-amber-300 transition-colors shadow-md min-h-[44px]"
                  >
                    <span>🎁</span> Browse Festival Boxes
                  </Link>
                  {topFestivalBox && (
                    <Link
                      href={`/festival-boxes/${topFestivalBox.slug}`}
                      className="inline-flex items-center justify-center gap-2 bg-[#380b11] text-amber-200 border border-amber-400/40 px-5 py-3 rounded-xl font-semibold text-sm hover:bg-[#52101b] transition-colors min-h-[44px]"
                    >
                      Quick Order: {topFestivalBox.name} (from ₹{topFestivalBox.variants[0]?.price})
                    </Link>
                  )}
                </div>
              </div>

              <div className="md:col-span-5">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-amber-400/30 shadow-lg">
                  <Image
                    src={siteSettings.festivalHighlightImage}
                    alt="Festive sweet gift hamper from Kanaka Sweets"
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. Categories Overview (Rule A2, E1, E2) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
            Fresh From Our Kitchen
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900">
            Explore by Category
          </h2>
          <p className="text-sm text-stone-600 max-w-xl mx-auto">
            Each recipe perfected over 15 years in Vijayawada. Freshly prepared, hygienic, and authentic.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden bg-white border border-amber-900/10 shadow-sm hover:shadow-md transition-all flex flex-col"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-amber-50">
                <Image
                  src={cat.image}
                  alt={`${cat.name} at Kanaka Sweets Vijayawada`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-amber-200">
                    {cat.name}
                  </h3>
                </div>
              </div>
              <div className="p-3 sm:p-4 flex-grow flex flex-col justify-between">
                <p className="text-xs text-stone-600 line-clamp-2">
                  {cat.description}
                </p>
                <span className="text-xs font-bold text-amber-700 mt-2 inline-flex items-center gap-1 group-hover:text-amber-800">
                  Browse {cat.name} →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Featured Specialties Grid (Rule A3, A6, C1) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
              Customer Favorites
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 mt-1">
              Kanaka Signature Specialties
            </h2>
            <p className="text-sm text-stone-600 mt-1">
              The dishes that made our Governorpet shop famous across Andhra Pradesh.
            </p>
          </div>
          <Link
            href="/sweets"
            className="inline-flex items-center text-sm font-bold text-amber-700 hover:text-amber-800 transition-colors"
          >
            View all sweets ({featuredProducts.length}+) →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. Trust Story & Shop Heritage (Rule B5, C4) */}
      <section className="bg-amber-50/70 border-y border-amber-900/10 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
                15 Years of Tradition
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900">
                A Family Sweet Shop Built on Pure Cow Ghee & Trust
              </h2>
              <p className="text-sm text-stone-700 leading-relaxed">
                Founded in 2011 on Eluru Road in Governorpet, Kanaka Sweets began with
                one simple promise: never compromise on ghee or ingredients. While
                commercial factories turned to preservatives and palm oils, we continued
                handcrafting our Pootharekulu with authentic Atreyapuram rice sheets,
                simmering Mysore Pak in bubbling pure butter ghee, and roasting cashews
                for our diamond Kaju Katli daily.
              </p>
              <p className="text-sm text-stone-700 leading-relaxed">
                Today, families across Vijayawada and travelers passing through the city
                rely on us for weddings, festival celebrations, and sweet memories.
              </p>

              <div className="pt-2 flex flex-wrap gap-4">
                <a
                  href="https://maps.google.com/?q=Kanaka+Sweets+Governorpet+Vijayawada"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#4c0e17] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#681320] transition-colors"
                >
                  <span>📍</span> Get Directions to Shop
                </a>
                <a
                  href="tel:+919848022338"
                  className="inline-flex items-center gap-2 bg-white text-stone-800 border border-stone-300 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-stone-50 transition-colors"
                >
                  <span>📞</span> Call +91 98480 22338
                </a>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="p-6 bg-white rounded-2xl border border-amber-900/10 shadow-sm space-y-2">
                <div className="text-3xl font-serif font-bold text-[#4c0e17]">15+</div>
                <div className="text-xs uppercase tracking-wider text-amber-700 font-semibold">Years of Quality</div>
                <p className="text-xs text-stone-600">Open 7 days a week since 2011 on Eluru Road, Vijayawada.</p>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-amber-900/10 shadow-sm space-y-2">
                <div className="text-3xl font-serif font-bold text-[#4c0e17]">100%</div>
                <div className="text-xs uppercase tracking-wider text-amber-700 font-semibold">Pure Desi Ghee</div>
                <p className="text-xs text-stone-600">Locally sourced cow milk ghee with zero vanaspati or palm oil.</p>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-amber-900/10 shadow-sm space-y-2">
                <div className="text-3xl font-serif font-bold text-[#4c0e17]">4.8 ★</div>
                <div className="text-xs uppercase tracking-wider text-amber-700 font-semibold">Customer Trust</div>
                <p className="text-xs text-stone-600">Over 1,200 verified reviews from families and Instagram foodies.</p>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-amber-900/10 shadow-sm space-y-2">
                <div className="text-3xl font-serif font-bold text-[#4c0e17]">Fresh</div>
                <div className="text-xs uppercase tracking-wider text-amber-700 font-semibold">Daily Preparation</div>
                <p className="text-xs text-stone-600">Every morning batch made fresh for same-day shop pickup & delivery.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
