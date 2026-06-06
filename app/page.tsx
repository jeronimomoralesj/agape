import Hero from '@/components/home/Hero';
import MisterioDelDia from '@/components/home/MisterioDelDia';
import RosaryGuide from '@/components/home/RosaryGuide';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import BrandStory from '@/components/home/BrandStory';
import { fetchProducts } from '@/lib/products';

export const revalidate = 300; // refresh featured products every 5 minutes

export default async function HomePage() {
  const featured = await fetchProducts(4);

  return (
    <>
      <Hero />
      <MisterioDelDia />
      <FeaturedProducts products={featured} />
      <RosaryGuide />
      <BrandStory />
    </>
  );
}
