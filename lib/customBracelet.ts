/**
 * "Crea tu pulsera / collar" — shared option catalog.
 * Imported by the configurator UI AND the orders API, so prices and
 * options are always validated server-side from this single source.
 */

/** The two devotional pepa families — tracked separately in inventory. */
export type PepaKind = 'maria' | 'jesus';

/** The product lines the customer can design. */
export type ProductType = 'pulsera' | 'collar' | 'nombres' | 'colombia';

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

/** Devotional medal (dije) for the collar centerpiece. */
export interface DijeOption {
  id: string;
  name: string;
}

/** A metallic finish for the seed beads of the "Collar de Nombres". */
export interface MetalOption {
  id: string;
  name: string;
  hex: string;
}

// ───────────────────────── Collar de Nombres ─────────────────────────

/** Hand-knotted name necklace: 1–5 names, up to 10 letters each. */
export const MIN_NAMES = 1;
export const MAX_NAMES = 5;
export const MAX_NAME_LEN = 10;

/** Flat price — same regardless of how many names. COP, validated server-side. */
export const NOMBRES_BASE_PRICE = 35000;

/** Metallic seed-bead finishes for the name necklace (not from pepa stock). */
export const METALS: MetalOption[] = [
  { id: 'plata', name: 'Plata', hex: '#C2C7CF' },
  { id: 'oro', name: 'Oro', hex: '#D9BC6B' },
];
export const DEFAULT_METAL_ID = METALS[0].id;

// ───────────────────────── Pulsera Colombia (edición limitada) ─────────────────────────

/**
 * Limited-edition tricolor bracelet — the Colombian flag (amarillo · azul ·
 * rojo) replaces the devotional pepas. The only choice the customer makes is
 * the color of the little separator pepitas between each flag color (white or
 * black); the piece still ends in the same Virgen Milagrosa + crucifijo as the
 * regular pulsera. On sale only through the 2026 World Cup.
 */
export const COLOMBIA_PRICE = 20000;

/** Marketing tag shown on the limited-edition tiles/badges. */
export const COLOMBIA_EDITION = 'Edición limitada · Mundial 2026';

/** The three flag colors, in flag order (fixed — not customer-selectable). */
export const COLOMBIA_FLAG: BeadOption[] = [
  { id: 'amarillo', name: 'Amarillo', hex: '#FCD116' },
  { id: 'azul', name: 'Azul', hex: '#00338D' },
  { id: 'rojo', name: 'Rojo', hex: '#CE1126' },
];

/** Separator pepita the customer picks — sits between each flag color. */
export const SEPARATORS: BeadOption[] = [
  { id: 'blanco', name: 'Blanco', hex: '#F7F8F8', light: true },
  { id: 'negro', name: 'Negro', hex: '#1A1A1A' },
];
export const DEFAULT_SEPARATOR_ID = SEPARATORS[0].id;

export function findSeparator(id: string | undefined): BeadOption {
  return SEPARATORS.find((s) => s.id === id) ?? SEPARATORS[0];
}

/** The two bead arrangements the customer can choose for the flag. */
export interface PatternOption {
  id: string;
  name: string;
  /** Short human description for the picker. */
  detail: string;
}
export const COLOMBIA_PATTERNS: PatternOption[] = [
  { id: 'bloques', name: 'Bloques', detail: '10 amarillo · 10 azul · 10 rojo (simétrico)' },
  { id: 'repetido', name: 'Tricolor repetido', detail: '4 amarillo · 3 azul · 3 rojo, repetido 5 veces' },
];
export const DEFAULT_PATTERN_ID = COLOMBIA_PATTERNS[0].id;

export function findPattern(id: string | undefined): PatternOption {
  return COLOMBIA_PATTERNS.find((p) => p.id === id) ?? COLOMBIA_PATTERNS[0];
}

/** Fixed price per product line — COP, validated server-side. */
export const CUSTOM_PRICES: Record<ProductType, number> = {
  pulsera: 22000,
  collar: 35000,
  nombres: NOMBRES_BASE_PRICE,
  colombia: COLOMBIA_PRICE,
};

/** Back-compat alias (the pulsera price). */
export const CUSTOM_PRICE = CUSTOM_PRICES.pulsera;

export const PRODUCT_LABELS: Record<ProductType, string> = {
  pulsera: 'Pulsera',
  collar: 'Collar',
  nombres: 'Collar de Nombres',
  colombia: 'Pulsera Colombia',
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

/** Centerpiece medals the customer can choose for the collar. */
export const DIJES: DijeOption[] = [
  { id: 'guadalupe', name: 'Virgen de Guadalupe' },
  { id: 'milagrosa', name: 'Virgen Milagrosa' },
  { id: 'san-benito', name: 'San Benito de Nursia' },
];

/** Default centerpiece when a collar config omits one (legacy carts). */
export const DEFAULT_DIJE_ID = DIJES[0].id;

export const GOLD = '#D4AF37';
export const GOLD_LIGHT = '#E8CD6F';
export const GOLD_DEEP = '#A8862A';

export interface CustomConfig {
  /** Which line the customer is designing */
  type: ProductType;
  /** Color of the small "Ave María" pepas */
  mariaId: string;
  /** Color of the larger "Padre Nuestro" intersection pepas */
  jesusId: string;
  /** Cord color — only meaningful for the pulsera */
  cordId?: string;
  /** Centerpiece medal — only meaningful for the collar */
  dijeId?: string;
  /** Personalized names — only meaningful for the "Collar de Nombres" */
  names?: string[];
  /** Seed-bead metal finish — only meaningful for the "Collar de Nombres" */
  metalId?: string;
  /** Separator pepita color — only meaningful for the "Pulsera Colombia" */
  separatorId?: string;
  /** Bead arrangement — only meaningful for the "Pulsera Colombia" */
  patternId?: string;
}

export function findMetal(id: string | undefined): MetalOption {
  return METALS.find((m) => m.id === id) ?? METALS[0];
}

/** Uppercase a single name, keep only letters, cap at MAX_NAME_LEN. */
export function sanitizeName(raw: string): string {
  return (raw ?? '')
    .toUpperCase()
    .replace(/[^A-ZÁÉÍÓÚÜÑ]/g, '')
    .slice(0, MAX_NAME_LEN);
}

/** Clean a list of names: trim each to letters, drop empties, cap at MAX_NAMES. */
export function sanitizeNames(names: unknown): string[] {
  const list = Array.isArray(names) ? names : [];
  return list
    .map((n) => sanitizeName(String(n ?? '')))
    .filter((n) => n.length > 0)
    .slice(0, MAX_NAMES);
}

/** Price of a name necklace — flat, regardless of how many names. */
export function nombresPrice(_names?: unknown): number {
  return NOMBRES_BASE_PRICE;
}

/** Resolve the COP price for any custom config (server-validated). */
export function configPrice(config: CustomConfig): number {
  if (config.type === 'nombres') return nombresPrice(config.names);
  return CUSTOM_PRICES[config.type];
}

export function findBead(id: string): BeadOption | undefined {
  return BEADS.find((b) => b.id === id);
}
export function findCord(id: string | undefined): CordOption | undefined {
  if (!id) return undefined;
  if (id === COLLAR_CORD.id) return COLLAR_CORD;
  return CORDS.find((c) => c.id === id);
}
export function findDije(id: string | undefined): DijeOption | undefined {
  if (!id) return undefined;
  return DIJES.find((d) => d.id === id);
}

/** Resolve the cord a config should render with (collar is always fixed). */
export function configCord(config: CustomConfig): CordOption {
  if (config.type === 'collar') return COLLAR_CORD;
  return findCord(config.cordId) ?? CORDS[0];
}

/** Resolve the centerpiece medal a collar config should render with. */
export function configDije(config: CustomConfig): DijeOption {
  return findDije(config.dijeId) ?? DIJES[0];
}

export function customProductId(config: CustomConfig): string {
  if (config.type === 'colombia') {
    return `custom-colombia-${findPattern(config.patternId).id}-${findSeparator(config.separatorId).id}-${config.cordId ?? CORDS[0].id}`;
  }
  if (config.type === 'nombres') {
    const names = sanitizeNames(config.names).join('-').toLowerCase() || 'sin-nombre';
    return `custom-nombres-${names}-${config.mariaId}.${config.jesusId}-${findMetal(config.metalId).id}`;
  }
  if (config.type === 'collar') {
    return `custom-collar-${config.mariaId}.${config.jesusId}-${configDije(config).id}`;
  }
  const cord = config.cordId ?? '';
  return `custom-${config.type}-${config.mariaId}.${config.jesusId}-${cord}`;
}

export function customTitle(
  config: CustomConfig,
  /** Resolve a bead id to its name — defaults to the static palette, but the
   *  orders API passes a resolver backed by the admin-managed colors. */
  resolveBead: (id: string) => { name?: string } | undefined = findBead
): string {
  if (config.type === 'colombia') {
    const sep = findSeparator(config.separatorId);
    const cord = configCord(config);
    const pattern = findPattern(config.patternId);
    return `Pulsera Colombia — Bandera tricolor (${pattern.name}) · Pepitas separadoras en ${sep.name.toLowerCase()} · Cordón ${cord.name} · ${COLOMBIA_EDITION}`;
  }
  const maria = resolveBead(config.mariaId)?.name ?? '';
  const jesus = resolveBead(config.jesusId)?.name ?? '';
  if (config.type === 'nombres') {
    const names = sanitizeNames(config.names);
    const titled = names.map((n) => n.charAt(0) + n.slice(1).toLowerCase());
    const list = titled.join(' · ') || 'Tu nombre';
    return `Collar de Nombres — ${list} · Pepas ${maria} y ${jesus} · ${findMetal(config.metalId).name}`;
  }
  const noun = config.type === 'collar' ? 'Collar Personalizado' : 'Pulsera Personalizada';
  const pepas = `Pepas Ave María ${maria} · Padre Nuestro ${jesus}`;
  if (config.type === 'collar') return `${noun} — ${pepas} · Medallas crucero ${configDije(config).name}`;
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

/** Tiny inline SVG thumbnail for a name necklace (elliptical loop of beads). */
export function nombresCartImage(
  mariaHex: string,
  jesusHex: string,
  metalHex: string
): string {
  // Vertical ellipse loop with five beads across the bottom:
  // letter · accent · letter · accent · letter
  const cx = 40;
  const cy = 38;
  const rx = 24;
  const ry = 30;
  const seq = ['L', 'a', 'L', 'b', 'L'];
  const beads = seq
    .map((t, i) => {
      const deg = 140 - (i * 100) / (seq.length - 1); // 140° → 40° (through bottom)
      const rad = (deg * Math.PI) / 180;
      const x = cx + rx * Math.cos(rad);
      const y = cy + ry * Math.sin(rad);
      if (t === 'L')
        return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5.5" fill="#F7F3E8" stroke="rgba(0,0,0,.18)" stroke-width=".8"/>`;
      const fill = t === 'a' ? mariaHex : jesusHex;
      return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4.5" fill="${fill}"/>`;
    })
    .join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><rect width="80" height="80" fill="#E0F2FE"/><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="${metalHex}" stroke-width="1.6"/>${beads}<ellipse cx="${cx}" cy="${cy - ry}" rx="3.4" ry="4.4" fill="${metalHex}" stroke="${GOLD_DEEP}" stroke-width=".6"/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/** Tiny inline SVG thumbnail for the "Pulsera Colombia" (tricolor flag loop). */
export function colombiaCartImage(separatorHex: string, cordHex: string): string {
  const cx = 40;
  const cy = 36;
  const r = 27;
  const [Y, B, R] = COLOMBIA_FLAG.map((c) => c.hex);
  // Symmetric tricolor: amarillo·azul·rojo · rojo·azul·amarillo, separators between.
  const block = (hex: string) => [hex, hex];
  const seq = [
    separatorHex,
    ...block(Y), separatorHex, ...block(B), separatorHex, ...block(R),
    ...block(R), separatorHex, ...block(B), separatorHex, ...block(Y),
    separatorHex,
  ];
  const beads = seq
    .map((hex, i) => {
      const deg = (i / seq.length) * 360 - 90;
      const rad = (deg * Math.PI) / 180;
      const x = cx + r * Math.cos(rad);
      const y = cy + r * Math.sin(rad);
      const isSep = hex === separatorHex;
      const rim = isSep ? ' stroke="rgba(0,0,0,.18)" stroke-width=".7"' : '';
      return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${isSep ? 2.8 : 3.8}" fill="${hex}"${rim}/>`;
    })
    .join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><rect width="80" height="80" fill="#E0F2FE"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${cordHex}" stroke-width="2.4"/>${beads}<rect x="37" y="${cy + r - 1}" width="6" height="18" rx="2" fill="${GOLD}"/><rect x="30" y="${cy + r + 4}" width="20" height="6" rx="2" fill="${GOLD}"/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
