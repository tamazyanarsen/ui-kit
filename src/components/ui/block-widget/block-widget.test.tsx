import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { BlockWidget, BlockWidgetColumn, BlockWidgetSlot } from "./block-widget"
import { BlockWidgetHead } from "./head"

describe("BlockWidget", () => {
  it("renders the head with its title", () => {
    render(
      <BlockWidget>
        <BlockWidgetHead title="Заголовок" description="Пояснение" />
      </BlockWidget>
    )
    expect(screen.getByText("Заголовок")).toBeInTheDocument()
    expect(screen.getByText("Пояснение")).toBeInTheDocument()
  })

  // ⚠️ Колонки типа `Double` ищутся среди детей, а `<>…</>` вокруг них
  // вызывающий код пишет естественно. `React.Children.toArray` фрагмент не
  // раскрывает — без своего раскрытия блок молча рисовался в один столбец.
  it("finds columns through a fragment and puts a divider between them", () => {
    render(
      <BlockWidget type="double">
        <>
          <BlockWidgetColumn>
            <BlockWidgetHead title="Слева" />
          </BlockWidgetColumn>
          <BlockWidgetColumn>
            <BlockWidgetHead title="Справа" />
          </BlockWidgetColumn>
          <BlockWidgetSlot>Подвал</BlockWidgetSlot>
        </>
      </BlockWidget>
    )

    const columns = document.querySelectorAll(
      '[data-slot="block-widget-columns"] > [data-slot="block-widget-column"]'
    )
    expect(columns).toHaveLength(2)
    expect(
      document.querySelectorAll(
        '[data-slot="block-widget-columns"] > [data-slot="divider"]'
      )
    ).toHaveLength(1)
    // Нижний слот — общий, он стоит ПОД колонками, а не в одной из них.
    const bottom = document.querySelector(
      '[data-slot="block-widget"] > [data-slot="block-widget-slot"]'
    )
    expect(bottom).toHaveTextContent("Подвал")
  })

  it("fires onClick on the block but not on a control inside it", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <BlockWidget onClick={onClick}>
        <BlockWidgetHead
          title="Заголовок"
          action={<button type="button">Действие</button>}
        />
      </BlockWidget>
    )

    await user.click(screen.getByText("Заголовок"))
    expect(onClick).toHaveBeenCalledTimes(1)

    await user.click(screen.getByRole("button", { name: "Действие" }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  // Состояния `Hover` у сета обводки нет вовсе — значит и кликабельной она
  // не бывает.
  it("ignores onClick on the border variant", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <BlockWidget variant="border" onClick={onClick}>
        <BlockWidgetHead title="Заголовок" />
      </BlockWidget>
    )

    const widget = document.querySelector('[data-slot="block-widget"]')!
    expect(widget).not.toHaveAttribute("role", "button")
    await user.click(screen.getByText("Заголовок"))
    expect(onClick).not.toHaveBeenCalled()
  })
})
