# 06 — Arquitectura y operación

## Vista del sistema

```text
Cliente → index/app → modelo y validación → sessionStorage
                         ↓
               prepareSubmissionPayload()
                         ↓
        webhook n8n → validación → tabla Respuestas
                                  → tabla Contactos
                         ↓
                recibo `{ ok: true }`
```

## Componentes y contratos

| Componente | Responsabilidad | Entrada | Salida | Propietario | Falla visible |
|---|---|---|---|---|---|
| `content.js` | Copy, opciones y escenas | Brief | Configuración | Wizard | Texto u opción ausente |
| `model.js` | Esquema, persistencia y reglas | Interacciones | Borrador normalizado | Wizard | Error junto al campo |
| `app.js` | Render y navegación | Borrador | UI accesible | Wizard | Pantalla/control incorrecto |
| `integration.js` | Preparar y enviar payload | Borrador | Recibo remoto | Wizard | Timeout o error con reintento |
| `sessionStorage` | Persistencia temporal | JSON | Borrador por pestaña | Navegador del usuario | Se inicia borrador nuevo |
| n8n | Validar y orquestar escrituras | JSON del formulario | Respuesta confirmada | Wizard | El webhook no devuelve éxito |
| Excel OneDrive | Fuente operativa | Filas validadas | Tablas `Respuestas` y `Contactos` | Wizard | Ejecución n8n fallida |

## Datos e integraciones

- Modelo: objeto versionado `1.3.0` en sesión.
- Integraciones: webhook de producción n8n y Microsoft Excel mediante credencial OAuth guardada en n8n.
- Permisos mínimos: el sitio no recibe credenciales; n8n tiene acceso al libro específico en OneDrive.
- Retención y borrado: vida de la pestaña para el borrador; retención de Excel [PENDIENTE definir].
- Datos sensibles: posibles datos de contacto; no se registran en URL y solo se envían con consentimiento.

## Confiabilidad

- Idempotencia: `submissionId` estable en el cliente; deduplicación remota pendiente.
- Reintentos/colas/timeouts: timeout de 15 segundos y reintento manual; no hay cola.
- Observabilidad: historial de ejecuciones en n8n y registros en Excel; telemetría de frontend pendiente.
- Recuperación: normalización de borrador y fallback a estado nuevo si JSON es inválido.

## Entornos y despliegue

- Desarrollo: `src/` servido localmente después de build a `dist/`.
- Producción: Site público con `.openai/hosting.json`.
- Variables y secretos: ninguno en frontend; credencial OAuth solo en n8n.
- CI/CD: build Python, pruebas Node/Python y paquete Sites.
- Rollback: versiones de Sites y control de código.

## Costos, seguridad y propiedad

- Costos variables: hosting, fuentes web, n8n y OneDrive.
- Amenazas: exposición de contactos, envíos no consentidos, duplicados por reintento y falsos positivos; mitigados por consentimiento, filtro, validación doble y confirmación posterior a escritura.
- Dependencias críticas: navegador moderno, Sites, n8n y OneDrive.
- Propiedad: código, activos preparados y documentación dentro del proyecto.
