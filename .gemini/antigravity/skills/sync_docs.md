# Skill: Sincronización de Documentación y Arquitectura 📚

Este skill define la obligación de Antigravity de mantener la documentación técnica y de arquitectura sincronizada con el estado real del código antes de realizar cualquier commit o finalizar una tarea significativa.

## Instrucciones para Antigravity

Cada vez que realices cambios estructurales, de lógica de negocio o de infraestructura, DEBES seguir este protocolo:

### 1. Actualización de ARCHITECTURE.md
- **Estructura de Directorios**: Si has creado, movido o eliminado carpetas/archivos clave, actualiza el árbol de directorios.
- **Responsabilidades**: Ajusta las tablas de responsabilidades si un módulo ha cambiado su propósito o si se han añadido nuevos.
- **Diagramas (Mermaid)**: Si el flujo de datos ha cambiado (ej. integración de una DB, nueva capa de servicios), actualiza los diagramas.

### 2. Registro en DECISIONS.md (ADRs)
- Por cada cambio de diseño significativo (ej. refactorización de hooks, elección de una librería, esquema de DB), añade un nuevo registro de decisión siguiendo el formato established (ID, Título, Estado, Contexto, Decisión, Consecuencias).

### 3. Seguimiento en PROPUESTASDEMEJORAS.md
- Marca como completadas las mejoras que hayas implementado.
- Añade nuevas propuestas técnicas relacionadas con la mantenibilidad, escalabilidad o rendimiento que hayas identificado durante el desarrollo.

### 4. Reflexión en reflection.md
- Resume brevemente los avances logrados, los desafíos encontrados y el estado actual de la "salud" del proyecto.

### 5. Validación Pre-Commit
- **Checklist mental**: ¿He actualizado los .md? ¿Los diagramas reflejan el código actual? ¿Los ADRs están al día?
- Solo después de confirmar estos puntos, procede a realizar el `git add` y `git commit`.

---

**Nota**: Este skill es mandatorio y se activa automáticamente al inicio de cada sesión de trabajo con el repositorio `cineswipe2.0`.
