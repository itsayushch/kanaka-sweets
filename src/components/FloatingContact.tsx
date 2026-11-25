import { PhoneIcon, WhatsAppIcon } from "@/components/icons";

export function FloatingContact() {
  return (
    <>
      {/* Desktop: one-tap WhatsApp on every page (Rule B3). Phones use the bar below. */}
      <a
        href="https://wa.me/919000000000?text=Hello%20Kanaka%20Sweets,%20I%20am%20browsing%20your%20store%20and%20want%20to%20order"
        target="_blank"
        rel="noopener noreferrer"
        className="hidden md:flex fixed bottom-6 right-6 z-40 w-14 h-14 bg-[#0f7a3d] hover:bg-[#0a6e35] text-white rounded-2xl shadow-2xl items-center justify-center transition-transform duration-200 hover:scale-110 active:scale-95"
        aria-label="Chat with Kanaka Sweets on WhatsApp"
      >
        <WhatsAppIcon className="w-7 h-7 text-white" />
      </a>

    <aside
      aria-label="Quick contact actions"
      className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-white border-t border-stone-200 shadow-2xl"
    >
      <div className="grid grid-cols-2 gap-0 max-w-lg mx-auto">
        {/* 1-tap Call (Rule B3) */}
        <a
          href="tel:+919000000000"
          className="flex items-center justify-center gap-2 bg-[#002c3f] text-white py-3 px-4 font-semibold text-sm min-h-[52px] active:bg-[#023e5a] transition-colors"
          aria-label="Call Kanaka Sweets directly"
          style={{ fontFamily: "var(--font-jost)" }}
        >
          <PhoneIcon className="w-4 h-4 text-white" />
          <span>Call Shop</span>
        </a>

        {/* 1-tap WhatsApp (Rule B3) */}
        <a
          href="https://wa.me/919000000000?text=Hello%20Kanaka%20Sweets,%20I%20am%20browsing%20your%20store%20and%20want%20to%20order"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-[#0f7a3d] text-white py-3 px-4 font-bold text-sm min-h-[52px] active:bg-[#0a6e35] transition-colors"
          aria-label="Chat with Kanaka Sweets on WhatsApp"
          style={{ fontFamily: "var(--font-jost)" }}
        >
          <WhatsAppIcon className="w-4 h-4 text-white" />
          <span>WhatsApp</span>
        </a>
      </div>
    </aside>
    </>
  );
}
