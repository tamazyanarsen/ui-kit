import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { matchesAccept } from "./accept"
import { FileUploadDropzone } from "./dropzone"

const file = (name: string, type: string) => new File(["x"], name, { type })

// Ревью 10.10, п. 2: `*/*` и `*` в браузере значат «любой файл», а кит
// отвергал по ним каждый файл.
describe("matchesAccept: любой тип (ревью 10.10, п. 2)", () => {
  it.each(["*/*", "*", "image/png, */*"])("«%s» пропускает любой файл", (accept) => {
    expect(matchesAccept(file("фото.png", "image/png"), accept)).toBe(true)
    expect(matchesAccept(file("архив.xyz", ""), accept)).toBe(true)
  })
})

// Ревью 10.10, п. 3: у скрытого `<input type="file">` не было имени —
// скринридер объявлял безымянный выбор файла, подпись и форматы не читались.
describe("FileUploadDropzone: имя поля (ревью 10.10, п. 3)", () => {
  it("поле называется подписью зоны и описывается подзаголовком", () => {
    const { container } = render(
      <FileUploadDropzone subtitle="PDF, не более 10 MB">Прикрепите договор</FileUploadDropzone>
    )
    const input = container.querySelector('input[type="file"]') as HTMLInputElement
    expect(input).toHaveAccessibleName("Прикрепите договор")
    expect(input).toHaveAccessibleDescription("PDF, не более 10 MB")
    expect(screen.getByLabelText("Прикрепите договор")).toBe(input)
  })

  it("без подзаголовка нет висячей ссылки aria-describedby", () => {
    const { container } = render(<FileUploadDropzone>Прикрепите договор</FileUploadDropzone>)
    const input = container.querySelector('input[type="file"]') as HTMLInputElement
    expect(input).not.toHaveAttribute("aria-describedby")
  })
})
