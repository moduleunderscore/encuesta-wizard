# 06 — Arquitectura y operación

## Vista del sistema

```text
Cliente → index/app → modelo y validación → sessionStorage
                         ↓
               prepareSubmissionPayload()
                         ↓
          [Etapa 2: webhook nuevo → n8n → Excel]
```

## Componentes y contratos

| Componente | Responsabilidad | Entrada | Salida | Propietario | Falla visible |
|---|---|---|---|---|---|
| `content.js` | Copy, opciones y escenas | Brief | Configuración | Wizard | Texto u opción ausente |
| `model.js` | Esquema, persistencia y reglas | Interacciones | Borrador normalizado | Wizard | Error junto al campo |
| `app.js` | Render y navegación | Borrador | UI accesible | Wizard | Pantalla/control incorrecto |
| `integration.js` | Limpiar futuro payload | Borrador | Referidos completos autorizados | Wizard | Error demo explícito |
| `sessionStorage` | Persistencia temporal | JSON | Borrador por pestaña | Navegador del usuario | Se inicia borrador nuevo |

## Datos e integraciones

- Modelo y fuente de verdad: objeto versionado `1.2.0` en sesión.
- Integraciones: ninguna activa; frontera aislada en `integration.js`.
- Permisos mínimos: ninguno en etapa 1.
- Retención y borrado: vida de la pestaña; reinicio manual elimina el borrador.
- Datos sensibles: posibles datos de contacto; no se registran en URL ni logs.

## Confiabilidad

- Idempotencia: `draftId` listo para ser clave remota futura.
- Reintentos/colas/timeouts: [PENDIENTE] etapa 2.
- Observabilidad: consola sin errores en QA; telemetría remota pendiente.
- Recuperación: normalización de borrador y fallback a estado nuevo si JSON es inválido.

## Entornos y despliegue

- Desarrollo: `src/` servido localmente después de build a `dist/`.
- Producción: Site privado con `.openai/hosting.json`.
- Variables y secretos: ninguno en frontend; secretos futuros solo en n8n.
- CI/CD: build Python, pruebas Node/Python y paquete Sites.
- Rollback: versiones de Sites y control de código.

## Costos, seguridad y propiedad

- Costos variables: hosting y fuentes web; n8n/OneDrive pendientes.
- Amenazas: exposición de contactos, envíos no consentidos y falsos positivos de guardado; mitigados por demo local y filtro estricto.
- Dependencias críticas: navegador moderno y Sites.
- Propiedad: código, activos preparados y documentación dentro del proyecto.
