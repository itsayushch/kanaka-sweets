import Link from "next/link";
import {
  PhoneIcon,
  WhatsAppIcon,
  MapPinIcon,
  ClockIcon,
  StarIcon,
  ArrowRightIcon,
  KanakaEmblemIcon,
} from "@/components/icons";

export function Footer() {
  return (
    <footer
      className="bg-[#012a3e] text-white"
      style={{ fontFamily: "var(--font-jost)" }}
    >
      <div className="w-full max-w-[1880px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-14 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <Link href="/" aria-label="Kanaka Sweets — Home" className="flex items-center gap-3 min-h-[44px]">
              <div className="w-10 h-10 rounded-full bg-[#871a45] flex items-center justify-center text-[#F8D030]">
                <KanakaEmblemIcon className="w-5 h-5 text-[#F8D030]" />
              </div>
              <div className="flex flex-col leading-tight">
                <span
                  className="font-serif text-2xl font-bold text-[#F8D030]"
                  style={{ fontFamily: "var(--font-fraunces)" }}
                >
                  Kanaka
                </span>
                <span className="text-[10px] tracking-[0.2em] uppercase text-white/60 font-semibold -mt-0.5">
                  Sweets &amp; Bakery
                </span>
              </div>
            </Link>
            <p className="text-sm text-white/70 leading-relaxed">
              Family-run sweet shop in Governorpet, Vijayawada since 2011.
              Handcrafted daily with pure cow ghee, zero preservatives and
              time-honoured Andhra recipes.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#2D5E3F] bg-emerald-900/30 px-3 py-2 rounded-lg w-fit border border-emerald-700/30">
              <StarIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-semibold text-emerald-200">
                4.8 / 5 · 1,200+ Verified Reviews
              </span>
            </div>
          </div>

          {/* Col 2: Shop Categories */}
          <div className="space-y-4">
            <h2
              className="font-serif text-base font-semibold text-[#F8D030]"
              style={{ fontFamily: "var(--font-fraunces)" }}
            >
              Our Specialties
            </h2>
            <ul className="space-y-2 text-sm text-white/70">
              {[
                { href: "/sweets", label: "Pure Ghee Sweets & Mithai" },
                { href: "/cakes", label: "Fresh Celebration Cakes" },
                { href: "/snacks", label: "Vijayawada Savouries & Mixture" },
                { href: "/festival-boxes", label: "Festive Gift Hampers" },
                { href: "/contact", label: "Visit Us & Map" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="hover:text-white transition-colors inline-block py-3"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Visit */}
          <div className="space-y-4">
            <h2
              className="font-serif text-base font-semibold text-[#F8D030]"
              style={{ fontFamily: "var(--font-fraunces)" }}
            >
              Visit Our Shop
            </h2>
            <div className="text-sm text-white/70 space-y-2.5 leading-relaxed">
              <div className="flex items-start gap-2">
                <MapPinIcon className="w-4 h-4 text-[#F8D030] shrink-0 mt-1" />
                <p className="font-medium text-white/90">
                  Door No. 28-10-15, Eluru Road,
                  <br />
                  Near Old Bus Stand, Governorpet,
                  <br />
                  Vijayawada, AP 520002
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/60">
                <ClockIcon className="w-3.5 h-3.5 text-[#F8D030] shrink-0" />
                <span>Open Daily: 7:00 AM – 10:30 PM</span>
              </div>
              <p className="text-xs text-white/70">
                FSSAI Certified · Bulk &amp; Wedding Orders Welcome
              </p>
            </div>
            <a
              href="https://maps.google.com/?q=Kanaka+Sweets+Governorpet+Vijayawada"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#F8D030] text-[#002c3f] px-4 py-2 rounded-lg text-sm font-bold hover:bg-yellow-300 transition-colors min-h-[44px]"
            >
              <span>Get Directions</span>
              <ArrowRightIcon className="w-4 h-4" />
            </a>
          </div>

          {/* Col 4: Contact */}
          <div className="space-y-4">
            <h2
              className="font-serif text-base font-semibold text-[#F8D030]"
              style={{ fontFamily: "var(--font-fraunces)" }}
            >
              Reach Us Instantly
            </h2>
            <p className="text-xs text-white/60">
              Custom gift boxes, same-day pickup or urgent orders — call or message us directly.
            </p>
            <div className="space-y-3">
              <a
                href="tel:+919000000000"
                className="flex items-center gap-3 bg-white/10 hover:bg-white/15 px-4 py-3 rounded-xl transition-colors text-sm font-semibold min-h-[52px]"
              >
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0">
                  <PhoneIcon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-xs text-white/70 font-normal">
                    Call Shop Directly
                  </div>
                  <div className="text-white font-bold">+91 90000 00000</div>
                </div>
              </a>
              <a
                href="https://wa.me/919000000000?text=Hello%20Kanaka%20Sweets,%20I%20would%20like%20to%20order"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-[#0f7a3d] hover:bg-[#0a6e35] px-4 py-3 rounded-xl transition-colors text-sm font-bold min-h-[52px]"
              >
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0">
                  <WhatsAppIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xs text-white font-normal">
                    WhatsApp Ordering
                  </div>
                  <div>Chat with Our Chef</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/70">
          <p>
            © 2026 Kanaka Sweets &amp; Bakery, Vijayawada. All rights reserved.{" "}
            <Link href="/credits" className="underline hover:text-white inline-flex items-center min-h-[44px]">
              Photo credits
            </Link>
          </p>
          <p className="text-white/70">
            Handcrafted with Pure Desi Ghee · FSSAI Certified · Authentic Andhra Mithai
          </p>
        </div>
      </div>
    </footer>
  );
}
