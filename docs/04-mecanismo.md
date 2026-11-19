# 04 — Mecanismo del sistema

## Flujo principal

`Abrir → entender modo demo → responder → adaptar ruta → recomendar al menos tres contactos → comentar → revisar borrador`

| Etapa | Qué ocurre | Sistema o responsable | Datos | Evidencia / salida |
|---|---|---|---|---|
| Entrada | Cliente abre la encuesta | Navegador | `startedAt`, `draftId` | Portada y aviso demo |
| Contexto | Se explican duración, propósito y privacidad | Interfaz | `mode=demo` | Confianza antes de preguntar |
| Decisión | Reglas determinísticas validan y adaptan | `model.js` | Calificaciones y selecciones | Ruta normal o mejora primero |
| Acción | Se guardan respuestas localmente | `sessionStorage` | Borrador completo | Persistencia en la pestaña |
| Seguimiento | [Etapa 2] n8n enrutará solicitudes reales | [PENDIENTE] | Payload autorizado | Fuera de alcance |
| Resultado | Contraportada y resumen editable | Interfaz | `completedAt` | Recorrido completado, no enviado |

## Decisiones y control

- Fuente de verdad: borrador normalizado en `sessionStorage`.
- Reglas críticas: nombre y empresa obligatorios en 02 antes de iniciar las preguntas; calificaciones obligatorias; máximo dos prioridades; “no lo tengo claro” excluyente; tres contactos completos obligatorios, dos espacios opcionales adicionales y una sola autorización general para compartir el conjunto.
- Decisiones asistidas por IA: ninguna.
- Handoff humano: solicitud de conversación registrada como preferencia local; operación pendiente.
- Estado persistente: aislado por pestaña y versión de esquema.
- Prevención de duplicados: `draftId` preparado; idempotencia remota pendiente para etapa 2.

## Excepciones y recuperación

- Datos incompletos: error junto al campo; las primeras tres fichas no pueden quedar vacías y las fichas cuatro y cinco se ignoran si permanecen vacías.
- Integración no disponible: no existe integración en demo y se comunica explícitamente.
- Acción repetida: cambios reemplazan el estado del mismo borrador.
- Experiencia insatisfactoria: prioriza comentario y mantiene referido como alternativa secundaria.
- Recuperación: recarga restaura el borrador; reinicio requiere confirmación.
- Responsable futuro: [PENDIENTE] operador de Wizard.

## Operación y medida

- SLA: no aplica en demo.
- Métrica futura: finalización, distribución de respuestas, comentarios accionables y referidos autorizados.
- Métricas de salud: errores de validación, abandono por pantalla y fallos de recepción.
- Límite de costo: sitio estático; costos de n8n/OneDrive pendientes.
- Señal de degradación: datos no guardados, controles inaccesibles o confirmación mostrada sin persistencia remota.
