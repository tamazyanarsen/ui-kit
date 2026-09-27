import type * as React from "react"
import {
  CircleAlert,
  Download,
  Ellipsis,
  FileIcon,
  LoaderCircle,
  X,
} from "@/icons"

import { cn } from "@/lib/utils"

// FileListItem — строка одного загруженного или загружаемого файла. Значок
// плюс имя (с подсказкой через `title` для обрезанных имён) плюс строка
// сведений (размер и дата, либо «Загрузка» во время загрузки, либо текст
// ошибки) плюс необязательные действия повтора и удаления (Show Edit и
// Show Cross в таблице свойств макета).

type FileItemState = "default" | "loading" | "disabled" | "error"

/**
 * `Size` компонент-сета `ELK / files`: L и S, каждый со
 * своей парой Desktop/Mobile. Раньше был только L, хотя в макете это
 * основная ось компонента.
 *
 * Разница снята с `Size=S / Desktop`: вместо плитки с
 * иконкой 48px — голая иконка документа 16px, имя P3 Medium (12/16) вместо
 * P1 Medium, подпись P4 Regular (10/12) вместо P3 Medium, высота строки 28
 * вместо 48.
 */
type FileItemSize = "l" | "s"

interface FileListItemProps extends Omit<React.ComponentProps<"div">, "id"> {
  name: string
  meta?: React.ReactNode
  size?: FileItemSize
  state?: FileItemState
  errorText?: React.ReactNode
  /**
   * `Show Description` таблицы свойств — вторая строка
   * с размером и датой. Дизайн-чек «Сторибук Ч.2», замечание 3: в панели
   * свойств её не было вовсе, хотя в макете это отдельное свойство.
   */
  showDescription?: boolean
  /**
   * `Show Text Error` — «если компонент находится в состоянии Error, то
   * можно включить или отключить текст ошибки» (там же). На остальные
   * состояния не влияет.
   */
  showErrorText?: boolean
  showEdit?: boolean
  showCross?: boolean
  onRetry?: () => void
  onRemove?: () => void
}

export function FileListItem({
  className,
  name,
  meta,
  size = "l",
  state = "default",
  errorText = "Text about error here",
  showDescription = true,
  showErrorText = true,
  showEdit = true,
  showCross = true,
  onRetry,
  onRemove,
  ...props
}: FileListItemProps) {
  const disabled = state === "disabled"
  const error = state === "error"
  const loading = state === "loading"
  const small = size === "s"
  // В S иконка стоит сама по себе, без плитки, и в трёх состояниях
  // отличается только цветом.
  const glyphSize = small ? 16 : 24
  const Glyph = loading ? LoaderCircle : error ? CircleAlert : FileIcon
  const glyphColor = loading
    ? "text-[var(--file-item-loading-fg)]"
    : error
      ? "text-[var(--file-item-error-fg)]"
      : "text-[var(--file-item-icon-fg)]"

  // Значок свойства `Show Edit` зависит от размера, и это не описка макета:
  // у L стоит
  // `icon / more`, то есть меню действий над файлом, а у S —
  // `icon / download`. Дизайн-чек «Сторибук Ч.2», замечание 2
  // («должна быть иконка more») снят с L-строки, но распространять его на S
  // нельзя: там эталон рисует именно стрелку.
  const EditGlyph = small ? Download : Ellipsis

  // Вторая строка: у загрузки это всегда «Загрузка», у ошибки — текст
  // ошибки под свойством `Show Text Error`, в остальном — описание под
  // `Show Description`. `null` означает «строки нет вовсе», а не пустая:
  // иначе под именем оставался бы её межстрочный интервал.
  let secondLine: React.ReactNode = null
  if (loading) secondLine = "Загрузка"
  else if (error) secondLine = showErrorText ? errorText : null
  else if (showDescription) secondLine = meta

  return (
    <div
      data-slot="file-item"
      data-size={size}
      data-disabled={disabled || undefined}
      className={cn(
        // Строка ровно той же высоты, что её миниатюра 48px, и резервирует
        // 16px справа под замыкающие значки: `ELK / files` — это
        // `flex gap-16 items-center pr-16` без собственных вертикальных
        // отступов. Расстояние между строками принадлежит списку, который
        // их складывает.
        "flex w-full items-center gap-4 pr-4 text-p2-medium",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      {...props}
    >
      {/* Пересмотр замечания 23 дизайн-чека: живой компонент
          «ELK / files» показывает коробку миниатюры 48px (а не 32px) с
          нейтральной заливкой, которая есть всегда, а не только при
          ошибке.
          Размер зависит от брейкпоинта: в анатомии File Upload строка
          `ELK / files` — 48px с миниатюрой 48 в `L / Desktop` и 40px с
          миниатюрой 40 в `M / Mobile` (маркеры spaceVertical: x=48/h=48
          против x=40/h=40). Было зафиксировано на 48 для обоих. */}
      {small ? (
        <Glyph
          size={16}
          aria-hidden="true"
          className={cn(
            "size-4 shrink-0",
            loading && "animate-spin",
            glyphColor
          )}
        />
      ) : (
        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-[8px] desktop:size-12",
            error
              ? "bg-[var(--file-item-error-bg)]"
              : "bg-[var(--file-item-icon-bg)]"
          )}
        >
          {/* Все три заполняют плитку миниатюры 48px значком 24px,
              поэтому берут 24-пиксельные рисунки (`icon / document` из
              макета внутри плитки ELK / files). */}
          <Glyph
            size={glyphSize}
            aria-hidden="true"
            className={cn("size-6", loading && "animate-spin", glyphColor)}
          />
        </span>
      )}

      <span
        className={cn(
          "flex min-w-0 flex-1 flex-col",
          small && "h-7 justify-center"
        )}
      >
        <span
          title={typeof name === "string" ? name : undefined}
          className={cn(
            "truncate",
            small ? "text-p3-medium" : "text-p1-medium",
            disabled
              ? "text-[var(--file-item-fg-disabled)]"
              : "text-[var(--file-item-fg)]"
          )}
        >
          {name}
        </span>
        {secondLine != null && (
          <span
            className={cn(
              "truncate",
              small ? "text-p4-medium" : "text-p3-medium",
              error
                ? "text-[var(--file-item-error-fg)]"
                : "text-[var(--file-item-meta-fg)]"
            )}
          >
            {secondLine}
          </span>
        )}
      </span>

      <span className="flex shrink-0 items-center gap-4">
        {showEdit && (
          <button
            type="button"
            aria-label={small ? "Скачать файл" : "Действия с файлом"}
            onClick={onRetry}
            className="flex items-center justify-center text-[var(--file-item-icon-fg)] outline-none focus-visible:focus-ring"
          >
            <EditGlyph aria-hidden="true" className="size-4" />
          </button>
        )}
        {showCross && (
          <button
            type="button"
            aria-label="Удалить файл"
            onClick={onRemove}
            className="flex items-center justify-center text-[var(--file-item-icon-fg)] outline-none focus-visible:focus-ring"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        )}
      </span>
    </div>
  )
}
