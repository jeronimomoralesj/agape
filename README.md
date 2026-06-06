# Ágape ✨

> **Amar como Dios nos ama** — *"Él sana a los de corazón herido y venda sus heridas" (Salmo 147:3)*

E-commerce de lujo para pulseras de cristal y oro inspiradas en los Misterios del Santo Rosario.

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** — sistema de diseño "Divine Elegance" (cielo, azul royal, oro #D4AF37)
- **Framer Motion** — transiciones de página, scroll reveals, micro-interacciones
- **MongoDB Atlas** vía Mongoose
- **Lucide React** — iconografía
- Listo para **Vercel**

## Empezar

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env.local
#    → edita .env.local con tu MONGODB_URI, ADMIN_PASSWORD y ADMIN_SESSION_SECRET

# 3. (Opcional) Sembrar productos de ejemplo
npm run seed

# 4. Levantar el servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Variables de entorno

| Variable | Descripción |
| --- | --- |
| `MONGODB_URI` | Cadena de conexión de MongoDB Atlas (incluye el nombre de la base, p. ej. `/agape`) |
| `ADMIN_PASSWORD` | Contraseña para entrar a `/admin` |
| `ADMIN_SESSION_SECRET` | Cadena aleatoria larga para firmar la cookie de sesión del admin |

Agrega las tres en **Vercel → Project → Settings → Environment Variables** antes de desplegar.

## Estructura

```
app/
  page.tsx               → Homepage (Hero, Misterio del Día, Guía del Rosario)
  tienda/                → Tienda con filtros por colección
  producto/[id]/         → Detalle de producto (galería + significado + materiales)
  checkout/              → Creación de pedido (sin pasarela de pago)
  admin/                 → Dashboard protegido (analytics + CRUD + pedidos)
  api/products/          → GET público · POST/PUT/DELETE protegidos
  api/orders/            → POST público (checkout) · GET/PATCH protegidos
components/              → UI organizada por dominio (home, shop, cart, admin, layout, motion)
lib/                     → db.ts (conexión cacheada), mysteries.ts, products.ts, adminAuth.ts
models/                  → Esquemas de Mongoose (Product, Order)
public/brand/            → Activos de marca (logo, pulseras, guía del rosario, misterios)
```

## Panel de administración

1. Ve a `/admin` → te redirige a `/admin/login`
2. Ingresa tu `ADMIN_PASSWORD`
3. Gestiona productos (crear/editar/eliminar/ocultar), revisa pedidos y métricas

La sesión dura 8 horas (cookie HMAC firmada, httpOnly).

## Misterio del Día

La sección de la homepage rota automáticamente según el día:

| Día | Misterios |
| --- | --- |
| Lunes y Sábado | Gozosos |
| Martes y Viernes | Dolorosos |
| Miércoles y Domingo | Gloriosos |
| Jueves | Luminosos |

La fuente de datos vive en `lib/mysteries.ts`.
