// Путь к Chrome: переменная CHROME_PATH или типичные места установки.
import fs from 'node:fs'

const CANDIDATES = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
]

export function chromePath() {
  const found = process.env.CHROME_PATH || CANDIDATES.find((p) => fs.existsSync(p))
  if (!found) throw new Error('Chrome не найден: задайте CHROME_PATH')
  return found
}
