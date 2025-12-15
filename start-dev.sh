#!/bin/bash

# Script para iniciar el servidor de desarrollo con Node.js 20
# Esto asegura que siempre se use la versión correcta de Node.js

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Usar Node.js 20
nvm use 20

# Verificar versión
echo "Usando Node.js $(node --version)"
echo "Usando npm $(npm --version)"

# Iniciar servidor
echo "Iniciando servidor de desarrollo..."
npx vite --host