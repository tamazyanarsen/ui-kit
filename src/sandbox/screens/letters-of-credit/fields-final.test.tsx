import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { DataTable } from "@/components/ui/table"

import type { LetterOfCreditRow } from "./data"
import { LETTER_FIELDS } from "./fields"

// Финальный аудит: колонка «Дата» печаталась своим `format` через
// `new Date("2026-03-05")` — полночь UTC. Западнее Гринвича дата уезжала на
// сутки назад («04.03.2026»). В Москве дефект не виден, поэтому тест
// переводит процесс в часовой пояс Нью-Йорка.

describe("Реестр аккредитивов: колонка «Дата»", () => {
  let tz: string | undefined
  beforeEach(() => {
    tz = process.env.TZ
    process.env.TZ = "America/New_York"
  })
  afterEach(() => {
    if (tz === undefined) delete process.env.TZ
    else process.env.TZ = tz
  })

  it("не сдвигает дату на сутки западнее UTC", () => {
    const dateField = LETTER_FIELDS.find((field) => field.key === "date")!
    const { container } = render(
      <DataTable<LetterOfCreditRow>
        fields={[dateField]}
        rows={[{ id: "1", date: "2026-03-05" } as unknown as LetterOfCreditRow]}
      />
    )
    expect(container.querySelector("tbody td")?.textContent).toContain("05.03.2026")
  })
})
