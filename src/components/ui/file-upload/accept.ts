/**
 * Проверка файлов по `accept` и `multiple` — для перетаскивания.
 *
 * Атрибут `accept` у `<input type="file">` действует только в окне выбора
 * файлов (и то как подсказка), а `dataTransfer.files` приходят как есть: при
 * `multiple={false} accept=".pdf"` можно было бросить пять .exe, и все пять
 * уезжали в `onFilesSelected`.
 */
function matchesAccept(file: File, accept: string | undefined) {
  if (!accept) return true
  const name = file.name.toLowerCase()
  const type = file.type.toLowerCase()
  return accept
    .split(",")
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean)
    .some((token) => {
      if (token.startsWith(".")) return name.endsWith(token)
      if (token.endsWith("/*")) return type.startsWith(token.slice(0, -1))
      return type === token
    })
}

function splitFiles(files: FileList, accept: string | undefined, multiple: boolean) {
  const accepted: File[] = []
  const rejected: File[] = []
  for (const file of Array.from(files)) {
    if (matchesAccept(file, accept) && (multiple || accepted.length === 0)) {
      accepted.push(file)
    } else {
      rejected.push(file)
    }
  }
  return { accepted, rejected }
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
