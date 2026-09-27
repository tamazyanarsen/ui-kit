import { afterEach } from "vitest"
import { cleanup } from "@testing-library/react"
import "@testing-library/jest-dom/vitest"

// jsdom не реализует ни то, ни другое, но кит нацелен на настоящие
// браузеры, и несколько компонентов от этого зависят (ModalBody и Input
// наблюдают за своей коробкой через ResizeObserver, а Input включает свою
// подсказку о переполнении только на десктопе по медиазапросу). Ставим
// заглушки здесь, а не разводим защитные ветки в каждом компоненте. Обе
// заглушки инертны: в jsdom ничто не меняет размеры, а медиазапрос всегда
// сообщает «не совпало», поэтому тесты видят мобильную форму.
if (!("ResizeObserver" in globalThis)) {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
}

if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList
}

afterEach(() => {
  cleanup()
})
