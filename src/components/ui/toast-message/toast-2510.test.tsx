import { readFileSync } from "node:fs"
import path from "node:path"
import type * as React from "react"
import { describe, expect, it } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { ViewportScope } from "@/lib/viewport"

import { ToastProvider, Toaster } from "./toast-message"
import { useToast } from "./use-toast"

// Правки UI-Kit от 25.10: «Toaster — стопка тостов наезжает на шапку» (p8)
// и правило каркаса «Тосты в мобильном виде» (m65).

function AddToast({ behavior }: { behavior?: "collected" | "transient" }) {
  const toast = useToast()
  return (
    <button type="button" onClick={() => toast.add({ title: "Скопировано", behavior })}>
      Показать тост
    </button>
  )
}

function Harness({
  viewport,
  behavior,
}: {
  viewport: "desktop" | "mobile"
  behavior?: "collected" | "transient"
}) {
  return (
    <ViewportScope viewport={viewport}>
      <ToastProvider>
        <AddToast behavior={behavior} />
        <Toaster />
      </ToastProvider>
    </ViewportScope>
  )
}

const column = () => document.querySelector<HTMLElement>('[aria-live="polite"]')!

async function closeToast(ui: React.ReactElement) {
  const user = userEvent.setup()
  render(ui)
  await user.click(screen.getByRole("button", { name: "Показать тост" }))
  await user.click(screen.getByRole("button", { name: "Закрыть" }))
  return {
    card: screen.getByRole("status"),
    row: document.querySelector<HTMLElement>('[data-slot="toast-row"]')!,
  }
}

describe("Toaster: привязка стопки", () => {
  it("десктоп — от нижней кромки шапки (--header-bottom) плюс 32", () => {
    render(<Harness viewport="desktop" />)
    expect(column().className).toContain(
      "desktop:top-[calc(var(--header-bottom,var(--viewport-inset-top,0px))+2rem)]"
    )
  })

  it("мобильный — 16 от верха вьюпорта, поля 16, высота не больше экрана минус 32", () => {
    render(<Harness viewport="mobile" />)
    const className = column().className
    expect(className).toMatch(/(^|\s)top-4(\s|$)/)
    expect(className).toMatch(/(^|\s)inset-x-4(\s|$)/)
    expect(className).toContain("max-h-[calc(100dvh-2rem)]")
  })

  it("зазор стопки — переменная: 16 мобильный, 24 десктоп", () => {
    render(<Harness viewport="mobile" />)
    const className = column().className
    expect(className).toContain("gap-(--toast-gap)")
    expect(className).toContain("[--toast-gap:1rem]")
    expect(className).toContain("desktop:[--toast-gap:1.5rem]")
  })
})

describe("Toast: уход", () => {
  it("мобильный — вверх у обоих типов", async () => {
    for (const behavior of ["collected", "transient"] as const) {
      const { card } = await closeToast(<Harness viewport="mobile" behavior={behavior} />)
      expect(card.className).toContain("toast-out-up_var(--duration-overlay)_var(--ease-out)")
      cleanup()
    }
  })

  it("десктоп — как было: вбок у отклика системы", async () => {
    const { card } = await closeToast(<Harness viewport="desktop" behavior="transient" />)
    expect(card.className).toContain("toast-out-transient")
    expect(card.className).not.toContain("toast-out-up")
  })

  it("схлопывающаяся строка съедает зазор стопки из той же переменной", async () => {
    const { row } = await closeToast(<Harness viewport="mobile" />)
    expect(row.className).toContain("-mb-(--toast-gap)")
    expect(row.className).toContain("after:h-(--toast-gap)")
    expect(row.className).not.toContain("-mb-6")
  })

  it("кадры toast-out-up: на свою высоту и ещё 16, с гашением", () => {
    const css = readFileSync(
      path.resolve(process.cwd(), "src/styles/component-rules.css"),
      "utf8"
    )
    expect(css).toMatch(
      /@keyframes toast-out-up\s*\{[\s\S]*?opacity: 0;\s*transform: translateY\(calc\(-100% - 16px\)\)/
    )
  })
})
