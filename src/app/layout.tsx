import type { Metadata, Viewport } from "next";
import { Fraunces, Jost } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingContact } from "@/components/FloatingContact";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
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
    process.env.NEXT_PUBLIC_APP_URL || "https://kanaka-sweets.vercel.app"
  ),
  title: {
    default: "Kanaka Sweets & Bakery | Authentic Pure Ghee Sweets in Vijayawada",
    template: "%s | Kanaka Sweets & Bakery Vijayawada",
  },
  description:
    "Family-run sweet shop in Governorpet, Vijayawada for over 15 years. Handcrafted Pootharekulu, Kaju Katli, Pure Ghee Mysore Pak, fresh celebration cakes & festival gift boxes.",
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
    url: "https://kanaka-sweets.vercel.app",
    siteName: "Kanaka Sweets & Bakery",
    title: "Kanaka Sweets & Bakery | 15 Years of Pure Ghee Sweets in Vijayawada",
    description:
      "Order authentic Andhra sweets, fresh cakes & festive gift boxes online. Handcrafted daily with pure desi ghee in Governorpet, Vijayawada.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=1200&q=80",
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
      "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=1200&q=80",
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
        className="flex flex-col min-h-screen bg-white text-[#1a1a1a] pb-16 md:pb-0"
        suppressHydrationWarning
      >
        <Navbar />
        <main className="flex-grow" suppressHydrationWarning>{children}</main>
        <Footer />
        <FloatingContact />
      </body>
    </html>
  );
}
