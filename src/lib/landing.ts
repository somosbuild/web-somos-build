// Contenido de la landing previa a la apertura. Para cambiar textos, editar acá.

export const OPENING = 'diciembre 2026';

export const HERO = {
  photo: '/fotos/hero-familia.webp',
  photoAlt: 'Familia jugando junta con luz natural',
  badge: 'Muy pronto · City Place, Santa Ana',
  text: `Build es un family hub para compartir con vos, que vas a ser papá o mamá, que ya tenés un bebé o que estás creciendo junto a tus hijos. Abrimos en ${OPENING}.`,
};

export const ABOUT = {
  lead: 'Un espacio flexible en City Place, Santa Ana, pensado para familias que esperan un bebé, que ya tienen uno o que siguen creciendo juntas.',
  body: 'Cada experiencia, juego y aprendizaje es un cimiento. Por eso en Build todo se vive con tus hijos: las actividades son siempre con papás o cuidadores presentes.',
};

export const LANDING_PILLARS = [
  { k: 'community', alt: 'Building Community Together', text: 'Papás que se acompañan en cada etapa.' },
  { k: 'skills', alt: 'Building Skills Together', text: 'Aprender juntos, desde el embarazo hasta los primeros pasos y más allá.' },
  { k: 'joy', alt: 'Building Joy Together', text: 'Juego y diversión sin intensidad, para grandes y chiquitos.' },
  { k: 'family', alt: 'Building Family Together', text: 'Momentos para crecer en familia, con calma y en confianza.' },
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
