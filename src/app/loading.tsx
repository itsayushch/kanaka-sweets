export default function Loading() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4 px-4 py-16">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-amber-200 animate-ping opacity-25" />
        <div className="w-12 h-12 rounded-full border-4 border-[#4c0e17] border-t-amber-500 animate-spin" />
      </div>
      <p className="text-sm font-serif font-semibold text-amber-900 tracking-wide">
        Freshly preparing your sweets...
      </p>
    </div>
  );
}
