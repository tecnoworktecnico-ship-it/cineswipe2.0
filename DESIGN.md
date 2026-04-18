# Design System: CineSwipe 2.0

Este documento define la identidad visual y los estándares de diseño para CineSwipe, asegurando una experiencia coherente, cinemática y premium.

## 🎨 Identidad Visual (Brand Identity)
CineSwipe busca una estética **"Premium Nocturna"**. La interfaz desaparece para que el contenido (los pósters de las películas) sea el protagonista, usando contrastes altos y feedback visual vibrante.

## 🌈 Paleta de Colores (Color Palette)

### Colores Base (Principales)
| Nombre | Color | Valor Hex | Uso |
| :--- | :--- | :--- | :--- |
| **Deep Dark** | ![#030712](https://via.placeholder.com/15/030712/000000?text=+) | `#030712` | Fondo de la aplicación (Gray-950) |
| **Card Surface** | ![#1f2937](https://via.placeholder.com/15/1f2937/000000?text=+) | `#1f2937` | Base de las tarjetas y botones (Gray-800) |
| **Border** | ![#374151](https://via.placeholder.com/15/374151/000000?text=+) | `#374151` | Bordes sutiles y separadores (Gray-700) |

### Colores de Acción (Accents)
| Nombre | Color | Propósito |
| :--- | :--- | :--- |
| **Vibrant Like** | `green-500` | Feedback positivo y botón de Like |
| **Vibrant Nope** | `red-500` | Feedback negativo y botón de Dislike |
| **Star Rating** | `yellow-400` | Puntuación de películas |
| **Brand Gradient**| `red-500` -> `orange-500` | Logotipo y acentos principales |

## Typography (Tipografía)
Se utiliza el stack de fuentes sans-serif nativo (Inter, Roboto, system) para máxima legibilidad y carga instantánea.

*   **Títulos principales**: `font-black` (900) o `font-bold` (700) con tracking `tight`.
*   **Contenidos**: `font-medium` (500) para tags y detalles.
*   **Labels de Swipe**: `uppercase`, `font-extrabold`, `letter-spacing: widest`.

## 📦 Componentes Principales

### 1. The Swipe Card
Es el centro de la experiencia.
*   **Bordes**: `rounded-2xl` (1rem).
*   **Sombra**: `shadow-2xl` para dar profundidad sobre el fondo negro.
*   **Filtros**: Gradiente inferior `bg-gradient-to-t from-black/95` para asegurar legibilidad del texto sobre cualquier imagen.
*   **Glassmorphism**: Acento en tags utilizando `backdrop-blur-md` y fondos traslúcidos.

### 2. Feedback Indicators
Los indicadores "Like" y "Nope" aparecen dinámicamente:
*   **Posición**: Esquinas superiores con una rotación de `12deg`.
*   **Estilo**: Borde grueso (`border-4`) simulando un sello.

## 📐 Layout & Spacing
*   **Container**: Máximo de `max-w-sm` para las tarjetas, ideal para uso con una sola mano en móviles.
*   **Padding**: Base de `p-4` o `p-6` para mantener aire entre elementos.

## 🎭 Animaciones y Transiciones
*   **Curva de velocidad**: `cubic-bezier(0.2, 0.8, 0.2, 1)` para un retorno elástico y natural de las tarjetas.
*   **Duración**: `300ms` a `400ms` para mantener la sensación de agilidad.

---
> [!TIP]
> **Evolución**: Para la Fase 2, se recomienda migrar todos estos valores a variables CSS nativas en `index.css` para soportar "Temas Personalizados" (ej. Modo OLED total).
