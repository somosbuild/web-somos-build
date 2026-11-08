# Build — sitio web (Fases 1–3)

Implementación en producción de `project/ui_kits/website/` (handoff de Claude Design).
Next.js 16 (App Router, TypeScript) con export estático: el build genera HTML plano en `out/`, que se puede hospedar en cualquier lado (Netlify, Vercel, Cloudflare Pages, GitHub Pages, S3).

## Estado actual de `main`

`main` publica la **landing previa a la apertura** (`/`) y la página del **camp de vacaciones** (`/camp/`). El sitio completo (Fases 1–3, rutas de abajo) vive en la rama `sitio-completo`.

### Camp

- **Contenido:** todo sale de `src/content/camp-data.json` (fuente única del handoff de Claude Design). Para cambiar textos, fechas, precios, grupos o FAQ, editar ese archivo; no hace falta tocar componentes.
- **Pendientes:** cualquier campo con `"pendiente": true` o con texto entre corchetes (`"[POR CONFIRMAR]"`) **no se muestra** en el sitio. Al completarlo en el JSON, aparece solo.
- **Inscripciones:** antes de `inscripciones.abren` (2 de noviembre 2026) el botón dice "Registrarme" y abre el formulario. Desde esa fecha dice "Reservá tu cupo" y va al link de pago (`inscripciones.link`); mientras ese link esté pendiente, va a WhatsApp. El cambio ocurre solo, en el navegador; no hace falta volver a publicar. Para previsualizar: `/camp/?simular=despues` o `?simular=antes`.
- **Formulario:** Netlify Forms, formulario `camp-interes` (declarado en `public/__forms.html`, igual que `registro` de la landing).
- **Pago con ONVO:** con inscripciones abiertas, plan elegido y 1 o 2 niños, el botón del formulario dice "Pagar ₡X con ONVO". Primero guarda el registro en Netlify Forms (campo `pago`) y después llama a `/api/onvo-checkout` (`netlify/functions/onvo-checkout.mts`), que recalcula el monto en el servidor, crea un link de pago de ONVO (`POST /v1/checkout/sessions/one-time-link`) y redirige. Al pagar, ONVO vuelve a `/camp/?pago=ok` y se muestra un mensaje. Con 3 o más niños no hay pago en línea: Build da seguimiento.
  - **Reservar sin pagar:** debajo del total hay un enlace "Reservar sin pagar". Guarda el registro con `pago` = "Pago pendiente (24 h): ₡X. Enviar link de ONVO por WhatsApp" y no llama a ONVO. Build crea el link en el panel de ONVO y lo manda por WhatsApp; si no se paga en 24 h, el cupo se libera. El plazo es `RESERVA_HORAS` en `CampPage.tsx`.
  - **Planes y precios:** `src/lib/camp-pago.ts`, que lee `precios` de `camp-data.json` (1 semana = `precios.semana`; Diciembre, Enero y Temporada = `paquetes`). Total = precio del plan × niños.
  - **Llave:** variable de entorno `ONVO_SECRET_KEY` en Netlify (Site configuration > Environment variables). Nunca en el repo. Con `onvo_test_secret_key_...` los pagos son de prueba; para cobrar de verdad, cambiarla por `onvo_live_secret_key_...` y volver a publicar.
  - **Montos:** se envían en céntimos (`CENTIMOS = 100` en la función), confirmado con un checkout de prueba.
- **Página `/camp`:** hero, qué es, grupos, manifiesto con el día tipo, precios (con la franja Walk-in), preguntas frecuentes (las de temas y qué llevar se arman solas desde `semanas` y `que_llevar`), aliados y cierre.
- **En la landing:** barra de anuncio arriba del header, bloque destacado debajo del hero y aviso flotante (a los 8 s o al 50 % del scroll, una vez por visita). Todo en `src/components/camp/CampPromo.tsx`; la landing no tiene otros cambios.
- **Foto:** `public/fotos/camp-ciudad-carton.webp` (y versión 640 px), usada en el hero de `/camp` y en el bloque de la landing.

## Uso

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # genera out/
npm run lint    # typecheck
```

Si se hospeda bajo un sub-path (p. ej. GitHub Pages `/build`), construir con `NEXT_PUBLIC_BASE_PATH=/build npm run build`.

## Rutas

| Ruta | Contenido |
|---|---|
| `/` | Home: hero, esta semana, pilares, espacio, membresía, testimonios, cumpleaños |
| `/agenda/` | Agenda con filtros (día, etapa, pilar), vista tarjetas/semana, sheet de filtros en móvil. `?pillar=joy` · `?view=week` · `?sheet=1` |
| `/actividades/` | Catálogo por pilar con pestañas fijas. `?pillar=joy` baja a ese pilar |
| `/actividades/<id>/` | Página de actividad (una por actividad, generada en el build): qué es, facilitador, cómo es una sesión, fechas, FAQ, relacionadas |
| `/membresia/` | Planes, tabla comparativa, políticas |
| `/cumpleanos/` | Paquetes, cómo funciona, galería, formulario de cotización |
| `/nosotros/` | Quiénes somos, método, espacio, seguridad, facilitadores, familias, cómo llegar. Anclas: `#quienes` `#metodo` `#espacio` `#seguridad` `#facilitadores` `#familias` `#llegar` |

El detalle de actividad (panel lateral en desktop, bottom sheet en móvil), el diálogo de reserva y el toast son globales (`SiteProvider`). **Reserva, elección de plan y cotización de cumpleaños son simuladas**: no hay backend y confirman con un toast.

## Estructura

```
src/
  app/                 rutas, layout, fuentes (next/font/local), tokens globales
  components/ds/       primitivos del Build Design System portados a TSX + CSS Modules
  components/site/     header, footer, barra móvil, EventCard, DayStrip, Carousel, overlays
  components/home/     secciones del Home
  components/agenda/   pantalla de Agenda
  components/activities/ catálogo y página de actividad
  components/membership/, birthdays/, about/   Membresía, Cumpleaños, Nosotros
  lib/data.ts          contenido de ejemplo (actividades, pilares, zonas, testimonios, contacto)
public/brand/          logo, iconos UI, shapes y patrón (PNG usados como máscaras CSS)
```

## Decisiones respecto del prototipo

- **Responsive con CSS, no con JS.** El prototipo usa `useIsMobile()` (matchMedia) y cambia estilos inline. Aquí todo es media query a 767px, así el HTML pre-renderizado no salta al hidratar. Valores (tamaños, paddings, radios, sombras) copiados tal cual.
- **Hover/press en CSS** (`:hover` dentro de `@media (hover: hover)` y `:active`), en vez de estado React.
- **Fotos:** `<ImageSlot>` reemplaza al `<image-slot>` del prototipo. Muestra el placeholder hasta recibir `src`.
- **Fuentes:** solo los pesos que se usan (Recoleta 400/700, Gilroy 400–700, Lilita One), subseteadas a Latin y en woff2 (~150 KB en total, contra ~1.2 MB de los originales). Comando: `pyftsubset <font> --unicodes="U+0000-00FF,U+0131,U+0152-0153,U+2013-2014,U+2018-201E,U+2022,U+2026,U+20A1,U+2190-2193,U+2212" --flavor=woff2 --layout-features='*'`.
- **Accesibilidad añadida:** Escape cierra los overlays, `aria-current` en la navegación, `aria-pressed` en los chips, foco visible en los controles.
- URLs reales en vez de `?screen=`: `/actividades/sandbox/`, `/nosotros/#llegar` (compartibles e indexables).
- Las anclas usan `scroll-margin-top` en lugar de calcular offsets en JS.

## Pendiente del cliente

Precios (`₡[x]`) de actividades, planes y paquetes; horario, local y parqueo; teléfono, correo y links de WhatsApp/Instagram/Waze/Maps (`CONTACT` y `LOCATION` en `lib/data.ts`); historia de los fundadores; fotos, testimonios y facilitadores reales. **Revisar la licencia de Gilroy** (Fontspring EULA en `project/assets/fonts/gilroy/License.txt`): el uso como webfont depende de la licencia comprada.
