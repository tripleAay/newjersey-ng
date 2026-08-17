// src/types/index.d.ts

// 🌱 Product (for giftcards, branding kits, etc.)
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: "giftcard" | "branding" | "webdev" | "other";
  image?: string;
  inStock: boolean;
}

// 🛒 Cart Item
export interface CartItem {
  product: Product;
  quantity: number;
}

// 👥 User (client or admin)
export interface User {
  id: string;
  name: string;
  email: string;
  role: "client" | "admin";
  avatar?: string;
}

// 📞 Contact Form Data
export interface ContactForm {
  name: string;
  email: string;
  message: string;
}

// ✍️ Blog Post
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  author: string;
  createdAt: Date;
  updatedAt?: Date;
  coverImage?: string;
}

// 🔑 API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}   