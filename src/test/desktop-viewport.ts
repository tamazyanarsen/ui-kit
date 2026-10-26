// Десктопная ширина для тестов, которые проверяют десктопную форму
// компонента целиком (шапка: два ряда, плитки, «Меню»/«Создать» с подписью).
//
// В jsdom `matchMedia` нет, и общий setup отвечает «не совпадает» на любой
// запрос — то есть `useIsDesktop()` видит телефон. Пока форма шапки не
// зависела от ширины, это было неважно; с мобильной формой (`Size=Mobile`)
// тестам десктопа нужна десктопная ширина. Совпадает ТОЛЬКО порог десктопа:
// остальные запросы (например, 1536 у раскладки меню) отвечают как раньше.
//
// Импортируется побочным эффектом первой строкой тестового файла; vitest
// изолирует файлы, так что на соседей подмена не влияет.

import { DESKTOP_QUERY } from "@/lib/use-is-desktop"

window.matchMedia = (query: string) =>
  ({
    matches: query === DESKTOP_QUERY,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }) as MediaQueryList

export {}
