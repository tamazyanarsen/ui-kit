import * as React from "react"
import {
  CircleAlert,
  Download,
  Ellipsis,
  FileIcon,
  LoaderCircle,
  X,
} from "@/icons"

import { cn } from "@/lib/utils"
import { hasContent } from "@/lib/has-content"

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
  /** Кнопка свойства `Show Edit`: меню действий у L, скачивание у S. */
  onEdit?: () => void
  /** @deprecated Прежнее имя обработчика кнопки `Show Edit` — у S это
   * «Скачать файл», а не повтор. Используйте `onEdit`. */
  onRetry?: () => void
  onRemove?: () => void
}

// `forwardRef`: тип пропсов объявляет `ref`, а на React 18 обычная функция
// его молча теряет — ref потребителя (фокус, react-hook-form) не доезжал.
export const FileListItem = React.forwardRef<
  HTMLDivElement,
  FileListItemProps
>(function FileListItem({
  className,
  name,
  meta,
  size = "l",
  state = "default",
  // Без умолчания: английская заглушка из макета («Text about error
  // here») доезжала до пользователя, если текст ошибки не передали.
  errorText,
  showDescription = true,
  showErrorText = true,
  showEdit = true,
  showCross = true,
  onEdit,
  onRetry,
  onRemove,
  ...props
}, ref) {
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
  else if (error) secondLine = showErrorText ? (errorText ?? null) : null
  else if (showDescription) secondLine = meta

  return (
    <div
      ref={ref}
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
        {hasContent(secondLine) && (
          <span
            // Аудит 17: текст ошибки обрезался в одну строку без подсказки —
            // причину отказа («Файл слишком большо…») было не прочитать. В L
            // он переносится до двух строк, в S (строка фиксированной высоты
            // `h-7`) остаётся в одну; в обоих случаях полный текст — в `title`.
            title={typeof secondLine === "string" ? secondLine : undefined}
            className={cn(
              small ? "truncate" : "line-clamp-2 break-words",
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
            // `disabled`, а не только `pointer-events-none` у строки:
            // иначе Tab + Enter срабатывали у заблокированного файла.
            disabled={disabled}
            onClick={onEdit ?? onRetry}
            className="flex items-center justify-center text-[var(--file-item-icon-fg)] outline-none focus-visible:focus-ring"
          >
            <EditGlyph aria-hidden="true" className="size-4" />
          </button>
        )}
        {showCross && (
          <button
            type="button"
            aria-label="Удалить файл"
            disabled={disabled}
            onClick={onRemove}
            className="flex items-center justify-center text-[var(--file-item-icon-fg)] outline-none focus-visible:focus-ring"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        )}
      </span>
    </div>
  )
})
