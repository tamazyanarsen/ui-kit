import * as React from "react"
import { CirclePlus } from "@/icons"

import { cn } from "@/lib/utils"
import { hasContent } from "@/lib/has-content"

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
  onDragEnter,
  onDragLeave,
  ...props
}, ref) {
  const [dragOver, setDragOver] = React.useState(false)
  // Глубина вложенности перетаскивания: `dragleave` приходит и при переходе
  // с зоны на её дочерний узел (значок, текст), и зона гасла на каждом таком
  // переходе, мигая до следующего `dragover` (r27). Гаснет она, когда
  // покинуты все узлы, в которые успели войти.
  const dragDepth = React.useRef(0)
  React.useEffect(() => {
    if (disabled) {
      dragDepth.current = 0
      setDragOver(false)
    }
  }, [disabled])
  const inputRef = React.useRef<HTMLInputElement>(null)
  const inputId = React.useId()

  // Программный `input.click()` всплывает обратно в `onClick` зоны. Метка
  // отличает этот отражённый клик от настоящего: иначе потребитель получал
  // два клика на одно нажатие.
  const openingRef = React.useRef(false)

  function openPicker() {
    if (disabled) return
    openingRef.current = true
    try {
      inputRef.current?.click()
    } finally {
      openingRef.current = false
    }
  }

  function deliver(files: FileList) {
    const { accepted, rejected } = splitFiles(files, accept, multiple)
    // Наружу — всегда копия, а не `input.files`: после выбора поле
    // очищается (`value = ""`, чтобы тот же файл можно было выбрать снова),
    // и Chromium обнуляет этот же объект FileList на месте. Сохранённый в
    // состояние или в форму список оказывался пустым.
    if (accepted.length > 0) onFilesSelected?.(toFileList(accepted))
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
        // Tab попадает на скрытый `sr-only` input — кольцо рисует зона,
        // иначе клавиатурный пользователь не видит, где фокус.
        "has-[:focus-visible]:focus-ring",
        containerToneClass,
        className
      )}
      // ⚠️ Обработчики потребителя вызываются ВМЕСТЕ с внутренними, а не
      // вместо них: `{...props}` стоял после, и `onClick` для аналитики
      // отключал окно выбора, а свой `onDragOver` снимал `preventDefault` —
      // и бросить файл становилось нельзя.
      {...props}
      onDragEnter={(event) => {
        onDragEnter?.(event)
        if (disabled) return
        dragDepth.current += 1
      }}
      onDragOver={(event) => {
        onDragOver?.(event)
        if (disabled) return
        event.preventDefault()
        setDragOver(true)
      }}
      onDragLeave={(event) => {
        onDragLeave?.(event)
        dragDepth.current = Math.max(0, dragDepth.current - 1)
        if (dragDepth.current === 0) setDragOver(false)
      }}
      onDrop={(event) => {
        dragDepth.current = 0
        if (disabled) return
        event.preventDefault()
        setDragOver(false)
        if (event.dataTransfer.files.length > 0) deliver(event.dataTransfer.files)
      }}
      onClick={(event) => {
        // Отражение собственного `input.click()` — не новое нажатие.
        if (openingRef.current) return
        onClick?.(event)
        // Клик по самому input (Space/Enter с клавиатуры) окно выбора уже
        // открыл: второй `input.click()` открыл бы его повторно.
        if (event.target === inputRef.current) return
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
      <span className="flex min-w-0 items-center gap-2">
        <CirclePlus size={24} aria-hidden="true" className={cn("size-6 shrink-0", CONTENT_COLOR[tone])} />
        <span className={cn("min-w-0 text-p2-medium [overflow-wrap:anywhere] desktop:text-p1-medium", CONTENT_COLOR[tone])}>
          {children ?? (
            <>
              {/* Мобильная форма макета (M / Mobile) — просто «Загрузите
                  файлы» без подчёркивания: перетаскивать на телефоне
                  нечего. Десктопная — «Перетащите или загрузите файлы».
                  Форма выбирается вариантом `desktop:`, а не медиазапросом,
                  поэтому её переключают и ViewportScope, и контрол истории. */}
              <span className="desktop:hidden">Загрузите файлы</span>
              <span className="hidden desktop:inline">
                {"Перетащите или "}
                {/* Эту половину подписи макет подчёркивает оформлением
                    «Ссылка/» — толщина from-font, пропуск засечек выключен,
                    — а это и есть `text-link`. */}
                <span className="text-link">загрузите файлы</span>
              </span>
            </>
          )}
        </span>
      </span>
      {hasContent(subtitle) && (
        // Подзаголовок — элемент колонки `items-center`, его ширина по
        // содержимому: без `max-w-full` и `anywhere` (он уменьшает и
        // min-content) неразрывное имя файла вылезало в обе стороны.
        <span className={cn("max-w-full text-p3-regular [overflow-wrap:anywhere]", SUBTITLE_COLOR[tone])}>
          {subtitle}
        </span>
      )}
    </div>
  )
})
