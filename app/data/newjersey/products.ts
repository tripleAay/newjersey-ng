import type { NewJerseyProduct } from "@/app/types/commerce";

/*
|--------------------------------------------------------------------------
| NEWJERSEY.NG PRODUCT CATALOGUE
|--------------------------------------------------------------------------
|
| This is the single source of truth for physical NewJersey products.
|
| IMPORTANT:
| - Prices are stored as numbers, not formatted strings.
| - UI components should format prices as ₦ currency.
| - Services such as logo design and business branding do NOT belong here.
| - Product configuration belongs with the product so product pages,
|   cart calculations and future checkout can all use the same rules.
|
*/

export const products: NewJerseyProduct[] = [
  /*
  |--------------------------------------------------------------------------
  | BUSINESS CARDS
  |--------------------------------------------------------------------------
  */

  {
    id: "print-business-cards",
    slug: "business-cards",

    name: "Premium Business Cards",
    shortName: "Business Cards",

    description:
      "Professional business cards produced for businesses, founders, teams and personal brands.",

    shortDescription:
      "Professional cards designed to make a strong first impression.",

    category: "print",
    status: "made-to-order",

    image: "/images/products/print/business-cards.webp",

    images: [
      "/images/products/print/business-cards.webp",
    ],

    pricing: {
      type: "starting-from",
      basePrice: 15000,
      oldPrice: 18000,
      baseQuantity: 100,
      unit: "copies",
    },

    options: [
      {
        id: "size",
        label: "Size",
        type: "radio",
        required: true,
        choices: [
          {
            id: "standard",
            label: "Standard",
            description: "Standard business card size",
          },
        ],
      },

      {
        id: "sides",
        label: "Print Sides",
        type: "radio",
        required: true,
        choices: [
          {
            id: "single",
            label: "Single-sided",
          },
          {
            id: "double",
            label: "Double-sided",
            priceModifier: 3000,
          },
        ],
      },

      {
        id: "paper",
        label: "Paper",
        type: "select",
        required: true,
        choices: [
          {
            id: "standard-card",
            label: "Standard Card Stock",
          },
          {
            id: "premium-card",
            label: "Premium Card Stock",
            priceModifier: 3500,
          },
        ],
      },

      {
        id: "finish",
        label: "Finish",
        type: "radio",
        required: true,
        choices: [
          {
            id: "standard",
            label: "Standard Finish",
          },
          {
            id: "matte",
            label: "Matte Lamination",
            priceModifier: 4000,
          },
          {
            id: "gloss",
            label: "Gloss Lamination",
            priceModifier: 4000,
          },
        ],
      },

      {
        id: "quantity",
        label: "Quantity",
        type: "quantity",
        required: true,
        choices: [
          {
            id: "100",
            label: "100 copies",
          },
          {
            id: "250",
            label: "250 copies",
            priceModifier: 15000,
          },
          {
            id: "500",
            label: "500 copies",
            priceModifier: 30000,
          },
          {
            id: "1000",
            label: "1,000 copies",
            priceModifier: 55000,
          },
        ],
      },
    ],

    turnaround: "Production timeline confirmed after artwork approval.",

    popular: true,
    featured: true,
    published: true,
  },

  /*
  |--------------------------------------------------------------------------
  | FLYERS
  |--------------------------------------------------------------------------
  */

  {
    id: "print-flyers",
    slug: "flyers",

    name: "Premium Flyers",
    shortName: "Flyers",

    description:
      "Professional promotional flyers for campaigns, businesses, events, churches, schools and announcements.",

    shortDescription:
      "Promotional flyers for campaigns, events and businesses.",

    category: "print",
    status: "made-to-order",

    image: "/images/products/print/flyers.webp",

    images: [
      "/images/products/print/flyers.webp",
    ],

    pricing: {
      type: "starting-from",
      basePrice: 12000,
      oldPrice: 15000,
      baseQuantity: 100,
      unit: "copies",
    },

    options: [
      {
        id: "size",
        label: "Flyer Size",
        type: "select",
        required: true,
        choices: [
          {
            id: "a6",
            label: "A6",
          },
          {
            id: "a5",
            label: "A5",
            priceModifier: 3000,
          },
          {
            id: "a4",
            label: "A4",
            priceModifier: 6000,
          },
        ],
      },

      {
        id: "sides",
        label: "Print Sides",
        type: "radio",
        required: true,
        choices: [
          {
            id: "single",
            label: "Single-sided",
          },
          {
            id: "double",
            label: "Double-sided",
            priceModifier: 4000,
          },
        ],
      },

      {
        id: "quantity",
        label: "Quantity",
        type: "quantity",
        required: true,
        choices: [
          {
            id: "100",
            label: "100 copies",
          },
          {
            id: "250",
            label: "250 copies",
            priceModifier: 10000,
          },
          {
            id: "500",
            label: "500 copies",
            priceModifier: 22000,
          },
          {
            id: "1000",
            label: "1,000 copies",
            priceModifier: 40000,
          },
        ],
      },
    ],

    turnaround: "Production timeline confirmed after artwork approval.",

    popular: true,
    featured: true,
    published: true,
  },

  /*
  |--------------------------------------------------------------------------
  | POSTERS
  |--------------------------------------------------------------------------
  */

  {
    id: "print-posters",
    slug: "posters",

    name: "Posters",
    shortName: "Posters",

    description:
      "Printed posters for promotions, campaigns, events, announcements and visual displays.",

    shortDescription:
      "Bold printed posters for promotions and displays.",

    category: "print",
    status: "made-to-order",

    image: "/images/products/print/posters.webp",

    images: [
      "/images/products/print/posters.webp",
    ],

    pricing: {
      type: "starting-from",
      basePrice: 5000,
      oldPrice: 7000,
      baseQuantity: 10,
      unit: "copies",
    },

    options: [
      {
        id: "size",
        label: "Poster Size",
        type: "select",
        required: true,
        choices: [
          {
            id: "a3",
            label: "A3",
          },
          {
            id: "a2",
            label: "A2",
            priceModifier: 5000,
          },
          {
            id: "a1",
            label: "A1",
            priceModifier: 10000,
          },
        ],
      },

      {
        id: "quantity",
        label: "Quantity",
        type: "quantity",
        required: true,
        choices: [
          {
            id: "10",
            label: "10 copies",
          },
          {
            id: "25",
            label: "25 copies",
            priceModifier: 7000,
          },
          {
            id: "50",
            label: "50 copies",
            priceModifier: 14000,
          },
        ],
      },
    ],

    turnaround: "Production timeline confirmed after artwork approval.",

    popular: true,
    featured: false,
    published: true,
  },

  /*
  |--------------------------------------------------------------------------
  | BANNERS
  |--------------------------------------------------------------------------
  */

  {
    id: "print-banners",
    slug: "banners",

    name: "Premium Banners",
    shortName: "Banners",

    description:
      "Large-format banners for businesses, events, campaigns, churches, schools and outdoor promotions.",

    shortDescription:
      "Large-format banners built for visibility.",

    category: "print",
    status: "made-to-order",

    image: "/images/products/print/banners.webp",

    images: [
      "/images/products/print/banners.webp",
    ],

    pricing: {
      type: "starting-from",
      basePrice: 8000,
      baseQuantity: 1,
      unit: "piece",
    },

    options: [
      {
        id: "size",
        label: "Banner Size",
        type: "select",
        required: true,
        choices: [
          {
            id: "small",
            label: "Small",
          },
          {
            id: "medium",
            label: "Medium",
            priceModifier: 5000,
          },
          {
            id: "large",
            label: "Large",
            priceModifier: 10000,
          },
          {
            id: "custom",
            label: "Custom Size",
          },
        ],
      },
    ],

    turnaround:
      "Production timeline depends on banner size, finishing and artwork approval.",

    popular: true,
    featured: true,
    published: true,
  },

  /*
  |--------------------------------------------------------------------------
  | BROCHURES
  |--------------------------------------------------------------------------
  */

  {
    id: "print-brochures",
    slug: "brochures",

    name: "Brochures",
    shortName: "Brochures",

    description:
      "Professional brochures for company profiles, product information, events, campaigns and presentations.",

    shortDescription:
      "Professional folded print for detailed brand communication.",

    category: "print",
    status: "made-to-order",

    image: "/images/products/print/brochures.webp",

    images: [
      "/images/products/print/brochures.webp",
    ],

    pricing: {
      type: "starting-from",
      basePrice: 20000,
      baseQuantity: 100,
      unit: "copies",
    },

    turnaround: "Production timeline confirmed after specification review.",

    popular: false,
    featured: false,
    published: true,
  },

  /*
  |--------------------------------------------------------------------------
  | STICKERS
  |--------------------------------------------------------------------------
  */

  {
    id: "print-stickers",
    slug: "stickers",

    name: "Branded Stickers",
    shortName: "Stickers",

    description:
      "Custom printed stickers for packaging, products, promotions, events and brand visibility.",

    shortDescription:
      "Custom stickers for products, packaging and promotions.",

    category: "print",
    status: "made-to-order",

    image: "/images/products/print/stickers.webp",

    images: [
      "/images/products/print/stickers.webp",
    ],

    pricing: {
      type: "starting-from",
      basePrice: 8000,
      baseQuantity: 50,
      unit: "pieces",
    },

    options: [
      {
        id: "shape",
        label: "Shape",
        type: "select",
        required: true,
        choices: [
          {
            id: "square",
            label: "Square",
          },
          {
            id: "rectangle",
            label: "Rectangle",
          },
          {
            id: "circle",
            label: "Circle",
          },
          {
            id: "custom",
            label: "Custom Shape",
            priceModifier: 2500,
          },
        ],
      },

      {
        id: "quantity",
        label: "Quantity",
        type: "quantity",
        required: true,
        choices: [
          {
            id: "50",
            label: "50 pieces",
          },
          {
            id: "100",
            label: "100 pieces",
            priceModifier: 5000,
          },
          {
            id: "250",
            label: "250 pieces",
            priceModifier: 14000,
          },
          {
            id: "500",
            label: "500 pieces",
            priceModifier: 26000,
          },
        ],
      },
    ],

    turnaround: "Production timeline confirmed after artwork approval.",

    popular: true,
    featured: true,
    published: true,
  },

  /*
  |--------------------------------------------------------------------------
  | LABELS
  |--------------------------------------------------------------------------
  */

  {
    id: "print-labels",
    slug: "labels",

    name: "Product Labels",
    shortName: "Labels",

    description:
      "Custom labels for products, packaging, bottles, containers and branded goods.",

    shortDescription:
      "Professional labels for products and packaging.",

    category: "print",
    status: "made-to-order",

    image: "/images/products/print/labels.webp",

    images: [
      "/images/products/print/labels.webp",
    ],

    pricing: {
      type: "starting-from",
      basePrice: 8000,
      baseQuantity: 50,
      unit: "pieces",
    },

    turnaround:
      "Production timeline confirmed after size, material and artwork review.",

    popular: false,
    featured: true,
    published: true,
  },

  /*
  |--------------------------------------------------------------------------
  | LETTERHEADS
  |--------------------------------------------------------------------------
  */

  {
    id: "print-letterheads",
    slug: "letterheads",

    name: "Company Letterheads",
    shortName: "Letterheads",

    description:
      "Professional branded letterheads for companies, organizations, schools and institutions.",

    shortDescription:
      "Branded stationery for professional communication.",

    category: "print",
    status: "made-to-order",

    image: "/images/products/print/letterheads.webp",

    images: [
      "/images/products/print/letterheads.webp",
    ],

    pricing: {
      type: "starting-from",
      basePrice: 12000,
      baseQuantity: 100,
      unit: "copies",
    },

    turnaround: "Production timeline confirmed after artwork approval.",

    popular: false,
    featured: false,
    published: true,
  },

  /*
  |--------------------------------------------------------------------------
  | BOOKLETS
  |--------------------------------------------------------------------------
  */

  {
    id: "print-booklets",
    slug: "booklets",

    name: "Printed Booklets",
    shortName: "Booklets",

    description:
      "Professionally printed booklets for programmes, manuals, reports, company profiles and events.",

    shortDescription:
      "Multi-page printed materials for programmes, reports and manuals.",

    category: "print",
    status: "made-to-order",

    image: "/images/products/print/booklets.webp",

    images: [
      "/images/products/print/booklets.webp",
    ],

    pricing: {
      type: "starting-from",
      basePrice: 25000,
      baseQuantity: 50,
      unit: "copies",
    },

    turnaround:
      "Final pricing and production timeline depend on page count, size, paper and finishing.",

    popular: false,
    featured: false,
    published: true,
  },

  /*
  |--------------------------------------------------------------------------
  | RECEIPT BOOKS
  |--------------------------------------------------------------------------
  */

  {
    id: "print-receipt-books",
    slug: "receipt-books",

    name: "Receipt Books",
    shortName: "Receipt Books",

    description:
      "Custom business receipt books for sales records, payments and everyday business operations.",

    shortDescription:
      "Branded receipt books for business transactions.",

    category: "print",
    status: "made-to-order",

    image: "/images/products/print/receipt-books.webp",

    images: [
      "/images/products/print/receipt-books.webp",
    ],

    pricing: {
      type: "starting-from",
      basePrice: 15000,
      baseQuantity: 10,
      unit: "books",
    },

    turnaround: "Production timeline confirmed after specification approval.",

    popular: false,
    featured: false,
    published: true,
  },

  /*
  |--------------------------------------------------------------------------
  | INVITATIONS
  |--------------------------------------------------------------------------
  */

  {
    id: "print-invitations",
    slug: "invitations",

    name: "Custom Invitations",
    shortName: "Invitations",

    description:
      "Custom invitation printing for weddings, birthdays, corporate events, launches and special occasions.",

    shortDescription:
      "Custom invitations produced around your event.",

    category: "print",
    status: "custom",

    image: "/images/products/print/invitations.webp",

    images: [
      "/images/products/print/invitations.webp",
    ],

    pricing: {
      type: "quote",
      baseQuantity: 10,
      unit: "copies",
    },

    turnaround: "Timeline provided with your custom quote.",

    popular: false,
    featured: false,
    published: true,
  },

  /*
  |--------------------------------------------------------------------------
  | CERTIFICATES
  |--------------------------------------------------------------------------
  */

  {
    id: "print-certificates",
    slug: "certificates",

    name: "Certificates",
    shortName: "Certificates",

    description:
      "Professional certificate printing for schools, training programmes, organizations, churches and events.",

    shortDescription:
      "Professional certificates for programmes and organizations.",

    category: "print",
    status: "custom",

    image: "/images/products/print/certificates.webp",

    images: [
      "/images/products/print/certificates.webp",
    ],

    pricing: {
      type: "quote",
      baseQuantity: 10,
      unit: "copies",
    },

    turnaround: "Timeline provided after specification review.",

    popular: false,
    featured: false,
    published: true,
  },

  /*
  |--------------------------------------------------------------------------
  | PACKAGING
  |--------------------------------------------------------------------------
  */

  {
    id: "print-packaging",
    slug: "packaging",

    name: "Custom Packaging",
    shortName: "Packaging",

    description:
      "Custom printed packaging developed around your product, dimensions, quantity and brand requirements.",

    shortDescription:
      "Custom branded packaging built around your product.",

    category: "print",
    status: "custom",

    image: "/images/products/print/packaging.webp",

    images: [
      "/images/products/print/packaging.webp",
    ],

    pricing: {
      type: "quote",
      baseQuantity: 50,
      unit: "pieces",
    },

    turnaround:
      "Pricing and production timeline are provided after specification review.",

    popular: true,
    featured: true,
    published: true,
  },

  /*
  |--------------------------------------------------------------------------
  | CALENDARS
  |--------------------------------------------------------------------------
  */

  {
    id: "print-calendars",
    slug: "calendars",

    name: "Custom Calendars",
    shortName: "Calendars",

    description:
      "Custom branded calendars for businesses, organizations, schools, churches and promotional campaigns.",

    shortDescription:
      "Branded calendars for organizations and promotions.",

    category: "print",
    status: "custom",

    image: "/images/products/print/calendars.webp",

    images: [
      "/images/products/print/calendars.webp",
    ],

    pricing: {
      type: "quote",
      baseQuantity: 10,
      unit: "copies",
    },

    turnaround: "Timeline provided with your custom quote.",

    popular: false,
    featured: false,
    published: true,
  },
];

/*
|--------------------------------------------------------------------------
| PRODUCT HELPERS
|--------------------------------------------------------------------------
*/

export function getProductBySlug(
  slug: string
): NewJerseyProduct | undefined {
  return products.find(
    (product) =>
      product.slug === slug &&
      product.published !== false
  );
}

export function getProductById(
  id: string
): NewJerseyProduct | undefined {
  return products.find(
    (product) =>
      product.id === id &&
      product.published !== false
  );
}

export function getPublishedProducts(): NewJerseyProduct[] {
  return products.filter(
    (product) => product.published !== false
  );
}

export function getPopularProducts(): NewJerseyProduct[] {
  return products.filter(
    (product) =>
      product.published !== false &&
      product.popular === true
  );
}

export function getFeaturedProducts(): NewJerseyProduct[] {
  return products.filter(
    (product) =>
      product.published !== false &&
      product.featured === true
  );
}

export function getProductsByCategory(
  category: NewJerseyProduct["category"]
): NewJerseyProduct[] {
  return products.filter(
    (product) =>
      product.published !== false &&
      product.category === category
  );
}