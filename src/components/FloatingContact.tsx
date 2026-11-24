export function FloatingContact() {
  return (
    <aside
      aria-label="Quick contact actions"
      className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-[#380b11]/95 backdrop-blur-md border-t border-amber-600/30 p-2 shadow-2xl"
    >
      <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
        {/* 1-tap Call (Rule B3) */}
        <a
          href="tel:+919848022338"
          className="flex items-center justify-center gap-2 bg-[#4c0e17] text-amber-200 border border-amber-500/40 py-2.5 px-3 rounded-lg font-semibold text-xs min-h-[44px] active:bg-[#691421] transition-colors"
          aria-label="Call Kanaka Sweets directly"
        >
          <span className="text-base">📞</span>
          <span>Call Shop</span>
        </a>

        {/* 1-tap WhatsApp (Rule B3) */}
        <a
          href="https://wa.me/919848022338?text=Hello%20Kanaka%20Sweets,%20I%20am%20browsing%20your%20store%20and%20want%20to%20order"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-2.5 px-3 rounded-lg font-bold text-xs min-h-[44px] active:bg-[#20ba59] transition-colors shadow-md"
          aria-label="Chat with Kanaka Sweets on WhatsApp"
        >
          <span className="text-base">💬</span>
          <span>WhatsApp</span>
        </a>
      </div>
    </aside>
  );
}
