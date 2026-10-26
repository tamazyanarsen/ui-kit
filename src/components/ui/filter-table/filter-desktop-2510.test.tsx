// Поповер фильтра — десктопная форма (уже 1280 вместо него штора).
import "@/test/desktop-viewport"

import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { FilterRange, FilterSelect } from "."
import { FilterShell } from "./shell"

// Правки UI-Kit от 25.10: FilterSelect (поиск по умолчанию, поля списка,
// строки `menu-row`), FilterShell (шеврон поворотом, зона крестика).

const options = (count: number) =>
  Array.from({ length: count }, (_, index) => ({
    value: String(index),
    label: `Вариант ${index + 1}`,
  }))

const chipLabel = () =>
  document.querySelector('[data-slot="filter-label"]')!.textContent

const popup = () =>
  document.querySelector('[data-slot="filter-content"]') as HTMLElement

describe("FilterSelect: поиск по умолчанию и поля списка", () => {
  it("3 варианта — без поля поиска", async () => {
    render(<FilterSelect label="Статус" options={options(3)} />)
    await userEvent.setup().click(screen.getByText("Статус"))
    expect(popup()).not.toBeNull()
    expect(screen.queryByRole("textbox")).toBeNull()
  })

  it("8 вариантов — поиск появляется сам", async () => {
    render(<FilterSelect label="Статус" options={options(8)} />)
    await userEvent.setup().click(screen.getByText("Статус"))
    expect(screen.getByRole("textbox")).toBeInTheDocument()
  })

  it("явный searchable решает сам", async () => {
    const user = userEvent.setup()
    const { unmount } = render(
      <FilterSelect label="Статус" options={options(12)} searchable={false} />
    )
    await user.click(screen.getByText("Статус"))
    expect(screen.queryByRole("textbox")).toBeNull()
    unmount()
    render(<FilterSelect label="Тип" options={options(2)} searchable />)
    await user.click(screen.getByText("Тип"))
    expect(screen.getByRole("textbox")).toBeInTheDocument()
  })

  it("у области строк нет полей сверху и снизу", async () => {
    render(<FilterSelect label="Статус" options={options(3)} />)
    await userEvent.setup().click(screen.getByText("Статус"))
    const group = popup().querySelector('[data-slot="filter-select-group"]')!
    expect(group.parentElement!.className).not.toMatch(/\bpy-2\b/)
  })

  it("строка — menu-row (наведение Grey 114, нажатие Grey 124)", async () => {
    render(<FilterSelect label="Статус" options={options(3)} />)
    await userEvent.setup().click(screen.getByText("Статус"))
    const row = popup().querySelector('[data-slot="filter-select-option"]')!
    expect(row.className.split(" ")).toContain("menu-row")
  })
})

describe("FilterShell: шеврон и крестик", () => {
  it("шеврон — один и тот же значок, при открытии повёрнут на 180°", () => {
    const { container, rerender } = render(
      <FilterShell label="Статус" open={false} onOpenChange={() => {}} />
    )
    const closed = container.querySelector('[data-slot="filter"] svg')!
    expect(closed.getAttribute("class")).not.toContain("rotate-180")
    expect(closed.getAttribute("class")).toContain("duration-200")
    rerender(<FilterShell label="Статус" open onOpenChange={() => {}} />)
    const opened = container.querySelector('[data-slot="filter"] svg')!
    expect(opened).toBe(closed)
    expect(opened.getAttribute("class")).toContain("rotate-180")
  })

  it("зона нажатия крестика — 32×32 (вынос 8 во все стороны), значок 16", () => {
    const onClear = vi.fn()
    render(
      <FilterShell
        label="Статус"
        active
        valueLabel="Исполнен"
        onClear={onClear}
        open={false}
        onOpenChange={() => {}}
      />
    )
    const clear = screen.getByRole("button", { name: "Сбросить фильтр" })
    expect(clear.className.split(" ")).toEqual(
      expect.arrayContaining(["relative", "before:absolute", "before:-inset-2"])
    )
    expect(clear.querySelector("svg")!.getAttribute("class")).toContain("size-4")
  })
})

describe("FilterRange: денежный режим, кнопка, проверка", () => {
  const field = (name: string) => screen.getByRole("textbox", { name })

  it("маска суммы, подпись с разрядами и валютой, наружу — сырые цифры", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<FilterRange label="Сумма" amount onValueChange={onValueChange} />)
    await user.click(screen.getByText("Сумма"))
    await user.type(field("От"), "3000")
    await user.type(field("До"), "300000")
    expect(field("До")).toHaveValue("300 000")
    await user.click(screen.getByRole("button", { name: "Применить" }))
    expect(onValueChange).toHaveBeenCalledWith({ from: "3000", to: "300000" })
    expect(chipLabel()).toBe("Сумма: 3 000 – 300 000 ₽")
  })

  it("кнопка поповера — просто «Применить», без счётчика полей", async () => {
    const user = userEvent.setup()
    render(<FilterRange label="Сумма" defaultValue={{ from: "1", to: "2" }} />)
    await user.click(screen.getByText("1 – 2"))
    expect(screen.getByRole("button", { name: "Применить" })).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: /Применить:/ })).toBeNull()
  })

  it("«до» меньше «от» — ошибка на втором поле, фильтр не применён", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<FilterRange label="Сумма" amount onValueChange={onValueChange} />)
    await user.click(screen.getByText("Сумма"))
    await user.type(field("От"), "20000")
    await user.type(field("До"), "1000")
    const apply = screen.getByRole("button", { name: "Применить" })
    await user.click(apply)
    expect(onValueChange).not.toHaveBeenCalled()
    expect(
      screen.getByText("Значение «до» должно быть больше значения «от»")
    ).toBeInTheDocument()
    expect(field("До")).toHaveAttribute("aria-invalid", "true")
    expect(field("От")).not.toHaveAttribute("aria-invalid")
    // Кнопка не выключается, окно остаётся открытым.
    expect(apply).not.toBeDisabled()
    expect(popup()).not.toBeNull()
  })

  it("внешний error важнее встроенной проверки", async () => {
    const user = userEvent.setup()
    render(<FilterRange label="Сумма" error="Проверьте диапазон" />)
    await user.click(screen.getByText("Сумма"))
    await user.type(field("От"), "5")
    await user.type(field("До"), "1")
    await user.click(screen.getByRole("button", { name: "Применить" }))
    expect(screen.getByText("Проверьте диапазон")).toBeInTheDocument()
    expect(
      screen.queryByText("Значение «до» должно быть больше значения «от»")
    ).toBeNull()
  })

  it("подписи: одно значение, «от», «до»", () => {
    const { rerender } = render(
      <FilterRange label="Доступный лимит" amount value={{ from: "3000", to: "3000" }} />
    )
    expect(chipLabel()).toBe("Доступный лимит: 3 000 ₽")
    rerender(<FilterRange label="Лимит" amount value={{ from: "3000", to: "" }} />)
    expect(chipLabel()).toBe("От 3 000 ₽")
    rerender(<FilterRange label="Лимит" amount value={{ from: "", to: "3000" }} />)
    expect(chipLabel()).toBe("До 3 000 ₽")
  })
})
