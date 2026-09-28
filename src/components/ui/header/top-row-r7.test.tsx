import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { ORG_ONE } from "@/test/header-fixtures"

import { Header } from "./header"

// Аудит r7: плитка профиля обрезает название многоточием
// (`max-w-[304px] min-w-0` + `truncate`), но кластер иконок вокруг стоял
// `shrink-0` и сжаться ей не давал. На узкой шапке плитка целиком уезжала за
// край и раздвигала страницу вбок: реестр аккредитивов на 600 — ширина
// документа 623 при окне 585. Раскладку jsdom не считает, поэтому проверка —
// по классам, которые её задают; живьём сверено в Chrome (стало 585).

describe("Header: кластер клиента даёт плитке профиля сжаться", () => {
  it("кластер сжимаемый, плитка профиля — тоже", () => {
    render(<Header organizations={ORG_ONE} contactPerson="Иванов И. И." />)
    const cluster = document.querySelector('[data-slot="header-client-actions"]')
    expect(cluster).not.toBeNull()
    expect(cluster!.className.split(/\s+/)).toContain("min-w-0")
    expect(cluster!.className.split(/\s+/)).not.toContain("shrink-0")
    const profile = cluster!.querySelector('[data-slot="profile-menu-trigger"]')
    expect(profile?.className.split(/\s+/)).toContain("min-w-0")
  })
})
