/**
 * MIME по расширению — запасная сверка, когда `file.type` врёт или пуст.
 *
 * Тип файла браузер берёт из реестра ОС: на Windows `.csv` приходит как
 * `application/vnd.ms-excel`, а `.docx` или HEIC без установленного
 * приложения — пустой строкой. Окно выбора с `accept="text/csv"` такой файл
 * показывает (оно сверяет расширение), и отбрасывать его здесь нельзя.
 */
const MIME_BY_EXTENSION: Record<string, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  odt: "application/vnd.oasis.opendocument.text",
  ods: "application/vnd.oasis.opendocument.spreadsheet",
  rtf: "application/rtf",
  csv: "text/csv",
  txt: "text/plain",
  xml: "application/xml",
  json: "application/json",
  zip: "application/zip",
  rar: "application/vnd.rar",
  "7z": "application/x-7z-compressed",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  bmp: "image/bmp",
  webp: "image/webp",
  svg: "image/svg+xml",
  tif: "image/tiff",
  tiff: "image/tiff",
  heic: "image/heic",
  heif: "image/heif",
  mp3: "audio/mpeg",
  wav: "audio/wav",
  mp4: "video/mp4",
  mov: "video/quicktime",
  exe: "application/x-msdownload",
  msi: "application/x-msi",
  bat: "application/x-bat",
}

function matchesMime(type: string, token: string) {
  if (token.endsWith("/*")) return type.startsWith(token.slice(0, -1))
  return type === token
}

/**
 * Проверка файлов по `accept` и `multiple` — для перетаскивания и окна
 * выбора.
 *
 * Атрибут `accept` у `<input type="file">` действует только в окне выбора
 * файлов (и то как подсказка), а `dataTransfer.files` приходят как есть: при
 * `multiple={false} accept=".pdf"` можно было бросить пять .exe, и все пять
 * уезжали в `onFilesSelected`.
 *
 * MIME-токен сверяется сначала с `file.type`, потом с типом по расширению.
 * Файл, о типе которого ничего не известно (пустой `type` и незнакомое
 * расширение), MIME-токен отбрасывает: так приходят папки и файлы без
 * расширения, а окно выбора с тем же `accept` их тоже не показало бы.
 */
function matchesAccept(file: File, accept: string | undefined) {
  if (!accept) return true
  const name = file.name.toLowerCase()
  const type = file.type.toLowerCase()
  const dot = name.lastIndexOf(".")
  const byExtension = dot >= 0 ? MIME_BY_EXTENSION[name.slice(dot + 1)] : undefined
  const tokens = accept
    .split(",")
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean)
  // Из одних пробелов и запятых («  », «,») ограничения нет, а не «ничего
  // не подходит»: иначе поле отвергало каждый файл.
  if (tokens.length === 0) return true
  return tokens.some((token) => {
    // `*/*` и голая `*` — «любой тип», как их понимает окно выбора файлов,
    // включая файл без типа и без знакомого расширения. Без этой ветки
    // `startsWith("*/")` отвергал каждый файл (ревью 10.10, п. 2).
    if (token === "*" || token === "*/*") return true
    if (token.startsWith(".")) return name.endsWith(token)
    if (type && matchesMime(type, token)) return true
    return byExtension ? matchesMime(byExtension, token) : false
  })
}

/** Почему файл не принят: формат, число файлов или размер. */
type FileRejectReason = "type" | "count" | "size" | "total-size"

interface FileRejection {
  file: File
  reason: FileRejectReason
}

interface SplitFilesOptions {
  accept?: string
  multiple: boolean
  /** Сколько файлов принять за один выбор или бросок. */
  maxFiles?: number
  /** Предел размера одного файла, MB (1 MB = 1024 × 1024 байт). */
  maxFileSizeMb?: number
  /** Предел суммарного размера принятых за раз файлов, MB. */
  maxTotalSizeMb?: number
}

const MB = 1024 * 1024

/**
 * Делит файлы на принятые и отклонённые — с причиной для каждого
 * отклонённого.
 *
 * Ревью 10.10, КК-5: подзаголовок зоны печатает лимиты («До 5 файлов…,
 * не более 10 MB»), а зона проверяла только `accept` и `multiple` — файл
 * больше предела уходил в `onFilesSelected`, и каждый потребитель проверял
 * размер сам. Порядок проверок: формат, число, размер файла, общий размер.
 * Суммарный предел считается по уже принятым в этом выборе файлам.
 */
function splitFiles(
  files: FileList,
  { accept, multiple, maxFiles, maxFileSizeMb, maxTotalSizeMb }: SplitFilesOptions
) {
  const accepted: File[] = []
  const rejections: FileRejection[] = []
  const countLimit = multiple ? (maxFiles ?? Infinity) : 1
  let total = 0
  for (const file of Array.from(files)) {
    let reason: FileRejectReason | null = null
    if (!matchesAccept(file, accept)) reason = "type"
    else if (accepted.length >= countLimit) reason = "count"
    else if (maxFileSizeMb !== undefined && file.size > maxFileSizeMb * MB) reason = "size"
    else if (maxTotalSizeMb !== undefined && total + file.size > maxTotalSizeMb * MB) {
      reason = "total-size"
    }
    if (reason) {
      rejections.push({ file, reason })
    } else {
      accepted.push(file)
      total += file.size
    }
  }
  return { accepted, rejected: rejections.map(({ file }) => file), rejections }
}

/**
 * Собирает `FileList` из массива: публичный колбэк обещает именно его.
 * `DataTransfer` есть во всех браузерах, но не в jsdom и не в старых
 * движках — там отдаётся совместимый по форме объект.
 */
function toFileList(files: File[]): FileList {
  if (typeof DataTransfer !== "undefined") {
    try {
      const transfer = new DataTransfer()
      for (const file of files) transfer.items.add(file)
      return transfer.files
    } catch {
      // Конструктор есть, но недоступен (часть окружений) — ниже запасной путь.
    }
  }
  const list: Record<number, File> & {
    length: number
    item: (index: number) => File | null
    [Symbol.iterator]: () => Iterator<File>
  } = {
    length: files.length,
    item: (index) => files[index] ?? null,
    [Symbol.iterator]: () => files[Symbol.iterator](),
  }
  files.forEach((file, index) => {
    list[index] = file
  })
  return list as unknown as FileList
}

export { matchesAccept, splitFiles, toFileList }
export type { FileRejection, FileRejectReason, SplitFilesOptions }
