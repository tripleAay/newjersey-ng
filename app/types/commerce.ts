export type ProductStatus =
  | "available"
  | "made-to-order"
  | "custom"
  | "pre-order";

export type PricingType =
  | "fixed"
  | "starting-from"
  | "quote";

export type ProductCategory =
  | "print"
  | "apparel"
  | "merch";

export type ServiceCategory =
  | "branding"
  | "creative"
  | "custom";

export type ProductOptionChoice = {
  id: string;
  label: string;
  priceModifier?: number;
  description?: string;
};

export type ProductOption = {
  id: string;
  label: string;
  type:
    | "select"
    | "radio"
    | "quantity";
  required?: boolean;
  choices: ProductOptionChoice[];
};

export type ProductPricing = {
  type: PricingType;
  basePrice?: number;
  oldPrice?: number;
  baseQuantity?: number;
  unit?: string;
};

export type NewJerseyProduct = {
  id: string;
  slug: string;
  name: string;
  shortName?: string;
  description: string;
  shortDescription?: string;
  category: ProductCategory;
  status: ProductStatus;
  image: string;
  images: string[];
  pricing: ProductPricing;
  options?: ProductOption[];
  turnaround?: string;
  featured?: boolean;
  popular?: boolean;
  published?: boolean;
};

export type NewJerseyService = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: ServiceCategory;
  image?: string;
  startingPrice?: number;
  quoteRequired: boolean;
  featured?: boolean;
  published?: boolean;
};

export type SelectedProductOption = {
  optionId: string;
  optionLabel: string;
  choiceId: string;
  choiceLabel: string;
  priceModifier: number;
};

export type CartItemArtwork = {
  type:
    | "customer-supplied"
    | "design-needed";
  designFee?: number;
};

export type CartItem = {
  cartItemId: string;
  productId: string;
  slug: string;
  name: string;
  image: string;

  /*
   * Number of identical configured jobs.
   * Print quantity such as 100/500 copies
   * remains part of selections.
   */
  quantity: number;

  basePrice: number;
  optionsTotal: number;
  unitPrice: number;
  totalPrice: number;

  selections: SelectedProductOption[];

  artwork?: CartItemArtwork;
};

export type OrderStatus =
  | "submitted"
  | "under-review"
  | "awaiting-artwork"
  | "awaiting-payment"
  | "confirmed"
  | "in-production"
  | "ready"
  | "dispatched"
  | "completed"
  | "cancelled";

export type OrderCustomer = {
  fullName: string;
  phone: string;
  email: string;
  organization?: string;
};

export type OrderDelivery = {
  method:
    | "delivery"
    | "pickup";
  state?: string;
  city?: string;
  address?: string;
  landmark?: string;
};

export type OrderProductionBrief = {
  projectName: string;
  deadline?: string;
  instructions?: string;
};

export type NewJerseyOrder = {
  id: string;
  orderNumber: string;

  customer: OrderCustomer;
  delivery: OrderDelivery;
  brief: OrderProductionBrief;

  items: CartItem[];

  itemCount: number;

  subtotal: number;
  designFee: number;
  deliveryFee: number;

  finalTotal: number | null;

  status: OrderStatus;

  createdAt: string;
  updatedAt: string;
};

export type CreateOrderPayload = {
  customer: OrderCustomer;
  delivery: OrderDelivery;
  brief: OrderProductionBrief;

  items: CartItem[];

  /*
   * Client subtotal is informational.
   * Server recalculates its own subtotal.
   */
  subtotal: number;
};

export type CreateOrderResult = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  subtotal: number;
  createdAt: string;
};