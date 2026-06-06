# Estrategia SEO de Ágape 🇨🇴

Objetivo: posicionar a Ágape como **#1 en Colombia** para pulseras católicas / religiosas de cristal y oro, y escalar luego a cadenas y más categorías.

---

## 1. Qué ya hace el código (automático)

| Pieza | URL | Para qué |
| --- | --- | --- |
| Sitemap dinámico | `/sitemap.xml` | Google/Bing descubren cada producto y entrada del blog (se regenera cada hora) |
| Robots | `/robots.txt` | Permite todo lo público, bloquea `/admin`, `/checkout` y APIs privadas |
| **Feed Google Shopping** | `/feed/google-shopping.xml` | RSS 2.0 con `g:` namespace: precio en COP, `sale_price` cuando hay descuento, stock, marca, categoría Google 191 (Bracelets), hasta 4 imágenes |
| Imágenes públicas | `/api/products/{id}/image/{n}` | Sirve las imágenes base64 como JPEG real para que Google Shopping y las redes las puedan leer |
| IndexNow | `/indexnow.txt` + ping automático | Cada vez que creas/editas/borras un producto o post, se notifica al instante a **Bing, DuckDuckGo, Yahoo y Yandex** |
| JSON-LD | en cada página | `Organization`, `WebSite`+SearchAction, `Product`+`Offer` (precio, stock, COP), `BreadcrumbList`, `ItemList` (home), `BlogPosting` |
| Metadatos | en cada página | Canónicas, Open Graph `es_CO`, Twitter Cards, `geo.region=CO`, keywords de alta intención en Colombia |

> Todo depende de `NEXT_PUBLIC_SITE_URL`. Configúrala en Vercel **antes** de registrar nada.

## 2. Checklist de lanzamiento (hazlo una vez, ~1 hora)

### Google
1. **Search Console** → https://search.google.com/search-console → agrega la propiedad del dominio. Copia el token de verificación a `GOOGLE_SITE_VERIFICATION` en Vercel y redespliega (o verifica por DNS).
2. En Search Console: **Sitemaps → enviar `https://tudominio/sitemap.xml`**.
3. **Merchant Center** → https://merchants.google.com → crea la cuenta con país **Colombia**, moneda **COP**.
   - Verifica y reclama el sitio (usa el mismo token de Search Console).
   - **Productos → Feeds → Agregar feed → Recuperación programada** → URL: `https://tudominio/feed/google-shopping.xml`, frecuencia diaria.
   - Configura envío (tarifa por Colombia) y datos del negocio. Con eso entras gratis a la pestaña **Shopping** ("listados gratuitos"); con presupuesto puedes activar campañas Performance Max.
4. **Google Business Profile** (https://business.google.com): crea el perfil "Ágape" aunque no tengas tienda física (área de servicio: Colombia). Da señal local fortísima.

### Bing / DuckDuckGo / Yahoo
5. **Bing Webmaster Tools** → https://www.bing.com/webmasters → importa directamente desde Search Console (1 clic) o verifica con `BING_SITE_VERIFICATION`. Envía el mismo `sitemap.xml`. **Bing alimenta DuckDuckGo y Yahoo**, así que esto cubre los tres.
6. **IndexNow**: genera la llave `openssl rand -hex 16`, ponla en `INDEXNOW_KEY` en Vercel, redespliega. Verifica que `https://tudominio/indexnow.txt` muestre la llave. Desde ese momento cada cambio en admin se indexa en minutos.
7. (Opcional) **Microsoft Merchant Center** acepta el mismo feed XML para Bing Shopping.

## 3. Estrategia de contenido para dominar "pulseras católicas Colombia"

El blog ya existe — úsalo. Cada entrada es una página indexable que ataca una búsqueda:

- "Cómo rezar el rosario paso a paso" (ya tienes la guía interactiva — escribe la versión artículo)
- "Significado de los misterios gozosos/dolorosos/gloriosos/luminosos"
- "Regalos para primera comunión en Colombia"
- "Pulsera denario: qué es y cómo se usa"
- "Diferencia entre denario, rosario y decenario"

Reglas: 1 entrada/semana, mínimo 600 palabras, una keyword por entrada en el título, foto propia (sube portada en el admin), enlaza siempre 1–2 productos dentro del texto.

**Nombres de producto**: incluye material + tipo en el título del producto en el admin, p. ej. "Pulsera Denario de Cristal Celeste y Oro 18k" — ese título es el `<title>`, el H1, el JSON-LD y el feed de Shopping.

## 4. Señales que no son código (las más importantes)

1. **Dominio propio** `.com.co` o `.com` — los subdominios `vercel.app` no posicionan.
2. **Backlinks colombianos**: directorios de emprendimiento (Fenalco, cámaras de comercio, marketplaces tipo Mercado Libre con link al sitio), prensa católica local, parroquias con página web, influencers católicos en Instagram (el link en bio cuenta).
3. **Reseñas**: cuando tengas ventas, pide reseñas en Google Business Profile — es el factor #1 del paquete local.
4. **Instagram/TikTok activos** enlazando al dominio (señal de marca + tráfico directo).
5. **Velocidad**: ya está optimizada (Next/Image, fuentes con `display:swap`), revisa https://pagespeed.web.dev tras el deploy.

## 5. Escalar a cadenas y nuevas categorías (futuro)

Cuando agregues cadenas: el feed, sitemap y JSON-LD las incluyen automáticamente. Solo ajusta en `lib/seo.ts`:
- agrega keywords ("cadenas católicas", "cadena con cruz oro"),
- y en el feed cambia `google_product_category` según el tipo (191 = Bracelets, 196 = Necklaces) — hoy está fijo en 191.

## 6. Variables de entorno SEO (Vercel)

```
NEXT_PUBLIC_SITE_URL = "https://www.agape.com.co"   ← obligatoria
INDEXNOW_KEY         = "<openssl rand -hex 16>"
GOOGLE_SITE_VERIFICATION = "<token de Search Console>"   (opcional si verificas por DNS)
BING_SITE_VERIFICATION   = "<token de Bing Webmaster>"    (opcional si importas de GSC)
```
