import { afterEach, describe, expect, it, vi } from "vitest"

import { availableWidth } from "./available-width"

// Круг проверки r3/r3b: свободное место для ужатого по содержимому корня
// Switcher сначала считалось арифметикой по соседям — и ломалось на `ml-auto`
// у кнопки справа (вычисленный отступ = всё свободное место), на растущем
// соседе и на корне шире родителя. Теперь корень на время замера
// растягивается, а место считает сама раскладка. jsdom раскладки не знает,
// поэтому «раскладка» здесь — ширина, которую корень получил бы при
// выставленном стиле растяжения.

/** Корень ужат по содержимому: один сегмент шириной `content`. */
function buildRoot(parentDisplay: "flex" | "block", content: number) {
  const parent = document.createElement("div")
  parent.style.display = parentDisplay
  const root = document.createElement("div")
  root.style.display = "inline-flex"
  const segment = document.createElement("button")
  root.append(segment)
  parent.append(root)
  document.body.append(parent)

  const box = (width: number) =>
    ({ width, height: 40, top: 0, left: 0, right: width, bottom: 40 }) as DOMRect
  vi.spyOn(segment, "getBoundingClientRect").mockReturnValue(box(content))
  vi.spyOn(root, "getBoundingClientRect").mockReturnValue(box(content))
  return { parent, root }
}

/** Что даст раскладка корню: растянутому — `stretched`, иначе — `own`. */
function mockLayout(root: HTMLElement, own: number, stretched: number) {
  vi.spyOn(root, "clientWidth", "get").mockImplementation(() =>
    root.style.flex === "1 1 auto" || root.style.width === "100%" ? stretched : own
  )
}

describe("availableWidth: место считает раскладка, а не сумма соседей", () => {
  afterEach(() => {
    vi.restoreAllMocks()
    document.body.innerHTML = ""
  })

  it("во flex-ряду ужатый корень получает долю растянутого — в том числе место ml-auto соседа", () => {
    const { root } = buildRoot("flex", 150)
    // Ряд 900, кнопка справа с ml-auto: растянутый корень получил бы 618.
    mockLayout(root, 150, 618)
    expect(availableWidth(root)).toBe(618)
  })

  it("корень шире родителя получает меньше своего содержимого — и свернётся", () => {
    const { root } = buildRoot("block", 524)
    mockLayout(root, 524, 300)
    expect(availableWidth(root)).toBe(300)
  })

  it("стили растяжения возвращаются сразу после замера", () => {
    const { root } = buildRoot("flex", 150)
    root.style.minWidth = "10px"
    mockLayout(root, 150, 618)
    availableWidth(root)
    expect(root.style.flex).toBe("")
    expect(root.style.minWidth).toBe("10px")
    expect(root.style.width).toBe("")
  })

  // Круг r3c: растянутый корень с основой 0% делил место с распоркой
  // `flex-1` поровну и «переезжал» в чужую строку в ряду с переносом.
  // Теперь основа — auto (строка не меняется), а соседи на время замера не
  // растут — и всё возвращается как было.
  it("во flex-ряду соседи на время замера не растут, потом всё восстанавливается", () => {
    const { parent, root } = buildRoot("flex", 150)
    const spacer = document.createElement("div")
    spacer.style.flexGrow = "1"
    parent.append(spacer)
    let spacerGrowDuringMeasure = ""
    vi.spyOn(root, "clientWidth", "get").mockImplementation(() => {
      if (root.style.flex === "1 1 auto") spacerGrowDuringMeasure = spacer.style.flexGrow
      return 150
    })
    availableWidth(root)
    expect(spacerGrowDuringMeasure).toBe("0")
    expect(spacer.style.flexGrow).toBe("1")
    expect(root.style.flex).toBe("")
  })

  // Grid-трек `auto` и родитель по содержимому: растяжение места не даёт,
  // ширина сама зависит от содержимого. Вычитая свои отступы, мера
  // скатывала ряд по сегменту за пересчёт до одного — поэтому здесь своя
  // ширина целиком, как раньше.
  it("если растяжение не дало места, мера — своя ширина вместе с отступами", () => {
    const { root } = buildRoot("block", 266)
    root.style.padding = "4px"
    // Корень 266 = сегмент 258 + отступы 2 × 4: ужат по содержимому.
    vi.spyOn(root.firstElementChild as HTMLElement, "getBoundingClientRect").mockReturnValue({
      width: 258, height: 40, top: 0, left: 0, right: 258, bottom: 40,
    } as DOMRect)
    mockLayout(root, 266, 266)
    expect(availableWidth(root)).toBe(266)
  })

  it("корень с заданной снаружи шириной меряет сам себя", () => {
    const { root } = buildRoot("flex", 150)
    // Ширина корня 300 ≠ содержимому 150: задана снаружи.
    vi.spyOn(root, "getBoundingClientRect").mockReturnValue({
      width: 300, height: 40, top: 0, left: 0, right: 300, bottom: 40,
    } as DOMRect)
    mockLayout(root, 300, 618)
    expect(availableWidth(root)).toBe(300)
  })
})
