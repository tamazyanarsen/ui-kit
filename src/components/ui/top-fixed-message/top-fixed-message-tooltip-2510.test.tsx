import * as React from "react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { ViewportScope } from "@/lib/viewport"

import { TopFixedMessage } from "./top-fixed-message"

// Правки UI-Kit от 25.10: умолчание Tooltip сменилось на «над элементом», но
// плашка прибита к верху окна — её тултип явно под плашкой (`top-center`).

function Desktop({ children }: { children: React.ReactNode }) {
  return <ViewportScope viewport="desktop">{children}</ViewportScope>
}

describe("TopFixedMessage: тултип под плашкой", () => {
  afterEach(() => vi.restoreAllMocks())

  it("подсказка с полным текстом раскрывается вниз", async () => {
    vi.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockReturnValue(900)
    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(400)
    render(<TopFixedMessage text="Очень длинное сообщение" />, { wrapper: Desktop })
    await userEvent.setup().hover(screen.getByText("Очень длинное сообщение"))
    await waitFor(() =>
      expect(document.querySelector('[data-slot="tooltip-content"]')).not.toBeNull()
    )
    expect(document.querySelector('[data-slot="tooltip-content"]')).toHaveAttribute(
      "data-side",
      "bottom"
    )
  })
})
