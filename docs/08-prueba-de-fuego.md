# 08 — Prueba de Fuego

## Matriz mínima

| Caso | Resultado esperado | Estado | Evidencia | Responsable |
|---|---|---|---|---|
| Flujo ideal | Completa 10 pantallas | Pass | Recorrido navegador 1280×720 | Codex |
| Datos obligatorios vacíos | Bloquea y muestra error | Pass | Pantalla 03 permaneció en 03 con 1 error | Codex |
| Sin referidos | Permite finalizar | Pass | Ficha vacía avanzó a 09 | Codex |
| Referido parcial | Bloquea y señala pendientes | Pass | 2 errores; permaneció en 08 | Codex |
| Mínimo de referidos | Impide avanzar con menos de tres contactos completos y autorizados | Pass | Prueba Node del modelo + recorrido de pantalla 08 | Codex |
| Consentimiento | Desmarcado por defecto | Pass | `checked=null` en navegador | Codex |
| Canal del referido | Cambia teléfono/correo | Pass | Input cambió a `type=email` | Codex |
| Prioridades | Máximo dos; incertidumbre excluyente | Pass | Prueba Node + navegador | Codex |
| Calificación baja | Prioriza mejora | Pass | Satisfacción 4 / recomendación 5 mostró mensaje adaptado | Codex |
| Recarga | Restaura pantalla y respuestas | Pass | Comentario, nombre y seguimiento persistieron | Codex |
| Copiar mensaje | Copia sin enviar | Pass | Toast confirmado | Codex |
| Cierre | Agradece sin afirmar recepción | Pass | Contraportada verificada | Codex |
| Móvil | Sin overflow y navegación fija | Pass | 319×671 y 390×844; overflow X 0; botones 51 px | Codex |
| Escritorio | Escena panorámica legible | Pass | 1280×720; overflow X 0 | Codex |
| Una escena por viewport | Las 10 pantallas caben sin scroll | Pass | 1280×720; `stageScroll === stageClient` en 01–10 | Codex |
| Referidos densos | Cinco espacios caben sin apilar fichas; tres son obligatorios | Pass | Navegación por pestañas; una ficha activa y cinco accesos visibles | Codex |
| Identidad al inicio | Nombre y empresa obligatorios aparecen en 03, bloquean el avance si faltan y no se repiten en 09 | Pass | Validación de modelo, semántica `required` y recorrido visual en móvil/escritorio | Codex |
| Última toma compacta | Comentario y seguimiento visibles juntos sin scroll | Pass | Pantalla 09 completa en 319×667 y 1280×720 | Codex |
| Consola | Sin errores o warnings | Pass | Logs de navegador vacíos | Codex |
| Thumbnail social | Portada y copy legibles al compartir | Pass | JPEG 1200×630 + Open Graph/Twitter con URL absoluta | Codex |
| Reel desde portada | CTA verde visible, accesible y separado del avance de la encuesta | Pass | Enlace HTTPS abre YouTube en pestaña nueva con `noopener noreferrer`; inspección desktop/móvil | Codex |
| Promesa del slide 02 | Explica con claridad que Wizard convierte necesidades e ideas en soluciones construibles | Pass | “Lo que ya funciona” eliminado; tres ideas breves y cierre de posibilidad verificados en desktop/móvil | Codex |
| Valoraciones 1–5 | Las tres escalas numéricas usan cinco opciones, etiquetas consistentes y resúmenes sobre 5 | Pass | UI, accesibilidad, validación, migración de borradores 1.0.0 y pruebas de modelo | Codex |
| Consentimiento general de referidos | Una sola confirmación autoriza el conjunto de contactos antes de continuar | Pass | Control único, validación de pantalla, filtro del payload y migración conservadora de borradores | Codex |
| Marca en escenas 01–09 | Todos los robots llevan la insignia Wizard oscura, pequeña y bordada en el lado anatómico izquierdo del pecho; ambos personajes en escenas grupales | Pass | Inspección visual de posición, escala, trama, volumen, conteo y contraste en desktop/móvil | Codex |
| Sistema de titulares | Juegos de sólido/outline en blanco y verde conservan jerarquía, contraste y nombre accesible | Pass | Inspección en 01–09 a 1280×720 y 390×844; fallback sólido sin `text-stroke` | Codex |
| Espaciado de titulares | Las palabras respiran sin perder el bloque editorial ni provocar desbordamiento | Pass | Tracking `-0.025em`, word spacing `0.06em`; slide 02 verificado en 1280×720 y 390×844 | Codex |
| Destellos de marca en 02 | Solo `WIZARD` activa estrellas blancas/verdes sin alterar lectura, layout ni accesibilidad | Pass | SVG inline + CSS; `aria-label` intacto; oculto con movimiento reducido | Codex |
| Header limpio | Logo Wizard más visible y sin leyendas de staging en la interfaz | Pass | Prueba estática + inspección desktop/móvil | Codex |
| Finalización explícita | El cierre muestra `<3` y un botón “Terminar” que registra la finalización local una sola vez | Pass | Botón cambia a “Recorrido terminado”, queda deshabilitado y muestra confirmación accesible | Codex |
| Movimiento reducido | Contenido visible y animación mínima | Pass por inspección | Media query global y fallback estático | Codex |
| Integración remota | No existe en demo | Pass | Código público sin OneDrive/n8n; `submitSurvey` falla explícito | Codex |

## Registro de ejecución

| Fecha | Versión | Entorno | Escenario | Resultado | Evidencia | Responsable |
|---|---|---|---|---|---|---|
| 2026-11-18 | 1.0-demo | Node 24 | 8 pruebas del modelo | Pass | 8/8 | Codex |
| 2026-11-18 | 1.0-demo | Python 3.9 | 3 pruebas estáticas | Pass | 3/3 | Codex |
| 2026-11-18 | 1.0-demo | Navegador local | Flujo positivo + recarga | Pass | cierre y resumen | Codex |
| 2026-11-18 | 1.0-demo | Navegador local | Flujo bajo + referidos | Pass | ruta adaptada | Codex |
| 2026-11-18 | 1.0-demo | Navegador local | Rediseño visual compartido | Pass | capturas desktop/móvil | Codex |
| 2026-11-18 | 1.0-demo | Navegador local | Encuadre completo 01–10 | Pass | 1280×720 sin scroll; 390×844 sin scroll; consola limpia | Codex |
| 2026-11-18 | 1.0-demo | Build estático | Vista previa al compartir | Pass | activo 1200×630 y metadatos OG/Twitter verificados | Codex |
| 2026-11-18 | 1.0-demo | Navegador local | Header más visible y superficie sin leyendas de staging | Pass | 1280×720, 390×844 y 319×671; overflow X 0; consola limpia | Codex |
| 2026-11-18 | 1.0-demo | Node + Python | Identidad en 03, copy de 02 y finalización en 10 | Pass | 11/11 modelo; 17/17 estáticas | Codex |
| 2026-11-18 | 1.0-demo | Navegador local | Recorrido actualizado 02–10 | Pass | 319×667 y 1280×720; 03/09 sin scroll; cierre confirmado; consola limpia | Codex |
| 2026-11-18 | 1.0-demo | Navegador local | Separación global de palabras en titulares | Pass | 1280×720 y 390×844; ancho de pantalla 390/390; consola limpia | Codex |
| 2026-11-18 | 1.0-demo | Navegador local | Nombre y empresa obligatorios en 03 | Pass | Bloqueo sin datos, dos errores accesibles, avance al completar ambos y 390×844 sin scroll; consola limpia | Codex |

## Criterio de salida

- Casos críticos aprobados: sí, para demo frontend.
- Defectos aceptados: ninguno conocido que bloquee uso.
- Riesgos pendientes: privacidad, recepción, operación e idempotencia de etapa 2.
- Versión liberada: 1.0-demo, pendiente de aprobación visual del usuario.
