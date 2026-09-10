// Модель страницы «Помощь» — канвас `ПЕСОЧНИЦА_ПОМОЩЬ` 70400:25863.
//
// Страница описана тремя кадрами: сам экран (70400:30488), секция «Как
// работает поиск» (70400:31096) и секция «Как работает скролл»
// (70400:31943). Данные здесь — ровно то, чем эти кадры оперируют: дерево
// разделов слева и темы («вопросы») справа.

/** Вложение темы — строка `IB / files` (нода 70400:27799). */
interface HelpFile {
  name: string
  meta: string
}

/**
 * Кусок содержимого темы. Эталон складывает тему из абзацев, нумерованных
 * списков, ссылок и картинок-заглушек, поэтому текст темы — не строка, а
 * последовательность блоков.
 */
type HelpBlock =
  | { kind: "text"; text: string }
  /** Абзац, в котором перевод строки значим (условия кредитования). */
  | { kind: "lines"; lines: string[] }
  | { kind: "list"; intro?: string; items: string[] }
  | { kind: "link"; label: string }
  /**
   * Картинка или видео. В макете это пустые прямоугольники: у `image 2` и
   * скриншота стоит рамка Grey 134 с радиусом 8, у видео (`image 3`) рамки
   * нет вовсе — здесь она добавлена, иначе на белой карточке видеоблок
   * читается как дыра.
   */
  | { kind: "media"; height: number; width?: number; title?: string }

/** Тема раздела — «Вопрос N» в макете. Заголовок H4, содержимое — блоки. */
interface HelpTopic {
  value: string
  title: string
  body: HelpBlock[]
  files?: HelpFile[]
}

/** Призыв к действию под темами раздела — кадр `CTA` 70400:31230. */
interface HelpCta {
  text: string
  action: string
}

/** Лист дерева разделов — `SideBar List (ELK)`. */
interface HelpSection {
  value: string
  title: string
  topics: HelpTopic[]
  cta?: HelpCta
}

/** Группа разделов — `Sidebar Item (ELK)` с раскрывающимся списком. */
interface HelpGroup {
  value: string
  title: string
  children: HelpSection[]
}

type HelpNode = HelpSection | HelpGroup

function isGroup(node: HelpNode): node is HelpGroup {
  return "children" in node
}

/** Все листья дерева по порядку — по ним идёт выбор «первого по списку». */
function flattenSections(nodes: HelpNode[]): HelpSection[] {
  return nodes.flatMap((node) => (isGroup(node) ? node.children : [node]))
}

/** Плоский текст темы — то, по чему ищет полнотекстовый поиск. */
function topicText(topic: HelpTopic): string {
  const body = topic.body.map((block) => {
    switch (block.kind) {
      case "text":
        return block.text
      case "lines":
        return block.lines.join(" ")
      case "list":
        return [block.intro, ...block.items].filter(Boolean).join(" ")
      case "link":
        return block.label
      case "media":
        return block.title ?? ""
    }
  })

  return [topic.title, ...body, ...(topic.files ?? []).map((f) => f.name)].join(
    " "
  )
}

export { flattenSections, isGroup, topicText }
export type {
  HelpBlock,
  HelpCta,
  HelpFile,
  HelpGroup,
  HelpNode,
  HelpSection,
  HelpTopic,
}
