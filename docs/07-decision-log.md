# 07 — Registro de decisiones

## DEC-001 — Frontend estático sin framework

- Fecha: 2026-11-18.
- Estado: aceptada.
- Responsable: implementación Wizard; aprobación final [PENDIENTE].
- Contexto: etapa 1 requiere interacción local, no servidor.
- Opciones: HTML/JS estático, React/Vite o backend desde el inicio.
- Decisión: módulos ES nativos y build de copia a `dist/`.
- Razón: menor peso, cero dependencias y publicación sencilla.
- Tradeoff: render manual y pruebas DOM sin framework.
- Riesgo aceptado: compatibilidad limitada a navegadores modernos.
- Revisión: cuando etapa 2 requiera comportamiento de servidor.

## DEC-002 — No usar los videos adjuntos

- Fecha: 2026-11-18.
- Estado: aceptada.
- Contexto: los videos pesan entre 2.8 y 6.8 MB y no pertenecen al personaje conductor de la encuesta.
- Decisión: usar seis escenas JPG optimizadas (~1.2 MB total).
- Razón: consistencia del robot, velocidad y menor distracción.
- Tradeoff: menos movimiento cinematográfico.
- Revisión: si medición real justifica video por pantalla.

## DEC-003 — Adoptar la arquitectura visual del sitio compartido

- Fecha: 2026-11-18.
- Estado: aceptada por instrucción del usuario.
- Contexto: la primera composición dividida se percibió menos resuelta.
- Decisión: escena a sangre, copy sobre degradado, eje editorial superior y progreso inferior.
- Razón: coincide mejor con la referencia preferida y utiliza plenamente el espacio negativo de las imágenes.
- Tradeoff: exige ajustes de encuadre y scroll específicos por móvil.
- Revisión: después de feedback visual del usuario.
