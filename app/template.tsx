'use client';

import { motion } from 'framer-motion';

/**
 * Ethereal "fade and lift" page transition applied to every route.
 * `template.tsx` re-mounts on navigation, so the animation plays per page.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
