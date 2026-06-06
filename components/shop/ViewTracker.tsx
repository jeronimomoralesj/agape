'use client';

import { useEffect } from 'react';

/**
 * Fires a single view ping per product per browser session.
 * Client-side so link prefetching doesn't inflate the count.
 */
export default function ViewTracker({ productId }: { productId: string }) {
  useEffect(() => {
    const key = `agape-viewed-${productId}`;
    try {
      if (window.sessionStorage.getItem(key)) return;
      window.sessionStorage.setItem(key, '1');
    } catch {
      /* storage unavailable — still count the view */
    }
    fetch(`/api/products/${productId}/view`, { method: 'POST', keepalive: true }).catch(
      () => {}
    );
  }, [productId]);

  return null;
}
