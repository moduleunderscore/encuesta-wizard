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
| Cierre demo | No afirma recepción | Pass | Contraportada verificada | Codex |
| Móvil | Sin overflow y navegación fija | Pass | 319×671 y 390×844; overflow X 0; botones 51 px | Codex |
| Escritorio | Escena panorámica legible | Pass | 1280×720; overflow X 0 | Codex |
| Una escena por viewport | Las 10 pantallas caben sin scroll | Pass | 1280×720; `stageScroll === stageClient` en 01–10 | Codex |
| Referidos densos | Cinco espacios caben sin apilar fichas; tres son obligatorios | Pass | Navegación por pestañas; una ficha activa y cinco accesos visibles | Codex |
| Última toma compacta | Comentario, identidad y seguimiento visibles juntos | Pass | Pantalla 09 a dos columnas; 1280×720 y 390×844 | Codex |
| Consola | Sin errores o warnings | Pass | Logs de navegador vacíos | Codex |
| Thumbnail social | Portada y copy legibles al compartir | Pass | JPEG 1200×630 + Open Graph/Twitter con URL absoluta | Codex |
| Marca en escenas 01–09 | Todos los robots llevan insignia Wizard pequeña y bordada; ambos personajes en escenas grupales | Pass | Inspección visual de escala, trama, volumen, conteo y contraste en desktop/móvil | Codex |
| Sistema de titulares | Juegos de sólido/outline en blanco y verde conservan jerarquía, contraste y nombre accesible | Pass | Inspección en 01–09 a 1280×720 y 390×844; fallback sólido sin `text-stroke` | Codex |
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

## Criterio de salida

- Casos críticos aprobados: sí, para demo frontend.
- Defectos aceptados: ninguno conocido que bloquee uso.
- Riesgos pendientes: privacidad, recepción, operación e idempotencia de etapa 2.
- Versión liberada: 1.0-demo, pendiente de aprobación visual del usuario.
