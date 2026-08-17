export type ProductSpec = {
  label: string;
  value: string;
};

export type AppProduct = {
  id: number | string;
  name: string;
  price: string;
  image: string;
  hoverImage?: string;
  images: string[];
  description: string;
  specs: ProductSpec[];
  rating: number;
  reviewsCount?: number;
  isFulfilled?: boolean;
  tag?: string;
  category?: string;
  stock?: string;
  status?: "Active" | "Draft" | "Out of Stock";
  isHotStuff: boolean;
};