# Bug Log: CineSwipe 2.0

Este documento registra los errores críticos detectados y resueltos, siguiendo el formato estandarizado para asegurar la trazabilidad y la prevención de regresiones.

---

### ID del bug
**BUG-001**

### Archivo afectado
`Supabase Dashboard / Tables (likes, dislikes)`

### Síntoma
Los likes y dislikes realizados en la UI no se persistían en la base de datos de Supabase, a pesar de que el cliente no reportaba errores explícitos (silent fail).

### Causa raíz
Row Level Security (RLS) estaba habilitado por defecto en las tablas nuevas sin políticas de acceso para el rol `anon`. La base de datos rechazaba la operación sin lanzar una excepción capturada por el cliente.

### Fix aplicado
Se desactivó el RLS para permitir el desarrollo ágil sin autenticación formal en esta etapa.
```sql
ALTER TABLE likes DISABLE ROW LEVEL SECURITY;
ALTER TABLE dislikes DISABLE ROW LEVEL SECURITY;
```

### Test de regresión
Manual: Realizar Swipe y verificar la inserción en el editor de SQL de Supabase.

### Tipo de error agentic
Falta de restricciones (El agente asumió permisos de infraestructura sin validación previa).

---

### ID del bug
**BUG-002**

### Archivo afectado
`e:\sesion6\src\context\movies\MovieContext.tsx`

### Síntoma
Pantalla blanca total (Runtime Crash) con el error: `ReferenceError: useRef is not defined`.

### Causa raíz
Se implementó lógica de persistencia usando `useRef` pero se omitió su importación desde el paquete `react`.

### Fix aplicado
```typescript
// Línea 1
import React, { createContext, useReducer, useEffect, useMemo, useContext, useRef } from 'react';
```

### Test de regresión
`npm run build` (tsc check) y `src/App.test.tsx` (Smoke Test).

### Tipo de error agentic
Contexto acumulado (Se asumió que el estado del archivo incluía importaciones estándar de sesiones anteriores).

---

### ID del bug
**BUG-003**

### Archivo afectado
`e:\sesion6\src\context\movies\MovieContext.tsx`

### Síntoma
La sincronización con Supabase se detenía permanentemente después de que el usuario realizaba 50 swipes (el límite del historial).

### Causa raíz
El `useEffect` de sincronización dependía de `state.history.length`. Al llegar al límite FIFO definido, el tamaño del array se estabilizaba en 50, por lo que el efecto dejaba de dispararse para nuevos elementos.

### Fix aplicado
Se implementó un `useRef` para trackear el `timestamp` del último elemento sincronizado y se cambió la dependencia al array completo `state.history`.
```typescript
const lastSyncedRef = useRef<number>(0);
useEffect(() => {
  const lastItem = state.history[0]; 
  if (!lastItem || lastItem.timestamp <= lastSyncedRef.current) return;
  lastSyncedRef.current = lastItem.timestamp;
  // ... syncWithSupabase() ...
}, [state.history]);
```

### Test de regresión
Validación manual de logs de consola en ciclos extendidos de swipe (>50).

### Tipo de error agentic
Sobredelegación (Se confió en una lógica de dependencia simplista sin considerar el estado estacionario del límite).

---

### ID del bug
**BUG-004**

### Archivo afectado
`.github/workflows/ci.yml` / `eslint.config.js`

### Síntoma
El pipeline de CI fallaba sistemáticamente en el job de `lint` con errores de configuración.

### Causa raíz
ESLint v10 (impuesto por el entorno de CI) no soporta el formato `.eslintrc.cjs` heredado, exigiendo el nuevo sistema "Flat Config".

### Fix aplicado
Eliminación del archivo legacy y creación de `eslint.config.js` con las reglas adaptadas al nuevo estándar.

### Test de regresión
Ejecución exitosa del job `lint` en GitHub Actions.

### Tipo de error agentic
Falta de restricciones (Diseño de CI sin pre-validación de compatibilidad de herramientas).
