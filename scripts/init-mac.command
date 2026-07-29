#!/bin/bash
set -e

REPO_URL="https://github.com/tamazyanarsen/ui-kit.git"
TARGET_DIR="$HOME/Desktop/ui-kit"

echo "Проверяю Git..."

if ! command -v git >/dev/null 2>&1; then
  echo "Git не найден — устанавливаю Command Line Tools для macOS."
  echo "Сейчас должно появиться системное окно — нажмите в нём «Установить» и дождитесь окончания."
  xcode-select --install 2>/dev/null || true

  echo "Жду завершения установки (это может занять несколько минут)..."
  ATTEMPTS=0
  MAX_ATTEMPTS=180
  until command -v git >/dev/null 2>&1; do
    sleep 5
    ATTEMPTS=$((ATTEMPTS + 1))
    if [ "$ATTEMPTS" -ge "$MAX_ATTEMPTS" ]; then
      echo ""
      echo "Установка не завершилась за отведённое время."
      echo "Попробуйте запустить этот скрипт ещё раз чуть позже, либо напишите разработчику."
      read -p "Нажмите Enter, чтобы закрыть окно..."
      exit 1
    fi
  done
  echo "Git установлен."
fi

echo "Git найден: $(git --version)"
echo ""

if [ -d "$TARGET_DIR/.git" ]; then
  echo "Проект уже склонирован здесь: $TARGET_DIR"
else
  echo "Клонирую проект в $TARGET_DIR..."
  git clone "$REPO_URL" "$TARGET_DIR"
fi

cd "$TARGET_DIR"

echo ""
echo "Готово! Проект здесь: $TARGET_DIR"
echo "Открываю папку — дальше дважды кликните start-storybook.command внутри неё"
echo "(для самого первого запуска ещё нужен установленный Node.js, см. README.md в этой папке)."

open "$TARGET_DIR"

read -p "Нажмите Enter, чтобы закрыть окно..."
