import { afterEach, describe, expect, it, vi } from "vitest"
import { render } from "@testing-library/react"

import { Button } from "@/components/ui/button"

import { ButtonMenuBlack } from "./black"

// Аудит 21: занятый низ публиковала только сама чёрная панель (72), а кнопка
// «Выбрать на всех страницах» стоит над ней — блок 136. Плавающие слои (NPS,
// «Наверх») вставали на уровень кнопки и закрывали её на 320–700.
// Полоса прокрутки таблицы при этом обязана липнуть к самой панели, поэтому
// блок публикуется в отдельную переменную для плавающих слоёв.

const root = () => document.documentElement.style

function placeAtBottom() {
  vi.stubGlobal("visualViewport", { height: 900, offsetTop: 0 })
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
    this: HTMLElement
  ) {
    const slot = this.dataset.slot
    if (slot === "button-menu-black-block") {
      return { top: 764, bottom: 900, height: 136, left: 0, right: 1280, width: 1280 } as DOMRect
    }
    if (slot === "button-menu-black") {
      return { top: 828, bottom: 900, height: 72, left: 0, right: 1280, width: 1280 } as DOMRect
    }
    return { top: 0, bottom: 0, height: 0, left: 0, right: 0, width: 0 } as DOMRect
  })
}

describe("ButtonMenuBlack: занятый низ с «Выбрать на всех страницах»", () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it("блок «кнопка + панель» публикуется для плавающих слоёв, панель — как раньше", () => {
    placeAtBottom()
    render(
      <ButtonMenuBlack
        pinned
        showSelectAllPages
        selectAllPagesCount={200}
        selectedCount={3}
        onSelectAllPages={() => {}}
      >
        <Button>Подписать</Button>
      </ButtonMenuBlack>
    )
    expect(root().getPropertyValue("--floating-inset-bottom")).toBe("136px")
    expect(root().getPropertyValue("--viewport-inset-bottom")).toBe("72px")
  })

  it("без кнопки блок ничего не добавляет", () => {
    placeAtBottom()
    render(
      <ButtonMenuBlack pinned>
        <Button>Подписать</Button>
      </ButtonMenuBlack>
    )
    expect(["", "0px"]).toContain(root().getPropertyValue("--floating-inset-bottom"))
    expect(root().getPropertyValue("--viewport-inset-bottom")).toBe("72px")
  })
})
