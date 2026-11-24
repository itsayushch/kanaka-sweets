import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-amber-900/10 shadow-lg">
        <div className="text-6xl">🪔</div>
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
            Page Not Found • 404
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Sweet Delicacy Missing
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed">
            The page or sweet you are searching for might have been relocated or is
            being freshly prepared in our Vijayawada kitchen.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-500 text-stone-950 px-5 py-3 rounded-xl font-bold text-sm hover:bg-amber-400 transition-colors shadow-sm min-h-[44px]"
          >
            <span>🏠</span> Back to Home
          </Link>
          <Link
            href="/sweets"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#4c0e17] text-amber-200 px-5 py-3 rounded-xl font-semibold text-sm hover:bg-[#681320] transition-colors min-h-[44px]"
          >
            Browse Sweets
          </Link>
        </div>
      </div>
    </div>
  );
}
