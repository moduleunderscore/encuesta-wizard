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
    title: "¿No que no se podía?",
    image: "./assets/robot-challenge-wizard-dark-embroidered.png",
    imageAlt:
      "Robot marfil con una insignia pequeña de Wizard bordada en azul oscuro en el pecho, los brazos cruzados y una sonrisa retadora",
  },
  {
    eyebrow: "ANTES DE EMPEZAR",
    title: "Con Wizard todo se puede.",
    image: "./assets/robot-welcome-wizard-dark-embroidered.png",
    imageAlt:
      "Robot marfil mostrando un cubo verde luminoso y una insignia pequeña de Wizard bordada en azul oscuro en el pecho",
  },
  {
    eyebrow: "01 / COLABORACIÓN",
    title: "A ver, sin filtro.",
    image: "./assets/robot-listening-wizard-dark-embroidered.png",
    imageAlt:
      "Robot marfil sentado, escuchando con atención y con una insignia pequeña de Wizard bordada en azul oscuro en el pecho",
  },
  {
    eyebrow: "02 / TECNOLOGÍA",
    title: "¿Qué tan cómodo te sientes con tu tecnología?",
    image: "./assets/robot-future-wizard-dark-embroidered.png",
    imageAlt:
      "Robot marfil con una insignia pequeña de Wizard bordada en azul oscuro en el pecho, sosteniendo una tableta con un orbe verde",
  },
  {
    eyebrow: "03 / LOS PRÓXIMOS 12 MESES",
    title: "Hablemos del futuro.",
    image: "./assets/robot-future-wizard-dark-embroidered.png",
    imageAlt:
      "Robot marfil con una insignia pequeña de Wizard bordada en azul oscuro en el pecho, explorando un orbe tecnológico verde",
  },
  {
    eyebrow: "04 / PRIORIDADES",
    title: "¿Qué proyecto debería arrancar hoy tu empresa?",
    image: "./assets/robot-archive-wizard-dark-embroidered.png",
    imageAlt:
      "Robot marfil con una insignia pequeña de Wizard bordada en azul oscuro en el pecho, archivando pendientes en una caja verde",
  },
  {
    eyebrow: "05 / RECOMENDACIÓN",
    title: "Y a todo esto, ¿nos recomendarías?",
    image: "./assets/robot-referral-wizard-dark-embroidered.png",
    imageAlt:
      "Dos robots marfil presentándose con confianza, ambos con una insignia pequeña de Wizard bordada en azul oscuro en el pecho",
  },
  {
    eyebrow: "06 / PRESENTACIONES",
    title: "Te comparto unos contactos.",
    image: "./assets/robot-referral-wizard-dark-embroidered.png",
    imageAlt:
      "Dos robots marfil juntos, ambos con una insignia pequeña de Wizard bordada en azul oscuro en el pecho, uno presentando al otro",
  },
  {
    eyebrow: "07 / ÚLTIMA TOMA",
    title: "Ya terminamos. Ahora, te escuchamos sin filtro:",
    image: "./assets/robot-listening-wizard-dark-embroidered.png",
    imageAlt:
      "Robot marfil escuchando con atención y con una insignia pequeña de Wizard bordada en azul oscuro en el pecho",
  },
  {
    eyebrow: "RECORRIDO COMPLETADO",
    title: "LET’S CONJURE THE FUTURE.",
    image: "",
    imageAlt: "",
  },
];
