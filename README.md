# Encuesta Wizard — etapa 1

Experiencia frontend de diez pantallas para conocer la satisfacción de clientes de Wizard, sus prioridades y, de forma opcional y consentida, posibles referidos.

## Qué incluye

- Recorrido horizontal en escritorio y vertical cómodo en móvil.
- Seis escenas consistentes del robot marfil y logo oficial de Wizard.
- Preguntas obligatorias con validación junto al control.
- Ruta prioritaria de mejora cuando satisfacción o recomendación es 6 o menor.
- Hasta tres referidos, con canal adaptable y consentimiento explícito.
- Alternativa para que el cliente haga la presentación por WhatsApp o correo.
- Borrador en `sessionStorage`, aislado a la pestaña actual.
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
- `src/js/integration.js`: frontera preparada para la futura recepción de datos.
- `src/assets/`: imágenes web optimizadas y logo oficial.
- `docs/`: brief, decisiones, arquitectura y evidencia de QA.

## Esquema del borrador

El objeto conservado en `sessionStorage` incluye:

- `draftId`, `schemaVersion`, `startedAt`, `completedAt`, `mode` y `demo`.
- `identity` con nombre y empresa opcionales.
- `satisfaction`, `technology`, `aiImpact`, `priorities` y `recommendation`.
- `referralMode`, `referrals` y `selfIntroMessage`.
- `finalComment` y `followUpRequested`.

Las calificaciones no contestadas son `null`. `prepareSubmissionPayload()` filtra los referidos para incluir únicamente fichas completas y autorizadas.

## Alcance y pendiente

Esta versión es explícitamente demo. No hace solicitudes de red y no confirma recepción de datos.

La etapa 2 deberá conectar un endpoint nuevo de n8n con Excel en OneDrive, credenciales dedicadas, validación de esquema, idempotencia, manejo de errores y confirmación de guardado real. Los enlaces y credenciales de esa etapa no están en el código público.
