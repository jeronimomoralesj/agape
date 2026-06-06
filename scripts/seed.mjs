/**
 * Seed demo products: `npm run seed`
 * Reads MONGODB_URI from .env.local (or the environment).
 */
import { readFileSync } from 'node:fs';
import mongoose from 'mongoose';

// Minimal .env.local loader (no extra dependency needed)
try {
  const env = readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
  for (const line of env.split('\n')) {
    const match = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*"?([^"\n]*)"?\s*$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
  }
} catch {
  /* .env.local not present — rely on the environment */
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI no está definida. Crea .env.local a partir de .env.example.');
  process.exit(1);
}

const ProductSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    price: Number,
    discount: { type: Number, default: 0 },
    images: [String],
    stock: Number,
    isActive: Boolean,
    views: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const PRODUCTS = [
  {
    title: 'Pulsera Gozo — Cristal Celeste',
    description:
      'Cristales celestes como el cielo de la mañana, con dije de cruz bañado en oro. Una pieza que acompaña tu oración y recuerda que la alegría del Señor es nuestra fuerza.',
    price: 65000,
    discount: 0,
    images: ['/brand/pulseras.jpeg'],
    stock: 12,
    isActive: true,
  },
  {
    title: 'Pulsera Consuelo — Cristal Granate',
    description:
      'Tonos profundos para los días difíciles. Lleva contigo la promesa del Salmo 147:3: "Él sana a los de corazón herido y venda sus heridas".',
    price: 68000,
    discount: 10,
    images: ['/brand/pulseras.jpeg'],
    stock: 8,
    isActive: true,
  },
  {
    title: 'Pulsera Gloria — Cristal Dorado',
    description:
      'Cristales dorados y luminosos que celebran la Resurrección. Luz para la muñeca y para el alma.',
    price: 72000,
    discount: 0,
    images: ['/brand/pulseras.jpeg'],
    stock: 10,
    isActive: true,
  },
  {
    title: 'Pulsera Luz — Cristal Blanco',
    description:
      'Cristales blancos y transparentes como el agua del Jordán. Un recordatorio de que Él es la luz del mundo (Juan 8:12).',
    price: 70000,
    discount: 0,
    images: ['/brand/pulseras.jpeg'],
    stock: 6,
    isActive: true,
  },
];

async function main() {
  await mongoose.connect(MONGODB_URI);
  const count = await Product.countDocuments();
  if (count > 0) {
    console.log(`ℹ️  Ya existen ${count} productos — no se agregó nada.`);
  } else {
    await Product.insertMany(PRODUCTS);
    console.log(`✅ ${PRODUCTS.length} pulseras de ejemplo creadas.`);
  }
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('❌ Error al sembrar la base de datos:', err.message);
  process.exit(1);
});
