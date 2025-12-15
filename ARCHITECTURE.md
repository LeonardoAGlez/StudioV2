# StudioV2 - Estructura Actualizada

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── ControlPanel.tsx      - Panel de control de la aplicación
│   ├── Mannequin.tsx          - Modelo 3D mannequin
│   └── StudioScene.tsx        - Escena 3D principal
├── services/
│   └── geminiService.ts       - API de generación con Gemini
├── stores/                    - Estado global con Zustand
│   ├── index.ts              - Exports de todos los stores
│   ├── useSettingsStore.ts   - Estado de configuración (prompt, lighting, etc)
│   ├── useCameraStore.ts     - Estado de la cámara 3D
│   ├── useResultStore.ts     - Estado de resultados generados
│   └── useViewportStore.ts   - Estado del viewport (grilla, sujeto, etc)
├── hooks/                     - Custom hooks (para future expansion)
├── App.tsx                    - Componente principal
├── main.tsx                   - Punto de entrada
├── App.css                    - Estilos de la app
├── index.css                  - Estilos globales
├── types.ts                   - Tipos TypeScript
└── ...
```

## 🎯 Optimizaciones Implementadas

### 1. **State Management con Zustand**
Migrado de `useState` a Zustand para mejor escalabilidad:

- `useSettingsStore`: Maneja prompt, lighting, style, aspectRatio, mode
- `useCameraStore`: Maneja posición, rotación y FOV de la cámara
- `useResultStore`: Maneja imágenes/videos generados y estados
- `useViewportStore`: Maneja visibilidad de elementos (subject, grid, transform mode)

**Ventajas:**
- ✅ Estado global más limpio
- ✅ No prop-drilling
- ✅ Mejor performance (subscribers selectivos)
- ✅ Fácil debugging con Zustand DevTools

### 2. **Plugin Vite Optimizado**
Cambio de `@vitejs/plugin-react` a `@vitejs/plugin-react-swc`:

```json
// Antes
"@vitejs/plugin-react": "^5.0.0"

// Ahora
"@vitejs/plugin-react-swc": "^4.2.2"
```

**Beneficios:**
- ⚡ Compilación 3-5x más rápida
- 📦 Build size más pequeño
- 🔄 HMR (Hot Module Reload) más rápido

## 📝 Uso de los Stores

### Ejemplo: Acceder a settings
```tsx
import { useSettingsStore } from './stores';

function MyComponent() {
  const settings = useSettingsStore((state) => state.settings);
  const updateSettings = useSettingsStore((state) => state.updateSettings);
  
  return (
    <button onClick={() => updateSettings({ mode: 'video' })}>
      Switch to Video
    </button>
  );
}
```

### Ejemplo: Actualizar cámara
```tsx
import { useCameraStore } from './stores';

function CameraControls() {
  const updateCamera = useCameraStore((state) => state.updateCamera);
  
  return (
    <button onClick={() => updateCamera({ fov: 75 })}>
      Increase FOV
    </button>
  );
}
```

## 🚀 Próximas mejoras sugeridas

1. **Custom Hooks en `hooks/`:**
   - `useRenderImage()` - lógica de generación
   - `useViewportControls()` - controles del viewport
   - `useAnimationFrame()` - optimización de animaciones

2. **Utils en `src/utils/`:**
   - Helpers para cálculos 3D
   - Funciones de conversión de aspectRatio
   - Utilidades para el canvas

3. **Middleware de Zustand:**
   - Persistencia de estado en localStorage
   - Logging de cambios
   - Sincronización entre tabs

## ✅ Verificación

Todos los archivos han sido creados y no hay errores de compilación:

- ✅ `App.tsx` - Refactorizado con Zustand
- ✅ 4 stores creados (Settings, Camera, Result, Viewport)
- ✅ `package.json` - Actualizado con SWC plugin
- ✅ `vite.config.ts` - Configurado para SWC
- ✅ `eslint.config.js` - Linting configurado

