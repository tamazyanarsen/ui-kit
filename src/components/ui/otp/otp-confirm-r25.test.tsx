import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { OtpConfirmCard } from "./confirm-card"

// r25: полнота и код считались по сырой строке `value`, а поле читает цифры:
// «12 34 56» снаружи — это шесть цифр, но кнопка оставалась выключенной, а
// наружу ушла бы строка с пробелами. И пустой абзац подзаголовка занимал
// место в колонке.

describe("OtpConfirmCard: значение снаружи с разделителями", () => {
  it("кнопка включена, а onSubmit получает только цифры", async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(
      <OtpConfirmCard defaultOpen length={6} value="12 34 56" onSubmit={onSubmit} />
    )
    const confirm = screen.getByRole("button", { name: "Подтвердить" })
    expect(confirm).toBeEnabled()
    await user.click(confirm)
    expect(onSubmit).toHaveBeenCalledWith("123456")
  })

  it("неполный код остаётся неполным, даже если строка длиннее", () => {
    render(<OtpConfirmCard defaultOpen length={6} value="12 34 5" />)
    expect(screen.getByRole("button", { name: "Подтвердить" })).toBeDisabled()
  })
})

describe("OtpConfirmCard: подзаголовок", () => {
  it("без телефона и подзаголовка пустого абзаца нет", () => {
    render(<OtpConfirmCard defaultOpen />)
    expect(document.querySelector('[data-slot="modal-description"]')).toBeNull()
  })

  it("пустая строка подзаголовка тоже не рисуется", () => {
    render(<OtpConfirmCard defaultOpen subtitle="" />)
    expect(document.querySelector('[data-slot="modal-description"]')).toBeNull()
  })

  it("с телефоном абзац есть", () => {
    render(<OtpConfirmCard defaultOpen phone="+7 900 000-00-00" />)
    expect(
      document.querySelector('[data-slot="modal-description"]')?.textContent
    ).toContain("+7 900 000-00-00")
  })
})
