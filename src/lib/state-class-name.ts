import { cn } from "@/lib/utils"

type StateClassName<S> = string | ((state: S) => string | undefined) | undefined

/**
 * Склеивает классы кита с `className` потребителя, который у примитивов
 * Base UI бывает и функцией от состояния.
 *
 * `cn` (clsx) функции молча выбрасывает: `className={(s) => ...}` терялся
 * целиком, хотя типы примитива его разрешают.
 */
function stateClassName<S>(
  base: string,
  className: StateClassName<S>
): string | ((state: S) => string) {
  if (typeof className !== "function") return cn(base, className)
  return (state: S) => cn(base, className(state))
}

export { stateClassName }
export type { StateClassName }
