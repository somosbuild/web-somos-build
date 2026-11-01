// Contenido de la landing previa a la apertura. Para cambiar textos, editar acá.
// En los textos, **así** va en negrita y \n es un salto de línea.

export const OPENING = 'diciembre 2026';

export const HERO = {
  photo: '/fotos/hero-familia.webp',
  photoAlt: 'Familia jugando junta con luz natural',
  badge: 'Muy pronto · City Place, Santa Ana',
  title: 'Aquí crecen los niños,\n**y los papás también**',
  text: 'Más que un playground, un **family hub** con clases, juego y comunidad para cada etapa de la crianza: desde que vas a ser mamá o papá hasta que tus hijos van a la escuela.\nLa familia no ocurre por casualidad, **se construye**.',
};

export const ABOUT = {
  lead: 'Un espacio flexible en City Place, Santa Ana, pensado en solucionar las necesidades de familias en distintas etapas de crianza.',
  body: 'Más que un playground, un **family hub.**',
};

export const LANDING_PILLARS = [
  { k: 'community', alt: 'Building Community Together', text: 'Comunidad: Papás que se acompañan en cada etapa.' },
  { k: 'skills', alt: 'Building Skills Together', text: 'Habilidades: Aprender juntos, desde el embarazo hasta los primeros pasos y más allá.' },
  { k: 'joy', alt: 'Building Joy Together', text: 'Juego: Diversión sin intensidad, para grandes y chiquitos.' },
  { k: 'family', alt: 'Building Family Together', text: 'Familia: Momentos para crecer en familia, con calma y en confianza.' },
];

export const ETAPAS: [string, string][] = [
  ['embarazo', 'Estamos esperando un bebé'],
  ['bebe', 'Tenemos un bebé'],
  ['nino', 'Tenemos un niño o niña'],
  ['grande', 'Soy papá grande, pero sigo aprendiendo'],
];

export const LANDING_FAQ: [string, string][] = [
  ['¿Qué es Build?', 'Un family hub en City Place, Santa Ana: un espacio flexible para compartir en familia, desde el embarazo hasta que tus hijos van creciendo.'],
  ['¿Es una guardería?', 'No. Todas las actividades en Build son con papás, mamás o cuidadores presentes. La idea es vivirlo juntos.'],
  ['¿Cuándo abren?', `Abrimos en ${OPENING}. Si te registrás, te avisamos primero la fecha exacta y la primera agenda.`],
  ['¿Qué tipo de actividades va a haber?', 'Experiencias, juego y aprendizaje organizados en cuatro pilares: Community, Skills, Joy y Family. Pronto compartimos el detalle.'],
  ['¿Dónde están ubicados?', 'En City Place, Santa Ana.'],
];
