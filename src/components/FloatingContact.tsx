export function FloatingContact() {
  return (
    <aside
      aria-label="Quick contact actions"
      className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-white border-t border-stone-200 shadow-2xl"
    >
      <div className="grid grid-cols-2 gap-0 max-w-lg mx-auto">
        {/* 1-tap Call (Rule B3) */}
        <a
          href="tel:+919848022338"
          className="flex items-center justify-center gap-2 bg-[#002c3f] text-white py-3 px-4 font-semibold text-sm min-h-[52px] active:bg-[#023e5a] transition-colors"
          aria-label="Call Kanaka Sweets directly"
          style={{ fontFamily: "var(--font-jost)" }}
        >
          <span className="text-base">📞</span>
          <span>Call Shop</span>
        </a>

        {/* 1-tap WhatsApp (Rule B3) */}
        <a
          href="https://wa.me/919848022338?text=Hello%20Kanaka%20Sweets,%20I%20am%20browsing%20your%20store%20and%20want%20to%20order"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 px-4 font-bold text-sm min-h-[52px] active:bg-[#20ba59] transition-colors"
          aria-label="Chat with Kanaka Sweets on WhatsApp"
          style={{ fontFamily: "var(--font-jost)" }}
        >
          <span className="text-base">💬</span>
          <span>WhatsApp</span>
        </a>
      </div>
    </aside>
  );
}
