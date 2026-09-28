import { describe, expect, it } from "vitest"

import { matchesAccept } from "./accept"

const file = (name: string, type: string) => new File(["x"], name, { type })

describe("matchesAccept", () => {
  it("accepts a CSV that Windows reports as an Excel type", () => {
    expect(matchesAccept(file("отчёт.csv", "application/vnd.ms-excel"), "text/csv")).toBe(true)
  })

  it("accepts files with an empty type by extension", () => {
    expect(matchesAccept(file("фото.HEIC", ""), "image/*")).toBe(true)
    expect(
      matchesAccept(
        file("договор.docx", ""),
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      )
    ).toBe(true)
  })

  // Третий проход: пустой тип без известного расширения — это папка или
  // файл без расширения; раньше он проходил любой MIME-токен.
  it("rejects a file with an empty type and no known extension by a MIME token", () => {
    expect(matchesAccept(file("скан.xyz", ""), "application/pdf")).toBe(false)
    expect(matchesAccept(file("Документы", ""), "image/*")).toBe(false)
  })

  it("still accepts such a file by an explicit extension token", () => {
    expect(matchesAccept(file("скан.xyz", ""), ".xyz")).toBe(true)
  })

  it("still rejects files whose type and extension both mismatch", () => {
    expect(matchesAccept(file("setup.exe", ""), "image/*")).toBe(false)
    expect(matchesAccept(file("setup.exe", "application/x-msdownload"), ".pdf,image/*")).toBe(false)
  })

  it("keeps wildcard, extension and case handling", () => {
    expect(matchesAccept(file("a.PNG", "image/png"), "IMAGE/*")).toBe(true)
    expect(matchesAccept(file("a.PDF", "application/pdf"), ".pdf")).toBe(true)
  })
})
