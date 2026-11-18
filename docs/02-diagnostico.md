# 02 — Diagnóstico

## Evidencia disponible

| Evidencia | Fuente | Fecha | Qué demuestra | Confianza |
|---|---|---|---|---|
| Brief de diez pantallas | Solicitud actual del usuario | 2026-11-18 | Alcance, copy, validación y rutas necesarias | Alta |
| Deck vigente de Wizard | Referencia pública indicada y verificada en navegador | 2026-11-18 | Negro profundo, verde eléctrico, jerarquía monumental y contraportada | Alta |
| Propuesta horizontal | Referencia pública indicada y verificada en navegador | 2026-11-18 | Ritmo de una idea por slide y navegación persistente | Alta |
| Seis escenas del robot y logo | Archivos adjuntos por el usuario | 2026-11-18 | Personaje, materialidad, encuadres y activo de marca | Alta |
| Excel y n8n futuros | Enlaces suministrados, no abiertos por instrucción | 2026-11-18 | Destino y orquestador previstos para etapa 2 | Media |

## Proceso actual

`Invitación → explicación de modo demo → preguntas obligatorias → adaptación por experiencia → referido opcional → comentario → resumen local`

En etapa 1, la persona responde en una sola pestaña. El navegador valida y conserva el borrador. No existe acción remota ni seguimiento operativo.

## Fricción y causa

- Síntoma visible: una encuesta tradicional se sentiría separada de la marca y podría presionar indebidamente por recomendaciones.
- Pérdida o riesgo: abandono, respuestas complacientes, referidos sin consentimiento y falsas confirmaciones de envío.
- Causa raíz probable: [HIPÓTESIS] formularios convencionales priorizan captura y densidad sobre confianza y narrativa.
- Qué se hace manualmente y por qué: el envío y seguimiento todavía no existen; se difieren hasta definir el workflow y la privacidad.
- Dónde se rompe o se pierde contexto: al recargar o retroceder si no hay estado local; resuelto con `sessionStorage` para la demo.
- Qué ya se intentó: no se proporcionó una encuesta previa.

## Lo pedido vs. lo necesario

- Forma solicitada: un sitio de encuesta de diez pantallas.
- Problema que intenta resolver: escuchar, detectar prioridades y convertir confianza real en conversaciones futuras.
- Capacidad necesaria: experiencia de captura clara, adaptable, consentida y lista para conectarse después.
- Diferencia a validar: la etapa 1 demuestra UX y esquema, no recepción, operación ni éxito comercial.

## Restricciones y riesgos

| Restricción o riesgo | Probabilidad | Impacto | Mitigación | Responsable |
|---|---:|---:|---|---|
| Referido compartido sin consentimiento | Media | Alto | Casilla desmarcada, validación y filtro del payload | Frontend / futuro workflow |
| Confundir demo con envío real | Media | Alto | Avisos en portada, comentario y cierre; cero llamadas de red | Frontend |
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
