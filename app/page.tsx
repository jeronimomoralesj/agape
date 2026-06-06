import BrandBanner from '@/components/home/BrandBanner';
import MarketplaceShop from '@/components/shop/MarketplaceShop';
import MisterioDelDia from '@/components/home/MisterioDelDia';
import RosaryGuide from '@/components/home/RosaryGuide';
import { fetchProducts } from '@/lib/products';

export const revalidate = 120; // keep the storefront fresh

export default async function HomePage() {
  const products = await fetchProducts();

  return (
    <>
      <BrandBanner />
      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <MarketplaceShop products={products} />
      </div>
      <MisterioDelDia />
      <RosaryGuide />
    </>
  );
}
