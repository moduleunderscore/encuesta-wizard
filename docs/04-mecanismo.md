# 04 — Mecanismo del sistema

## Flujo principal

`Abrir → identificarse → responder → adaptar ruta → recomendar de tres a cinco contactos → comentar → enviar → confirmar`

| Etapa | Qué ocurre | Sistema o responsable | Datos | Evidencia / salida |
|---|---|---|---|---|
| Entrada | Cliente abre la encuesta | Navegador | `startedAt`, `draftId` | Portada y CTA de inicio |
| Contexto | Se explican duración, propósito y privacidad | Interfaz | `mode=live` | Confianza antes de preguntar |
| Decisión | Reglas determinísticas validan y adaptan | `model.js` | Calificaciones y selecciones | Ruta normal o mejora primero |
| Acción | Se guarda el borrador y se envía al terminar | Navegador + n8n | Payload autorizado | Reintento o recibo remoto |
| Persistencia | Se escriben respuesta y contactos | n8n + Excel | Una fila y de tres a cinco filas | Tablas `Respuestas` y `Contactos` |
| Resultado | Se confirma la recepción | Interfaz | `submittedAt`, `receiptId` | “Encuesta enviada” |

## Decisiones y control

- Fuente de verdad: borrador normalizado en `sessionStorage` antes del envío; Excel después de la confirmación.
- Reglas críticas: nombre y empresa obligatorios en 02 antes de iniciar las preguntas; calificaciones obligatorias; máximo dos prioridades; “no lo tengo claro” excluyente; tres contactos completos obligatorios, dos espacios opcionales adicionales y una sola autorización general para compartir el conjunto.
- Decisiones asistidas por IA: ninguna.
- Handoff humano: solicitud de conversación registrada como preferencia local; operación pendiente.
- Estado persistente: aislado por pestaña y versión de esquema.
- Prevención de duplicados: el navegador conserva el mismo `submissionId` y bloquea un segundo envío exitoso; la deduplicación remota en Excel queda pendiente.

## Excepciones y recuperación

- Datos incompletos: error junto al campo; las primeras tres fichas no pueden quedar vacías y las fichas cuatro y cinco se ignoran si permanecen vacías.
- Integración no disponible: el cierre muestra el error y permite reintentar sin perder el borrador.
- Acción repetida: cambios reemplazan el estado del mismo borrador.
- Experiencia insatisfactoria: prioriza comentario y mantiene referido como alternativa secundaria.
- Recuperación: recarga restaura el borrador; reinicio requiere confirmación.
- Responsable futuro: [PENDIENTE] operador de Wizard.

## Operación y medida

- SLA técnico del cliente: timeout de 15 segundos antes de ofrecer reintento; SLA operativo [PENDIENTE].
- Métrica: finalización, distribución de respuestas, comentarios accionables y referidos autorizados.
- Métricas de salud: errores de validación, abandono por pantalla y fallos de recepción.
- Límite de costo: sitio estático y plan vigente de n8n/OneDrive; costos operativos [PENDIENTE].
- Señal de degradación: datos no guardados, controles inaccesibles o confirmación mostrada sin persistencia remota.
