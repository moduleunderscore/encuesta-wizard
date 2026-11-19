# Encuesta Wizard — versión conectada

Experiencia frontend de diez pantallas para conocer la satisfacción de clientes de Wizard, sus prioridades y entre tres y cinco recomendaciones consentidas.

## Qué incluye

- Recorrido horizontal en escritorio y vertical cómodo en móvil.
- Seis escenas consistentes del robot marfil y logo oficial de Wizard.
- Preguntas obligatorias con validación junto al control.
- Ruta prioritaria de mejora cuando satisfacción o recomendación es 3 o menor.
- Entre tres y cinco referidos, con canal adaptable y una confirmación general explícita.
- Borrador en `sessionStorage`, aislado a la pestaña actual.
- Envío real a un webhook de n8n con validación antes de escribir.
- Persistencia en dos tablas de Excel en OneDrive: respuestas y contactos.
- Confirmación de recepción, reintento visible y bloqueo después de un envío exitoso.
- Resumen editable, reinicio confirmado y contraportada Wizard.
- Movimiento reducido, navegación con teclado y estados de foco visibles.

## Ejecutar localmente

No hay dependencias de aplicación.

```bash
python3 scripts/build.py
python3 -m http.server 4173 -d dist
```

Abrir `http://127.0.0.1:4173`.

## Pruebas

Con Node 20 o superior:

```bash
node --test tests/model.test.js
python3 -m unittest discover -s tests -p 'test_*.py'
```

## Estructura

- `src/index.html`: shell semántico de la experiencia.
- `src/styles.css`: dirección visual, responsive y movimiento.
- `src/js/content.js`: copy, opciones y escenas.
- `src/js/model.js`: esquema del borrador, reglas y validación.
- `src/js/app.js`: render, navegación e interacciones.
- `src/js/integration.js`: payload, timeout y envío al webhook de producción.
- `src/assets/`: imágenes web optimizadas y logo oficial.
- `docs/`: brief, decisiones, arquitectura y evidencia de QA.

## Esquema del borrador

El objeto conservado en `sessionStorage` incluye:

- `draftId`, `schemaVersion`, `startedAt`, `completedAt`, `submittedAt`, `mode` y `demo`.
- `identity` con nombre y empresa obligatorios.
- `satisfaction`, `technology`, `aiImpact`, `priorities` y `recommendation`.
- `referralMode`, `referrals`, `referralsConsent` y `selfIntroMessage`.
- `finalComment` y `followUpRequested`.

Las calificaciones no contestadas son `null`. `prepareSubmissionPayload()` solo incluye fichas completas cuando existe autorización general.

## Integración

El botón final envía el borrador autorizado a n8n. El workflow valida identidad, escalas, prioridades, consentimiento y entre tres y cinco contactos completos. Solo después de guardar la respuesta y los contactos en Excel devuelve `{ ok: true }`.

Las credenciales de Microsoft viven únicamente en n8n. El frontend público contiene la URL del webhook, pero no secretos ni enlaces privados del libro. El `submissionId` se conserva en los reintentos del navegador; la deduplicación remota en Excel sigue siendo una mejora operativa pendiente.
