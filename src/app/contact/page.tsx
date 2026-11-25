import type { Metadata } from "next";
import { LazyMap } from "@/components/LazyMap";
import { MapPinIcon, PhoneIcon, WhatsAppIcon, ClockIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: { absolute: "Visit Kanaka Sweets in Governorpet, Vijayawada" },
  description:
    "Find Kanaka Sweets & Bakery on Eluru Road, Governorpet, Vijayawada. Open 7:00 AM to 10:30 PM. Call, WhatsApp or get directions.",
  alternates: { canonical: "/contact" },
};

const ADDRESS_LINES = [
  "Door No. 28-10-15, Eluru Road",
  "Near Old Bus Stand, Governorpet",
  "Vijayawada, Andhra Pradesh 520002",
];
const MAP_QUERY = "Kanaka Sweets Governorpet Eluru Road Vijayawada";
const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(MAP_QUERY)}`;

export default function ContactPage() {
  const button =
    "inline-flex items-center justify-center gap-2 rounded-xl font-bold text-sm px-6 min-h-[48px]";
  return (
    <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8" style={{ fontFamily: "var(--font-jost)" }}>
      <h1 className="font-serif text-3xl font-bold text-[#002c3f] mb-2" style={{ fontFamily: "var(--font-fraunces)" }}>
        Visit Kanaka Sweets &amp; Bakery
      </h1>
      <p className="text-stone-600 mb-8 max-w-2xl">
        A family-run shop in Governorpet for over 15 years. Walk in for fresh sweets and cakes, or call us to plan a
        festival, wedding or birthday order.
      </p>

      <div className="grid md:grid-cols-[1fr_1.4fr] gap-8 items-start">
        <div className="space-y-6">
          <section className="space-y-2">
            <h2 className="flex items-center gap-2 font-bold text-[#002c3f]">
              <MapPinIcon className="w-4 h-4 text-[#871a45]" /> Address
            </h2>
            <address className="not-italic text-stone-700 leading-relaxed">
              {ADDRESS_LINES.map((line) => (
                <span key={line} className="block">{line}</span>
              ))}
            </address>
          </section>

          <section className="space-y-2">
            <h2 className="flex items-center gap-2 font-bold text-[#002c3f]">
              <ClockIcon className="w-4 h-4 text-[#871a45]" /> Opening hours
            </h2>
            <p className="text-stone-700">Every day, 7:00 AM to 10:30 PM</p>
          </section>

          <div className="flex flex-col gap-3">
            <a href="tel:+919848022338" className={`${button} bg-[#002c3f] text-white`}>
              <PhoneIcon className="w-4 h-4" /> Call +91 98480 22338
            </a>
            <a
              href="https://wa.me/919848022338?text=Hello%20Kanaka%20Sweets%2C%20I%20would%20like%20to%20place%20an%20order."
              target="_blank"
              rel="noopener noreferrer"
              className={`${button} bg-[#25D366] text-white`}
            >
              <WhatsAppIcon className="w-4 h-4" /> Chat on WhatsApp
            </a>
            <a
              href={DIRECTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`${button} border-2 border-[#871a45] text-[#871a45]`}
            >
              <MapPinIcon className="w-4 h-4" /> Get Directions
            </a>
          </div>
        </div>

        <LazyMap query={MAP_QUERY} title="Map showing Kanaka Sweets & Bakery in Governorpet, Vijayawada" />
      </div>
    </div>
  );
}
