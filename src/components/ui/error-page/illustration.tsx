import type * as React from "react"

import { cn } from "@/lib/utils"
import errorIllustration from "@/assets/error-page/error-illustration.png"
import noCodeMascot from "@/assets/error-page/no-code-mascot.png"

/**
 * Image Error (ELK) — иллюстрация страницы ошибки.
 *
 * Дизайн-чек №28: «во-первых, цифры четвёрок не соответствуют шрифту,
 * который применён в компоненте, во-вторых, слишком маленький размер
 * иллюстрации нуля. Необходимо унаследовать точный компонент из
 * дизайн-системы и сделать Pixel Perfect».
 *
 * Обе претензии — про одну и ту же причину: блок собирался локально.
 * Цифры рисовались текстом (`text-[160px] font-bold`), то есть Object Sans
 * Heavy, а в макете это ВЕКТОРНЫЕ ассеты со своим рисунком — четвёрка
 * 232×300 с плоским срезом, к шрифту отношения не имеющая. Иллюстрация
 * же вставлялась как отдельная маленькая картинка высотой 0.85em (≈136px)
 * вместо полноразмерного кадра.
 *
 * Здесь блок воспроизведён по мастеру `Image Error (ELK)`, вариант
 * `Type=404` (нода 39222:20716) и `Type=403` (39222:20701):
 *
 *   контейнер  1216×488, overflow-clip
 *   картинка   left 19.07%, top −17.21%, w 65.59%, h 114.34% (обрезается)
 *   цифра 4    inset 16.36% / 61.84% / 22.29% / 19.08%  → ровно 232×299
 *   цифра 4 #2 inset 16.36% / 19.08% / 22.29% / 61.84%
 *   цифра 3    inset 16.39% / 20.07% / 21.31% / 62.83%
 *
 * Всё в процентах от контейнера, поэтому блок масштабируется вместе с
 * ним — мобильный вариант в макете это ровно тот же кадр шириной 328px
 * (нода 48696:4521).
 */

/* Цифры — ровно те пути, что отдаёт Figma (assets 4e20187e / fdf1b2f8),
   заливка Grey 166 #C8C8CB. Не шрифт: у четвёрки прямые срезы и своя
   ширина штриха, текстом это не воспроизводится. */
function DigitFour({
  className,
  style,
}: {
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <svg
      viewBox="0 0 232 300"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
      className={className}
      style={style}
    >
      <path
        d="M232 200.143V246H197.63V300H147.793V246H0V200.143L103.541 0H157.244L53.7037 200.143H147.793V122.143H197.63V200.143H232Z"
        fill="var(--error-page-code-fg)"
      />
    </svg>
  )
}

function DigitThree({
  className,
  style,
}: {
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <svg
      viewBox="0 0 208 304"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
      className={className}
      style={style}
    >
      <path
        d="M133.9 121.941C155.856 127.058 173.622 137.148 187.2 152.213C201.067 166.994 208 185.612 208 208.067C208 237.913 197.744 261.363 177.233 278.418C156.722 295.473 131.589 304 101.833 304C78.7222 304 57.9222 298.741 39.4333 288.224C21.2333 277.707 8.08889 262.358 0 242.177L42.4667 217.874C51.4222 243.456 71.2111 256.247 101.833 256.247C119.167 256.247 132.889 251.983 143 243.456C153.111 234.644 158.167 222.848 158.167 208.067C158.167 193.287 153.111 181.633 143 173.105C132.889 164.578 119.167 160.314 101.833 160.314H90.5667L70.6333 130.895L136.067 46.0477H9.1V0H195.433V41.784L133.9 121.941Z"
        fill="var(--error-page-code-fg)"
      />
    </svg>
  )
}

type IllustrationType = "403" | "404" | "image"

function ErrorPageIllustration({
  type,
  className,
}: {
  type: IllustrationType
  className?: string
}) {
  if (type === "image") {
    // Вариант `Type=Image` — обобщённая иллюстрация без цифр, для всех
    // прочих ошибок (500, техработы и т.д.).
    return (
      <div
        data-slot="error-page-illustration"
        data-type="image"
        className={cn("relative w-full overflow-hidden", className)}
      >
        <img src={noCodeMascot} alt="" aria-hidden="true" className="mx-auto block h-40 w-auto" />
      </div>
    )
  }

  return (
    <div
      data-slot="error-page-illustration"
      data-type={type}
      className={cn(
        "relative w-full max-w-[1216px] overflow-hidden",
        // 1216 × 488 из мастера — держим пропорцию, а не фиксированный размер.
        "aspect-[1216/488]",
        className
      )}
    >
      <img
        src={errorIllustration}
        alt=""
        aria-hidden="true"
        className="absolute max-w-none"
        style={{ left: "19.07%", top: "-17.21%", width: "65.59%", height: "114.34%" }}
      />
      {/* Левая цифра — четвёрка в обоих кодах. */}
      <DigitFour
        className="absolute"
        style={
          type === "404"
            ? { top: "16.36%", right: "61.84%", bottom: "22.29%", left: "19.08%" }
            : { top: "16.39%", right: "61.84%", bottom: "22.13%", left: "19.08%" }
        }
      />
      {type === "404" ? (
        <DigitFour
          className="absolute"
          style={{ top: "16.36%", right: "19.08%", bottom: "22.29%", left: "61.84%" }}
        />
      ) : (
        <DigitThree
          className="absolute"
          style={{ top: "16.39%", right: "20.07%", bottom: "21.31%", left: "62.83%" }}
        />
      )}
    </div>
  )
}

export { ErrorPageIllustration }
export type { IllustrationType }
