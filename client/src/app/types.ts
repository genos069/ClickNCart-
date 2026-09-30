export interface Product {
  _id: string;
  id?: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  rating: number;
  reviews: number;
  description: string;
  features: string[];
  inStock: boolean;
  discount?: number;
  createdAt?: string;
}
export interface Brand {
  _id: string;
  id?: string;
  name: string;
  logo?: string;
  description?: string;
  featured: boolean;
  color?: string;
  rating: number;
  products: number;
}
export interface Review {
  _id: string;
  title: string;
  comment: string;
  rating: number;
  createdAt: string;
  user?: { name: string };
  verifiedPurchase: boolean;
}
