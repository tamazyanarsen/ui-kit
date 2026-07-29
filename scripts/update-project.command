#!/bin/bash
cd "$(dirname "$0")/.."

if ! command -v npm >/dev/null 2>&1; then
  echo "Не найдена команда npm - похоже, Node.js не установлен."
  echo "Скачать Node.js: https://nodejs.org"
  read -p "Нажмите Enter, чтобы закрыть окно..."
  exit 1
fi

echo "Обновляю проект..."
npm run update
echo ""
echo "Готово! Можно запускать Storybook (start-storybook.command)."
read -p "Нажмите Enter, чтобы закрыть окно..."
