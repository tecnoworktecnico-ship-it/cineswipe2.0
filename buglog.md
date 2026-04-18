# Bug Log & Technical Debt: CineSwipe 2.0

Este documento registra los errores encontrados, las soluciones aplicadas y la deuda técnica identificada durante el desarrollo.

## 🐛 Errores Resueltos (Sesión Actual)
- **RLS Blocking**: Las políticas de Supabase impedían la escritura anónima. *Solución:* Se desactivó RLS temporalmente y se habilitaron políticas de inserción para `anon`.
- **Sync Trigger Failure**: El historial no se sincronizaba al llegar al límite de 50 elementos. *Solución:* Se cambió la dependencia de `history.length` a `history` en el `useEffect` de `MovieContext`.
- **ReferenceError (useRef)**: La aplicación se bloqueó (pantalla en blanco) por falta de importación de `useRef`. *Solución:* Se añadió la importación en `MovieContext.tsx`.
- **ESLint Migration**: ESLint v10 fallaba por la falta de archivos de configuración flat (`eslint.config.js`). *Solución:* Se migró de `.eslintrc.cjs` a `eslint.config.js`.

## ⚠️ Problemas Conocidos (Pendientes)
- **LCP Delay**: Aunque hay precarga, la primera imagen todavía puede tardar en descubrirse si el JS principal es pesado.
- **Cascading Renders**: ESLint advierte sobre llamados a `setState` dentro de `useEffect` en `useMovies.ts` que podrían optimizarse.
- **Falta de Tipado Estricto**: Se han usado algunos `any` en la lógica de Supabase y TMDB que deben tiparse correctamente.

## 📝 Backlog de Funcionalidades (Deuda Técnica)
- [ ] **UI de Historial**: Falta visualización para que el usuario consulte sus likes.
- [ ] **Debounce de Sync**: Riesgo de saturar la API de Supabase con swipes rápidos.
- [ ] **Mapeo de Géneros**: Los IDs numéricos no son amigables para el usuario.

## 🛠️ Herramientas de Calidad
- **CI Pipeline**: Configurado para detectar fallos en Lint, Test y Build automáticamente en cada commit.
- **Skill Docs**: Localizados en la carpeta `/skills` para prevenir regresiones.
