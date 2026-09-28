import * as React from "react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { ViewportScope } from "@/lib/viewport"

import { TopFixedMessage } from "./top-fixed-message"

// Финальный аудит: Tooltip висел на тексте безусловно, и при наведении на
// короткое сообщение появлялась вторая копия того же текста.

const TOOLTIP = '[data-slot="tooltip-content"]'

function Desktop({ children }: { children: React.ReactNode }) {
  return <ViewportScope viewport="desktop">{children}</ViewportScope>
}

/** Ширина подписи: `scroll` — полный текст, `client` — видимая коробка. */
function mockText(scroll: number, client: number) {
  vi.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockReturnValue(scroll)
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(client)
}

async function hoverText(text: string) {
  const user = userEvent.setup()
  await user.hover(screen.getByText(text))
  // Задержка открытия подсказки.
  await new Promise((resolve) => setTimeout(resolve, 700))
}

describe("TopFixedMessage: подсказка с полным текстом", () => {
  afterEach(() => vi.restoreAllMocks())

  it("короткий текст без многоточия не дублируется тултипом", async () => {
    mockText(80, 400)
    render(<TopFixedMessage text="Коротко" />, { wrapper: Desktop })
    await hoverText("Коротко")
    expect(document.querySelector(TOOLTIP)).toBeNull()
  })

  it("обрезанный текст показывает полный в тултипе", async () => {
    mockText(900, 400)
    render(<TopFixedMessage text="Очень длинное сообщение" />, { wrapper: Desktop })
    await hoverText("Очень длинное сообщение")
    expect(document.querySelector(TOOLTIP)).not.toBeNull()
  })
})
