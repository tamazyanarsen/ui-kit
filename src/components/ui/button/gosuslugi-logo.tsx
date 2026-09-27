import type * as React from "react"

// Упрощённое приближение знака-флага Госуслуг (ЕСИА), который используют
// варианты кнопки «Secondary Logo». Решение то же, что и с PaymentLogo в
// ui/thumbnail: это кит для сверки с макетом, а не место для переноса
// точной государственной фирменной графики, поэтому здесь небольшая
// геометрическая замена (пять цветных клиньев, развёрнутых в стрелку), а не
// буквальная обводка. Цвета сняты пипеткой с собственных образцов Secondary
// Logo в макете кнопки.
function GosuslugiLogo({
  "data-icon": dataIcon,
  // Принимается и игнорируется, чтобы Button мог единообразно передавать
  // `size` любому глифу, который рисует: у этой замены один рисунок.
  size: _size,
  ...props
}: React.SVGProps<SVGSVGElement> & {
  "data-icon"?: string
  size?: 16 | 24
}) {
  return (
    <svg viewBox="0 0 16 16" fill="none" data-icon={dataIcon} {...props}>
      <path d="M3 8 L3 1 L9 3 Z" fill="#ED6F26" />
      <path d="M3 8 L9 3 L14 7 Z" fill="#D90751" />
      <path d="M3 8 L14 7 L14 9 Z" fill="#1487C9" />
      <path d="M3 8 L14 9 L9 13 Z" fill="#5B57A2" />
      <path d="M3 8 L9 13 L3 15 Z" fill="#017F36" />
    </svg>
  )
}

export { GosuslugiLogo }
