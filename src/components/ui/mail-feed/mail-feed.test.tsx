import { describe, expect, it, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"

import { MailFeed } from "./mail-feed"

const BASE_PROPS = {
  id: "159638",
  sender: "ООО «Родники»",
  date: "24.12.2022, 09:32",
  subject: "Ошибки в данных",
  message: "У меня сломалось отображение зарплатного проекта",
}

describe("MailFeed", () => {
  it("renders sender, subject and date", () => {
    render(<MailFeed {...BASE_PROPS} />)
    expect(screen.getByText("ООО «Родники»")).toBeInTheDocument()
    expect(screen.getByText("Ошибки в данных")).toBeInTheDocument()
    expect(screen.getByText("24.12.2022, 09:32")).toBeInTheDocument()
  })

  it("calls onClick when the row is clicked", () => {
    const onClick = vi.fn()
    render(<MailFeed {...BASE_PROPS} onClick={onClick} />)
    fireEvent.click(screen.getByText("Ошибки в данных"))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("omits the checkbox by default and shows it when showCheckbox is set", () => {
    const { rerender } = render(<MailFeed {...BASE_PROPS} />)
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument()

    rerender(<MailFeed {...BASE_PROPS} showCheckbox />)
    expect(screen.getByRole("checkbox")).toBeInTheDocument()
  })

  it("toggling the checkbox does not also fire the row's onClick", () => {
    const onClick = vi.fn()
    const onCheckedChange = vi.fn()
    render(
      <MailFeed
        {...BASE_PROPS}
        showCheckbox
        onClick={onClick}
        onCheckedChange={onCheckedChange}
      />
    )
    fireEvent.click(screen.getByRole("checkbox"))
    expect(onCheckedChange).toHaveBeenCalledWith(true)
    expect(onClick).not.toHaveBeenCalled()
  })
})
