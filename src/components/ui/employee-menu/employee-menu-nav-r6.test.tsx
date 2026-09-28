import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { EmployeeMenuNav } from "./employee-menu-nav"

describe("EmployeeMenuNav: подсказка пустого избранного", () => {
  // Аудит r6: подсказка стояла `whitespace-nowrap` без обрезки и на узкой
  // шапке вылезала за полосу — под колокольчик и в горизонтальную прокрутку
  // страницы. Раскладку jsdom не считает, поэтому проверяется контракт
  // классов; вживую сверено в Chrome на 1024 и 1280.
  it("обрезает себя, а не вылезает за полосу", () => {
    render(<EmployeeMenuNav />)
    const hint = document.querySelector('[data-slot="employee-menu-nav-empty-hint"]')
    expect(hint).not.toBeNull()
    // Строка режется ОДНИМ блоком: у двух сжимаемых кусков многоточие
    // появлялось и посреди фразы («…нажмит… ☆ справа, чтобы доб…»).
    expect(hint!.className).toMatch(/\btruncate\b/)
    expect(hint!.className).toMatch(/\bmin-w-0\b/)
    expect(hint!.className.split(/\s+/)).not.toContain("flex")
    expect(hint!.querySelector('[class*="truncate"]')).toBeNull()
    // Звезда — строчный элемент в потоке текста, а не флекс-обёртка.
    const star = hint!.querySelector("svg")
    expect(star?.parentElement).toBe(hint)
    expect(star!.getAttribute("class")).toMatch(/\binline-block\b/)
  })
})
