export const SCREEN_COUNT = 10;

export const IMPACT_OPTIONS = [
  { value: "very_positive", label: "Muy positivamente." },
  { value: "somewhat_positive", label: "Algo positivamente." },
  { value: "no_big_changes", label: "No espero grandes cambios." },
  { value: "somewhat_negative", label: "Algo negativamente." },
  { value: "very_negative", label: "Muy negativamente." },
  { value: "unsure", label: "Todavía no lo sé." },
];

export const PRIORITY_OPTIONS = [
  { value: "new_clients", label: "Conseguir nuevos clientes." },
  { value: "follow_up", label: "Dar seguimiento." },
  { value: "customer_service", label: "Atender mejor a mis clientes." },
  { value: "repetitive_tasks", label: "Reducir tareas repetitivas." },
  { value: "operations", label: "Organizar la operación." },
  { value: "decisions", label: "Tomar mejores decisiones." },
  { value: "other", label: "Otra prioridad." },
  { value: "unclear", label: "Aún no lo tengo claro.", exclusive: true },
];

export const DEFAULT_INTRO_MESSAGE =
  "Estoy trabajando con Wizard para aplicar tecnología e IA en mi negocio. Pensé en ti porque creo que les vendría bien conocerse. ¿Te los presento?";

export const SCREENS = [
  {
    eyebrow: "WIZARD / EXPERIENCIA DE CLIENTE",
    title: "¿No que no se podIA?",
    image: "./assets/robot-challenge.jpg",
    imageAlt: "Robot marfil de Wizard con los brazos cruzados y una sonrisa retadora",
  },
  {
    eyebrow: "ANTES DE EMPEZAR",
    title: "Con Wizard todo se puede.",
    image: "./assets/robot-welcome.jpg",
    imageAlt: "Robot marfil de Wizard mostrando un cubo verde luminoso",
  },
  {
    eyebrow: "01 / COLABORACIÓN",
    title: "A ver, sin filtro.",
    image: "./assets/robot-listening.jpg",
    imageAlt: "Robot marfil de Wizard sentado y escuchando con atención",
  },
  {
    eyebrow: "02 / TECNOLOGÍA",
    title: "¿Ya son del mismo equipo?",
    image: "./assets/robot-future.jpg",
    imageAlt: "Robot marfil de Wizard sosteniendo una tableta con un orbe verde",
  },
  {
    eyebrow: "03 / LOS PRÓXIMOS 12 MESES",
    title: "Hablemos del futuro.",
    image: "./assets/robot-future.jpg",
    imageAlt: "Robot marfil de Wizard explorando un orbe tecnológico verde",
  },
  {
    eyebrow: "04 / PRIORIDADES",
    title: "¿Qué pendiente mandas al retiro?",
    image: "./assets/robot-archive.jpg",
    imageAlt: "Robot marfil de Wizard archivando pendientes en una caja verde",
  },
  {
    eyebrow: "05 / RECOMENDACIÓN",
    title: "¿Nos sentarías en tu mesa?",
    image: "./assets/robot-referral.jpg",
    imageAlt: "Dos robots marfil de Wizard presentándose con confianza",
  },
  {
    eyebrow: "06 / PRESENTACIONES",
    title: "Seguro conoces a alguien.",
    image: "./assets/robot-referral.jpg",
    imageAlt: "Dos robots marfil de Wizard juntos, uno presentando al otro",
  },
  {
    eyebrow: "07 / ÚLTIMA TOMA",
    title: "Última toma. Te escuchamos.",
    image: "./assets/robot-listening.jpg",
    imageAlt: "Robot marfil de Wizard escuchando con atención",
  },
  {
    eyebrow: "RECORRIDO COMPLETADO",
    title: "LET’S CONJURE THE FUTURE.",
    image: "",
    imageAlt: "",
  },
];
