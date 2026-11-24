import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#380b11] text-[#fdfbf7] border-t-4 border-amber-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Col 1: Shop Story & Trust */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-bold text-amber-300">
              Kanaka Sweets & Bakery
            </h3>
            <p className="text-sm text-stone-300 leading-relaxed">
              Family-run sweet shop and bakery serving Vijayawada for over 15 years.
              Every batch of Pootharekulu, Kaju Katli, and Mysore Pak is handcrafted
              daily with pure desi ghee and time-honored recipes.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 bg-[#4c0e17] text-amber-200 text-xs px-3 py-1.5 rounded-full border border-amber-500/30">
                <span className="text-amber-400">★ 4.8 / 5.0</span>
                <span>• 1,200+ Google & Instagram Reviews</span>
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-serif font-semibold text-amber-200">
              Our Specialties
            </h4>
            <ul className="space-y-2 text-sm text-stone-300">
              <li>
                <Link href="/sweets" className="hover:text-amber-300 transition-colors inline-block py-1">
                  Pure Ghee Sweets & Mithai
                </Link>
              </li>
              <li>
                <Link href="/cakes" className="hover:text-amber-300 transition-colors inline-block py-1">
                  Fresh Celebration Cakes & Pastries
                </Link>
              </li>
              <li>
                <Link href="/snacks" className="hover:text-amber-300 transition-colors inline-block py-1">
                  Vijayawada Savouries & Spicy Mixture
                </Link>
              </li>
              <li>
                <Link href="/festival-boxes" className="hover:text-amber-300 transition-colors inline-block py-1 font-semibold text-amber-300">
                  🪔 Festive Gift Boxes & Hampers
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Visit Our Shop & Hours */}
          <div className="space-y-4">
            <h4 className="text-lg font-serif font-semibold text-amber-200">
              Visit Our Shop
            </h4>
            <div className="text-sm text-stone-300 space-y-2">
              <p className="font-medium text-amber-100">
                📍 Door No. 28-10-15, Eluru Road,<br />
                Near Old Bus Stand, Governorpet,<br />
                Vijayawada, Andhra Pradesh 520002
              </p>
              <p className="text-xs text-stone-400 pt-1">
                ⏰ Open 7 Days: 7:00 AM – 10:30 PM
              </p>
              <p className="text-xs text-stone-400">
                ⚡ Festival & Wedding Bulk Orders Welcome
              </p>
            </div>

            {/* Google Map Get Directions Button */}
            <div className="pt-2">
              <a
                href="https://maps.google.com/?q=Kanaka+Sweets+Governorpet+Vijayawada"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-amber-500 text-maroon-950 px-4 py-2 rounded-lg text-sm font-bold hover:bg-amber-400 transition-colors shadow-sm"
              >
                <span>🗺️</span> Get Directions
              </a>
            </div>
          </div>

          {/* Col 4: Contact & Instant Ordering */}
          <div className="space-y-4">
            <h4 className="text-lg font-serif font-semibold text-amber-200">
              Reach Us Instantly
            </h4>
            <p className="text-xs text-stone-300">
              Need custom gift boxes or urgent same-day pickup? Call or message our kitchen directly.
            </p>
            <div className="space-y-3 pt-1">
              <a
                href="tel:+919848022338"
                className="flex items-center gap-3 bg-[#4c0e17] hover:bg-[#691421] text-amber-200 p-3 rounded-lg border border-amber-500/20 transition-colors text-sm font-semibold"
              >
                <span className="text-xl">📞</span>
                <div>
                  <div className="text-xs text-stone-400 font-normal">Call Shop Directly</div>
                  <div>+91 98480 22338</div>
                </div>
              </a>

              <a
                href="https://wa.me/919848022338?text=Hello%20Kanaka%20Sweets,%20I%20would%20like%20to%20order"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-[#1e7e34] hover:bg-[#18642a] text-white p-3 rounded-lg transition-colors text-sm font-semibold shadow-sm"
              >
                <span className="text-xl">💬</span>
                <div>
                  <div className="text-xs text-green-200 font-normal">WhatsApp Ordering</div>
                  <div>Chat with Our Chef</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="mt-12 pt-8 border-t border-[#52101b] text-center text-xs text-stone-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Kanaka Sweets & Bakery, Vijayawada. All rights reserved.</p>
          <p className="text-amber-200/70">
            Handcrafted with Pure Desi Ghee • FSSAI Certified • Authentic Andhra Mithai
          </p>
        </div>
      </div>
    </footer>
  );
}
