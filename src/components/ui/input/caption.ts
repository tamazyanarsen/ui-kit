import type * as React from "react"

/**
 * Какую подпись показать под полем: текст ошибки или комментарий.
 *
 * ⚠️ Не `error ?? comment`. Оператор `??` пропускает только `null` и
 * `undefined`, а распространённое `error={touched && msg}` даёт `false`, и
 * `error={true}` (только красная рамка, без текста) — тоже частый случай. В
 * обоих подпись-комментарий пропадала, а на её месте рисовался пустой `<p>`.
 *
 * Текстом ошибки считается только то, что действительно рисуется: не
 * булево значение и не пустая строка. Красная рамка при этом по-прежнему
 * держится на `Boolean(error)` у самого поля, и цвет подписи тоже: в макете
 * это один слой, который при ошибке просто краснеет.
 */
function resolveCaption(error: React.ReactNode, comment: React.ReactNode) {
  const errorText =
    error === null || error === undefined || typeof error === "boolean" || error === ""
      ? null
      : error
  const caption = errorText ?? (comment === "" || typeof comment === "boolean" ? null : comment)
  return {
    /** Текст ошибки, если он есть. */
    errorText,
    /** То, что стоит в строке подписи: ошибка, иначе комментарий. */
    caption: caption ?? null,
  }
}

export { resolveCaption }
