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

  it("видит контейнер, который смонтировал сосед, не перерисовав кнопку", async () => {
    const ref = React.createRef<HTMLDivElement>()
    let show: () => void = () => {}
    function Sibling() {
      const [on, setOn] = React.useState(false)
      show = () => setOn(true)
      return on ? <div ref={ref} data-testid="late" /> : null
    }
    const MemoUp = React.memo(UpButton)
    render(
      <>
        <MemoUp scrollContainer={ref} threshold={100} />
        <Sibling />
      </>
    )
    await act(async () => show())

    const late = screen.getByTestId("late")
    act(() => {
      late.scrollTop = 500
      fireEvent.scroll(late)
    })

    expect(screen.getByRole("button")).toBeInTheDocument()
  })

  it("принимает сам элемент вместо ref", () => {
    const el = document.createElement("div")
    document.body.appendChild(el)
    render(<UpButton scrollContainer={el} threshold={100} />)
    act(() => {
      el.scrollTop = 500
      fireEvent.scroll(el)
    })
    expect(screen.getByRole("button")).toBeInTheDocument()
    el.remove()
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
