export const publicServices = {
  "print": {
    "title": "Print that gets the details right.",
    "intro": "Business cards, flyers, stickers, banners and packaging for businesses, events and everyday work.",
    "label": "Explore print products",
    "href": "/shop/print",
    "sections": [
      [
        "Start with the job",
        "Tell us what the piece needs to do, the quantity and finished dimensions. Paper, material and finishing options depend on the product; the order specification is the reference for production."
      ],
      [
        "Bring a design or start with a brief",
        "Have a finished design? Read our print guidelines before submitting it through your order. For a custom brief, use Custom orders. If you need a design created, choose a designer first."
      ],
      [
        "Confirm before production",
        "Review price, quantity, finish and any proof that needs approval. Delivery is confirmed separately. Tell us your deadline before committing to an event order."
      ]
    ]
  },
  "apparel": {
    "title": "Good pieces. Your choice.",
    "intro": "Ready-designed clothing and promotional apparel, with available sizes and colours shown before you order.",
    "label": "Shop apparel",
    "href": "/shop/apparel",
    "sections": [
      [
        "Choose a finished style",
        "Browse published products and choose the offered size, colour and quantity. These are retail purchases; there is no artwork upload for an ordinary apparel order."
      ],
      [
        "Need your own design printed?",
        "Use Custom orders for a logo, campaign graphic or print job made to your brief. Custom requirements, design assistance and production timing are confirmed against that job."
      ],
      [
        "Looking for team jerseys?",
        "Our jersey shop lets you choose team, season, home, away or third kit and size. Optional names and numbers are charged separately where offered. Check spelling, capitalisation and leading zeroes carefully."
      ]
    ]
  },
  "branding": {
    "title": "Your business, in view.",
    "intro": "Signage, vehicle graphics and branding for the places your business is seen.",
    "label": "Explore branding",
    "href": "/shop/branding",
    "sections": [
      [
        "Signage and spaces",
        "Tell us where the sign will be used, the approximate dimensions and the surface or mounting location. Material, fabrication and installation needs must be confirmed for the site."
      ],
      [
        "Vehicles and moving brands",
        "Share the vehicle type, clear photographs and the areas you want branded. Coverage, surface condition and artwork influence the specification and quote."
      ],
      [
        "Scope before commitment",
        "A project may need measurements, a site review or agreed artwork before final pricing. Installation, access, travel and preparation are included only when stated in the accepted scope. No enquiry automatically books an installation date."
      ]
    ]
  },
  "business-stationery": {
    "title": "The essentials, carrying your name.",
    "intro": "Business cards, letterheads, envelopes and printed materials that keep your business presentation consistent.",
    "label": "Explore stationery and print",
    "href": "/shop/print",
    "sections": [
      [
        "Build a consistent set",
        "Bring your logo and approved business details. Check names, roles, contact numbers, addresses and links before approving the production proof."
      ],
      [
        "Match the finish to the purpose",
        "Quantity, paper, dimensions and finishing affect the available options and price. Ask about matching related items before confirming separate jobs."
      ],
      [
        "Design support when needed",
        "Use Hire a Designer for a new layout or identity work. Production-ready artwork and a new design commission are different services; any design fee is agreed separately."
      ]
    ]
  }
} as const;
export type PublicService = keyof typeof publicServices;
