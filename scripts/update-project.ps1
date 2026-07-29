$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "Не найдена команда npm - похоже, Node.js не установлен, либо после его установки нужно перезапустить компьютер." -ForegroundColor Red
    Write-Host "Скачать Node.js: https://nodejs.org"
    Read-Host "Нажмите Enter, чтобы закрыть окно"
    exit 1
}

Write-Host "Обновляю проект..."
npm run update

Write-Host ""
Write-Host "Готово! Можно запускать Storybook (start-storybook.bat)."
Read-Host "Нажмите Enter, чтобы закрыть окно"
