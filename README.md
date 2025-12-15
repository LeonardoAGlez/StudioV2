# AI Film Studio Director - FIBO Edition

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

## 🚀 Características

- **Generación de imágenes con FIBO API**: Tecnología de IA avanzada para crear imágenes cinematográficas
- **Estudio 3D interactivo**: Controla la cámara y composición en tiempo real
- **Interfaz moderna**: UI/UX optimizada con React y Three.js
- **Arquitectura modular**: Código organizado con Zustand para state management

## 🛠️ Requisitos

- **Node.js 20+** (actualizado automáticamente con el script)
- **npm** o **yarn**

## 📦 Instalación y ejecución

### Opción 1: Script automático (Recomendado)

```bash
# Hacer ejecutable el script (solo la primera vez)
chmod +x start-dev.sh

# Ejecutar el servidor de desarrollo
./start-dev.sh
```

### Opción 2: Manual

```bash
# Instalar dependencias
npm install

# Configurar Node.js 20
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 20

# Iniciar servidor
npm run dev
```

## ⚙️ Configuración

Copia el archivo `.env.example` a `.env` y configura las variables de FIBO:

```env
# FIBO API Configuration
FIBO_API_URL=https://engine.prod.bria-api.com/v2
FIBO_API_KEY=tu_api_key_aqui
FIBO_GENERATE_PATH=/fibo/image/generate
FIBO_AUTH_HEADER=api_token
```

## 🎛️ Presets de Iluminación y Cámara

El frontend ahora soporta presets dinámicos proveniente del backend. Hay dos tipos de presets:

- Presets integrados (definidos en `src/types.ts`): `Studio`, `Golden Hour`, `Midnight`, `Overcast`, `Neon City`.
- Presets de "directores" proporcionados por el backend (`/presets/list`) — ej. `wes_anderson`, `roger_deakins`.

Cómo se usan:

- En el panel lateral (`ControlPanel`), el selector de `Lighting Setup` lista primero los presets integrados.
- Debajo, si existen, aparecerán los presets de directores como `Director — Name`.
- Al seleccionar un preset de director, la escena aplica una configuración de iluminación mapeada automáticamente (por ejemplo `golden_hour`, `dramatic`, etc.).

Si necesitas añadir nuevos presets en el backend, expónlos en la ruta `/presets/list` como un objeto cuyo valor para cada clave incluye `name`, `camera`, `lighting`, `style`.


## 🌐 Acceso

Una vez iniciado, el servidor estará disponible en:
- **Local**: http://localhost:5173/
- **Red**: http://192.168.1.100:5173/ (y otras IPs de red)

## 📁 Estructura del proyecto

```
StudioV2/
├── src/
│   ├── components/     # Componentes React
│   ├── services/       # Servicios API (FIBO, backend)
│   ├── stores/         # Estado con Zustand
│   └── types.ts        # Definiciones TypeScript
├── public/             # Assets estáticos
└── start-dev.sh        # Script de inicio
```

## 🔧 Tecnologías

- **React 19** con TypeScript
- **Three.js** + React Three Fiber para 3D
- **Vite** para desarrollo rápido
- **Zustand** para state management
- **FIBO API** para generación de imágenes
- **Tailwind CSS** para estilos
