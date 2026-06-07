'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { CartItem, Product } from '@/lib/types';
import { finalPrice } from '@/lib/types';
import {
  CUSTOM_PRICE,
  customCartImage,
  customProductId,
  customTitle,
  findBead,
  findCord,
  type CustomConfig,
} from '@/lib/customBracelet';

const FALLBACK_BEAD_HEX = '#EBD4BE';

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  /** Increments whenever an item is added — drives the badge bounce */
  pulse: number;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, quantity?: number) => void;
  addCustomItem: (config: CustomConfig) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = 'agape-cart-v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [pulse, setPulse] = useState(0);
  const hydrated = useRef(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {
      /* corrupted storage — start fresh */
    }
    hydrated.current = true;
  }, []);

  // Persist on change (after hydration)
  useEffect(() => {
    if (!hydrated.current) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.productId === product._id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product._id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product._id,
          title: product.title,
          price: finalPrice(product), // discounted price when a discount is active
          image: product.images[0] ?? '/brand/pulseras.jpeg',
          quantity: Math.min(quantity, product.stock),
          stock: product.stock,
        },
      ];
    });
    setPulse((p) => p + 1);
    setIsOpen(true);
  }, []);

  const addCustomItem = useCallback((config: CustomConfig) => {
    const productId = customProductId(config);
    setItems((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.min(item.quantity + 1, 10) }
            : item
        );
      }
      return [
        ...prev,
        {
          productId,
          title: customTitle(config),
          price: CUSTOM_PRICE,
          image: customCartImage(
            config.beadIds.map((id) => findBead(id)?.hex ?? FALLBACK_BEAD_HEX),
            findCord(config.cordId)?.hex ?? '#E3D5BC'
          ),
          quantity: 1,
          stock: 10, // handmade to order — cap per pedido
          custom: config,
        },
      ];
    });
    setPulse((p) => p + 1);
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.max(0, Math.min(quantity, item.stock)) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const value = useMemo<CartContextValue>(() => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return {
      items,
      isOpen,
      pulse,
      openCart,
      closeCart,
      addItem,
      addCustomItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
    };
  }, [items, isOpen, pulse, openCart, closeCart, addItem, addCustomItem, removeItem, updateQuantity, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>');
  return ctx;
}
