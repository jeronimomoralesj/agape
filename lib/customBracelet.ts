/**
 * "Crea tu pulsera / collar" — shared option catalog.
 * Imported by the configurator UI AND the orders API, so prices and
 * options are always validated server-side from this single source.
 */

/** The two devotional pepa families — tracked separately in inventory. */
export type PepaKind = 'maria' | 'jesus';

/** The two product lines the customer can design. */
export type ProductType = 'pulsera' | 'collar';

export interface BeadOption {
  id: string;
  name: string;
  hex: string;
  /** true for translucent/light beads that need a visible rim */
  light?: boolean;
  /** 'maria' = small pepas · 'jesus' = larger intersection pepas */
  kind?: PepaKind;
}

export interface CordOption {
  id: string;
  name: string;
  hex: string;
}

/** Fixed price per product line — COP, validated server-side. */
export const CUSTOM_PRICES: Record<ProductType, number> = {
  pulsera: 22000,
  collar: 35000,
};

/** Back-compat alias (the pulsera price). */
export const CUSTOM_PRICE = CUSTOM_PRICES.pulsera;

export const PRODUCT_LABELS: Record<ProductType, string> = {
  pulsera: 'Pulsera',
  collar: 'Collar',
};

/**
 * Original palette — seeded into the DB the first time the collection is
 * empty (as both a 'maria' and a 'jesus' set). `kind` here is only the
 * default family; the live colors come from the admin.
 */
export const BEADS: BeadOption[] = [
  { id: 'esmeralda', name: 'Esmeralda Profunda', hex: '#025928' },
  { id: 'peridoto', name: 'Verde Oliva Claro', hex: '#6BB343' },
  { id: 'selva', name: 'Verde Selva Viva', hex: '#0D7F25' },
  { id: 'celestial', name: 'Azul Celestial', hex: '#7A9FE6' },
  { id: 'nocturno', name: 'Misterio Nocturno', hex: '#1A1126' },
  { id: 'turquesa', name: 'Turquesa Profunda', hex: '#0D6E6B' },
  { id: 'onix', name: 'Ónix Facetado', hex: '#1C1616' },
  { id: 'cobre', name: 'Cobre Ahumado', hex: '#7E594B' },
  { id: 'nacar', name: 'Nácar Alabastro', hex: '#ECE2D0', light: true },
  { id: 'champana', name: 'Champaña Suave', hex: '#EBD4BE', light: true },
  { id: 'ambar', name: 'Ámbar Sagrado', hex: '#732911' },
  { id: 'opalina', name: 'Opalina Glacial', hex: '#D5E4EB', light: true },
  { id: 'cristal', name: 'Cristal Puro', hex: '#F0F3F5', light: true },
  { id: 'blanco', name: 'Blanco Macizo', hex: '#F9FAFA', light: true },
];

/** Adjustable cords — only the pulsera lets the customer choose. */
export const CORDS: CordOption[] = [
  { id: 'crema', name: 'Crema', hex: '#E3D5BC' },
  { id: 'rosa-viejo', name: 'Rosa Viejo', hex: '#B37D8E' },
  { id: 'verde-oliva', name: 'Verde Oliva', hex: '#536643' },
];

/** The collar uses a single, fixed waxed thread (not customer-selectable). */
export const COLLAR_CORD: CordOption = {
  id: 'collar-fijo',
  name: 'Hilo encerado',
  hex: '#C9B89A',
};

export const GOLD = '#D4AF37';
export const GOLD_LIGHT = '#E8CD6F';
export const GOLD_DEEP = '#A8862A';

export interface CustomConfig {
  /** Which line the customer is designing */
  type: ProductType;
  /** Color of the small "Sagrada María" pepas */
  mariaId: string;
  /** Color of the larger "Cristo Jesús" intersection pepas */
  jesusId: string;
  /** Cord color — only meaningful for the pulsera */
  cordId?: string;
}

export function findBead(id: string): BeadOption | undefined {
  return BEADS.find((b) => b.id === id);
}
export function findCord(id: string | undefined): CordOption | undefined {
  if (!id) return undefined;
  if (id === COLLAR_CORD.id) return COLLAR_CORD;
  return CORDS.find((c) => c.id === id);
}

/** Resolve the cord a config should render with (collar is always fixed). */
export function configCord(config: CustomConfig): CordOption {
  if (config.type === 'collar') return COLLAR_CORD;
  return findCord(config.cordId) ?? CORDS[0];
}

export function customProductId(config: CustomConfig): string {
  const cord = config.type === 'collar' ? COLLAR_CORD.id : config.cordId ?? '';
  return `custom-${config.type}-${config.mariaId}.${config.jesusId}-${cord}`;
}

export function customTitle(
  config: CustomConfig,
  /** Resolve a bead id to its name — defaults to the static palette, but the
   *  orders API passes a resolver backed by the admin-managed colors. */
  resolveBead: (id: string) => { name?: string } | undefined = findBead
): string {
  const maria = resolveBead(config.mariaId)?.name ?? '';
  const jesus = resolveBead(config.jesusId)?.name ?? '';
  const noun = config.type === 'collar' ? 'Collar Personalizado' : 'Pulsera Personalizada';
  const pepas = `Pepas María ${maria} · Jesús ${jesus}`;
  if (config.type === 'collar') return `${noun} — ${pepas}`;
  const cord = configCord(config);
  return `${noun} — ${pepas} · Cordón ${cord.name}`;
}

/** Tiny inline SVG thumbnail for the cart (María + Jesús pepas on sky blue). */
export function customCartImage(
  mariaHex: string,
  jesusHex: string,
  cordHex: string
): string {
  const maria = [
    [40, 10], [61, 19], [70, 40], [61, 61], [19, 61], [10, 40], [19, 19],
  ]
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="${mariaHex}"/>`)
    .join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><rect width="80" height="80" fill="#E0F2FE"/><circle cx="40" cy="40" r="30" fill="none" stroke="${cordHex}" stroke-width="3"/>${maria}<circle cx="40" cy="40" r="8.5" fill="${jesusHex}"/><rect x="37" y="56" width="6" height="20" rx="2" fill="${GOLD}"/><rect x="30" y="61" width="20" height="6" rx="2" fill="${GOLD}"/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
