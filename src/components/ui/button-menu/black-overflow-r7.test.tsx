import { afterEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"

import { Button } from "@/components/ui/button"

import { ButtonMenuBlack } from "./black"

// Аудит r7: действия чёрной панели стояли `shrink-0` и в «…» не уходили.
// На части сетки (`placement="left"`, `span={6}`) панель 588 выталкивала
// информацию и крестик за свой край на белый фон — вживую на 195px.
// Теперь действия — тот же ряд, что у белой панели.

/** Ряд действий шириной `width`, каждая кнопка — 100. */
function mockActions(width: number) {
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(function (
    this: HTMLElement
  ) {
    return this.dataset.slot === "button-menu-black-actions" ? width : 0
  })
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
    () => ({ width: 100, height: 32, top: 0, left: 0, right: 100, bottom: 32 }) as DOMRect
  )
}

const visibleButtons = () =>
  screen
    .getAllByRole("button")
    .map((button) => button.textContent?.trim() || button.getAttribute("aria-label"))

function renderPanel() {
  render(
    <ButtonMenuBlack
      placement="left"
      span={6}
      info={[{ label: "Выбрано", value: "3 документа" }]}
      onClose={() => {}}
    >
      <Button>Подписать</Button>
      <Button>Отправить в банк</Button>
      <Button>Скачать</Button>
      <Button>Удалить</Button>
    </ButtonMenuBlack>
  )
}

describe("ButtonMenuBlack: не поместившиеся действия уходят в «…»", () => {
  afterEach(() => vi.restoreAllMocks())

  it("в узком ряду видны две кнопки и белое «…»", () => {
    // 40 (резерв «…») + 100 + 8 + 100 = 248 ≤ 250; третья уже не встаёт.
    mockActions(250)
    renderPanel()
    const visible = visibleButtons()
    expect(visible).toEqual(expect.arrayContaining(["Подписать", "Отправить в банк", "Ещё"]))
    expect(visible).not.toContain("Скачать")
    expect(visible).not.toContain("Удалить")
    // «…» на чёрной панели — белое, как и сами действия.
    expect(screen.getByRole("button", { name: "Ещё" }).className).toContain(
      "--btn-secondary-white-bg"
    )
  })

  it("когда место есть, все действия на месте и «…» нет", () => {
    mockActions(1000)
    renderPanel()
    const visible = visibleButtons()
    expect(visible).toEqual(
      expect.arrayContaining(["Подписать", "Отправить в банк", "Скачать", "Удалить"])
    )
    expect(visible).not.toContain("Ещё")
  })
})
