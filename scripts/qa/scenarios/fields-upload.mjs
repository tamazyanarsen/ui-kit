// File Upload (dropzone): перетаскивание над дочерними узлами без мерцания, drop, accept, выбор нескольких файлов
// через input[type=file], открытие окна выбора мышью и клавиатурой, disabled.
import { setArgs, fold } from './fields-lib.mjs'

const PLAY = 'компоненты-file-upload--playground'
const STEP2 = 'песочница-подача-заявки-на-кредит-шаг-2--default'
const ZONE = '[data-slot=file-upload-dropzone]'

const txt = (name, body = 'hello') => ({ name, mimeType: 'text/plain', buffer: Buffer.from(body) })
const png = (name) => ({ name, mimeType: 'image/png', buffer: Buffer.from('x') })

// Событие перетаскивания на узел внутри зоны; `of` — сокращённый выбор узла: zone | icon | text | subtitle.
async function drag(page, type, of = 'zone', { files = false } = {}) {
  return page.evaluate(([type, of, files, sel]) => {
    const zone = document.querySelector(sel)
    const target = { zone, icon: zone.querySelector('svg'), text: zone.querySelector('.text-link') ?? zone.querySelectorAll('span')[1], subtitle: zone.lastElementChild }[of]
    const dt = new DataTransfer()
    if (files) dt.items.add(new File(['hello'], 'dropped.txt', { type: 'text/plain' }))
    const event = new DragEvent(type, { bubbles: true, cancelable: true, dataTransfer: dt })
    target.dispatchEvent(event)
    return event.defaultPrevented
  }, [type, of, files, ZONE])
}
const bg = (page) => page.locator(ZONE).evaluate((e) => getComputedStyle(e).backgroundColor)

const all = [
  {
    name: 'file-upload: перетаскивание над зоной подсвечивает её, уход с зоны возвращает исходный фон',
    story: PLAY,
    run: async ({ page, expect, step }) => {
      await page.locator(ZONE).waitFor()
      const normal = await bg(page)
      step('dragenter + dragover')
      await drag(page, 'dragenter')
      await drag(page, 'dragover')
      const hover = await bg(page)
      expect(hover !== normal, `фон при перетаскивании отличается от обычного (${hover})`)
      step('dragleave')
      await drag(page, 'dragleave')
      expect.eq(await bg(page), normal, 'фон вернулся')
    },
  },
  {
    name: 'file-upload: переход курсора с зоны на значок, текст и подпись не гасит подсветку (без мерцания)',
    story: PLAY,
    run: async ({ page, expect, step }) => {
      await page.locator(ZONE).waitFor()
      const normal = await bg(page)
      await drag(page, 'dragenter')
      await drag(page, 'dragover')
      const hover = await bg(page)
      // Браузер при переходе на дочерний узел шлёт dragenter на него и dragleave на предыдущий.
      let previous = 'zone'
      for (const child of ['icon', 'text', 'subtitle']) {
        step(`переход ${previous} → ${child}`)
        await drag(page, 'dragenter', child)
        await drag(page, 'dragleave', previous)
        expect.eq(await bg(page), hover, `сразу после перехода на ${child} подсветка на месте`)
        await drag(page, 'dragover', child)
        expect.eq(await bg(page), hover, `после dragover на ${child}`)
        previous = child
      }
      step('уход из последнего узла за пределы зоны')
      await drag(page, 'dragleave', previous)
      expect.eq(await bg(page), normal, 'подсветка снята')
    },
  },
  {
    name: 'file-upload: повторный заход после ухода снова подсвечивает, а drop снимает подсветку',
    story: PLAY,
    run: async ({ page, expect, step }) => {
      await page.locator(ZONE).waitFor()
      const normal = await bg(page)
      await drag(page, 'dragenter')
      await drag(page, 'dragover')
      await drag(page, 'dragleave')
      expect.eq(await bg(page), normal, 'после ухода')
      step('второй заход через дочерний узел и drop')
      await drag(page, 'dragenter')
      await drag(page, 'dragenter', 'text')
      await drag(page, 'dragover', 'text')
      expect(normal !== (await bg(page)), 'подсветка есть')
      const prevented = await drag(page, 'drop', 'text', { files: true })
      expect.eq(prevented, true, 'drop отменяет открытие файла браузером')
      expect.eq(await bg(page), normal, 'после drop подсветка снята')
      step('следующее перетаскивание начинает счёт заново')
      await drag(page, 'dragenter')
      await drag(page, 'dragover')
      await drag(page, 'dragleave')
      expect.eq(await bg(page), normal, 'после ухода снова обычный фон (глубина сброшена drop-ом)')
    },
  },
  {
    name: 'file-upload: над включённой зоной dragover разрешает сброс, над выключенной — нет и подсветки нет',
    story: PLAY,
    run: async ({ page, expect, step }) => {
      await page.locator(ZONE).waitFor()
      expect.eq(await drag(page, 'dragover'), true, 'включённая: dragover отменён (сброс разрешён)')
      step('выключенная')
      await setArgs(page, { id: PLAY }, { state: 'disabled' })
      const normal = await bg(page)
      await drag(page, 'dragenter')
      expect.eq(await drag(page, 'dragover'), false, 'выключенная: сброс не разрешён')
      expect.eq(await bg(page), normal, 'фон не меняется')
      expect.eq(await drag(page, 'drop', 'zone', { files: true }), false, 'drop не перехватывается')
      expect.eq(await page.locator(ZONE).getAttribute('aria-disabled'), 'true', 'aria-disabled')
      expect.eq(await page.locator('input[type=file]').isDisabled(), true, 'input выключен')
    },
  },
  {
    name: 'file-upload: щелчок по зоне и Enter/Space на поле открывают окно выбора файлов, у выключенной — нет',
    story: PLAY,
    run: async ({ page, expect, step }) => {
      const input = page.locator('input[type=file]')
      await input.waitFor({ state: 'attached' })
      expect.eq(await input.getAttribute('multiple'), '', 'multiple по умолчанию')
      step('щелчок по подписи')
      const [chooser] = await Promise.all([page.waitForEvent('filechooser', { timeout: 10000 }), page.getByText('загрузите файлы').click()])
      expect.eq(chooser.isMultiple(), true, 'окно выбора нескольких файлов')
      await chooser.setFiles([]) // закрыть окно: неотвеченное окно выбора мешает открыть следующее
      step('клавиатура: Tab, Space')
      await page.keyboard.press('Tab')
      expect.eq(await page.evaluate(() => document.activeElement?.type), 'file', 'Tab фокусирует поле выбора')
      const [chooser2] = await Promise.all([page.waitForEvent('filechooser', { timeout: 10000 }), page.keyboard.press('Space')])
      expect(chooser2, 'Space открыл окно')
      await chooser2.setFiles([])
      const [chooser3] = await Promise.all([page.waitForEvent('filechooser', { timeout: 10000 }), page.keyboard.press('Enter')])
      expect(chooser3, 'Enter открыл окно')
      await chooser3.setFiles([])
      step('выключенная зона')
      await setArgs(page, { id: PLAY }, { state: 'disabled' })
      let opened = false
      page.once('filechooser', () => { opened = true })
      await page.locator(ZONE).click({ force: true })
      await page.evaluate(() => new Promise((r) => setTimeout(r, 400)))
      expect.eq(opened, false, 'окно не открылось')
    },
  },
  {
    name: 'file-upload: accept и multiple из аргументов доезжают до input, единственный выбор — без multiple',
    story: PLAY,
    run: async ({ page, expect }) => {
      const input = page.locator('input[type=file]')
      await setArgs(page, { id: PLAY }, { accept: '.pdf,.docx', multiple: false })
      expect.eq(await input.getAttribute('accept'), '.pdf,.docx', 'accept')
      expect.eq(await input.getAttribute('multiple'), null, 'multiple снят')
      const [chooser] = await Promise.all([page.waitForEvent('filechooser', { timeout: 10000 }), page.getByText('загрузите файлы').click()])
      expect.eq(chooser.isMultiple(), false, 'окно выбора одного файла')
      await chooser.setFiles([])
    },
  },

  {
    name: 'file-upload (заявка, шаг 2): несколько файлов через input попадают в список, файл не по accept отбрасывается',
    story: STEP2,
    run: async ({ page, expect, step }) => {
      const input = page.locator('input[type=file]')
      const items = page.locator('[data-slot=file-item]')
      await input.waitFor({ state: 'attached' })
      expect.eq(await input.getAttribute('accept'), '.txt', 'accept')
      const before = await items.count()
      step('два .txt и один .png одним выбором')
      await input.setInputFiles([txt('a.txt'), txt('b.txt'), png('c.png')])
      await page.getByText('b.txt', { exact: true }).waitFor()
      expect.eq(await items.count(), before + 2, 'добавлены только .txt')
      expect.eq(await page.getByText('c.png').count(), 0, '.png отброшен')
      step('поле выбора очищено — тот же файл можно выбрать снова')
      await input.setInputFiles([txt('a.txt')])
      await page.waitForFunction((n) => document.querySelectorAll('[data-slot=file-item]').length === n, before + 3)
      expect.eq(await page.getByText('a.txt', { exact: true }).count(), 2, 'a.txt дважды')
    },
  },
  {
    name: 'file-upload (заявка, шаг 2): выбор только неподходящего файла ничего не добавляет; удаление файла убирает строку',
    story: STEP2,
    run: async ({ page, expect, step }) => {
      const input = page.locator('input[type=file]')
      const items = page.locator('[data-slot=file-item]')
      await input.waitFor({ state: 'attached' })
      const before = await items.count()
      step('только .png')
      await input.setInputFiles([png('c.png')])
      await page.evaluate(() => new Promise((r) => setTimeout(r, 300)))
      expect.eq(await items.count(), before, 'список не изменился')
      step('добавить и удалить')
      await input.setInputFiles([txt('new.txt')])
      await page.getByText('new.txt', { exact: true }).waitFor()
      await items.filter({ hasText: 'new.txt' }).getByRole('button', { name: 'Удалить файл' }).click()
      await page.getByText('new.txt', { exact: true }).waitFor({ state: 'detached' })
      expect.eq(await items.count(), before, 'строка удалена')
    },
  },
  {
    name: 'file-upload (заявка, шаг 2): сброс файлов на зону добавляет только подходящие и снимает подсветку',
    story: STEP2,
    run: async ({ page, expect }) => {
      const zone = page.locator(ZONE)
      const items = page.locator('[data-slot=file-item]')
      await zone.waitFor()
      const before = await items.count()
      const normal = await bg(page)
      await page.evaluate((sel) => {
        const z = document.querySelector(sel)
        const dt = new DataTransfer()
        dt.items.add(new File(['1'], 'dropped.txt', { type: 'text/plain' }))
        dt.items.add(new File(['2'], 'dropped.png', { type: 'image/png' }))
        for (const type of ['dragenter', 'dragover', 'drop']) z.dispatchEvent(new DragEvent(type, { bubbles: true, cancelable: true, dataTransfer: dt }))
      }, ZONE)
      await page.getByText('dropped.txt', { exact: true }).waitFor()
      expect.eq(await items.count(), before + 1, 'добавлен один файл')
      expect.eq(await page.getByText('dropped.png').count(), 0, '.png отброшен')
      expect.eq(await bg(page), normal, 'подсветка снята')
    },
  },
]

export default fold(all, [
  ['file-upload: перетаскивание — подсветка, переходы на значок/текст/подпись без мерцания, повторный заход и drop', 'file-upload: перетаскивание над зоной', 'file-upload: переход курсора', 'file-upload: повторный заход'],
  ['file-upload: окно выбора по щелчку и с клавиатуры, accept и multiple из аргументов', 'file-upload: щелчок по зоне', 'file-upload: accept и multiple'],
  ['file-upload (заявка, шаг 2): выбор нескольких файлов, отбрасывание не по accept, повторный выбор, удаление', 'шаг 2): несколько файлов', 'шаг 2): выбор только неподходящего'],
])
