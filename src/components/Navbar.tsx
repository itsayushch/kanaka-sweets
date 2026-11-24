import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-[#4c0e17] text-[#fdfbf7] shadow-md border-b border-[#691421]">
      {/* Top Announcement Bar */}
      <div className="bg-[#380b11] py-1.5 px-4 text-xs text-center border-b border-[#52101b] flex items-center justify-between max-w-7xl mx-auto">
        <span className="hidden sm:inline text-amber-200">
          ✨ Handcrafting Andhra Sweets with Pure Desi Ghee in Vijayawada for 15 Years
        </span>
        <span className="sm:hidden text-amber-200 font-medium">
          Pure Desi Ghee Sweets • Governorpet, Vijayawada
        </span>
        <div className="flex items-center gap-4 text-xs">
          <a
            href="tel:+919848022338"
            className="flex items-center gap-1.5 hover:text-amber-300 transition-colors py-1 px-2 rounded touch-manipulation"
            aria-label="Call Kanaka Sweets at +91 98480 22338"
          >
            <span className="text-amber-400">📞</span>
            <span className="font-semibold">+91 98480 22338</span>
          </a>
        </div>
      </div>

      {/* Main Nav Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <Link href="/" className="flex flex-col group py-1" aria-label="Kanaka Sweets & Bakery Home">
            <span className="font-serif text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-amber-300 group-hover:text-amber-200 transition-colors">
              Kanaka Sweets
            </span>
            <span className="text-[10px] sm:text-xs tracking-widest uppercase text-amber-100/80 font-sans -mt-0.5">
              & Bakery • Vijayawada (Est. 2011)
            </span>
          </Link>

          {/* Desktop Category Navigation */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium" aria-label="Main Navigation">
            <Link
              href="/sweets"
              className="text-[#fdfbf7] hover:text-amber-300 transition-colors py-2 px-1 hover:border-b-2 hover:border-amber-400"
            >
              Sweets
            </Link>
            <Link
              href="/cakes"
              className="text-[#fdfbf7] hover:text-amber-300 transition-colors py-2 px-1 hover:border-b-2 hover:border-amber-400"
            >
              Cakes
            </Link>
            <Link
              href="/snacks"
              className="text-[#fdfbf7] hover:text-amber-300 transition-colors py-2 px-1 hover:border-b-2 hover:border-amber-400"
            >
              Snacks
            </Link>
            <Link
              href="/festival-boxes"
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-maroon-950 px-3.5 py-1.5 rounded-full font-semibold shadow-sm hover:from-amber-400 hover:to-amber-500 transition-all transform hover:scale-105"
            >
              <span>🪔</span> Festival Boxes
            </Link>
          </nav>

          {/* Action Links: WhatsApp, Call, Cart */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* WhatsApp Quick Order button (1-tap, Rule B3) */}
            <a
              href="https://wa.me/919848022338?text=Hello%20Kanaka%20Sweets,%20I%20would%20like%20to%20place%20an%20order"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-[#25D366] text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold hover:bg-[#20ba59] transition-colors shadow-sm min-h-[44px]"
              aria-label="Chat on WhatsApp with Kanaka Sweets"
            >
              <span className="text-base">💬</span>
              <span className="hidden sm:inline">WhatsApp</span>
            </a>

            {/* Call Button (1-tap, Rule B3) */}
            <a
              href="tel:+919848022338"
              className="inline-flex md:hidden items-center justify-center bg-amber-500 text-maroon-950 w-11 h-11 rounded-lg text-base font-bold hover:bg-amber-400 transition-colors min-h-[44px] min-w-[44px]"
              aria-label="Call Kanaka Sweets now"
            >
              📞
            </a>

            {/* Cart Link with count (Rule B4) */}
            <Link
              href="/cart"
              className="relative inline-flex items-center justify-center p-2.5 bg-[#691421] text-amber-200 rounded-lg hover:bg-[#86162a] transition-colors min-h-[44px] min-w-[44px]"
              aria-label="View Shopping Cart"
            >
              <span className="text-lg">🛍️</span>
              <span
                id="cart-badge-count"
                className="absolute -top-1.5 -right-1.5 bg-amber-400 text-maroon-950 font-bold text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow-md"
              >
                0
              </span>
            </Link>
          </div>
        </div>

        {/* Mobile Category Bar (Always accessible, Rule B2) */}
        <div className="md:hidden flex items-center space-x-2 overflow-x-auto py-2.5 border-t border-[#691421]/60 no-scrollbar text-xs">
          <Link
            href="/sweets"
            className="flex-shrink-0 bg-[#380b11] text-amber-100 hover:text-white px-3 py-1.5 rounded-full border border-amber-400/30 font-medium"
          >
            Sweets
          </Link>
          <Link
            href="/cakes"
            className="flex-shrink-0 bg-[#380b11] text-amber-100 hover:text-white px-3 py-1.5 rounded-full border border-amber-400/30 font-medium"
          >
            Cakes
          </Link>
          <Link
            href="/snacks"
            className="flex-shrink-0 bg-[#380b11] text-amber-100 hover:text-white px-3 py-1.5 rounded-full border border-amber-400/30 font-medium"
          >
            Snacks
          </Link>
          <Link
            href="/festival-boxes"
            className="flex-shrink-0 bg-amber-500 text-maroon-950 px-3 py-1.5 rounded-full font-bold shadow-sm"
          >
            🪔 Festival Boxes
          </Link>
        </div>
      </div>
    </header>
  );
}
