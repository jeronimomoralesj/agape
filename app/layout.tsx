import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans, Titan_One } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/components/cart/CartContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartSidebar from '@/components/cart/CartSidebar';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

// Chunky rounded display face for the "ÁGAPE" wordmark (Gliker-style)
const titan = Titan_One({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-logo',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Ágape — Amar como Dios nos ama',
    template: '%s · Ágape',
  },
  description:
    'Pulseras de cristal y oro inspiradas en los Misterios del Santo Rosario. "Él sana a los de corazón herido y venda sus heridas" — Salmo 147:3.',
  keywords: ['pulseras', 'rosario', 'cristal', 'oro', 'fe', 'católico', 'Ágape'],
};

export const viewport: Viewport = {
  themeColor: '#E0F2FE',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${playfair.variable} ${jakarta.variable} ${titan.variable}`}>
      <body className="flex min-h-screen flex-col font-sans">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartSidebar />
        </CartProvider>
      </body>
    </html>
  );
}
