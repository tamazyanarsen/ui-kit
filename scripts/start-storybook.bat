@echo off
where pwsh >nul 2>nul
if %errorlevel%==0 (
  pwsh -ExecutionPolicy Bypass -File "%~dp0start-storybook.ps1"
) else (
  powershell -ExecutionPolicy Bypass -File "%~dp0start-storybook.ps1"
)
