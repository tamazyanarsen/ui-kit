import { readFileSync } from "node:fs"
import path from "node:path"
import * as React from "react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Button } from "@/components/ui/button"
import { ViewportScope } from "@/lib/viewport"

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "./index"

// Правки UI-Kit от 25.10: ширина модалки на десктопе (p25), черты соседями
// (p69), начальный фокус на окне (p70), мобильный вид на весь экран (p53).

const content = () =>
  document.querySelector<HTMLElement>('[data-slot="modal-content"]')!

afterEach(() => {
  vi.restoreAllMocks()
})

describe("Modal: ширина на десктопе", () => {
  it("не ужимается под окно: нет max-width calc(100% - 160px)", () => {
    render(
      <Modal open>
        <ModalContent size="l">
          <ModalBody>Текст</ModalBody>
        </ModalContent>
      </Modal>
    )
    expect(content().className).not.toContain("max-w-[calc(100%_-_160px)]")
    expect(content().className).toContain("desktop:w-(--modal-width)")
  })
})

describe("Modal: начальный фокус", () => {
  it("при открытии фокус на самом окне, а не на первом элементе", async () => {
    const user = userEvent.setup()
    render(
      <Modal>
        <ModalTrigger render={<Button />}>Открыть</ModalTrigger>
        <ModalContent>
          <ModalBody>
            <button type="button">Все</button>
          </ModalBody>
        </ModalContent>
      </Modal>
    )
    await user.click(screen.getByRole("button", { name: "Открыть" }))
    await screen.findByRole("dialog")
    await waitFor(() => expect(document.activeElement).toBe(content()))
  })

  it("initialFocus экрана главнее", async () => {
    const user = userEvent.setup()
    function WithField() {
      const field = React.useRef<HTMLInputElement>(null)
      return (
        <Modal>
          <ModalTrigger render={<Button />}>Открыть</ModalTrigger>
          <ModalContent initialFocus={field}>
            <ModalBody>
              <input ref={field} aria-label="Поле" />
            </ModalBody>
          </ModalContent>
        </Modal>
      )
    }
    render(<WithField />)
    await user.click(screen.getByRole("button", { name: "Открыть" }))
    await waitFor(() =>
      expect(document.activeElement).toBe(screen.getByRole("textbox", { name: "Поле" }))
    )
  })
})

describe("Modal: черты рисуют соседи", () => {
  const rules = readFileSync(
    path.resolve(process.cwd(), "src/styles/rules-overlays.css"),
    "utf8"
  )

  it("подвал рисует верхнюю черту при data-divider-bottom у тела", () => {
    expect(rules).toMatch(
      /\[data-slot="modal-body"\][^{]*\[data-divider-bottom\]\s*\+\s*\[data-slot="modal-footer"\]\s*\{\s*box-shadow:\s*inset 0 1px 0 var\(--modal-divider\)/
    )
  })

  it("шапка/холдер рисуют нижнюю черту при data-divider-top у тела", () => {
    expect(rules).toMatch(
      /\[data-slot="modal-top-holder"\]\):has\(\s*\+[^)]*\[data-slot="modal-body"\][^)]*\)\[data-divider-top\]\s*\)\s*\{\s*box-shadow:\s*inset 0 -1px 0 var\(--modal-divider\)/
    )
  })

  it("у тела с соседом своя черта гасится", () => {
    expect(rules).toMatch(/\[data-slot="modal-body"\]:has\(\+ \[data-slot="modal-footer"\]\)/)
    expect(rules).toMatch(/--divider-bottom: 0 0 #0000/)
    expect(rules).toMatch(/--divider-top: 0 0 #0000/)
  })
})

/**
 * Естественная высота в jsdom: части окна меряются `offsetHeight`, а
 * содержимое тела — диапазоном по его узлам.
 */
function mockHeights({ content: contentHeight }: { content: number }) {
  vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockImplementation(function (
    this: HTMLElement
  ) {
    const slot = this.dataset.slot
    if (slot === "modal-header") return 80
    if (slot === "modal-footer") return 92
    if (slot === "modal-body") return 300
    return 0
  })
  vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockImplementation(function (
    this: HTMLElement
  ) {
    return this.dataset.slot === "modal-body" ? 300 : 0
  })
  Range.prototype.getBoundingClientRect = () =>
    ({ height: contentHeight, width: 300, top: 0, left: 0, right: 300, bottom: contentHeight }) as DOMRect
  vi.spyOn(window, "innerHeight", "get").mockReturnValue(800)
}

function SheetModal({ fullScreen }: { fullScreen?: boolean }) {
  return (
    <Modal open>
      <ModalContent fullScreen={fullScreen}>
        <ModalHeader>
          <ModalTitle>Реквизиты</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <p>Строка</p>
        </ModalBody>
        <ModalFooter>
          <Button>Скопировать</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

describe("Modal, мобильный вид: на весь экран", () => {
  it("естественная высота больше 87vh → data-full", () => {
    // 80 + 800 + 92 = 972 > 0.87 × 800 = 696
    mockHeights({ content: 800 })
    render(<SheetModal />)
    expect(content()).toHaveAttribute("data-full")
  })

  it("помещается в 87vh → штора, без data-full", () => {
    // 80 + 300 + 92 = 472 < 696
    mockHeights({ content: 300 })
    render(<SheetModal />)
    expect(content()).not.toHaveAttribute("data-full")
  })

  it("на границе не мигает: в полноэкранном виде решение то же", () => {
    // 80 + 520 + 92 = 692 < 696 — штора; с полем подвала в полноэкранном
    // виде (+12 возвращаются при замере) решение не меняется.
    mockHeights({ content: 520 })
    render(<SheetModal />)
    expect(content()).not.toHaveAttribute("data-full")
  })

  it("проп fullScreen включает вид принудительно", () => {
    mockHeights({ content: 10 })
    render(<SheetModal fullScreen />)
    expect(content()).toHaveAttribute("data-full")
  })

  it("на десктопе вида на весь экран нет", () => {
    mockHeights({ content: 2000 })
    render(
      <ViewportScope viewport="desktop">
        <SheetModal fullScreen />
      </ViewportScope>
    )
    expect(content()).not.toHaveAttribute("data-full")
  })

  it("классы вида: от верха, 100dvh, без скруглений", () => {
    mockHeights({ content: 10 })
    render(<SheetModal />)
    const className = content().className
    expect(className).toContain("data-[full]:top-0")
    expect(className).toContain("data-[full]:h-dvh")
    expect(className).toContain("data-[full]:max-h-none")
    expect(className).toContain("data-[full]:rounded-none")
  })
})
