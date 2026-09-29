import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { MailFeed } from "./mail-feed"

// r25: `{preview && …}` с числом 0 выводил голый «0» без оформления.

describe("MailFeed", () => {
  it("preview = 0 рисуется внутри оформленной строки", () => {
    render(
      <MailFeed
        id="1"
        sender="Отправитель"
        date="01.01"
        subject="Тема"
        message="Сообщение"
        preview={0}
      />
    )
    expect(screen.getByText("0").className).toContain("line-clamp-1")
  })
})
