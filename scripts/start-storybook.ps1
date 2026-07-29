$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "Не найдена команда npm - похоже, Node.js не установлен, либо после его установки нужно перезапустить компьютер." -ForegroundColor Red
    Write-Host "Скачать Node.js: https://nodejs.org"
    Read-Host "Нажмите Enter, чтобы закрыть окно"
    exit 1
}

if (-not (Test-Path (Join-Path $projectRoot "node_modules"))) {
    Write-Host "Похоже, это первый запуск - устанавливаю зависимости (может занять пару минут)..."
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Установка не удалась." -ForegroundColor Red
        Read-Host "Нажмите Enter, чтобы закрыть окно"
        exit 1
    }
}

Write-Host "Запускаю Storybook..."
npm run storybook

Read-Host "Нажмите Enter, чтобы закрыть окно"
