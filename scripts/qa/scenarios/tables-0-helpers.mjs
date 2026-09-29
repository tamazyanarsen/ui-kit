// Общие помощники сценариев группы «таблицы и экраны». Сам файл сценариев не содержит
// (пустой массив), другие tables-*.mjs импортируют отсюда.
export default []

/** Перезагружает историю с аргументами Storybook, например args('empty:true;block:false'). */
export async function withArgs(page, args) {
  const url = new URL(page.url())
  url.searchParams.set('args', args)
  await page.goto(url.href, { waitUntil: 'load' })
  await page.waitForFunction(() => document.body.classList.contains('sb-show-main'))
  await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForFunction(() => (document.querySelector('#storybook-root')?.children.length ?? 0) > 0)
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))))
}

/**
 * История DataTable («По конфигу полей») передаёт в `onRowClick` пустую функцию, наружу переход не виден.
 * Подменяем её на запись ключа строки в window.__rowClicks (правка бандла истории на лету) и перезагружаем.
 */
export async function trackRowClicks(page) {
  let patched = false
  await page.route(/table\.stories.*\.js/, async (route) => {
    const res = await route.fetch()
    let body = await res.text()
    const next = body.replace(/onRowClick:(\w+)\?\(\)=>\{\}:void 0/, (_, c) => {
      patched = true
      return `onRowClick:${c}?(r,k)=>{(window.__rowClicks=window.__rowClicks||[]).push(k)}:void 0`
    })
    await route.fulfill({ response: res, body: next })
  })
  await page.reload({ waitUntil: 'load' })
  await page.waitForFunction(() => document.body.classList.contains('sb-show-main'))
  await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}' })
  await page.evaluate(() => document.fonts.ready)
  if (!patched) throw new Error('не удалось подменить onRowClick в бандле истории (изменился код истории?)')
  return () => page.evaluate(() => window.__rowClicks || [])
}

/** Таблица номер n внутри #storybook-root. */
export const tableAt = (page, n = 0) => page.locator('#storybook-root table').nth(n)

/** Текст первой ячейки каждой строки тела (по порядку), без итоговой строки при noTotal. */
export const firstCells = (table) =>
  table.locator('tbody tr').evaluateAll((rows) =>
    rows.map((r) => (r.querySelector('td[data-type=text], td[data-type=number]') || r.querySelector('td'))?.innerText.replace(/\s+/g, ' ').trim())
  )

/** aria-checked всех чекбоксов выбора строк (первая ячейка). */
export const rowChecks = (table) =>
  table.locator('tbody tr').evaluateAll((rows) => rows.map((r) => r.querySelector('td:first-child [role=checkbox]')?.getAttribute('aria-checked') ?? null))

/** Текст чёрной панели выбора («Выбрано 1 из 5») либо null. */
export const panelInfo = (page) =>
  page.evaluate(() => {
    const el = document.querySelector('[data-slot=button-menu-black-info]')
    return el ? el.innerText.replace(/\s+/g, ' ').trim() : null
  })

/** Ждёт, пока условие станет истинным (опрос раз в 50 мс), иначе кидает ошибку с сообщением. */
export async function until(cond, msg, timeout = 3000) {
  const end = Date.now() + timeout
  for (;;) {
    if (await cond()) return
    if (Date.now() > end) throw new Error('не дождались: ' + msg)
    await new Promise((r) => setTimeout(r, 50))
  }
}

/**
 * Оборачивает сценарии: перед шагами ждём, пока история реально отрисована (`sb-show-main` ставится раньше
 * первого рендера React), иначе первое же чтение DOM могло увидеть пустой корень.
 */
export function ready(defs) {
  return defs.map((d) => ({
    ...d,
    run: async (ctx) => {
      await ctx.page.waitForFunction(() => (document.querySelector('#storybook-root')?.children.length ?? 0) > 0)
      await ctx.page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))))
      return d.run(ctx)
    },
  }))
}

/** Как expect.eq, но ждёт до `timeout` мс, пока значение из `get` станет равным `want` (асинхронные обновления). */
export async function eventually(expect, get, want, msg, timeout = 3000) {
  const end = Date.now() + timeout
  let got = await get()
  while (JSON.stringify(got) !== JSON.stringify(want) && Date.now() < end) {
    await new Promise((r) => setTimeout(r, 50))
    got = await get()
  }
  expect.eq(got, want, msg)
}
