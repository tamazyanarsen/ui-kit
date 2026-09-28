import { describe, expect, it, vi } from "vitest"
import { render } from "@testing-library/react"

import { useActiveIndicator } from "./use-active-indicator"

// Добор покрытия к исправлению бесконечного цикла Switcher. В Switcher
// цикл гасят два независимых исправления (useMemo над items и стабильный
// setRect в хуке), и тест Switcher ловит только отмену обоих сразу. Здесь —
// сам хук: `deps`, пересоздаваемые на каждом рендере, при не найденном
// активном сегменте не должны раскручивать рендеры.
function Row({ activeValue, attach, onRender }: {
  activeValue: string | undefined
  attach: boolean
  onRender: () => void
}) {
  onRender()
  // Новый объект на каждом рендере — как `resolvedItems` у выключенного
  // Switcher до исправления.
  const { rowRef } = useActiveIndicator<HTMLDivElement>(activeValue, [{}])
  return (
    <div ref={attach ? rowRef : undefined}>
      <span data-value="a">А</span>
    </div>
  )
}

describe("useActiveIndicator coverage", () => {
  it.each([
    ["без ряда и без активного значения", undefined, false],
    ["активный сегмент не найден в ряду", "missing", true],
  ] as const)("не зацикливается: %s", (_, activeValue, attach) => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {})
    let renders = 0
    expect(() =>
      render(<Row activeValue={activeValue} attach={attach} onRender={() => (renders += 1)} />)
    ).not.toThrow()
    expect(renders).toBeLessThan(10)
    expect(error).not.toHaveBeenCalled()
    error.mockRestore()
  })
})
