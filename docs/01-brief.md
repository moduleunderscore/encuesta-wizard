# 01 — Brief del proyecto

## Identidad

- Cliente o unidad: Wizard.
- Industria y contexto: agencia mexicana de inteligencia artificial aplicada y automatización de negocios.
- Nombre del proyecto: Encuesta Wizard.
- Tipo: producto web / experiencia de satisfacción conectada.
- Responsable Wizard: [PENDIENTE].
- Responsable del cliente: no aplica; es un proyecto interno de Wizard.

## Resultado buscado

- Cambio de negocio u operación: instalar una experiencia breve y memorable para escuchar a clientes, detectar prioridades futuras y capturar entre tres y cinco recomendaciones consentidas.
- Métrica principal: [OBJETIVO] tasa de recorrido completado cuando exista captura real.
- Línea base y fuente: [PENDIENTE]; el libro de OneDrive queda listo para iniciar medición.
- Meta y fecha: [OBJETIVO] duración cercana a tres minutos; meta de conversión pendiente de operación real.
- Qué demostraría que esto funcionó: recorrido completo sin fricción en escritorio y móvil, respuestas honestas, comentarios accionables y al menos tres referidos autorizados.

## Usuario y situación real

- Usuario principal: cliente actual de Wizard, con perfil de empresario, fundador u operador de negocio.
- Momento o evento de uso: después o durante una colaboración con Wizard, al recibir una invitación directa a dar feedback.
- Trabajo que intenta resolver: comunicar su experiencia, prioridades y recomendaciones con poco esfuerzo.
- Fricción, pérdida o riesgo actual: formularios genéricos, poca claridad sobre privacidad y rutas que priorizan el referido sobre una experiencia insatisfactoria.
- Proceso actual: [PENDIENTE]; no se proporcionó un flujo de encuesta activo previo.

## Alcance

- Dentro: diez pantallas, copy, diseño, escenas, navegación, validación, accesibilidad base, nombre y empresa obligatorios en 02, borrador local, tres referidos obligatorios con espacio para cinco, webhook n8n y persistencia en Excel.
- Fuera: correos enviados, WhatsApp enviado, analítica, CRM y prospección automática de los contactos.
- Entregables: sitio estático funcional, recursos optimizados, código modular, workflow n8n, libro de Excel y documentación operativa.
- Dependencias: navegador moderno con JavaScript y `sessionStorage`; imágenes y logo proporcionados por el usuario.
- Restricciones: no exponer credenciales ni el enlace privado del libro; solo enviar contactos tras consentimiento explícito.

## Sistemas y propiedad

- Sistemas existentes: sitio público, instancia n8n de Wizard y libro de Excel en OneDrive.
- Fuente de verdad: `sessionStorage` mientras se responde; tablas `Respuestas` y `Contactos` después de la confirmación remota.
- Datos disponibles y calidad: respuestas capturadas por controles validados; el libro contiene registros sintéticos de QA claramente rotulados.
- Cuentas, código e infraestructura que controlará el cliente: repositorio local y proyecto privado de Sites asociado.
- Terceros y límites de licencia: hosting Sites y navegador; los activos adjuntos se usan como recursos proporcionados por Wizard.

## Preguntas abiertas

1. [PENDIENTE] Responsable operativo y propietario del workflow en producción.
2. [PENDIENTE] Política de privacidad, retención y base legal para comentarios y referidos.
3. [PENDIENTE] Dominio, audiencia y criterios de éxito de producción.

## Aceptación del brief

- Fecha de implementación inicial: 2026-11-18.
- Aprobado por: [PENDIENTE] revisión del usuario.
- Versión: 1.3-live.
