#!/usr/bin/env bash

cd "$(dirname "$0")" || exit 1

echo "🏛️ Instalando dependências do Sistema de Governança Bíblica Pro..."
npm install --silent || npm install

echo "🚀 Iniciando a aplicação..."
npm start
