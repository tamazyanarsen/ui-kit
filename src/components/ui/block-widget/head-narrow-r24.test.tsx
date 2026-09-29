import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { Button } from "@/components/ui/button"
import { ViewportScope } from "@/lib/viewport"

import { BlockWidgetHead } from "./head"

// Аудит 23: в узкой десктопной колонке шапка не переносилась
// (`desktop:flex-nowrap`), и всё сжатие доставалось заголовку — в колонке 400
// от него оставалось 44px, в 343 и 288 он исчезал, а приписка с кнопкой
// вылезали за блок. Раскладку jsdom не считает — проверяется механика.

function renderHead() {
  return render(
    <ViewportScope viewport="desktop">
      <BlockWidgetHead
        title="ООО «Северо-Западная логистическая компания»"
        status="Требует подписи"
        action={<Button size="sm">Подписать документ</Button>}
      />
    </ViewportScope>
  )
}

const slot = (container: HTMLElement, name: string) =>
  container.querySelector(`[data-slot="${name}"]`) as HTMLElement

describe("BlockWidgetHead: узкая десктопная колонка", () => {
  it("шапка переносится и на десктопе", () => {
    const { container } = renderHead()
    const head = slot(container, "block-widget-head")
    expect(head).toHaveClass("flex-wrap")
    expect(head).not.toHaveClass("desktop:flex-nowrap")
  })

  it("у заголовка порог — меньшее из 200px и собственной ширины", () => {
    const { container } = renderHead()
    const title = slot(container, "block-widget-title-block")
    // Автоматический минимум при заданной ширине: не процентный min-width,
    // который в контейнере по содержимому переносил и короткий «Title».
    expect(title).toHaveClass("desktop:w-[min(200px,100%)]", "desktop:min-w-auto")
  })

  it("перенесённые приписки прижаты вправо и не шире шапки", () => {
    const { container } = renderHead()
    const trailing = slot(container, "block-widget-trailing")
    expect(trailing).toHaveClass("desktop:ml-auto", "desktop:max-w-full", "desktop:flex-wrap")
  })
})
