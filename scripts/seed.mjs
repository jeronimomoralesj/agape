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
    images: [String],
    category: String,
    stock: Number,
    isActive: Boolean,
    spiritualMeaning: String,
    materials: String,
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const MATERIALES =
  'Cristales facetados de alta calidad, componentes con baño de oro de 18k y dije de cruz. Hipoalergénica y pensada para el uso diario.';

const PRODUCTS = [
  {
    title: 'Pulsera Gozo — Cristal Celeste',
    description:
      'Cristales celestes como el cielo de la mañana, con dije de cruz bañado en oro. Inspirada en los Misterios Gozosos: la alegría de la Encarnación y el Nacimiento.',
    price: 65000,
    images: ['/brand/pulseras.jpeg'],
    category: 'Gozosos',
    stock: 12,
    isActive: true,
    spiritualMeaning:
      'Los Misterios Gozosos (lunes y sábado) nos invitan a contemplar la alegría de María al recibir al Hijo de Dios. Esta pulsera es un recordatorio de que la alegría del Señor es nuestra fuerza.',
    materials: MATERIALES,
  },
  {
    title: 'Pulsera Consuelo — Cristal Granate',
    description:
      'Tonos profundos que acompañan los Misterios Dolorosos. Para llevar contigo la promesa del Salmo 147:3: "Él sana a los de corazón herido y venda sus heridas".',
    price: 68000,
    images: ['/brand/pulseras.jpeg'],
    category: 'Dolorosos',
    stock: 8,
    isActive: true,
    spiritualMeaning:
      'Los Misterios Dolorosos (martes y viernes) nos unen al sacrificio de Cristo. Una compañía para los días difíciles: no caminamos solos.',
    materials: MATERIALES,
  },
  {
    title: 'Pulsera Gloria — Cristal Dorado',
    description:
      'Cristales dorados y luminosos que celebran la Resurrección. Inspirada en los Misterios Gloriosos, es luz para la muñeca y para el alma.',
    price: 72000,
    images: ['/brand/pulseras.jpeg'],
    category: 'Gloriosos',
    stock: 10,
    isActive: true,
    spiritualMeaning:
      'Los Misterios Gloriosos (miércoles y domingo) proclaman la victoria de la vida sobre la muerte. ¡Resucitó, como lo había dicho!',
    materials: MATERIALES,
  },
  {
    title: 'Pulsera Luz — Cristal Blanco',
    description:
      'Cristales blancos y transparentes como el agua del Jordán. Un homenaje a los Misterios Luminosos y a la luz que ilumina cada conversión.',
    price: 70000,
    images: ['/brand/pulseras.jpeg'],
    category: 'Luminosos',
    stock: 6,
    isActive: true,
    spiritualMeaning:
      'Los Misterios Luminosos (jueves) recorren la vida pública de Jesús: del Bautismo a la Eucaristía. "Yo soy la luz del mundo" (Juan 8:12).',
    materials: MATERIALES,
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
