import Link from "next/link";
import { KanakaEmblemIcon, ArrowRightIcon } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16" style={{ fontFamily: "var(--font-jost)" }}>
      <div className="max-w-md w-full text-center space-y-6 bg-[#FAF6EF] p-8 sm:p-10 rounded-3xl border border-stone-200/80 shadow-md">
        <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-[#871a45] mx-auto border border-stone-200">
          <KanakaEmblemIcon className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#871a45]">
            Page Not Found • 404
          </span>
          <h1
            className="font-serif text-2xl sm:text-3xl font-bold text-[#002c3f]"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
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
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#871a45] hover:bg-[#691436] text-white px-5 py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-colors shadow-sm min-h-[44px]"
          >
            <span>Back to Home</span>
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
          <Link
            href="/sweets"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-[#002c3f] border border-stone-200 px-5 py-3 rounded-xl font-semibold text-sm hover:bg-stone-50 transition-colors min-h-[44px]"
          >
            Browse Sweets
          </Link>
        </div>
      </div>
    </div>
  );
}
