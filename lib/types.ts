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
  /** Present for "Crea tu pulsera / collar / nombres / colombia" custom configurations */
  custom?: {
    type?: 'pulsera' | 'collar' | 'nombres' | 'colombia';
    /** Color of the small María pepas */
    mariaId?: string;
    /** Color of the larger Jesús intersection pepas */
    jesusId?: string;
    cordId?: string;
    /** Centerpiece medal — collar only */
    dijeId?: string;
    /** Personalized names — "Collar de Nombres" only */
    names?: string[];
    /** Seed-bead metal finish — "Collar de Nombres" only */
    metalId?: string;
    /** Separator pepita color — "Pulsera Colombia" only */
    separatorId?: string;
    /** Bead arrangement — "Pulsera Colombia" only */
    patternId?: string;
    /** Legacy single-list carts (pre maría/jesús split) */
    beadIds?: string[];
  };
}

export interface BlogPost {
  _id: string;
  title: string;
  content: string;
  image?: string;
  isPublished: boolean;
  createdAt: string;
}

/** A pepa (bead) color managed from the admin and offered in the configurator. */
export interface Pepa {
  _id: string;
  /** Stable id used inside cart items / orders */
  id: string;
  name: string;
  hex: string;
  light: boolean;
  /** Devotional family: 'maria' = small pepas · 'jesus' = intersection pepas */
  kind: 'maria' | 'jesus';
  stock: number;
  isActive: boolean;
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
