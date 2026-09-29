import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"
import { act, render, screen } from "@testing-library/react"

import { ToastProvider, Toaster } from "./toast-message"
import { useToast } from "./use-toast"

// Аудит 14: тост при открытой модалке лежал под её подложкой (оба на слое
// 50, окно позже в DOM) — щелчок по крестику тоста попадал в подложку и
// закрывал окно. А ряд кнопок тоста не переносился: с `min-w-[320px]` на
// телефоне 320 карточка была шире колонки, и крестик уезжал за край.

/** Слой модалки — `z-50` у подложки и окна в modal/popup.tsx. */
const MODAL_Z = 50

const tokens = readFileSync(
  path.resolve(process.cwd(), "src/styles/tokens-surfaces.css"),
  "utf8"
)

const token = (name: string) =>
  Number(new RegExp(`--${name}:\\s*(\\d+)`).exec(tokens)?.[1])

let api: ReturnType<typeof useToast>
function Capture() {
  api = useToast()
  return null
}

function renderToast() {
  render(
    <ToastProvider>
      <Capture />
      <Toaster />
    </ToastProvider>
  )
  act(
    () =>
      void api.add({
        title: "С кнопками",
        data: { primaryButtonLabel: "Перейти в документ", secondaryButtonLabel: "Скрыть" },
      })
  )
  return screen.getByText("С кнопками").closest('[data-slot="toast"]') as HTMLElement
}

describe("Тосты: слой и ширина", () => {
  it("тосты выше модалки, окно опроса — выше тостов", () => {
    expect(token("z-toast")).toBeGreaterThan(MODAL_Z)
    expect(token("z-nps")).toBeGreaterThan(token("z-toast"))
  })

  it("минимальная ширина карточки — только на десктопе", () => {
    const card = renderToast()
    expect(card).not.toHaveClass("min-w-[320px]")
    expect(card).toHaveClass("desktop:min-w-[320px]")
  })

  it("кнопки в мобильной форме переносятся, на десктопе — нет", () => {
    renderToast()
    const row = screen.getByRole("button", { name: "Скрыть" }).parentElement!
    expect(row).toHaveClass("flex-wrap")
    expect(row).toHaveClass("desktop:flex-nowrap")
  })
})
