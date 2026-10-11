// Sample content from the Fase 1 prototype (project/ui_kits/website/data.js).
// Placeholders pending from the client are marked with [x] / [horario].

export type PillarKey = 'community' | 'skills' | 'joy' | 'family';
export type BrandColor = 'orange' | 'yellow' | 'olive' | 'celeste';
export type DayKey = 'lun' | 'mar' | 'mie' | 'jue' | 'vie' | 'sab' | 'dom';

export interface Pillar {
  k: PillarKey;
  name: string;
  color: BrandColor;
  shape: string;
  tag: string;
  text: string;
  examples: string[];
}

export interface Day {
  k: DayKey;
  short: string;
  name: string;
  date: number;
  month: 'sep' | 'oct';
}

export interface BuildEvent {
  id: string;
  day: DayKey;
  time: string;
  title: string;
  pillar: PillarKey;
  stage: string;
  dur: string;
  price: string;
  fac: string;
  spots: number;
  desc: string;
  bring: string[];
}

export interface Testimonial { id: string; quote: string; name: string; stage: string }
export interface Zone { k: string; icon: string; name: string; text: string; color: BrandColor }

export const PILLARS: Pillar[] = [
  { k: 'community', name: 'Community', color: 'orange', shape: '04', tag: 'BUILDING COMMUNITY TOGETHER', text: 'Papás que se acompañan en cada etapa', examples: ['Círculo de embarazo', 'Grupo posparto', 'Café de papás', 'Charlas de crianza'] },
  { k: 'skills', name: 'Skills', color: 'yellow', shape: '03', tag: 'BUILDING SKILLS TOGETHER', text: 'Aprender y crecer con confianza, papás y peques', examples: ['Primeros auxilios pediátricos', 'Estimulación temprana', 'Little Builders (3-5)'] },
  { k: 'joy', name: 'Joy', color: 'olive', shape: '01', tag: 'BUILDING JOY TOGETHER', text: 'Juego libre, música y movimiento', examples: ['Juego sensorial', 'Sandbox', 'Música en familia'] },
  { k: 'family', name: 'Family', color: 'celeste', shape: '02', tag: 'BUILDING FAMILY TOGETHER', text: 'Tiempo de calidad para toda la familia', examples: ['Masaje para bebés', 'Family Build Time', 'Brunch y celebraciones'] },
];

export const DAYS: Day[] = [
  { k: 'lun', short: 'Lun', name: 'Lunes', date: 28, month: 'sep' },
  { k: 'mar', short: 'Mar', name: 'Martes', date: 29, month: 'sep' },
  { k: 'mie', short: 'Mié', name: 'Miércoles', date: 30, month: 'sep' },
  { k: 'jue', short: 'Jue', name: 'Jueves', date: 1, month: 'oct' },
  { k: 'vie', short: 'Vie', name: 'Viernes', date: 2, month: 'oct' },
  { k: 'sab', short: 'Sáb', name: 'Sábado', date: 3, month: 'oct' },
  { k: 'dom', short: 'Dom', name: 'Domingo', date: 4, month: 'oct' },
];

export const WEEK_LABEL = '28 sep – 4 oct';

export const STAGES = ['Todos', 'Embarazo', '0-12 meses', '1-3 años', '3-5 años', 'Papás', 'Familia'];

export const MEMBER = 'Incluida en membresía';
const M = MEMBER;

export const EVENTS: BuildEvent[] = [
  { id: 'estimulacion', day: 'lun', time: '9:00', title: 'Estimulación temprana', pillar: 'skills', stage: '0-12 meses', dur: '45 min', price: M, fac: 'Ana M.', spots: 5, desc: 'Juegos y ejercicios guiados para acompañar el desarrollo motor y sensorial de tu bebé.', bring: ['Mantita', 'Pañalera', 'Ropa cómoda para vos y el bebé'] },
  { id: 'sandbox', day: 'lun', time: '10:30', title: 'Sandbox libre', pillar: 'joy', stage: '1-3 años', dur: '60 min', price: '₡[x]', fac: 'Equipo Build', spots: 7, desc: 'Juego libre en el sandbox con materiales por edad. Vos jugás, explorás y acompañás.', bring: ['Ropa que se pueda ensuciar', 'Botella de agua'] },
  { id: 'posparto', day: 'mar', time: '10:00', title: 'Grupo posparto', pillar: 'community', stage: 'Papás', dur: '60 min', price: M, fac: 'Laura V.', spots: 6, desc: 'Un círculo para hablar de lo que se vive después del parto, con otras familias en la misma etapa.', bring: ['Tu bebé es bienvenido', 'Algo para tomar notas'] },
  { id: 'circulo-embarazo', day: 'mar', time: '18:30', title: 'Círculo de embarazo', pillar: 'community', stage: 'Embarazo', dur: '90 min', price: '₡[x]', fac: 'Laura V.', spots: 4, desc: 'Encuentro para futuras mamás, papás y acompañantes: preguntas, experiencias y preparación para la llegada del bebé.', bring: ['Cojín si lo preferís', 'Tu acompañante'] },
  { id: 'little-builders', day: 'mie', time: '15:30', title: 'Little Builders', pillar: 'skills', stage: '3-5 años', dur: '60 min', price: '₡[x]', fac: 'Diego R.', spots: 3, desc: 'Construcción, retos y proyectos pequeños para peques de 3 a 5 años, junto a su papá, mamá o cuidador.', bring: ['Ropa cómoda', 'Merienda'] },
  { id: 'juego-sensorial', day: 'jue', time: '9:30', title: 'Juego sensorial 6-12 m', pillar: 'joy', stage: '0-12 meses', dur: '45 min', price: M, fac: 'Ana M.', spots: 0, desc: 'Texturas, sonidos y colores para explorar con tu bebé en un espacio acolchado.', bring: ['Mantita', 'Muda de ropa'] },
  { id: 'charla-crianza', day: 'jue', time: '18:30', title: 'Charla de crianza', pillar: 'community', stage: 'Papás', dur: '90 min', price: '₡[x]', fac: 'Invitada', spots: 12, desc: 'Una especialista invitada comparte herramientas prácticas y abre espacio para preguntas.', bring: ['Tus preguntas'] },
  { id: 'cafe-papas', day: 'vie', time: '8:00', title: 'Café de papás', pillar: 'community', stage: 'Papás', dur: '60 min', price: M, fac: 'Equipo Build', spots: 6, desc: 'Café, conversación y comunidad para empezar el viernes. Los peques pueden venir con vos.', bring: ['Solo ganas de conversar'] },
  { id: 'family-build-time', day: 'sab', time: '9:00', title: 'Family Build Time', pillar: 'family', stage: 'Familia', dur: '90 min', price: '₡[x]', fac: 'Equipo Build', spots: 5, desc: 'Una mañana para construir, jugar y compartir en familia, con estaciones para cada edad.', bring: ['Toda la familia', 'Botella de agua'] },
  { id: 'masaje-bebes', day: 'sab', time: '10:00', title: 'Masaje para bebés', pillar: 'family', stage: '0-12 meses', dur: '45 min', price: '₡[x]', fac: 'Sofía P.', spots: 2, desc: 'Técnicas suaves para conectar con tu bebé, ayudarle a relajarse y dormir mejor.', bring: ['Toalla', 'Pañal extra'] },
  { id: 'primeros-auxilios', day: 'sab', time: '14:00', title: 'Primeros auxilios pediátricos', pillar: 'skills', stage: 'Papás', dur: '180 min', price: '₡[x]', fac: 'Dr. Mora', spots: 8, desc: 'Curso práctico: atragantamiento, RCP pediátrica y qué hacer ante emergencias comunes en casa.', bring: ['Ropa cómoda', 'Algo para tomar notas'] },
  { id: 'musica-familia', day: 'dom', time: '11:00', title: 'Música en familia', pillar: 'joy', stage: '1-3 años', dur: '45 min', price: M, fac: 'Carla J.', spots: 3, desc: 'Canciones, ritmo e instrumentos para cantar y moverse juntos.', bring: ['Ganas de cantar'] },
];

export const TESTIMONIALS: Testimonial[] = [
  { id: 't1', quote: 'Llegamos por el masaje para bebés y nos quedamos por la gente. Ahora venimos tres veces por semana.', name: 'Andrea', stage: 'Mamá de Lucía, 8 meses' },
  { id: 't2', quote: 'El café de papás fue lo que necesitaba: hablar con otros que están en lo mismo.', name: 'José Pablo', stage: 'Papá de Mateo, 1 año' },
  { id: 't3', quote: 'Mi hija espera el sábado toda la semana. Y yo también.', name: 'María José', stage: 'Mamá de Emma, 4 años' },
];

export const ZONES: Zone[] = [
  { k: 'sala', icon: '01', name: 'Sala flexible', text: 'Se adapta a talleres, juego libre o encuentros.', color: 'orange' },
  { k: 'juego', icon: '21', name: 'Área de juego', text: 'Piso acolchado y materiales por edad.', color: 'yellow' },
  { k: 'sandbox', icon: '23', name: 'Sandbox', text: 'Arena, texturas y juego libre para explorar.', color: 'olive' },
  { k: 'lactancia', icon: '37', name: 'Zona de lactancia', text: 'Un rincón tranquilo y privado.', color: 'celeste' },
  { k: 'cafe', icon: '34', name: 'Café', text: 'Para conversar mientras los peques juegan cerca.', color: 'orange' },
];

export const ADDRESS = 'City Place, Santa Ana, San José';
export const HOURS = 'Lunes a domingo · [horario]';

// Contact links: WhatsApp and email pending from the client.
export const CONTACT = { whatsapp: '#', instagram: 'https://www.instagram.com/somos.build/', email: '#', phone: '+506 8992-6000' };

export const NAV: { href: string; label: string }[] = [
  { href: '/agenda/', label: 'Agenda' },
  { href: '/actividades/', label: 'Actividades' },
  { href: '/membresia/', label: 'Membresía' },
  { href: '/cumpleanos/', label: 'Cumpleaños' },
  { href: '/nosotros/', label: 'Nosotros' },
];

export const pillarOf = (k: PillarKey) => PILLARS.find(p => p.k === k)!;
export const dayOf = (k: DayKey) => DAYS.find(d => d.k === k)!;
export const isPillar = (k: string | null): k is PillarKey => !!k && PILLARS.some(p => p.k === k);
/** Yellow and celeste grounds take ink text; the rest take white. */
export const onColorInk = (c: BrandColor) => c === 'yellow' || c === 'celeste';

/* ---------- Fase 2–3 content (project/ui_kits/website/data2.js) ---------- */

export interface Facilitator { name: string; short: string; role: string }
export const FAC: Record<string, Facilitator> = {
  'Laura V.': { name: 'Laura Vargas', short: 'Laura V.', role: 'Psicóloga perinatal' },
  'Ana M.': { name: 'Ana Montero', short: 'Ana M.', role: 'Especialista en estimulación temprana' },
  'Diego R.': { name: 'Diego Rojas', short: 'Diego R.', role: 'Educador infantil' },
  'Sofía P.': { name: 'Sofía Pérez', short: 'Sofía P.', role: 'Masajista infantil certificada' },
  'Dr. Mora': { name: 'Dr. Andrés Mora', short: 'Dr. Mora', role: 'Pediatra · instructor de RCP' },
  'Carla J.': { name: 'Carla Jiménez', short: 'Carla J.', role: 'Música y educadora' },
  'Equipo Build': { name: 'Equipo Build', short: 'Equipo Build', role: 'Anfitriones del espacio' },
  'Invitada': { name: 'Especialista invitada', short: 'Invitada', role: 'Cambia cada mes' },
};

/** [icon, title, description] — how a session runs, per pillar. */
export const STEPS: Record<PillarKey, [string, string, string][]> = {
  community: [['07', 'Llegada y bienvenida', 'Café, presentaciones y un espacio para acomodarse.'], ['05', 'Tema del día', 'La facilitadora abre la conversación.'], ['06', 'Compartir', 'Cada familia cuenta lo que vive, sin juicios.'], ['49', 'Cierre', 'Una idea para llevar a casa y contactos del grupo.']],
  skills: [['04', 'Bienvenida', 'Presentación y objetivos de la sesión.'], ['36', 'Aprender', 'Explicación práctica y demostración.'], ['18', 'Practicar', 'Vos lo hacés, con acompañamiento.'], ['43', 'Cierre', 'Material de apoyo y dudas.']],
  joy: [['23', 'Llegada', 'Canción de bienvenida y exploración libre.'], ['21', 'Juego guiado', 'Estaciones por edad con materiales seleccionados.'], ['33', 'Movimiento', 'Música, ritmo y juego en conjunto.'], ['28', 'Calma', 'Cierre tranquilo antes de despedirnos.']],
  family: [['01', 'Bienvenida', 'Nos acomodamos en familia.'], ['13', 'Conexión', 'Actividad guiada para papás y peques.'], ['49', 'Tiempo juntos', 'Espacio libre para disfrutar.'], ['09', 'Cierre', 'Un recuerdo del día.']],
};

export const FAQ: [string, string][] = [
  ['¿Tengo que quedarme durante la actividad?', 'Sí. Todas las actividades en Build son con papás o cuidadores presentes. No es un servicio de cuidado.'],
  ['¿Puedo cancelar mi reserva?', 'Podés cancelar hasta 12 horas antes sin costo. Después de ese plazo el cupo se descuenta.'],
  ['¿Está incluida en la membresía?', 'Depende de la actividad y de tu plan. En cada tarjeta indicamos el precio o si está incluida.'],
  ['¿Puedo llevar a hermanos?', 'Escribinos por WhatsApp y lo coordinamos según la capacidad de la sesión.'],
];

export interface Plan { k: string; name: string; for: string; color: BrandColor; price: string; perMonth: string; discount: string; priority: boolean; cafe: string; events: boolean; featured?: boolean }
export const PLANS: Plan[] = [
  { k: 'explora', name: 'Explora', for: 'Para conocer Build y venir de vez en cuando', color: 'celeste', price: '₡[x]', perMonth: '4 actividades', discount: '10% en talleres', priority: false, cafe: '5% en el café', events: false },
  { k: 'comunidad', name: 'Comunidad', for: 'Para familias que vienen cada semana', color: 'orange', price: '₡[x]', perMonth: '10 actividades', discount: '15% en talleres', priority: true, cafe: '10% en el café', events: true, featured: true },
  { k: 'familia', name: 'Familia Build', for: 'Para toda la familia, sin límites', color: 'yellow', price: '₡[x]', perMonth: 'Ilimitadas', discount: '20% en talleres y cumpleaños', priority: true, cafe: '15% en el café', events: true },
];

export const POLICIES: [string, string][] = [
  ['Congelamiento', 'Podés congelar tu membresía hasta 30 días por año, por ejemplo durante un viaje o después de un parto. Avisanos con 3 días de anticipación.'],
  ['Cancelación', 'La membresía se renueva cada mes. Podés cancelarla cuando querás, avisando antes de la fecha de renovación.'],
  ['Reservas y ausencias', 'Si no podés venir, cancelá con 12 horas de anticipación para liberar el cupo a otra familia.'],
];

export interface Package { k: string; name: string; ages: string; cap: string; dur: string; color: BrandColor; incl: string[]; price: string; featured?: boolean }
export const PACKAGES: Package[] = [
  { k: 'mini', name: 'Mini Build', ages: '1 a 2 años', cap: 'Hasta 12 niños', dur: '2 horas', color: 'celeste', incl: ['Sala flexible exclusiva', 'Juego sensorial guiado', 'Decoración Build', 'Anfitrión Build'], price: '₡[x]' },
  { k: 'party', name: 'Build Party', ages: '2 a 4 años', cap: 'Hasta 20 niños', dur: '2,5 horas', color: 'orange', incl: ['Sala + área de juego', 'Actividad guiada a elección', 'Sandbox', 'Decoración y mesa de pastel', '2 anfitriones Build'], price: '₡[x]', featured: true },
  { k: 'max', name: 'Build Max', ages: '3 a 5 años', cap: 'Hasta 25 niños', dur: '3 horas', color: 'yellow', incl: ['Todo el espacio', 'Little Builders: reto de construcción', 'Música en vivo', 'Menú del café para adultos', '3 anfitriones Build'], price: '₡[x]' },
];

const DEVELOPS: Record<PillarKey, string> = {
  community: 'Desarrolla red de apoyo, confianza y la tranquilidad de saber que no estás solo.',
  skills: 'Desarrolla herramientas prácticas para vos y habilidades nuevas para tu peque.',
  joy: 'Desarrolla curiosidad, coordinación y el gusto por jugar juntos.',
  family: 'Desarrolla vínculo, calma y tiempo de calidad en familia.',
};
/** "Qué es y qué desarrolla" paragraphs for an activity page. */
export const aboutOf = (e: BuildEvent) => [
  e.desc,
  `Está pensada para ${e.stage === 'Papás' ? 'papás, mamás y cuidadores' : e.stage === 'Familia' ? 'toda la familia' : 'familias en la etapa ' + e.stage}, y se vive siempre con vos presente.`,
  DEVELOPS[e.pillar],
];

// Pending from the client (shown as placeholders on /nosotros).
export const LOCATION = { local: '[local]', parking: 'Parqueo de City Place · [condiciones]', phone: '+506 8992-6000', email: '[hola@build.cr]', waze: '#', maps: '#' };
