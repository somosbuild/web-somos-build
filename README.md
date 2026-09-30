# Build — sitio web (Fase 1)

Implementación en producción de `project/ui_kits/website/` (handoff de Claude Design).
Next.js 16 (App Router, TypeScript) con export estático: el build genera HTML plano en `out/`, que se puede hospedar en cualquier lado (Netlify, Vercel, Cloudflare Pages, GitHub Pages, S3).

## Uso

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # genera out/
npm run lint    # typecheck
```

Si se hospeda bajo un sub-path (p. ej. GitHub Pages `/build`), construir con `NEXT_PUBLIC_BASE_PATH=/build npm run build`.

## Rutas

| Ruta | Estado |
|---|---|
| `/` | Home: hero, esta semana, pilares, espacio, membresía, testimonios, cumpleaños |
| `/agenda/` | Agenda con filtros (día, etapa, pilar), vista tarjetas/semana, sheet de filtros en móvil |
| `/agenda/?pillar=joy` · `?view=week` · `?sheet=1` | Mismos estados por URL que el prototipo |
| `/actividades/`, `/membresia/`, `/cumpleanos/` | Placeholder Fase 2 |
| `/nosotros/` | Placeholder Fase 3 |

El detalle de actividad (panel lateral en desktop, bottom sheet en móvil), el diálogo de reserva y el toast son globales (`SiteProvider`). **La reserva es simulada**: no hay backend y confirma con un toast.

## Estructura

```
src/
  app/                 rutas, layout, fuentes (next/font/local), tokens globales
  components/ds/       primitivos del Build Design System portados a TSX + CSS Modules
  components/site/     header, footer, barra móvil, EventCard, DayStrip, Carousel, overlays
  components/home/     secciones del Home
  components/agenda/   pantalla de Agenda
  lib/data.ts          contenido de ejemplo (actividades, pilares, zonas, testimonios, contacto)
public/brand/          logo, iconos UI, shapes y patrón (PNG usados como máscaras CSS)
```

## Decisiones respecto del prototipo

- **Responsive con CSS, no con JS.** El prototipo usa `useIsMobile()` (matchMedia) y cambia estilos inline. Aquí todo es media query a 767px, así el HTML pre-renderizado no salta al hidratar. Valores (tamaños, paddings, radios, sombras) copiados tal cual.
- **Hover/press en CSS** (`:hover` dentro de `@media (hover: hover)` y `:active`), en vez de estado React.
- **Fotos:** `<ImageSlot>` reemplaza al `<image-slot>` del prototipo. Muestra el placeholder hasta recibir `src`.
- **Fuentes:** solo los pesos que se usan (Recoleta 400/700, Gilroy 400–700, Lilita One), subseteadas a Latin y en woff2 (~150 KB en total, contra ~1.2 MB de los originales). Comando: `pyftsubset <font> --unicodes="U+0000-00FF,U+0131,U+0152-0153,U+2013-2014,U+2018-201E,U+2022,U+2026,U+20A1,U+2190-2193,U+2212" --flavor=woff2 --layout-features='*'`.
- **Accesibilidad añadida:** Escape cierra los overlays, `aria-current` en la navegación, `aria-pressed` en los chips, foco visible en los controles.
- Corregido un desborde del grid de testimonios del prototipo (las tarjetas salían del contenedor).

## Pendiente del cliente

Precios (`₡[x]`), horario, links de WhatsApp/Instagram/correo (`CONTACT` en `lib/data.ts`), fotos reales, testimonios y facilitadores reales. **Revisar la licencia de Gilroy** (Fontspring EULA en `project/assets/fonts/gilroy/License.txt`): el uso como webfont depende de la licencia comprada.
