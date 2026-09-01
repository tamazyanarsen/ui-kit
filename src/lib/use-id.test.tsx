import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { useId } from "@/lib/use-id"

function Probe({ label }: { label: string }) {
  const id = useId()
  return <span data-testid={label} data-id={id} />
}

// В дев-окружении репозитория стоит React 18: хук обязан делегировать
// нативному React.useId, а не уходить в счётчиковый фолбэк — иначе потеряли
// бы честные id при SSR-гидратации на 18/19 ради совместимости с 17.
describe("useId", () => {
  it("delegates to the native React.useId when available", () => {
    render(
      <div>
        <Probe label="a" />
        <Probe label="b" />
      </div>
    )

    const idA = screen.getByTestId("a").dataset.id
    const idB = screen.getByTestId("b").dataset.id
    expect(idA).toBeTruthy()
    expect(idB).toBeTruthy()
    expect(idA).not.toBe(idB)
    expect(idA).not.toMatch(/^ui-kit-\d+$/)
    expect(idB).not.toMatch(/^ui-kit-\d+$/)
  })
})
