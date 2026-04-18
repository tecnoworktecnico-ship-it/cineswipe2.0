# Skill: Document Sincronización (sync_docs)

Esta skill define el protocolo para mantener la documentación técnica (ADRs, Arquitectura, Backlog) sincronizada con el estado real del código antes de realizar commits importantes.

## Protocolo de Ejecución
Siempre que se realicen cambios en la estructura de datos, persistencia o lógica de negocio central, se deben actualizar los siguientes archivos:

1. **ARCHITECTURE.md**: Actualizar diagramas de flujo y responsabilidades de componentes si la jerarquía cambia.
2. **DECISIONS.md (ADRs)**: Documentar el *por qué* de las decisiones técnicas significativas (ej. cambio a Supabase, migración de ESLint).
3. **reflection.md**: Resumir los logros de la sesión y lecciones aprendidas.
4. **README.md**: Asegurar que las instrucciones de instalación y variables de entorno (`.env`) estén al día.

## Automatización Futura
Se planea integrar un script `npm run docs:check` que verifique si los archivos de documentación han sido modificados recientemente en relación con los cambios en `src/`.
