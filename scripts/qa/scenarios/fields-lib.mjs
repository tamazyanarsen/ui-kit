// Общие помощники сценариев групп «поля и маски» (fields-*.mjs). Сам файл сценариев не содержит:
// запускалка требует от каждого файла массив по умолчанию, поэтому он пустой.
export default []

const origin = (page) => new URL(page.url()).origin

/** Поле по нативному placeholder (у масок он уникален внутри истории «Маски ввода»). */
export const byPlaceholder = (page, text) => page.locator(`input[placeholder="${text}"]`)

export const PH = {
  phone: '+7 000 000-00-00',
  date: 'ДД.ММ.ГГГГ',
  time: 'ЧЧ:ММ',
  passport: '0000 000000',
  foreign: '00 0000000',
  card: '0000 0000 0000 0000',
  account: '00000 000 0 00000000000',
  inn: '000000000000',
  kpp: '000000000',
  kbk: '000 0 00 00000 00 0000 000',
  amount: '0 ₽',
}

/** История дорисовывается уже после «sb-show-main»: перед клавиатурой с Tab ждём саму разметку. */
export const ready = (page) => page.waitForSelector('#storybook-root [role], #storybook-root button, #storybook-root input')

/** Первая строка подписи (по aria-labelledby) у сфокусированного элемента. */
export const activeLabel = (page) =>
  page.evaluate(() => document.activeElement?.getAttribute('aria-labelledby') && document.getElementById(document.activeElement.getAttribute('aria-labelledby'))?.innerText.split('\n')[0])

/**
 * Дать странице обработать асинхронные события выделения (selectionchange): маска запоминает каретку по ним, и
 * действия, посланные подряд без паузы, под нагрузкой видят устаревшую каретку. Человек так быстро не действует.
 */
export const settle = (page) =>
  page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(resolve, 25)))))

/** Ctrl+A с паузой на событие выделения. */
export async function selectAll(page) {
  await page.keyboard.press('Control+A')
  await settle(page)
}

/** Выделение поля: [начало, конец]. */
export const sel = (el) => el.evaluate((e) => [e.selectionStart, e.selectionEnd])

/** Поставить каретку (или выделение) и сфокусировать поле. */
export async function caret(el, start, end = start) {
  await el.evaluate((e, [s, f]) => { e.focus(); e.setSelectionRange(s, f) }, [start, end])
  await settle(el.page())
}

/** Сфокусировать поле с кареткой в конце значения — как после щелчка правее текста. */
export async function focusEnd(el) {
  await el.evaluate((e) => { e.focus(); e.setSelectionRange(e.value.length, e.value.length) })
  await settle(el.page())
}

/** Набрать текст с клавиатуры в конец поля. */
export async function typeIn(page, el, text) {
  await focusEnd(el)
  await page.keyboard.type(text)
}

/**
 * Вставка текста в сфокусированное поле: сначала настоящее событие paste с текстом в clipboardData (его слушают
 * компоненты), затем вставка через execCommand('insertText') — браузер заменяет выделение и шлёт beforeinput/input.
 * Системный буфер обмена не нужен: он один на все вкладки браузера, и параллельные сценарии подсовывали друг другу
 * чужой текст. Отличие от Ctrl+V — только inputType (insertText вместо insertFromPaste); маска imask и код кита по
 * нему не различают.
 */
export async function paste(page, text) {
  await settle(page)
  await page.evaluate((t) => {
    const el = document.activeElement
    // Ctrl+V: маска запоминает выделение по keydown, как при настоящей вставке.
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'v', code: 'KeyV', ctrlKey: true, bubbles: true, cancelable: true }))
    const data = new DataTransfer()
    data.setData('text/plain', t)
    const event = new ClipboardEvent('paste', { clipboardData: data, bubbles: true, cancelable: true })
    if (el.dispatchEvent(event)) document.execCommand('insertText', false, t)
  }, text)
  await settle(page)
}

/** Изменить аргументы истории снаружи, как панель Controls (у Playground это «значение снаружи»). Ждёт конца перерисовки. */
export async function setArgs(page, story, args) {
  await page.evaluate(
    ([id, a]) => new Promise((resolve) => {
      const ch = window.__STORYBOOK_PREVIEW__.channel
      // Конец перерисовки: после storyRendered ждём, пока DOM «затихнет» (React коммитит асинхронно).
      let quiet
      const mo = new MutationObserver(() => { clearTimeout(quiet); quiet = setTimeout(finish, 120) })
      const finish = () => { clearTimeout(quiet); clearTimeout(limit); mo.disconnect(); ch.off('storyRendered', onRendered); resolve() }
      const limit = setTimeout(finish, 4000)
      const onRendered = () => { clearTimeout(quiet); quiet = setTimeout(finish, 120) }
      mo.observe(document.body, { subtree: true, childList: true, attributes: true, characterData: true })
      ch.on('storyRendered', onRendered)
      ch.emit('updateStoryArgs', { storyId: id, updatedArgs: a })
    }),
    [story.id, args],
  )
}

/** Открыть историю заново с аргументами в адресе (`resendSeconds:2;length:4`) — для значений, которые компонент читает один раз. */
export async function reopen(page, story, args) {
  await page.goto(`${origin(page)}/iframe.html?id=${encodeURIComponent(story.id)}&viewMode=story&args=${encodeURIComponent(args)}`, { waitUntil: 'load' })
  await page.waitForFunction(() => document.body.classList.contains('sb-show-main'))
  await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}' })
}

/**
 * Свернуть родственные сценарии одной истории в один: `groups` — список [имя, ...подстроки имён сценариев].
 * Подсценарии идут по порядку, между ними история открывается заново (аргументы и введённое не тянутся дальше),
 * а ошибка получает приставку с именем подсценария. Несвернутые сценарии остаются как есть.
 * Подстрока должна находить ровно один сценарий — иначе ошибка при загрузке файла, а не тихая потеря.
 */
export function fold(list, groups) {
  const used = new Set()
  const out = []
  const folded = new Map()
  for (const [name, ...parts] of groups) {
    const subs = parts.map((part) => {
      const found = list.filter((s) => s.name.includes(part))
      if (found.length !== 1) throw new Error(`fold: «${part}» нашла ${found.length} сценариев`)
      used.add(found[0])
      return found[0]
    })
    const story = subs[0].story
    if (subs.some((s) => s.story !== story || String(s.viewport) !== String(subs[0].viewport))) throw new Error(`fold: разные истории в группе «${name}»`)
    folded.set(subs[0], {
      name,
      story,
      viewport: subs[0].viewport,
      run: async (ctx) => {
        for (const [i, sub] of subs.entries()) {
          if (i > 0) await freshStory(ctx.page, ctx.story)
          try {
            await sub.run(ctx)
          } catch (e) {
            e.message = `[${sub.name}] ${e.message}`
            throw e
          }
        }
      },
    })
  }
  for (const s of list) {
    if (folded.has(s)) out.push(folded.get(s))
    else if (!used.has(s)) out.push(s)
  }
  return out
}

/** Та же история без аргументов из адреса и без следов прошлого подсценария. */
async function freshStory(page, story) {
  await page.goto(`${origin(page)}/iframe.html?id=${encodeURIComponent(story.id)}&viewMode=story`, { waitUntil: 'load' })
  await page.waitForFunction(() => document.body.classList.contains('sb-show-main'))
  await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}' })
  // Разметка истории дорисовывается уже после «sb-show-main».
  await page.waitForSelector('#storybook-root *', { state: 'attached' })
}
