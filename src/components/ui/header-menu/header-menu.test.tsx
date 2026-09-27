import { describe, expect, it } from "vitest"

import { distributeMenuGroups } from "./header-menu"
import type { HeaderMenuGroup } from "./header-menu"
import {
  collectMenuLinks,
  moveFavourite,
  resolveFavouriteLinks,
  resolveRemainingLinks,
  toggleFavourite,
} from "./favourites"

function group(title: string, ...links: string[]): HeaderMenuGroup {
  return {
    value: title,
    title,
    links: links.map((value) => ({ value, label: value })),
  }
}

const GROUPS = [
  group("Платежи", "payments", "sbp", "qr"),
  group("Отчёты", "reports"),
  group("Справки", "certs", "statements"),
]

describe("distributeMenuGroups", () => {
  // Каждая группа уходит в самую короткую колонку: иначе меню растёт одной
  // длинной колонкой, пока остальные пустуют.
  it("раскладывает группы по колонкам, добирая самую короткую", () => {
    const columns = distributeMenuGroups(GROUPS, 3, [0, 0, 0])
    expect(columns).toHaveLength(3)
    expect(columns.flat()).toHaveLength(GROUPS.length)
    // Первая группа — самая высокая (шапка плюс три ссылки), поэтому
    // следующие уходят в другие колонки.
    expect(columns[0]).toHaveLength(1)
  })

  it("учитывает начальную высоту колонок", () => {
    const columns = distributeMenuGroups([group("Одна", "a")], 2, [10, 0])
    expect(columns[0]).toHaveLength(0)
    expect(columns[1]).toHaveLength(1)
  })

  it("ни одна группа не теряется и не дублируется", () => {
    const columns = distributeMenuGroups(GROUPS, 4, [0, 0, 0, 0])
    const titles = columns.flat().map((g) => g.title)
    expect(new Set(titles).size).toBe(GROUPS.length)
  })
})

describe("избранное", () => {
  it("собирает все ссылки меню в один список", () => {
    expect(collectMenuLinks(GROUPS).map((l) => l.value)).toEqual([
      "payments",
      "sbp",
      "qr",
      "reports",
      "certs",
      "statements",
    ])
  })

  // Порядок избранного задаёт пользователь, а не порядок групп в меню.
  it("отдаёт избранное в порядке закрепления", () => {
    const links = resolveFavouriteLinks(GROUPS, ["certs", "payments"])
    expect(links.map((l) => l.value)).toEqual(["certs", "payments"])
  })

  it("молча пропускает избранное, которого больше нет в меню", () => {
    const links = resolveFavouriteLinks(GROUPS, ["payments", "удалённый"])
    expect(links.map((l) => l.value)).toEqual(["payments"])
  })

  // «Остальные разделы» в настройке избранного отсортированы по алфавиту.
  it("остальные разделы идут по алфавиту и без избранных", () => {
    const rest = resolveRemainingLinks(GROUPS, ["payments"])
    expect(rest.map((l) => l.value)).not.toContain("payments")
    const labels = rest.map((l) => String(l.label))
    expect(labels).toEqual([...labels].sort((a, b) => a.localeCompare(b, "ru")))
  })

  it("звезда добавляет и снимает раздел", () => {
    expect(toggleFavourite([], "sbp")).toEqual(["sbp"])
    expect(toggleFavourite(["sbp", "qr"], "sbp")).toEqual(["qr"])
  })

  it("перетаскивание меняет порядок", () => {
    expect(moveFavourite(["a", "b", "c"], 0, 2)).toEqual(["b", "c", "a"])
  })

  it("перетаскивание за границы списка ничего не меняет", () => {
    const list = ["a", "b"]
    expect(moveFavourite(list, 1, 1)).toBe(list)
    expect(moveFavourite(list, -1, 0)).toBe(list)
    expect(moveFavourite(list, 0, 5)).toBe(list)
  })
})
