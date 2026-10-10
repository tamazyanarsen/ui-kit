/**
 * Реестр, общий для ВСЕХ копий кита на странице.
 *
 * В микрофронтах у каждого приложения своя копия пакета, а значит и свои
 * модульные переменные. Реестр, публикующий одну CSS-переменную на `<html>`
 * (`--viewport-inset-top`, `--viewport-inset-bottom`,
 * `--floating-corner-inset`), обязан видеть вклады всех копий: иначе копия,
 * у которой своих полос нет, записывала `0px` поверх значения соседней
 * (ревью 10.10, КК-4). Тот же приём, что у замка прокрутки
 * (`use-page-scroll-lock.ts`): состояние лежит на `window` под ключом
 * `Symbol.for`, одинаковым для всех копий.
 *
 * Звать только в браузере — из эффектов, не во время отрисовки на сервере.
 */
function sharedRegistry<T>(name: string, create: () => T): T {
  const holder = window as unknown as Record<symbol, T | undefined>
  const key = Symbol.for(`core-ui-kit.${name}`)
  return (holder[key] ??= create())
}

export { sharedRegistry }
