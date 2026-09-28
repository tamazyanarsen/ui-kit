import * as React from "react"
import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"

import { Button } from "@/components/ui/button"
import { formatBadgeCount } from "@/components/ui/badge/variants"
import { CloseCross } from "@/components/ui/close-cross"
import { IssueItem } from "@/components/ui/issue-item"
import { ListOfErrors } from "@/components/ui/list-of-errors"
import { Shimmer } from "@/components/ui/shimmer"
import { TitleCard, TitleRegistry } from "@/components/ui/title"
import { BlockWidget, BlockWidgetColumn, BlockWidgetSlot, BlockWidgetHead } from "@/components/ui/block-widget"
import { ItemInformationFieldGroup } from "@/components/ui/item-information-field"

describe("Button: className-функция", () => {
  it("функция от состояния не выбрасывается", () => {
    render(<Button className={() => "from-state"}>Сохранить</Button>)
    expect(screen.getByRole("button", { name: "Сохранить" }).className).toContain("from-state")
  })
})

describe("formatBadgeCount", () => {
  it("NaN показывается нулём", () => {
    expect(formatBadgeCount(Number.NaN)).toBe("0")
    expect(formatBadgeCount(150)).toBe("99+")
  })
})

describe("ref доходит до корня", () => {
  const cases: [string, (ref: React.Ref<HTMLElement>) => React.ReactElement, string][] = [
    ["CloseCross", (ref) => <CloseCross ref={ref as React.Ref<HTMLButtonElement>} />, "close-cross"],
    ["IssueItem", (ref) => <IssueItem ref={ref as React.Ref<HTMLDivElement>}>Задача</IssueItem>, "issue-item"],
    ["ListOfErrors", (ref) => <ListOfErrors ref={ref as React.Ref<HTMLDivElement>}><IssueItem>Ошибка</IssueItem></ListOfErrors>, "list-of-errors"],
    ["Shimmer", (ref) => <Shimmer ref={ref as React.Ref<HTMLDivElement>} />, "shimmer"],
    ["TitleCard", (ref) => <TitleCard ref={ref as React.Ref<HTMLDivElement>} title="Карта" />, "title-card"],
    ["TitleRegistry", (ref) => <TitleRegistry ref={ref as React.Ref<HTMLDivElement>} title="Реестр" />, "title-registry"],
    ["BlockWidget", (ref) => <BlockWidget ref={ref as React.Ref<HTMLDivElement>} />, "block-widget"],
    ["BlockWidgetColumn", (ref) => <BlockWidgetColumn ref={ref as React.Ref<HTMLDivElement>} />, "block-widget-column"],
    ["BlockWidgetSlot", (ref) => <BlockWidgetSlot ref={ref as React.Ref<HTMLDivElement>} />, "block-widget-slot"],
    ["BlockWidgetHead", (ref) => <BlockWidgetHead ref={ref as React.Ref<HTMLDivElement>} title="Т" />, "block-widget-head"],
    ["ItemInformationFieldGroup", (ref) => <ItemInformationFieldGroup ref={ref as React.Ref<HTMLDivElement>} />, "item-information-field-group"],
  ]

  it.each(cases)("%s", (_name, make, slot) => {
    const ref = React.createRef<HTMLElement>()
    const error = vi.spyOn(console, "error").mockImplementation(() => {})
    render(make(ref))
    expect(ref.current).not.toBeNull()
    expect(ref.current?.getAttribute("data-slot")).toBe(slot)
    expect(error).not.toHaveBeenCalled()
    error.mockRestore()
  })
})

describe("Button: загрузка", () => {
  it("кнопка с подписью не теряет доступное имя, пока идёт загрузка", () => {
    render(<Button isLoading>Сохранить</Button>)
    const button = screen.getByRole("button", { name: "Сохранить" })
    expect(button).toHaveAttribute("aria-busy", "true")
  })

  it("aria-label потребителя по-прежнему главнее подписи", () => {
    render(
      <Button isLoading aria-label="Отправка">
        Сохранить
      </Button>
    )
    expect(screen.getByRole("button", { name: "Отправка" })).toBeInTheDocument()
  })
})
