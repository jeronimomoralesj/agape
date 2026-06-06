export type Category = 'Gozosos' | 'Dolorosos' | 'Gloriosos' | 'Luminosos';

export const CATEGORIES: Category[] = ['Gozosos', 'Dolorosos', 'Gloriosos', 'Luminosos'];

export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: Category;
  stock: number;
  isActive: boolean;
  spiritualMeaning?: string;
  materials?: string;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
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
