import type { BlogPost, Product } from './types';
import { finalPrice } from './types';

/** Canonical site origin. Set NEXT_PUBLIC_SITE_URL in Vercel (no trailing slash). */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
).replace(/\/$/, '');

export const SITE_NAME = 'Ágape';
export const SITE_TAGLINE = 'Amar como Dios nos ama';

export const DEFAULT_DESCRIPTION =
  'Compra pulseras católicas artesanales de cristal y baño de oro 18k en Colombia. ' +
  'Joyería religiosa inspirada en los Misterios del Santo Rosario, hecha a mano con amor. ' +
  '“Él sana a los de corazón herido y venda sus heridas” — Salmo 147:3.';

/** High-intent keywords for the Colombian market. */
export const KEYWORDS = [
  'pulseras católicas',
  'pulseras religiosas Colombia',
  'pulsera rosario',
  'manillas católicas',
  'pulseras de cristal y oro',
  'pulsera con cruz',
  'denario pulsera',
  'joyería religiosa Colombia',
  'regalos católicos Colombia',
  'pulseras artesanales Bogotá',
  'pulsera primera comunión',
  'pulsera confirmación regalo',
  'accesorios católicos',
  'Ágape pulseras',
];

export function absoluteUrl(path: string): string {
  return path.startsWith('http') ? path : `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}

export function productUrl(product: Pick<Product, '_id'>): string {
  return `${SITE_URL}/producto/${product._id}`;
}

/**
 * Public, crawlable URL for a product image. Base64 uploads are served as
 * real image bytes through /api/products/[id]/image/[index] so Google
 * Shopping, social cards, and image search can fetch them.
 */
export function productImageUrl(product: Pick<Product, '_id' | 'images'>, index = 0): string {
  const image = product.images[index];
  if (!image) return absoluteUrl('/brand/pulseras.jpeg');
  if (image.startsWith('data:')) {
    return `${SITE_URL}/api/products/${product._id}/image/${index}`;
  }
  return absoluteUrl(image);
}

export function postImageUrl(post: Pick<BlogPost, '_id' | 'image'>): string | null {
  if (!post.image) return null;
  if (post.image.startsWith('data:')) return `${SITE_URL}/api/blog/${post._id}/image`;
  return absoluteUrl(post.image);
}

// ───────────────────────── JSON-LD builders ─────────────────────────

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    slogan: SITE_TAGLINE,
    description: DEFAULT_DESCRIPTION,
    logo: absoluteUrl('/icon.svg'),
    image: absoluteUrl('/brand/pulseras.jpeg'),
    email: 'hola@agape.com.co',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'CO',
    },
    areaServed: { '@type': 'Country', name: 'Colombia' },
    sameAs: ['https://www.instagram.com/agape.pulseras'],
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    alternateName: `${SITE_NAME} — ${SITE_TAGLINE}`,
    url: SITE_URL,
    inLanguage: 'es-CO',
    publisher: { '@id': `${SITE_URL}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function productJsonLd(product: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${productUrl(product)}#product`,
    name: product.title,
    description: product.description,
    image: product.images.map((_, i) => productImageUrl(product, i)),
    url: productUrl(product),
    sku: product._id,
    brand: { '@type': 'Brand', name: SITE_NAME },
    category: 'Joyería > Pulseras religiosas',
    material: 'Cristal, baño de oro 18k',
    audience: { '@type': 'PeopleAudience', geographicArea: { '@type': 'Country', name: 'Colombia' } },
    offers: {
      '@type': 'Offer',
      url: productUrl(product),
      price: finalPrice(product),
      priceCurrency: 'COP',
      availability:
        product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@id': `${SITE_URL}/#organization` },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'CO' },
      },
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function itemListJsonLd(products: Product[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Pulseras ${SITE_NAME}`,
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: productUrl(product),
      name: product.title,
    })),
  };
}

export function articleJsonLd(post: BlogPost) {
  const image = postImageUrl(post);
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    ...(image ? { image: [image] } : {}),
    datePublished: post.createdAt,
    inLanguage: 'es-CO',
    author: { '@id': `${SITE_URL}/#organization` },
    publisher: { '@id': `${SITE_URL}/#organization` },
    mainEntityOfPage: `${SITE_URL}/blog/${post._id}`,
  };
}

// ───────────────────────── XML helpers ─────────────────────────

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
