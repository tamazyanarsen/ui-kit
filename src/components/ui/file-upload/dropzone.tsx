import * as React from "react"
import { CirclePlus } from "@/icons"

import { cn } from "@/lib/utils"

import { splitFiles, toFileList } from "./accept"

// FileUploadDropzone — цель для перетаскивания файлов. Состояния: обычное,
// наведение (файл тащат над зоной — по макету заливается Grey 100),
// выключенное и ошибка.

type DropzoneTone = "disabled" | "error" | "default"

// Значок и основной текст делят одни и те же три цвета; у подзаголовка
// токены выключенного и обычного состояний свои собственные, а вот ошибка
// всё равно переиспользует тот же токен border-error, что и остальные.
const CONTENT_COLOR: Record<DropzoneTone, string> = {
  disabled: "text-[var(--file-upload-fg-disabled)]",
  error: "text-[var(--file-upload-border-error)]",
  default: "text-[var(--file-upload-fg)]",
}
// Ошибка перекрашивает только значок и заголовок (CONTENT_COLOR):
// подзаголовок и в состоянии ошибки остаётся обычным серым — так в живом
// компоненте макета.
const SUBTITLE_COLOR: Record<DropzoneTone, string> = {
  disabled: "text-[var(--file-upload-subtitle-fg-disabled)]",
  error: "text-[var(--file-upload-subtitle-fg)]",
  default: "text-[var(--file-upload-subtitle-fg)]",
}

interface FileUploadDropzoneProps
  extends Omit<React.ComponentProps<"div">, "onDrop" | "onChange"> {
  subtitle?: React.ReactNode
  error?: boolean
  disabled?: boolean
  multiple?: boolean
  accept?: string
  onFilesSelected?: (files: FileList) => void
  /** Файлы, отброшенные по `accept` или `multiple` (перетаскивание или
   * «Все файлы» в окне выбора) — чтобы показать пользователю причину. */
  onFilesRejected?: (files: File[]) => void
}

// `forwardRef`: тип пропсов объявляет `ref`, а на React 18 обычная функция
// его молча теряет — ref потребителя (фокус, react-hook-form) не доезжал.
export const FileUploadDropzone = React.forwardRef<
  HTMLDivElement,
  FileUploadDropzoneProps
>(function FileUploadDropzone({
  className,
  subtitle,
  error = false,
  disabled = false,
  multiple = true,
  accept,
  onFilesSelected,
  onFilesRejected,
  children,
  onClick,
  onDragOver,
  onDragLeave,
  ...props
}, ref) {
  const [dragOver, setDragOver] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const inputId = React.useId()

  function openPicker() {
    if (!disabled) inputRef.current?.click()
  }

  function deliver(files: FileList) {
    const { accepted, rejected } = splitFiles(files, accept, multiple)
    if (accepted.length > 0) {
      onFilesSelected?.(rejected.length > 0 ? toFileList(accepted) : files)
    }
    if (rejected.length > 0) onFilesRejected?.(rejected)
  }

  const tone: DropzoneTone = disabled ? "disabled" : error ? "error" : "default"

  let containerToneClass: string
  if (disabled) {
    // Заливка та же, что и в Default: у `State=Disabled`
    // меняются только рамка и текст.
    containerToneClass =
      "cursor-not-allowed border-[var(--file-upload-border-disabled)] bg-[var(--file-upload-bg)]"
  } else if (error) {
    containerToneClass =
      "cursor-pointer border-[var(--file-upload-border-error)] bg-[var(--file-upload-bg)]"
  } else {
    // На наведении меняется ЗАЛИВКА, а не рамка: у `Size=Desktop,
    // State=Hover` появляется фон grey-106 #F8F8F8, а
    // пунктирная рамка остаётся тем же grey-284, что и в Default.
    // Раньше здесь висел `hover:border-*` на тот же самый
    // цвет — то есть наведение не давало вообще никакой реакции.
    // Перетаскивание файла показывает то же состояние, что и наведение.
    containerToneClass = cn(
      "cursor-pointer border-[var(--file-upload-border)] bg-[var(--file-upload-bg)] hover:bg-[var(--file-upload-bg-hover)]",
      dragOver && "bg-[var(--file-upload-bg-hover)]"
    )
  }

  return (
    <div
      ref={ref}
      data-slot="file-upload-dropzone"
      data-disabled={disabled || undefined}
      aria-disabled={disabled || undefined}
      // Дизайн-чек, замечание 22: замерено по вектору макета в
      // натуральном масштабе (верхний край значка стоит ровно на 24px ниже
      // верхнего края самой карточки — py-6 и так совпадал). На деле не
      // совпадала раскладка: макет ставит значок в одну строку с
      // заголовком, а не над ним, а подзаголовок выносит в свою строку
      // ниже.
      className={cn(
        // `p-6` и `gap-2`: мастер — это равномерная коробка 24px с
        // зазором 8px между строкой «Перетащите или загрузите файлы» и
        // подсказкой о форматах; прежние 16px по бокам и зазор 4px были
        // теснее макета.
        "relative flex w-full flex-col items-center gap-2 rounded-[24px] border border-dashed p-6 text-center transition-colors",
        containerToneClass,
        className
      )}
      // ⚠️ Обработчики потребителя вызываются ВМЕСТЕ с внутренними, а не
      // вместо них: `{...props}` стоял после, и `onClick` для аналитики
      // отключал окно выбора, а свой `onDragOver` снимал `preventDefault` —
      // и бросить файл становилось нельзя.
      {...props}
      onDragOver={(event) => {
        onDragOver?.(event)
        if (disabled) return
        event.preventDefault()
        setDragOver(true)
      }}
      onDragLeave={(event) => {
        onDragLeave?.(event)
        setDragOver(false)
      }}
      onDrop={(event) => {
        if (disabled) return
        event.preventDefault()
        setDragOver(false)
        if (event.dataTransfer.files.length > 0) deliver(event.dataTransfer.files)
      }}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) openPicker()
      }}
    >
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        multiple={multiple}
        accept={accept}
        disabled={disabled}
        // Ошибку видно не только глазами: без `aria-invalid` скринридер
        // объявляет поле обычным, сколько бы красного вокруг ни нарисовали.
        aria-invalid={error || undefined}
        className="sr-only"
        onChange={(event) => {
          if (event.target.files && event.target.files.length > 0) {
            deliver(event.target.files)
          }
          event.target.value = ""
        }}
      />
      <span className="flex items-center gap-2">
        <CirclePlus size={24} aria-hidden="true" className={cn("size-6", CONTENT_COLOR[tone])} />
        <span className={cn("text-p2-medium desktop:text-p1-medium", CONTENT_COLOR[tone])}>
          {children ?? (
            <>
              {"Перетащите или "}
              {/* Эту половину подписи макет подчёркивает оформлением
                  «Ссылка/» — толщина from-font, пропуск засечек выключен,
                  — а это и есть `text-link`. */}
              <span className="text-link">загрузите файлы</span>
            </>
          )}
        </span>
      </span>
      {subtitle && (
        <span className={cn("text-p3-medium", SUBTITLE_COLOR[tone])}>
          {subtitle}
        </span>
      )}
    </div>
  )
})
