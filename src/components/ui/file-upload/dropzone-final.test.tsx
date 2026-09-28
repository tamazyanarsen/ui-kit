import { afterEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render } from "@testing-library/react"

import { FileUploadDropzone } from "./dropzone"

// Финальный аудит.
// 1. `openPicker()` делает `input.click()`, и этот клик всплывал обратно
//    в `onClick` зоны: потребитель получал два клика на одно нажатие.
// 2. Tab попадает на скрытый `sr-only` input, а у зоны не было кольца
//    фокуса — клавиатурный пользователь не видел, где он.

const zoneOf = (container: HTMLElement) =>
  container.querySelector<HTMLElement>('[data-slot="file-upload-dropzone"]')!

describe("FileUploadDropzone: один клик — один onClick", () => {
  afterEach(() => vi.restoreAllMocks())

  it("клик по зоне зовёт onClick потребителя ровно раз и открывает окно выбора", () => {
    const onClick = vi.fn()
    const pick = vi.spyOn(HTMLInputElement.prototype, "click")
    const { container } = render(<FileUploadDropzone onClick={onClick} />)

    fireEvent.click(zoneOf(container))

    expect(onClick).toHaveBeenCalledTimes(1)
    expect(pick).toHaveBeenCalledTimes(1)
  })

  it("нажатие на сам input (клавиатура) не открывает окно второй раз", () => {
    const onClick = vi.fn()
    const pick = vi.spyOn(HTMLInputElement.prototype, "click")
    const { container } = render(<FileUploadDropzone onClick={onClick} />)
    const input = container.querySelector<HTMLInputElement>('input[type="file"]')!

    // Нативная активация input (Space/Enter) — клик по нему самому.
    fireEvent.click(input)

    expect(onClick).toHaveBeenCalledTimes(1)
    expect(pick).not.toHaveBeenCalled()
  })
})

describe("FileUploadDropzone: видимый фокус", () => {
  it("зона рисует кольцо, когда фокус с клавиатуры на скрытом input", () => {
    const { container } = render(<FileUploadDropzone />)
    expect(zoneOf(container).className).toContain("has-[:focus-visible]:focus-ring")
  })
})
