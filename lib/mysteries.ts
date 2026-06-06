import type { Category } from './types';

export interface MysterySet {
  key: Category;
  name: string;
  days: string;
  /** 0 = domingo … 6 = sábado (JS Date.getDay) */
  weekdays: number[];
  verse: string;
  mysteries: string[];
}

/**
 * Los Misterios del Santo Rosario, según el día de la semana.
 * Fuente: material de marca Ágape.
 */
export const MYSTERY_SETS: MysterySet[] = [
  {
    key: 'Gozosos',
    name: 'Misterios Gozosos',
    days: 'Lunes y Sábado',
    weekdays: [1, 6],
    verse: 'La alegría del Señor es nuestra fuerza.',
    mysteries: [
      'La encarnación del Hijo de Dios.',
      'La visitación de Nuestra Señora a su prima Santa Isabel.',
      'El nacimiento del Hijo de Dios.',
      'La Presentación de Jesús en el templo.',
      'El Niño Jesús perdido y hallado en el templo.',
    ],
  },
  {
    key: 'Dolorosos',
    name: 'Misterios Dolorosos',
    days: 'Martes y Viernes',
    weekdays: [2, 5],
    verse: 'Él sana a los de corazón herido y venda sus heridas. — Salmo 147:3',
    mysteries: [
      'La Oración de Jesús en el Huerto.',
      'La Flagelación del Señor.',
      'La Coronación de espinas.',
      'Jesús con la Cruz a cuestas camino del Calvario.',
      'La Crucifixión y Muerte de Nuestro Señor.',
    ],
  },
  {
    key: 'Gloriosos',
    name: 'Misterios Gloriosos',
    days: 'Miércoles y Domingo',
    weekdays: [3, 0],
    verse: 'Resucitó, como lo había dicho. ¡Aleluya!',
    mysteries: [
      'La Resurrección del Hijo de Dios.',
      'La Ascensión del Señor a los Cielos.',
      'La Venida del Espíritu Santo sobre los Apóstoles.',
      'La Asunción de Nuestra Señora a los Cielos.',
      'La Coronación de la Santísima Virgen como Reina de Cielos y Tierra.',
    ],
  },
  {
    key: 'Luminosos',
    name: 'Misterios Luminosos',
    days: 'Jueves',
    weekdays: [4],
    verse: 'Yo soy la luz del mundo. — Juan 8:12',
    mysteries: [
      'El Bautismo de Jesús en el Jordán.',
      'La autorrevelación de Jesús en las bodas de Caná.',
      'El anuncio del Reino de Dios invitando a la conversión.',
      'La Transfiguración.',
      'La Institución de la Eucaristía.',
    ],
  },
];

/** Devuelve el set de misterios que corresponde a un día (por defecto, hoy). */
export function getMysteryOfTheDay(date: Date = new Date()): MysterySet {
  const day = date.getDay();
  return MYSTERY_SETS.find((set) => set.weekdays.includes(day)) ?? MYSTERY_SETS[0];
}

export function getMysteryByKey(key: string): MysterySet | undefined {
  return MYSTERY_SETS.find((set) => set.key === key);
}

/** Pasos de la guía del rosario (material de marca Ágape). */
export const ROSARY_STEPS = [
  { step: 1, label: 'Señal de la Santa Cruz · Credo' },
  { step: 2, label: 'Primer misterio' },
  { step: 3, label: 'Segundo misterio' },
  { step: 4, label: 'Tercer misterio' },
  { step: 5, label: 'Cuarto misterio' },
  { step: 6, label: 'Quinto misterio' },
  { step: 7, label: 'Por las intenciones del Santo Padre' },
];

export const ROSARY_AFTER_EACH =
  'Después de cada misterio se rezan: 1 Padre Nuestro · 10 Ave Marías · 1 Gloria';
