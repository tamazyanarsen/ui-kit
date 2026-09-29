// Оркестратор проверки в живом браузере.
//   npm run qa -- build <имя>              собрать Storybook в .qa/<имя>
//   npm run qa -- audit <имя> [base|hard]  прогнать все истории (по умолчанию base), результат в .qa/out/<имя>-<режим>
//   npm run qa -- compare <а> <б>          сверить скриншоты двух прогонов (.qa/out/<а>, .qa/out/<б>)
//   npm run qa -- drill <имя> <id...>      какой текстовый аргумент растягивает страницу на 375
//   npm run qa -- scenarios <имя> [--filter текст]   записанные сценарии взаимодействия (scripts/qa/scenarios)
//   npm run qa -- fuzz <имя> [--iterations 25 --seed 1]  случайные сочетания пропсов по argTypes
// Типичный цикл: build before → audit before base → правка → build after → audit after base → compare before-base after-base.
import { spawn, spawnSync } from 'node:child_process'
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'

const [cmd, ...rest] = process.argv.slice(2)
const ROOT = '.qa'
const here = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'))
// Асинхронно: сервер статики живёт в этом же процессе, синхронный запуск заблокировал бы его.
const node = (script, args) =>
  new Promise((resolve) => spawn(process.execPath, [path.join(here, script), ...args], { stdio: 'inherit' }).on('exit', (code) => resolve(code)))

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.png': 'image/png' }
function serve(dir) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const url = decodeURIComponent(req.url.split('?')[0])
      let file = path.join(dir, url === '/' ? 'index.html' : url)
      if (!file.startsWith(path.resolve(dir)) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end() }
      res.writeHead(200, { 'content-type': MIME[path.extname(file)] || 'application/octet-stream' })
      fs.createReadStream(file).pipe(res)
    })
    server.listen(0, () => resolve({ server, url: `http://localhost:${server.address().port}` }))
  })
}

if (cmd === 'build') {
  const name = rest[0] || 'head'
  process.exit(spawnSync('npx', ['storybook', 'build', '-o', path.join(ROOT, name), '--quiet'], { stdio: 'inherit', shell: true, env: { ...process.env, STORYBOOK_QA: '1' } }).status ?? 0)
} else if (cmd === 'audit' || cmd === 'drill' || cmd === 'scenarios' || cmd === 'fuzz') {
  const [name, ...more] = rest
  const dir = path.resolve(ROOT, name)
  if (!fs.existsSync(dir)) { console.error(`Нет сборки ${dir}: сначала npm run qa -- build ${name}`); process.exit(1) }
  const { server, url } = await serve(dir)
  let code
  if (cmd === 'audit') {
    const mode = more[0] === 'hard' ? 'hard' : 'base'
    code = await node('audit.mjs', ['--sb', url, '--mode', mode, '--out', path.join(ROOT, 'out', `${name}-${mode}`), ...more.slice(1)])
  } else if (cmd === 'scenarios') {
    code = await node('scenarios.mjs', ['--sb', url, ...more])
  } else if (cmd === 'fuzz') {
    code = await node('fuzz.mjs', ['--sb', url, '--out', path.join(ROOT, 'out', `${name}-fuzz`), ...more])
  } else {
    process.env.SB = url
    code = await node('drill.mjs', more)
  }
  server.close()
  process.exit(code ?? 0)
} else if (cmd === 'compare') {
  process.exit(await node('compare.mjs', [path.join(ROOT, 'out', rest[0]), path.join(ROOT, 'out', rest[1])]))
} else {
  console.error('Команды: build <имя> | audit <имя> [base|hard] | compare <а> <б> | drill <имя> <id...> | scenarios <имя> | fuzz <имя>')
  process.exit(1)
}
