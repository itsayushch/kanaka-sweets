import Link from "next/link";
import Image from "next/image";

export const CATEGORY_STORIES = [
  {
    href: "/sweets",
    label: "All Sweets",
    sublabel: "Pure Ghee",
    image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=300&q=80",
    badge: "Bestseller",
  },
  {
    href: "/sweets/ghee-mysore-pak",
    label: "Mysore Pak",
    sublabel: "15-Yr Recipe",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&q=80",
    badge: "Signature",
  },
  {
    href: "/sweets/pootharekulu",
    label: "Pootharekulu",
    sublabel: "Atreyapuram",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&q=80",
    badge: "Masterpiece",
  },
  {
    href: "/sweets/kaju-katli",
    label: "Kaju Katli",
    sublabel: "Goan Cashew",
    image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=300&q=80",
    badge: "Pure Silver",
  },
  {
    href: "/cakes",
    label: "Fresh Cakes",
    sublabel: "Bakery Daily",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&q=80",
    badge: "Fresh",
  },
  {
    href: "/snacks",
    label: "Savouries",
    sublabel: "Crispy Mixture",
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=300&q=80",
    badge: "Spicy",
  },
  {
    href: "/festival-boxes",
    label: "Gift Hampers",
    sublabel: "Festive Velvet",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=300&q=80",
    badge: "Gifting",
  },
  {
    href: "/sweets/bobbatlu",
    label: "Bobbatlu",
    sublabel: "Warm Jaggery",
    image: "https://images.unsplash.com/photo-1627834377411-8da5f4f09de8?w=300&q=80",
    badge: "Heritage",
  },
];

export function CategoryStories() {
  return (
    <nav
      aria-label="Category Stories"
      className="bg-[#FAF6EF] border-y border-stone-200/80 w-full py-4 sm:py-5 shadow-2xs"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex items-center justify-between gap-3 sm:gap-5 md:gap-6 overflow-x-auto no-scrollbar py-1">
          {CATEGORY_STORIES.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="flex flex-col items-center gap-1.5 group shrink-0 min-w-[76px] sm:min-w-[92px] flex-1 text-center"
            >
              {/* Real High-Resolution Circular Photography Disc */}
              <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 rounded-full overflow-hidden border-2 border-stone-200/90 group-hover:border-[#871a45] group-hover:scale-105 shadow-xs group-hover:shadow-md transition-all duration-300 relative bg-stone-100">
                <Image
                  src={cat.image}
                  alt={cat.label}
                  fill
                  sizes="80px"
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {cat.badge && (
                  <span className="absolute bottom-0 inset-x-0 bg-[#871a45]/90 text-white text-[8px] font-bold uppercase tracking-wider py-0.5 text-center backdrop-blur-xs">
                    {cat.badge}
                  </span>
                )}
              </div>

              {/* Category Label and Subtitle */}
              <div className="flex flex-col items-center leading-tight mt-0.5">
                <span
                  className="text-xs sm:text-sm font-semibold text-[#002c3f] group-hover:text-[#871a45] transition-colors whitespace-nowrap"
                  style={{ fontFamily: "var(--font-jost)" }}
                >
                  {cat.label}
                </span>
                <span className="text-[10px] text-stone-400 font-medium hidden sm:inline whitespace-nowrap">
                  {cat.sublabel}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
