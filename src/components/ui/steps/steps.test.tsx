import { afterEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Steps } from "./steps"

describe("Steps", () => {
  afterEach(() => vi.restoreAllMocks())

  // `scrollIntoView` крутил и окно: Steps ниже первого экрана утаскивал к
  // себе страницу при загрузке. Прокручиваться должна только лента.
  it("выводит активный шаг в центр ленты, не трогая остальные прокрутки", () => {
    const scrollIntoView = vi.fn()
    Element.prototype.scrollIntoView = scrollIntoView
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
      this: HTMLElement
    ) {
      if (this.dataset.slot === "steps-strip") {
        return { left: 0, width: 400 } as DOMRect
      }
      // Второй шаг — активный — стоит правее центра ленты на 300px.
      return { left: 450, width: 100 } as DOMRect
    })
    render(
      <Steps
        steps={[
          { title: "Шаг 1", description: "а" },
          { title: "Шаг 2", description: "б", state: "active" },
        ]}
      />
    )
    const strip = document.querySelector<HTMLElement>('[data-slot="steps-strip"]')!
    expect(scrollIntoView).not.toHaveBeenCalled()
    expect(strip.scrollLeft).toBe(300)
  })

  it("renders each step's title and description", () => {
    render(
      <Steps
        steps={[
          { title: "Шаг 1", description: "Заполнение" },
          { title: "Шаг 2", description: "Проверка" },
        ]}
      />
    )
    expect(screen.getByText("Шаг 1")).toBeInTheDocument()
    expect(screen.getByText("Проверка")).toBeInTheDocument()
  })

  it("is clickable only when a step has onClick and isn't disabled", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Steps
        steps={[
          { title: "Шаг 1", description: "Заполнение", onClick },
          { title: "Шаг 2", description: "Заблокирован", state: "disabled", onClick: vi.fn() },
        ]}
      />
    )

    await user.click(screen.getByText("Шаг 1"))
    expect(onClick).toHaveBeenCalledTimes(1)

    expect(screen.getByText("Шаг 2").closest('[data-slot="step"]')).not.toHaveAttribute(
      "role",
      "button"
    )
  })

  it("shows a tooltip hint on a disabled step", async () => {
    const user = userEvent.setup()
    render(
      <Steps
        steps={[
          {
            title: "Шаг 2",
            description: "Заблокирован",
            state: "disabled",
            disabledHint: "Заполните предыдущий шаг",
          },
        ]}
      />
    )

    await user.hover(screen.getByText("Шаг 2"))

    expect(
      await screen.findByText("Заполните предыдущий шаг")
    ).toBeInTheDocument()
  })

  // Ширина ленты 300, содержимого 900: в jsdom раскладки нет, поэтому
  // геометрию подставляем, а положение прокрутки двигаем сами.
  function mockStrip(scrollLeft: { value: number }) {
    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(300)
    vi.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockReturnValue(900)
    vi.spyOn(HTMLElement.prototype, "scrollLeft", "get").mockImplementation(
      () => scrollLeft.value
    )
  }

  const MANY = Array.from({ length: 6 }, (_, i) => ({
    title: `Шаг ${i + 1}`,
    description: "Заполнение",
  }))

  // Дизайн-чек от 08.10, замечание 20.
  it("в начале ленты — только правая стрелка, в середине — обе, в конце — только левая", () => {
    const position = { value: 0 }
    mockStrip(position)
    render(<Steps steps={MANY} />)
    const strip = document.querySelector('[data-slot="steps-strip"]')!

    expect(screen.queryByRole("button", { name: "Назад" })).toBeNull()
    expect(screen.getByRole("button", { name: "Далее" })).toBeInTheDocument()

    position.value = 300
    fireEvent.scroll(strip)
    expect(screen.getByRole("button", { name: "Назад" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Далее" })).toBeInTheDocument()

    position.value = 600
    fireEvent.scroll(strip)
    expect(screen.getByRole("button", { name: "Назад" })).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "Далее" })).toBeNull()
  })

  it("лента помещается целиком — стрелок нет", () => {
    render(<Steps steps={[{ title: "Шаг 1", description: "Заполнение" }]} />)
    expect(screen.queryByRole("button", { name: "Назад" })).toBeNull()
    expect(screen.queryByRole("button", { name: "Далее" })).toBeNull()
  })

  it("showLeftFade/showRightFade = false запрещают стрелки даже при переполнении", () => {
    mockStrip({ value: 300 })
    render(<Steps steps={MANY} showLeftFade={false} showRightFade={false} />)
    expect(screen.queryByRole("button", { name: "Назад" })).toBeNull()
    expect(screen.queryByRole("button", { name: "Далее" })).toBeNull()
  })

  it("стрелки вызывают свои обработчики", async () => {
    mockStrip({ value: 300 })
    const user = userEvent.setup()
    const onClickLeft = vi.fn()
    const onClickRight = vi.fn()
    render(
      <Steps steps={MANY} onClickLeft={onClickLeft} onClickRight={onClickRight} />
    )

    await user.click(screen.getByRole("button", { name: "Назад" }))
    await user.click(screen.getByRole("button", { name: "Далее" }))

    expect(onClickLeft).toHaveBeenCalledTimes(1)
    expect(onClickRight).toHaveBeenCalledTimes(1)
  })
})
