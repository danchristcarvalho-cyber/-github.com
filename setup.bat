@echo off
cd /d "%~dp0"

echo Instalando dependencias...
npm install

echo Iniciando app...
npm start
