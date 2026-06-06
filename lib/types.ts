// Used by the Misterios section of the homepage (lib/mysteries.ts)
export type Category = 'Gozosos' | 'Dolorosos' | 'Gloriosos' | 'Luminosos';

export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  /** Discount percentage (0–90) */
  discount?: number;
  images: string[];
  stock: number;
  isActive: boolean;
  /** Product page views */
  views?: number;
  createdAt: string;
}

/** Price after applying the discount percentage. */
export function finalPrice(product: Pick<Product, 'price' | 'discount'>): number {
  const discount = product.discount ?? 0;
  return discount > 0 ? Math.round(product.price * (1 - discount / 100)) : product.price;
}

export interface CartItem {
  productId: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}

export interface BlogPost {
  _id: string;
  title: string;
  content: string;
  image?: string;
  isPublished: boolean;
  createdAt: string;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped';

export interface Order {
  _id: string;
  orderNumber: string;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: { productId: string; title?: string; quantity: number; price: number }[];
  total: number;
  status: OrderStatus;
  createdAt: string;
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value);
}
