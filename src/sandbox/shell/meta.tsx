import type { Decorator, Parameters } from "@storybook/react-vite"

import { ToastProvider, Toaster } from "@/components/ui/toast-message"

// Общая обвязка историй-песочниц.
//
// `layout: "fullscreen"` обязателен: экран — это весь вьюпорт вместе с
// шапкой, и штатная рамка `padded` смещала бы сетку на свои 16px, из-за чего
// поле страницы переставало быть 60 при 1920 — то самое число, которое эти
// экраны и проверяют.
//
// Тосты подключены сразу всем: их показывают четыре экрана из тринадцати, а
// провайдер без очереди ничего не рисует, поэтому дешевле держать его в
// общей обвязке, чем вспоминать про него в каждой второй истории.
const SANDBOX_PARAMETERS: Parameters = {
  layout: "fullscreen",
  // Подложку рисует сам экран (холст конструктора — Grey 109), поэтому
  // переключатель подложки из preview.tsx здесь ничего не решает: гасим
  // серую заливку body, чтобы под страницей не было второго серого.
  backgrounds: { disable: true },
}

const SANDBOX_DECORATORS: Decorator[] = [
  (Story) => (
    <ToastProvider>
      <Story />
      <Toaster />
    </ToastProvider>
  ),
]

export { SANDBOX_DECORATORS, SANDBOX_PARAMETERS }
