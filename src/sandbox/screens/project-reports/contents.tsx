import * as React from "react"

import { cn } from "@/lib/utils"

import { SandboxBlock, SandboxSection } from "../../shell"

// «Содержание раздела» — оглавление отчёта.
//
// Три правила из аннотации `33218:36322`, и все три поведенческие:
//
//  1. Оглавление ЗАКРЕПЛЯЕТСЯ при вертикальной прокрутке — липнет колонка и
//     прибивается к 104 = 64 + 40 (шапка + поле сетки).
//  2. Активный пункт считается по СЕРЕДИНЕ доступной области, а не по
//     жёсткому порогу сверху: иначе короткая карточка внизу страницы никогда
//     не становится активной. Плюс особый случай «докрутили донизу» —
//     последний пункт подсвечивается, даже если его середина выше центра.
//  3. Ниже 1536 блок содержания пропадает ЦЕЛИКОМ, содержимое занимает всю
//     область — на узком окне колонка съедала бы больше, чем помогает.
//
// Переход по оглавлению подводит карточку целиком на линию оглавления
// (правило C7 документа): `scroll-margin-top` у секций, а не «прокрутить на
// высоту шапки» руками.

interface ContentsEntry {
  id: string
  label: string
}

interface ReportContentsProps {
  entries: ContentsEntry[]
}

const STICKY_TOP = 104

function ReportContents({ entries }: ReportContentsProps) {
  const [activeId, setActiveId] = React.useState<string | undefined>(
    entries[0]?.id
  )

  React.useEffect(() => {
    function update() {
      const middle = window.innerHeight / 2
      let current: string | undefined = entries[0]?.id

      for (const entry of entries) {
        const element = document.getElementById(entry.id)
        if (!element) continue
        if (element.getBoundingClientRect().top <= middle) current = entry.id
      }

      // «Докрутили донизу»: последняя карточка может быть ниже середины
      // экрана и в обычном правиле не выиграет никогда.
      const atBottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 2
      if (atBottom) current = entries.at(-1)?.id

      setActiveId(current)
    }

    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [entries])

  return (
    <div className="hidden 2xl:block" style={{ position: "sticky", top: STICKY_TOP }}>
      <SandboxBlock>
        <SandboxSection title="Содержание раздела" gap={8}>
          <nav className="flex flex-col">
            {entries.map((entry) => (
              <a
                key={entry.id}
                href={`#${entry.id}`}
                aria-current={entry.id === activeId ? "true" : undefined}
                className={cn(
                  "rounded-[8px] px-4 py-3 text-p2-regular text-[var(--grey-1514)] outline-none focus-visible:focus-ring",
                  entry.id === activeId
                    ? "bg-[var(--grey-109)]"
                    : "hover:bg-[var(--grey-106)]"
                )}
              >
                {entry.label}
              </a>
            ))}
          </nav>
        </SandboxSection>
      </SandboxBlock>
    </div>
  )
}

/** Карточка отчёта — якорь оглавления. */
function ReportSection({
  id,
  children,
}: {
  id: string
  children: React.ReactNode
}) {
  return (
    <div id={id} style={{ scrollMarginTop: STICKY_TOP }}>
      {children}
    </div>
  )
}

export { ReportContents, ReportSection, STICKY_TOP }
export type { ContentsEntry, ReportContentsProps }
