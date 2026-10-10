import { describe, expect, expectTypeOf, it } from "vitest"

import { ICON_NAMES, isIconName, type IconName } from "./icon"

// Ревью 10.10, КК-5: `IconName` был просто `string`. Теперь это объединение
// настоящих имён набора, выведенное из экспортов `@/icons` тем же правилом,
// что и реестр в рантайме.
describe("IconName (ревью 10.10, КК-5)", () => {
  it("имена набора — IconName, опечатка — нет", () => {
    expectTypeOf<"check">().toMatchTypeOf<IconName>()
    expectTypeOf<"circle-alert">().toMatchTypeOf<IconName>()
    expectTypeOf<"chek">().not.toMatchTypeOf<IconName>()
    expectTypeOf<string>().not.toMatchTypeOf<IconName>()
  })

  it("каждое имя из реестра узнаётся проверкой", () => {
    expect(ICON_NAMES.every((name) => isIconName(name))).toBe(true)
    expect(isIconName("chek")).toBe(false)
    expect(isIconName(42)).toBe(false)
  })
})
