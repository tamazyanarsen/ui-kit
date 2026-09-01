import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"

// Симулируем React 17: нативного React.useId нет, хук должен уйти в
// счётчиковый фолбэк. Мок применяется на весь граф модулей этого файла,
// поэтому тест фолбэка живёт отдельно от теста делегирования. Свойство
// объявлено явно со значением undefined — vitest-прокси мока бросает ошибку
// на доступе к отсутствующему экспорту, а нам нужен честный undefined.
vi.mock("react", async (importOriginal) => {
  // `default` в типе реального модуля не объявлен, но при CJS-интеропе
  // может существовать в рантайме — потому тип расширен, а не заменён.
  type ReactModule = typeof import("react") & { default?: Record<string, unknown> }
  const actual = await importOriginal<ReactModule>()
  const named = { ...actual, useId: undefined }
  const def = { ...(actual.default ?? {}), useId: undefined }
  return { ...named, default: def }
})

import { useId } from "@/lib/use-id"

function Probe({ label }: { label: string }) {
  const id = useId()
  return <span data-testid={label} data-id={id} />
}

describe("useId fallback (React 17)", () => {
  it("falls back to unique counter-based ids", () => {
    render(
      <div>
        <Probe label="a" />
        <Probe label="b" />
      </div>
    )

    const idA = screen.getByTestId("a").dataset.id
    const idB = screen.getByTestId("b").dataset.id
    expect(idA).toMatch(/^ui-kit-\d+$/)
    expect(idB).toMatch(/^ui-kit-\d+$/)
    expect(idA).not.toBe(idB)
  })

  it("keeps the id stable across re-renders", () => {
    const { rerender } = render(<Probe label="a" />)
    const before = screen.getByTestId("a").dataset.id

    rerender(<Probe label="a" />)
    const after = screen.getByTestId("a").dataset.id

    expect(after).toBe(before)
  })
})
