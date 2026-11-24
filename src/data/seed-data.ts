export interface SeedVariant {
  id: string;
  name: string;
  weight: string;
  price: number; // in INR
  stock: number;
  sku: string;
}

export interface SeedProduct {
  id: string;
  name: string;
  slug: string;
  categorySlug: string;
  description: string;
  image: string;
  images: string[];
  isFeatured: boolean;
  isBestForGifting: boolean;
  isActive: boolean;
  variants: SeedVariant[];
}

export interface SeedCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  displayOrder: number;
}

export interface SeedSiteSettings {
  festivalHighlightActive: boolean;
  festivalHighlightTitle: string;
  festivalHighlightSubtitle: string;
  festivalHighlightText: string;
  festivalHighlightImage: string;
  festivalHighlightDiscount: string;
}

export const SEED_CATEGORIES: SeedCategory[] = [
  {
    id: "cat-sweets",
    name: "Sweets",
    slug: "sweets",
    description: "Authentic Andhra sweets and classic Indian mithai handcrafted daily with pure desi ghee in Vijayawada.",
    image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&q=80",
    displayOrder: 1,
  },
  {
    id: "cat-cakes",
    name: "Cakes",
    slug: "cakes",
    description: "Freshly baked celebration cakes, rich holiday plum cakes, and custom birthday pastries made to order.",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80",
    displayOrder: 2,
  },
  {
    id: "cat-snacks",
    name: "Snacks",
    slug: "snacks",
    description: "Crunchy Andhra savouries, spicy Vijayawada mixture, and traditional crispy snacks seasoned to perfection.",
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&q=80",
    displayOrder: 3,
  },
  {
    id: "cat-festival-boxes",
    name: "Festival Boxes",
    slug: "festival-boxes",
    description: "Curated gift hampers and traditional festival sweet boxes designed for Diwali, Sankranti, weddings, and corporate gifting.",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80",
    displayOrder: 4,
  },
];

export const SEED_PRODUCTS: SeedProduct[] = [
  // SWEETS
  {
    id: "prod-kaju-katli",
    name: "Kaju Katli",
    slug: "kaju-katli",
    categorySlug: "sweets",
    description: "Our signature melt-in-the-mouth diamond confection, handcrafted from premium grade Goan cashews and pure cane sugar, delicately finished with edible silver leaf. Kanaka's 15-year recipe with zero artificial additives.",
    image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&q=80",
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80",
    ],
    isFeatured: true,
    isBestForGifting: false,
    isActive: true,
    variants: [
      { id: "var-kk-250", name: "250g Box", weight: "250g", price: 320, stock: 45, sku: "KK-250G" },
      { id: "var-kk-500", name: "500g Box", weight: "500g", price: 620, stock: 60, sku: "KK-500G" },
      { id: "var-kk-1000", name: "1kg Gift Tin", weight: "1kg", price: 1200, stock: 30, sku: "KK-1KG" },
    ],
  },
  {
    id: "prod-ghee-mysore-pak",
    name: "Pure Ghee Mysore Pak",
    slug: "ghee-mysore-pak",
    categorySlug: "sweets",
    description: "Rich, porous, melt-in-mouth golden sweet prepared using roasted chickpea flour and bubbling pure desi ghee from local Andhra dairies. Cooked to the exact traditional soft-core consistency.",
    image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80",
      "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&q=80",
    ],
    isFeatured: true,
    isBestForGifting: false,
    isActive: true,
    variants: [
      { id: "var-gmp-250", name: "250g", weight: "250g", price: 220, stock: 50, sku: "GMP-250G" },
      { id: "var-gmp-500", name: "500g", weight: "500g", price: 420, stock: 40, sku: "GMP-500G" },
      { id: "var-gmp-1000", name: "1kg", weight: "1kg", price: 800, stock: 25, sku: "GMP-1KG" },
    ],
  },
  {
    id: "prod-atreyapuram-pootharekulu",
    name: "Atreyapuram Pootharekulu",
    slug: "pootharekulu",
    categorySlug: "sweets",
    description: "The world-famous 'Paper Sweet' of Andhra Pradesh. Whispering rice-starch film layered with warm liquid desi ghee, powdered organic jaggery, and crushed dry fruits. Hand-rolled exclusively by master artisans.",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80",
    ],
    isFeatured: true,
    isBestForGifting: false,
    isActive: true,
    variants: [
      { id: "var-pooth-5", name: "Box of 5 Rolls", weight: "250g", price: 250, stock: 35, sku: "POOTH-5" },
      { id: "var-pooth-10", name: "Box of 10 Rolls", weight: "500g", price: 480, stock: 40, sku: "POOTH-10" },
      { id: "var-pooth-20", name: "Royal Box of 20", weight: "1kg", price: 920, stock: 20, sku: "POOTH-20" },
    ],
  },
  {
    id: "prod-bobbatlu",
    name: "Traditional Bobbatlu (Puran Poli)",
    slug: "bobbatlu",
    categorySlug: "sweets",
    description: "Handcrafted soft flatbread with a rich sweet filling of slow-cooked Bengal gram, aromatic jaggery, and fresh green cardamom, roasted gently on iron griddles with pure ghee. Warm comfort in every bite.",
    image: "https://images.unsplash.com/photo-1627834377411-8da5f4f09de8?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1627834377411-8da5f4f09de8?w=800&q=80",
    ],
    isFeatured: false,
    isBestForGifting: false,
    isActive: true,
    variants: [
      { id: "var-bob-5", name: "Pack of 5 Pcs", weight: "300g", price: 180, stock: 30, sku: "BOB-5" },
      { id: "var-bob-10", name: "Pack of 10 Pcs", weight: "600g", price: 350, stock: 25, sku: "BOB-10" },
    ],
  },
  {
    id: "prod-ghee-ariselu",
    name: "Ghee Ariselu",
    slug: "ariselu",
    categorySlug: "sweets",
    description: "The crown jewel of Andhra Sankranti. Freshly ground wet rice flour and clarified organic jaggery simmered into a tender dough, encrusted with white sesame seeds and deep-fried in pure desi ghee.",
    image: "https://images.unsplash.com/photo-1605197584547-c93452417769?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1605197584547-c93452417769?w=800&q=80",
    ],
    isFeatured: true,
    isBestForGifting: false,
    isActive: true,
    variants: [
      { id: "var-ari-250", name: "250g", weight: "250g", price: 200, stock: 40, sku: "ARI-250G" },
      { id: "var-ari-500", name: "500g", weight: "500g", price: 380, stock: 35, sku: "ARI-500G" },
      { id: "var-ari-1000", name: "1kg", weight: "1kg", price: 740, stock: 20, sku: "ARI-1KG" },
    ],
  },
  {
    id: "prod-boondi-ladoo",
    name: "Tirupati Style Ghee Boondi Ladoo",
    slug: "boondi-ladoo",
    categorySlug: "sweets",
    description: "Golden boondi pearls soaked in fragrant sugar syrup spiked with edible camphor, whole cardamom, golden raisins, and toasted cashew nuts, lovingly rolled in pure cow ghee.",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&q=80",
    ],
    isFeatured: false,
    isBestForGifting: false,
    isActive: true,
    variants: [
      { id: "var-lad-250", name: "250g (Approx 6 pcs)", weight: "250g", price: 180, stock: 50, sku: "LAD-250G" },
      { id: "var-lad-500", name: "500g (Approx 12 pcs)", weight: "500g", price: 350, stock: 45, sku: "LAD-500G" },
      { id: "var-lad-1000", name: "1kg Box (Approx 24 pcs)", weight: "1kg", price: 680, stock: 30, sku: "LAD-1KG" },
    ],
  },
  {
    id: "prod-kaju-pista-roll",
    name: "Royal Kaju Pista Roll",
    slug: "kaju-pista-roll",
    categorySlug: "sweets",
    description: "Two-tone luxury confection with a velvety outer layer of cashew paste rolled around a rich center of crushed Iranian pistachios, flavored with saffron and rose.",
    image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&q=80",
    ],
    isFeatured: false,
    isBestForGifting: false,
    isActive: true,
    variants: [
      // Demonstrates Out of Stock behaviour (Rule A3 and Rule F7)
      { id: "var-kpr-250", name: "250g Box", weight: "250g", price: 340, stock: 0, sku: "KPR-250G" },
      { id: "var-kpr-500", name: "500g Box", weight: "500g", price: 660, stock: 15, sku: "KPR-500G" },
    ],
  },
  {
    id: "prod-malai-peda",
    name: "Mathura Style Malai Peda",
    slug: "malai-peda",
    categorySlug: "sweets",
    description: "Slow-cooked full-cream milk fudge prepared by simmering creamy milk for over 4 hours until caramelized, finished with cardamom and saffron essence.",
    image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80",
    ],
    isFeatured: false,
    isBestForGifting: false,
    isActive: true,
    variants: [
      { id: "var-mp-250", name: "250g", weight: "250g", price: 210, stock: 35, sku: "MP-250G" },
      { id: "var-mp-500", name: "500g", weight: "500g", price: 400, stock: 40, sku: "MP-500G" },
    ],
  },

  // CAKES
  {
    id: "prod-eggless-rich-plum-cake",
    name: "Traditional Eggless Rich Plum Cake",
    slug: "plum-cake",
    categorySlug: "cakes",
    description: "Our legendary Vijayawada winter bakery specialty: aged candied citrus peels, plump sultanas, black raisins, and roasted walnuts folded into rich spiced brown butter batter.",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80",
    ],
    isFeatured: true,
    isBestForGifting: false,
    isActive: true,
    variants: [
      { id: "var-pc-500", name: "500g Loaf", weight: "500g", price: 450, stock: 30, sku: "PC-500G" },
      { id: "var-pc-1000", name: "1kg Round Cake", weight: "1kg", price: 850, stock: 20, sku: "PC-1KG" },
    ],
  },
  {
    id: "prod-black-forest-cake",
    name: "Black Forest Fresh Cream Cake",
    slug: "black-forest-cake",
    categorySlug: "cakes",
    description: "Airy cocoa sponge cake layered with sweet-tart sour cherry compote, fresh dairy whipped cream, and shaved Belgian bittersweet chocolate curls.",
    image: "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=800&q=80",
    ],
    isFeatured: false,
    isBestForGifting: false,
    isActive: true,
    variants: [
      { id: "var-bfc-500", name: "500g (Serves 4-6)", weight: "500g", price: 480, stock: 25, sku: "BFC-500G" },
      { id: "var-bfc-1000", name: "1kg (Serves 8-12)", weight: "1kg", price: 920, stock: 15, sku: "BFC-1KG" },
    ],
  },
  {
    id: "prod-butterscotch-crunch-cake",
    name: "Butterscotch Praline Crunch Cake",
    slug: "butterscotch-crunch-cake",
    categorySlug: "cakes",
    description: "Golden vanilla sponge infused with brown sugar caramel sauce, layered with house-made crunchy cashew praline and light butterscotch chantilly cream.",
    image: "https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=800&q=80",
    ],
    isFeatured: false,
    isBestForGifting: false,
    isActive: true,
    variants: [
      { id: "var-bsc-500", name: "500g", weight: "500g", price: 460, stock: 20, sku: "BSC-500G" },
      { id: "var-bsc-1000", name: "1kg", weight: "1kg", price: 880, stock: 15, sku: "BSC-1KG" },
    ],
  },
  {
    id: "prod-chocolate-truffle-cake",
    name: "Dutch Chocolate Truffle Cake",
    slug: "chocolate-truffle-cake",
    categorySlug: "cakes",
    description: "Decadent dark chocolate sponge wrapped in silky, melted couverture chocolate truffle ganache. A chocolate lover's celebration masterpiece.",
    image: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800&q=80",
    ],
    isFeatured: false,
    isBestForGifting: false,
    isActive: true,
    variants: [
      { id: "var-ctc-500", name: "500g", weight: "500g", price: 550, stock: 25, sku: "CTC-500G" },
      { id: "var-ctc-1000", name: "1kg", weight: "1kg", price: 1050, stock: 12, sku: "CTC-1KG" },
    ],
  },

  // SNACKS
  {
    id: "prod-vijayawada-spicy-mixture",
    name: "Vijayawada Special Spicy Mixture",
    slug: "mixture",
    categorySlug: "snacks",
    description: "Our signature 15-year recipe that every customer carries home: crunchy besan sev, crispy boondi, whole cashews, roasted groundnuts, and crisp curry leaves dusted with fiery Guntur red chili powder.",
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&q=80",
    ],
    isFeatured: true,
    isBestForGifting: false,
    isActive: true,
    variants: [
      { id: "var-mix-250", name: "250g Pouch", weight: "250g", price: 130, stock: 80, sku: "MIX-250G" },
      { id: "var-mix-500", name: "500g Pack", weight: "500g", price: 250, stock: 70, sku: "MIX-500G" },
      { id: "var-mix-1000", name: "1kg Family Pack", weight: "1kg", price: 480, stock: 50, sku: "MIX-1KG" },
    ],
  },
  {
    id: "prod-chekkalu",
    name: "Crispy Pappu Chekkalu",
    slug: "chekkalu",
    categorySlug: "snacks",
    description: "Traditional handmade Andhra rice discs kneaded with soaked chana dal, green chilies, cumin seeds, and fresh curry leaves, fried golden crisp in cold-pressed oil.",
    image: "https://images.unsplash.com/photo-1605197584547-c93452417769?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1605197584547-c93452417769?w=800&q=80",
    ],
    isFeatured: false,
    isBestForGifting: false,
    isActive: true,
    variants: [
      { id: "var-chk-250", name: "250g", weight: "250g", price: 140, stock: 50, sku: "CHK-250G" },
      { id: "var-chk-500", name: "500g", weight: "500g", price: 260, stock: 40, sku: "CHK-500G" },
    ],
  },
  {
    id: "prod-ribbon-pakoda",
    name: "Crispy Ribbon Pakoda",
    slug: "ribbon-pakoda",
    categorySlug: "snacks",
    description: "Delicate flat ribbon crisps made from roasted gram flour and fragrant spices. Crisp, airy, and seasoned with a touch of asafoetida and sesame.",
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&q=80",
    ],
    isFeatured: false,
    isBestForGifting: false,
    isActive: true,
    variants: [
      { id: "var-rib-250", name: "250g", weight: "250g", price: 130, stock: 45, sku: "RIB-250G" },
      { id: "var-rib-500", name: "500g", weight: "500g", price: 250, stock: 40, sku: "RIB-500G" },
    ],
  },
  {
    id: "prod-bellam-gavvalu",
    name: "Organic Bellam Gavvalu",
    slug: "bellam-gavvalu",
    categorySlug: "snacks",
    description: "Classic Andhra teatime favourite: crunchy shell-shaped flour dumplings fried crisp and coated in thick, cardamom-infused organic jaggery syrup.",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&q=80",
    ],
    isFeatured: false,
    isBestForGifting: false,
    isActive: true,
    variants: [
      { id: "var-gav-250", name: "250g", weight: "250g", price: 150, stock: 35, sku: "GAV-250G" },
      { id: "var-gav-500", name: "500g", weight: "500g", price: 280, stock: 30, sku: "GAV-500G" },
    ],
  },

  // FESTIVAL BOXES
  {
    id: "prod-royal-diwali-box",
    name: "Royal Vijayawada Festive Hamper",
    slug: "royal-festive-hamper",
    categorySlug: "festival-boxes",
    description: "Our grandest celebration box in rich velvet maroon & foil-stamped gold packaging. Contains premium Kaju Katli, Pure Ghee Mysore Pak, Dry Fruit Pootharekulu, and Tirupati Boondi Ladoo. Includes custom gift card.",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80",
      "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&q=80",
    ],
    isFeatured: true,
    isBestForGifting: true, // C5 requirement
    isActive: true,
    variants: [
      { id: "var-rfh-750", name: "Medium Hamper (750g)", weight: "750g", price: 950, stock: 50, sku: "RFH-750G" },
      { id: "var-rfh-1200", name: "Grand Box (1.2kg)", weight: "1.2kg", price: 1450, stock: 40, sku: "RFH-1200G" },
      { id: "var-rfh-2000", name: "Royal Family Hamper (2kg)", weight: "2kg", price: 2300, stock: 20, sku: "RFH-2000G" },
    ],
  },
  {
    id: "prod-sankranti-special-box",
    name: "Subhakruth Sankranti Harvest Box",
    slug: "sankranti-harvest-box",
    categorySlug: "festival-boxes",
    description: "Handpicked traditional harvest sweets packed fresh on the day of dispatch: pure Ghee Ariselu, Dry Fruit Pootharekulu, soft Ghee Bobbatlu, and crunchy Bellam Gavvalu. The authentic taste of Andhra tradition.",
    image: "https://images.unsplash.com/photo-1605197584547-c93452417769?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1605197584547-c93452417769?w=800&q=80",
    ],
    isFeatured: true,
    isBestForGifting: true, // C5 requirement
    isActive: true,
    variants: [
      { id: "var-shb-800", name: "Traditional Assortment (800g)", weight: "800g", price: 850, stock: 40, sku: "SHB-800G" },
      { id: "var-shb-1500", name: "Family Feast Box (1.5kg)", weight: "1.5kg", price: 1550, stock: 25, sku: "SHB-1500G" },
    ],
  },
  {
    id: "prod-sweet-savoury-hamper",
    name: "Celebration Sweet & Savoury Box",
    slug: "sweet-savoury-box",
    categorySlug: "festival-boxes",
    description: "The crowd favourite balanced treat box: luscious Kaju Katli and Pure Ghee Mysore Pak paired with crunchy Vijayawada Spicy Mixture and delicate Ribbon Pakoda in an ornate partitioned box.",
    image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&q=80",
    ],
    isFeatured: false,
    isBestForGifting: true, // C5 requirement
    isActive: true,
    variants: [
      { id: "var-ssb-1000", name: "Standard Box (1kg)", weight: "1kg", price: 880, stock: 45, sku: "SSB-1000G" },
      { id: "var-ssb-1800", name: "Grand Box (1.8kg)", weight: "1.8kg", price: 1580, stock: 25, sku: "SSB-1800G" },
    ],
  },
  {
    id: "prod-elite-dry-fruit-collection",
    name: "Elite Dry Fruit Mithai Collection",
    slug: "dry-fruit-collection",
    categorySlug: "festival-boxes",
    description: "Zero added grain flour or preservatives. 100% natural luxury sweets crafted from roasted Mamra almonds, California pistachios, Cashews, and Afghan Anjeer figs.",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80",
    ],
    isFeatured: true,
    isBestForGifting: true, // C5 requirement
    isActive: true,
    variants: [
      { id: "var-edc-500", name: "500g Luxury Tray", weight: "500g", price: 820, stock: 30, sku: "EDC-500G" },
      { id: "var-edc-1000", name: "1kg Royal Gift Chest", weight: "1kg", price: 1580, stock: 20, sku: "EDC-1KG" },
    ],
  },
];

export const SEED_SITE_SETTINGS: SeedSiteSettings = {
  festivalHighlightActive: true,
  festivalHighlightTitle: "Diwali & Festive Special Gift Boxes",
  festivalHighlightSubtitle: "Handcrafted with pure desi ghee in Vijayawada",
  festivalHighlightText: "Pre-order your traditional festive sweet boxes today. Custom assortments with Kaju Katli, Mysore Pak, and Pootharekulu. Bulk corporate discounts and guaranteed shop pickup slots available.",
  festivalHighlightImage: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=1200&q=80",
  festivalHighlightDiscount: "Special festive packaging • Guaranteed fresh on pickup date",
};
