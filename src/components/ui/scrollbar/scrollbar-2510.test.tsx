import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { act, fireEvent, render } from "@testing-library/react"

import { startOverlayScrollbars } from "@/lib/overlay-scrollbar"

import { PageScrollbar } from "./page-scrollbar"
import { Scrollbar } from "./scrollbar"

// Правки UI-Kit от 25.10: «Scrollbar — родные полосы браузера вместо полос
// кита» и «Scrollbar — видимость полосы и передача прокрутки странице».
// В jsdom нет раскладки: размеры областей подставлены через прототип, ширина
// окна и наличие мыши — через `matchMedia`.

const DESKTOP = "(min-width: 1280px)"
let media: Record<string, boolean> = {}

function mockMedia(next: Record<string, boolean>) {
  media = next
  window.matchMedia = (query: string) =>
    ({
      matches: media[query] ?? false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList
}

const sizes = { clientHeight: 200, scrollHeight: 1000, clientWidth: 300, scrollWidth: 300 }
const originals = new Map<string, PropertyDescriptor | undefined>()

// Утилит Tailwind в jsdom нет — ось прокрутки области задаём сами.
const sheet = document.createElement("style")
sheet.textContent = ".overflow-y-auto { overflow-y: auto } .overflow-x-hidden { overflow-x: hidden }"
document.head.appendChild(sheet)

beforeEach(() => {
  mockMedia({ [DESKTOP]: true, "(hover: hover)": true })
  for (const [key, value] of Object.entries(sizes)) {
    originals.set(key, Object.getOwnPropertyDescriptor(HTMLElement.prototype, key))
    Object.defineProperty(HTMLElement.prototype, key, {
      configurable: true,
      get() {
        return this.classList?.contains("themed-scrollbar") ? value : 0
      },
    })
  }
})

afterEach(() => {
  for (const [key, descriptor] of originals) {
    if (descriptor) Object.defineProperty(HTMLElement.prototype, key, descriptor)
    else delete (HTMLElement.prototype as unknown as Record<string, unknown>)[key]
  }
  vi.useRealTimers()
})

function area(container: HTMLElement) {
  return container.querySelector<HTMLElement>('[data-slot="scrollbar"]')!
}
function bar(container: HTMLElement) {
  return container.querySelector<HTMLElement>('[data-ovs-bar="y"]')
}

describe("Scrollbar — наложенная полоса", () => {
  it("подключается к области: родная скрыта (data-ovs), своя полоса — первым ребёнком", () => {
    const { container } = render(
      <Scrollbar>
        <p>Содержимое</p>
      </Scrollbar>
    )
    const el = area(container)
    expect(el).toHaveAttribute("data-ovs")
    expect(el.firstElementChild).toBe(bar(container))
    expect(bar(container)).toHaveAttribute("aria-hidden", "true")
    // бегунок 200/1000 от дорожки 200
    expect(bar(container)!.querySelector<HTMLElement>(".kit-ovs-thumb")!.style.height).toBe("40px")
  })

  it("прокручивать нечего — узла полосы нет", () => {
    Object.defineProperty(HTMLElement.prototype, "scrollHeight", {
      configurable: true,
      get() {
        return 200
      },
    })
    const { container } = render(<Scrollbar>Мало</Scrollbar>)
    expect(bar(container)).toBeNull()
  })

  it("спрятанная потребителем полоса (`[scrollbar-width:none]`) не рисуется", () => {
    const { container } = render(<Scrollbar className="[scrollbar-width:none]">x</Scrollbar>)
    expect(bar(container)).toBeNull()
  })

  it("нажатие на дорожку листает на 90 % высоты", () => {
    const { container } = render(<Scrollbar>x</Scrollbar>)
    fireEvent.pointerDown(bar(container)!, { clientY: 190, button: 0 })
    expect(area(container).scrollTop).toBe(180)
  })

  it("бегунок перетаскивается", () => {
    const { container } = render(<Scrollbar>x</Scrollbar>)
    const el = bar(container)!
    fireEvent.pointerDown(el, { clientY: 10, button: 0 })
    fireEvent.pointerMove(el, { clientY: 50 })
    // 40 px по дорожке × (800 / 160)
    expect(area(container).scrollTop).toBe(200)
    fireEvent.pointerUp(el, { clientY: 50 })
  })

  it("колесо над полосой листает её область", () => {
    const { container } = render(<Scrollbar>x</Scrollbar>)
    const event = new WheelEvent("wheel", { deltaY: 120, bubbles: true, cancelable: true })
    bar(container)!.dispatchEvent(event)
    expect(event.defaultPrevented).toBe(true)
    expect(area(container).scrollTop).toBe(120)
  })
})

describe("Scrollbar — видимость", () => {
  it("always на десктопе с мышью — видна сразу", () => {
    const { container } = render(<Scrollbar>x</Scrollbar>)
    expect(bar(container)).toHaveAttribute("data-visible")
  })

  it("hover — при наведении на область и во время прокрутки", () => {
    vi.useFakeTimers()
    const { container } = render(<Scrollbar visibility="hover">x</Scrollbar>)
    const el = area(container)
    expect(bar(container)).not.toHaveAttribute("data-visible")
    fireEvent.pointerEnter(el, { pointerType: "mouse" })
    expect(bar(container)).toHaveAttribute("data-visible")
    fireEvent.pointerLeave(el, { pointerType: "mouse" })
    expect(bar(container)).not.toHaveAttribute("data-visible")
    fireEvent.scroll(el)
    expect(bar(container)).toHaveAttribute("data-visible")
    act(() => void vi.advanceTimersByTime(800))
    expect(bar(container)).not.toHaveAttribute("data-visible")
  })

  it("hover в блоке — наведение на весь блок, не только на окно прокрутки", () => {
    const { container } = render(
      <section data-slot="card-box">
        <h2>Заголовок</h2>
        <Scrollbar visibility="hover">x</Scrollbar>
      </section>
    )
    const block = container.querySelector("section")!
    fireEvent.pointerEnter(block, { pointerType: "mouse" })
    expect(bar(container)).toHaveAttribute("data-visible")
    fireEvent.pointerLeave(block, { pointerType: "mouse" })
    expect(bar(container)).not.toHaveAttribute("data-visible")
  })

  it("в мобильном виде always ведёт себя как scroll", () => {
    vi.useFakeTimers()
    mockMedia({ "(hover: hover)": true })
    const { container } = render(<Scrollbar>x</Scrollbar>)
    expect(bar(container)).not.toHaveAttribute("data-visible")
    fireEvent.scroll(area(container))
    expect(bar(container)).toHaveAttribute("data-visible")
    act(() => void vi.advanceTimersByTime(800))
    expect(bar(container)).not.toHaveAttribute("data-visible")
  })

  it("на тач-устройстве (hover: none) — только во время прокрутки", () => {
    mockMedia({ [DESKTOP]: true, "(hover: none)": true })
    const { container } = render(<Scrollbar>x</Scrollbar>)
    expect(bar(container)).not.toHaveAttribute("data-visible")
  })

  it("ViewportScope mobile перебивает ширину окна", () => {
    const { container } = render(
      <div data-viewport="mobile">
        <Scrollbar>x</Scrollbar>
      </div>
    )
    expect(bar(container)).not.toHaveAttribute("data-visible")
  })
})

describe("Scrollbar — передача колеса (visibility=hover)", () => {
  it("докрученный до края блок держит колесо 500 мс, потом листает страницу", () => {
    vi.useFakeTimers()
    vi.setSystemTime(10_000)
    const scrollBy = vi.fn()
    window.scrollBy = scrollBy as unknown as typeof window.scrollBy
    const { container } = render(<Scrollbar visibility="hover">x</Scrollbar>)
    const el = area(container)
    el.scrollTop = 800
    fireEvent.scroll(el)

    const wheel = () => {
      const event = new WheelEvent("wheel", { deltaY: 100, bubbles: true, cancelable: true })
      el.dispatchEvent(event)
      return event
    }
    vi.setSystemTime(10_050)
    expect(wheel().defaultPrevented).toBe(true)
    expect(scrollBy).not.toHaveBeenCalled()
    vi.setSystemTime(10_550)
    expect(wheel().defaultPrevented).toBe(true)
    expect(scrollBy).toHaveBeenCalledWith(0, 100)
  })

  it("без режима блока колесо не перехватывается", () => {
    const { container } = render(<Scrollbar>x</Scrollbar>)
    const el = area(container)
    el.scrollTop = 800
    const event = new WheelEvent("wheel", { deltaY: 100, bubbles: true, cancelable: true })
    el.dispatchEvent(event)
    expect(event.defaultPrevented).toBe(false)
  })

  it("на устройстве без наведения колесо не перехватывается", () => {
    mockMedia({ [DESKTOP]: true })
    const { container } = render(<Scrollbar visibility="hover">x</Scrollbar>)
    const el = area(container)
    el.scrollTop = 800
    fireEvent.scroll(el)
    const event = new WheelEvent("wheel", { deltaY: 100, bubbles: true, cancelable: true })
    el.dispatchEvent(event)
    expect(event.defaultPrevented).toBe(false)
  })
})

describe("автоподключение и полоса страницы", () => {
  it("голая область .themed-scrollbar получает полосу, пока запущено автоподключение", async () => {
    const stop = startOverlayScrollbars()
    const { container, unmount } = render(
      <div className="themed-scrollbar overflow-y-auto" data-testid="list">
        x
      </div>
    )
    // наблюдатель мутаций срабатывает микрозадачей
    await act(async () => {})
    const list = container.querySelector<HTMLElement>("[data-testid=list]")!
    expect(list).toHaveAttribute("data-ovs")
    unmount()
    stop()
  })

  it("textarea получает полосу соседом, а не ребёнком", async () => {
    const stop = startOverlayScrollbars()
    const { container } = render(
      <div>
        <textarea className="themed-scrollbar" style={{ overflowY: "auto" }} />
      </div>
    )
    await act(async () => {})
    const textarea = container.querySelector("textarea")!
    expect(textarea.previousElementSibling).toHaveAttribute("data-ovs-bar", "y")
    stop()
    expect(textarea).not.toHaveAttribute("data-ovs")
  })

  it("PageScrollbar прячет родную полосу страницы, пока смонтирован", () => {
    const { unmount } = render(<PageScrollbar />)
    expect(document.documentElement).toHaveAttribute("data-page-scrollbar")
    expect(document.querySelector('[data-slot="page-scrollbar"] [data-kind="page"]')).not.toBeNull()
    unmount()
    expect(document.documentElement).not.toHaveAttribute("data-page-scrollbar")
  })
})
