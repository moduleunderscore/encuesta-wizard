# 02 — Diagnóstico

## Evidencia disponible

| Evidencia | Fuente | Fecha | Qué demuestra | Confianza |
|---|---|---|---|---|
| Brief de diez pantallas | Solicitud actual del usuario | 2026-11-18 | Alcance, copy, validación y rutas necesarias | Alta |
| Deck vigente de Wizard | Referencia pública indicada y verificada en navegador | 2026-11-18 | Negro profundo, verde eléctrico, jerarquía monumental y contraportada | Alta |
| Propuesta horizontal | Referencia pública indicada y verificada en navegador | 2026-11-18 | Ritmo de una idea por slide y navegación persistente | Alta |
| Seis escenas del robot y logo | Archivos adjuntos por el usuario | 2026-11-18 | Personaje, materialidad, encuadres y activo de marca | Alta |
| Excel y n8n | Sesiones autorizadas, workflow ejecutado y celdas verificadas | 2026-11-19 | El destino y el orquestador guardan una respuesta y de tres a cinco contactos | Alta |

## Proceso actual

`Invitación → identidad → preguntas obligatorias → adaptación por experiencia → tres a cinco contactos consentidos → comentario → envío → confirmación`

La persona responde en una sola pestaña. El navegador valida y conserva el borrador; n8n vuelve a validar, escribe en Excel y confirma el envío solo al terminar ambas escrituras.

## Fricción y causa

- Síntoma visible: una encuesta tradicional se sentiría separada de la marca y podría presionar indebidamente por recomendaciones.
- Pérdida o riesgo: abandono, respuestas complacientes, referidos sin consentimiento y falsas confirmaciones de envío.
- Causa raíz probable: [HIPÓTESIS] formularios convencionales priorizan captura y densidad sobre confianza y narrativa.
- Qué se hace manualmente y por qué: el seguimiento de respuestas y contactos se hace desde Excel; no se automatiza el contacto inicial.
- Dónde se rompe o se pierde contexto: un fallo de red mantiene el borrador y ofrece reintento; `sessionStorage` protege el recorrido dentro de la pestaña.
- Qué ya se intentó: no se proporcionó una encuesta previa.

## Lo pedido vs. lo necesario

- Forma solicitada: un sitio de encuesta de diez pantallas.
- Problema que intenta resolver: escuchar, detectar prioridades y convertir confianza real en conversaciones futuras.
- Capacidad necesaria: experiencia de captura clara, adaptable, consentida y conectada a una fuente operable.
- Diferencia a validar: la versión conectada demuestra recepción y almacenamiento; todavía no demuestra conversión ni éxito comercial.

## Restricciones y riesgos

| Restricción o riesgo | Probabilidad | Impacto | Mitigación | Responsable |
|---|---:|---:|---|---|
| Referido compartido sin consentimiento | Media | Alto | Una sola casilla general desmarcada, validación y filtro del payload | Frontend / n8n |
| Confirmar sin guardar | Baja | Alto | n8n responde solo después de las dos escrituras; error y reintento visibles | Frontend / n8n |
| Contenido largo en móvil | Alta | Medio | `100dvh`, scroll interno y navegación fija | Frontend |
| Exceso de peso visual | Media | Medio | JPG optimizados y un solo video de cierre comprimido, sin audio y con movimiento reducido | Frontend |
| Pérdida al recargar | Media | Medio | Persistencia de sesión y normalización de esquema | Frontend |
| Datos privados en URL o archivos públicos | Baja | Alto | Sin query strings; enlaces de etapa 2 solo en documentación privada | Wizard |

## Declaración del problema

Cuando un cliente recibe una solicitud de feedback, puede abandonar o responder de forma superficial porque la encuesta se siente genérica, pesada o interesada únicamente en el referido. Esto reduce la calidad de aprendizaje y puede erosionar confianza.

## Qué se validó antes de construir

1. Accesibilidad visual de las dos referencias públicas.
2. Disponibilidad y coherencia de las seis escenas del robot.
3. Capacidad de resolver etapa 1 sin framework ni backend.
