# 03 — Rutas de solución

## Ruta simple

- Mecanismo: formulario vertical estático con una sola imagen.
- Qué resuelve / qué no: captura básica; no crea experiencia de marca ni ritmo de presentación.
- Tiempo, costo y riesgo: bajos; alto riesgo de verse genérico.
- Qué valida: únicamente preguntas y campos.

## Ruta recomendada

- Mecanismo: presentación conversacional estática, una pregunta por escena, personaje consistente, estado local y rutas adaptativas.
- Qué resuelve / qué no: resuelve UX, confianza, consentimiento y preparación técnica; no recibe ni opera datos todavía.
- Tiempo, costo y riesgo: moderados y controlables, sin dependencias de aplicación.
- Por qué gana: combina identidad, velocidad, accesibilidad, propiedad y una frontera limpia para etapa 2.

## Ruta ambiciosa

- Mecanismo: secuencias de video o 3D, personalización dinámica y backend desde el inicio.
- Capacidad adicional: mayor espectáculo y captura real.
- Complejidad y riesgo añadidos: peso, GPU, compatibilidad, privacidad, operación y dependencia de proveedores.
- Evidencia que la justificaría: prueba de que el movimiento adicional aumenta finalización o calidad de respuesta.

## Scorecard Wizard

| Criterio | Peso | Simple | Recomendada | Ambiciosa | Evidencia |
|---|---:|---:|---:|---:|---|
| Resuelve el problema real | 20 | 12 | 20 | 16 | La ruta adaptativa escucha antes de pedir referidos |
| Mecanismo coherente | 15 | 9 | 15 | 9 | Etapa 1 no requiere backend ni 3D |
| Simplicidad operativa | 15 | 15 | 12 | 3 | Sitio estático sin dependencias |
| Identidad visual pertinente | 15 | 6 | 15 | 12 | Referencias y activos de Wizard |
| Evidencia y medición | 15 | 6 | 12 | 9 | QA local; medición real pendiente |
| Propiedad del cliente | 10 | 10 | 10 | 5 | Código y activos organizados |
| Claridad y cero ñoñez | 10 | 6 | 10 | 5 | Movimiento subordinado a la tarea |
| **Total / 100** | **100** | **64** | **94** | **59** | Recomendación lista para avanzar |

## Decisión

- Ruta elegida: presentación conversacional estática.
- Responsable de aprobar: [PENDIENTE] usuario.
- Primera prueba reversible: recorrido demo con `sessionStorage`, sin conexión remota.
