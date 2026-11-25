import type { Metadata } from "next";
import { PHOTO_CREDITS } from "@/data/photo-credits";

export const metadata: Metadata = {
  title: { absolute: "Photo Credits | Kanaka Sweets" },
  description:
    "Thank you to the photographers whose Wikimedia Commons photos of Indian sweets and snacks are shown on this site.",
  alternates: { canonical: "/credits" },
};

export default function CreditsPage() {
  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8" style={{ fontFamily: "var(--font-jost)" }}>
      <h1 className="font-serif text-3xl font-bold text-[#002c3f] mb-3" style={{ fontFamily: "var(--font-fraunces)" }}>
        Photo credits
      </h1>
      <p className="text-stone-700 mb-8 leading-relaxed">
        The sweet and snack photos on this site are from{" "}
        <a href="https://commons.wikimedia.org" className="underline text-[#871a45]" target="_blank" rel="noopener noreferrer">
          Wikimedia Commons
        </a>
        . We resized and cropped them. Each is shared by its photographer under the licence shown. The cake photos
        are from Unsplash.
      </p>

      <ul className="space-y-4">
        {PHOTO_CREDITS.map((c) => (
          <li key={c.file} className="rounded-xl border border-stone-200 bg-white p-4 text-sm leading-relaxed">
            <div className="font-bold text-[#002c3f]">{c.usedFor}</div>
            <div className="text-stone-700">
              &ldquo;
              <a href={c.page} className="underline" target="_blank" rel="noopener noreferrer">
                {c.title}
              </a>
              &rdquo; by {c.author}, licence{" "}
              <a href={c.licenseUrl} className="underline" target="_blank" rel="noopener noreferrer">
                {c.license}
              </a>
              .
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
