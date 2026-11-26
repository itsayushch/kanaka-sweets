import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Fraunces, Jost } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingContact } from "@/components/FloatingContact";
import { HideOnAdmin } from "@/components/StorefrontShell";
import { SITE_URL } from "@/lib/site";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  // No italic: Fraunces italic is never used on the site, so we don't download it.
});

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#871a45",
};

export const metadata: Metadata = {
  metadataBase: new URL(
    SITE_URL
  ),
  title: {
    default: "Kanaka Sweets & Bakery | Authentic Pure Ghee Sweets in Vijayawada",
    template: "%s | Kanaka Sweets & Bakery Vijayawada",
  },
  description:
    "Family-run sweet shop in Governorpet, Vijayawada for 15 years. Pootharekulu, Kaju Katli, pure ghee Mysore Pak, fresh cakes and festival gift boxes.",
  keywords: [
    "Kanaka Sweets",
    "Kanaka Bakery",
    "Vijayawada sweet shop",
    "Andhra sweets online",
    "Pootharekulu Vijayawada",
    "Pure Ghee Mysore Pak",
    "Kaju Katli Vijayawada",
    "Governorpet sweets",
    "Festival sweet boxes",
    "Diwali sweets Vijayawada",
  ],
  authors: [{ name: "Kanaka Sweets & Bakery" }],
  creator: "Kanaka Sweets & Bakery",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "Kanaka Sweets & Bakery",
    title: "Kanaka Sweets & Bakery | 15 Years of Pure Ghee Sweets in Vijayawada",
    description:
      "Order authentic Andhra sweets, fresh cakes & festive gift boxes online. Handcrafted daily with pure desi ghee in Governorpet, Vijayawada.",
    images: [
      {
        url: "/images/products/royal-festive-hamper.jpg",
        width: 1200,
        height: 630,
        alt: "Kanaka Sweets & Bakery Vijayawada - Pure Desi Ghee Sweets & Mithai",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kanaka Sweets & Bakery Vijayawada",
    description:
      "Handcrafted pure desi ghee sweets, cakes & festival boxes from Vijayawada.",
    images: [
      "/images/products/royal-festive-hamper.jpg",
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${jost.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Strip browser extension injected attributes (e.g. Bitdefender, Urban VPN bis_skin_checked) before React hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){const c=()=>{try{document.querySelectorAll('[bis_skin_checked]').forEach(e=>e.removeAttribute('bis_skin_checked'))}catch(e){}};c();if(typeof MutationObserver!=='undefined'){const o=new MutationObserver(c);o.observe(document.documentElement,{attributes:true,subtree:true,attributeFilter:['bis_skin_checked']});window.addEventListener('DOMContentLoaded',()=>o.disconnect())}})();`,
          }}
        />
      </head>
      <body
        className="flex flex-col min-h-screen bg-white text-[#1a1a1a]"
        suppressHydrationWarning
      >
        <Suspense fallback={<Navbar />}>
          <HideOnAdmin>
            <Navbar />
          </HideOnAdmin>
        </Suspense>
        <main className="flex-grow" suppressHydrationWarning>
          {children}
        </main>
        <Suspense
          fallback={
            <>
              <Footer />
              <FloatingContact />
            </>
          }
        >
          <HideOnAdmin>
            <Footer />
            <FloatingContact />
          </HideOnAdmin>
        </Suspense>
      </body>
    </html>
  );
}
