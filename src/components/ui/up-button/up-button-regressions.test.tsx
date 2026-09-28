import * as React from "react"
import { describe, expect, it } from "vitest"
import { act, fireEvent, render, screen } from "@testing-library/react"

import { UpButton } from "./up-button"

function Harness({ showContainer }: { showContainer: boolean }) {
  const ref = React.useRef<HTMLDivElement>(null)
  return (
    <>
      <UpButton scrollContainer={ref} threshold={100} />
      {showContainer && <div ref={ref} data-testid="scroller" />}
    </>
  )
}

describe("UpButton: контейнер прокрутки", () => {
  it("подхватывает контейнер, смонтированный позже кнопки", () => {
    const { rerender } = render(<Harness showContainer={false} />)
    rerender(<Harness showContainer />)

    const scroller = screen.getByTestId("scroller")
    act(() => {
      scroller.scrollTop = 500
      fireEvent.scroll(scroller)
    })

    expect(screen.getByRole("button")).toBeInTheDocument()
  })

  it("снимает слушатель со старого контейнера при замене", () => {
    const { rerender } = render(<Harness showContainer />)
    const first = screen.getByTestId("scroller")
    rerender(<Harness showContainer={false} />)
    rerender(<Harness showContainer />)

    act(() => {
      first.scrollTop = 500
      fireEvent.scroll(first)
    })

    expect(screen.queryByRole("button")).not.toBeInTheDocument()
  })
})
