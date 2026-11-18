# 05 — Dirección visual

## Qué debe comunicar

- Producto: una conversación de marca, no un formulario administrativo.
- Mecanismo: una escena por pregunta con progreso visible.
- En cinco segundos: es Wizard, toma unos tres minutos y nada se envía en demo.
- Acción dominante: responder una pregunta y decidir cuándo continuar.
- Sensación: precisión editorial con humor en el personaje; confianza sin solemnidad.

## Síntesis de referencias

1. **Sitio “¿No que no se podía?” proporcionado por el usuario:** escena a sangre, degradado oscuro, copy dentro de la imagen, encabezado editorial y progreso inferior. Se adopta como arquitectura visual principal.
2. **Deck vigente de Wizard:** negro profundo, verde eléctrico, titulares contundentes y contraportada limpia.
3. **Propuesta horizontal:** ritmo de una idea por pantalla y controles persistentes. Se descartan nombre, contenido y firma visual de Hangar.
4. **Escenas adjuntas:** material textil marfil, ojos negros, gesto confiado y espacio negativo a la izquierda.
5. **Outro de la propuesta Digital Stories:** video a sangre, titular central sólido/delineado y firma Wizard. Se adapta como cierre de la encuesta con acciones de revisión propias.

No se copia código ni activos de terceros. Se reimplementan principios dentro de la estructura propia del proyecto.

## Tres direcciones consideradas

| Dirección | Idea espacial | Jerarquía | Material / color | Movimiento | Riesgo |
|---|---|---|---|---|---|
| Clara | Formulario vertical | Pregunta primero | Negro y verde | Fade corto | Genérico |
| Wizard | Escenario editorial a sangre | Titular, pregunta, acción | Negro, gris estudio, marfil y `#39FF14` | Continuidad lateral y filamento de progreso | Controlado |
| Experimental | Video/3D inmersivo | Personaje primero | Neón y profundidad | Scroll cinético | Peso y distracción |

## Sistema elegido

- Dirección: escenario editorial Wizard.
- Navegación: barra superior con eje narrativo y contador; barra inferior con anterior, filamento, pasos visitados y continuar.
- Tipografía: Barlow para lectura, Inter Tight para titulares/escala e IBM Plex Mono para controles y metadatos. Los titulares combinan relleno blanco, relleno verde y contorno blanco/verde como sistema editorial: el sólido fija la idea y el outline aporta ritmo sin competir con la pregunta.
- Paleta: `#050706`, blanco frío, gris de estudio y `#39FF14`.
- Composición: escena completa de fondo, degradado izquierdo, copy a 60% en escritorio; personaje arriba y contenido sobre degradado en móvil.
- Contrato de encuadre: cada escena completa cabe en un viewport de 1280×720 sin scroll; en 390×844 se conserva el mismo comportamiento y en teléfonos menores queda scroll como respaldo de accesibilidad.
- Densidad de formularios: los referidos se editan uno a la vez mediante pestañas y la última toma usa una retícula de dos columnas en escritorio para mantener el ritmo de una idea por pantalla.
- Materialidad: robot textil contra estudio gris; paneles negros semitransparentes con bordes finos.
- Aplicación de marca en la colección: todos los robots llevan una insignia Wizard a color, pequeña y bordada (aprox. 18–22% del ancho visible del torso), con hilo en relieve que sigue el volumen, la luz y la trama de la tela. En escenas de dos personajes, ambos quedan uniformados. En el titular de 02, `WIZARD` permanece como texto tipográfico para evitar duplicar el imagotipo.
- Estados: selección verde, foco de 2 px, error coral, bloqueo local, cierre oscuro y demo explícita.
- Vista al compartir: miniatura 1200×630 derivada de la portada, con robot a la derecha, degradado oscuro, logo Wizard y el titular completo con `IA` en verde.

## Dirección de movimiento y storyboard

### Transición de escena

- Función: continuidad y orientación.
- Trigger: Anterior, Continuar o paso visitado.
- Sujeto: copy y escena del robot.
- Estado: copy entra 16 px y la imagen se revela lateralmente.
- Duración: 520–700 ms con `cubic-bezier(0.22, 1, 0.36, 1)`.
- Móvil: misma lógica, sin pinning ni scroll intervenido.
- Movimiento reducido: duración prácticamente instantánea; todo contenido visible.
- Fallback: escena final visible sin animación ni JavaScript de movimiento.
- Presupuesto: CSS únicamente; cero librerías, canvas, WebGL o listeners por frame.
- QA: navegación por botones y teclado, sin reanimar la escena al seleccionar una respuesta.

### Filamento de progreso

- Función: progreso, causalidad y feedback.
- Trigger: cambio de pantalla o respuesta seleccionada.
- Sujeto: línea verde y paso actual.
- Estado: ancho 10–100%; pulso breve al responder.
- Duración: 600–650 ms.
- Móvil: solo línea para reducir ruido; escritorio añade los diez pasos.
- Movimiento reducido: actualización inmediata sin brillo animado.
- Fallback: contador `01 / 10` siempre visible.
- Presupuesto: una transición de ancho y una animación de sombra.
- QA: no provoca overflow ni bloquea los controles.

El momento distintivo es la transformación coordinada entre escena, titular verde y filamento inferior: la encuesta se siente como avanzar dentro de una historia, no como cambiar de página.

### Outro en video

- Función: cerrar el recorrido con una firma de marca reconocible.
- Trigger: completar la pantalla 09.
- Sujeto: video del robot frente a la máquina de la fortuna, titular central y logo.
- Estado: video a sangre en loop silencioso; `LET’S` sólido y `CONJURE THE FUTURE` delineado en verde.
- Móvil: encuadre central con título reducido; las acciones permanecen visibles.
- Movimiento reducido: el video se oculta y permanece un fondo oscuro legible.
- Fallback: fondo negro, título, logo y acciones conservan el cierre completo.
- Presupuesto: un MP4 de aproximadamente 5.8 MB; sin audio, librerías ni listeners por frame.
- QA: autoplay silencioso, legibilidad del titular, revisión y reinicio en escritorio y móvil.

## Preview

- Local: `http://127.0.0.1:4173` durante QA.
- Fecha: 2026-11-18.
- Cambio solicitado e incorporado: adoptar como principal la arquitectura visual de `wizard-no-que-no-se-podia` conservando la estructura funcional propia.
- Ajuste de densidad: las diez escenas, incluido el estado de error de referidos y el outro, fueron compactadas y verificadas sin scroll en 1280×720; la ruta completa también cabe en 390×844.
- Vista social: metadatos Open Graph y Twitter apuntan a `social-preview-v1.jpg`; el nombre versionado permite renovar la caché de los mensajeros.
