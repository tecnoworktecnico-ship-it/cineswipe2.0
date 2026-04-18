# Skill: Límites de Validación en el Workflow de CI - CineSwipe

Este documento enumera los escenarios críticos en los que un bug **no** sería detectado por el flujo de CI (Lint, Test, Build) y llegaría a producción, sirviendo como guía para expandir la cobertura de calidad en el futuro.

## 1. Bugs de Integración de Servicios Externos (API/Supabase)
*   **Cambios en el Schema de Supabase**: Si se modifica una tabla en Supabase (ej. se borra una columna) pero no se actualiza el código, el lint y el build pasarán. Solo fallará en runtime.
*   **Expiración de API Keys**: Si la `VITE_TMDB_KEY` expira o es revocada, el CI puede pasar (especialmente si los tests unitarios usan mocks), pero la app fallará para el usuario final.
*   **Límites de Rate Limit**: Fallos por exceso de peticiones a la API real que solo ocurren bajo carga real.

## 2. Errores Visuales y de UX (CSS/Layout)
*   **Regresiones Visuales**: Un cambio en Tailwind que rompa el layout en dispositivos móviles (ej. un `hidden` donde no debería) no será detectado por Vitest ni Lint.
*   **Z-Index y Superposiciones**: Elementos que se tapan entre sí o botones que dejan de ser "clickeables" por un overlay invisible.
*   **Performance en Dispositivos Reales**: Lentitud en animaciones o "jank" que ocurre en hardware móvil pero no en el entorno de build (Ubuntu-latest).

## 3. Lógica Dependiente de Variables de Entorno
*   **Variables Faltantes en Staging/Producción**: Si una nueva feature depende de una variable de entorno (`.env`) que no ha sido configurada en el servidor de hosting (Vercel/Netlify), la app se romperá a pesar de que el CI haya pasado con sus propios secretos.

## 4. Diferencias entre Entornos (Bugs de Runtime)
*   **Polyfills y Browser Support**: Un método de JS moderno que no esté bien transpilado y falle específicamente en Safari o navegadores antiguos.
*   **Race Conditions**: Condiciones de carrera en efectos asíncronos (`useEffect`) que ocurren de forma aleatoria dependiendo de la latencia de red real.

## 5. Bugs en la Lógica de Negocio (Sin Cobertura)
*   **Falsos Positivos**: Tests que pasan porque el "Mock" de la API devuelve datos válidos, pero la API real cambió su formato de respuesta.
*   **Falta de Cobertura**: Cualquier funcionalidad nueva que no tenga un archivo `.test.tsx` asociado.

> [!TIP]
> **Recomendación**: Para mitigar estos riesgos, se recomienda integrar **Playwright/Cypress** (E2E) para flujos críticos y **Visual Regression Testing** (Percy/Chromatic) para el UI.
