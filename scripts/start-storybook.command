#!/bin/bash
cd "$(dirname "$0")/.."

if ! command -v npm >/dev/null 2>&1; then
  echo "Не найдена команда npm - похоже, Node.js не установлен."
  echo "Скачать Node.js: https://nodejs.org"
  read -p "Нажмите Enter, чтобы закрыть окно..."
  exit 1
fi

if [ ! -d "node_modules" ]; then
  echo "Похоже, это первый запуск - устанавливаю зависимости (может занять пару минут)..."
  npm install
  if [ $? -ne 0 ]; then
    echo "Установка не удалась."
    read -p "Нажмите Enter, чтобы закрыть окно..."
    exit 1
  fi
fi

echo "Запускаю Storybook..."
npm run storybook
echo ""
read -p "Нажмите Enter, чтобы закрыть окно..."
