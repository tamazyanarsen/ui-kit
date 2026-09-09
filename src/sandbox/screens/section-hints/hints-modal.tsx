import { useState } from "react"

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal"
import { Scrollbar } from "@/components/ui/scrollbar"
import { cn } from "@/lib/utils"

// D9. «Модальное окно подсказок раздела» — эталон 70371:25065.
//
// Собрано ОТДЕЛЬНЫМ модулем и открывается кнопкой «Справка» на ОБОИХ экранах
// раздела — на калькуляторе размещения (D3) и на деталке заявки (D8):
// подсказки принадлежат разделу, а не документу, и своей копии в экране нет
// ни у одного из двух. Самостоятельной страницей каталога окно поэтому не
// является — оно живёт состоянием сразу двух экранов.
//
// Две полосы прокрутки — по эталону: список тем и область содержимого
// прокручиваются независимо, длинный ответ не уводит вниз список.
//
// Иллюстрация — пустая рамка, и это НЕ заглушка «не успели»: по документу
// иллюстрации подсказок снимаются с наших же живых экранов (кадр 1072 × 648,
// @2x от коробки 536 × 323,83), а не выгружаются из макета — выгруженный
// растр снят в «Зелёной» теме и в «Голубой» нёс зелёные кнопки. Эталон в
// этом месте рисует ровно такую же пустую рамку.

interface Hint {
  id: string
  question: string
  answer: string
}

interface SectionHintsModalProps {
  /** Заголовок окна — название документа раздела. */
  title: string
  hints: Hint[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

function SectionHintsModal({
  title,
  hints,
  open,
  onOpenChange,
}: SectionHintsModalProps) {
  const [activeId, setActiveId] = useState(hints[0]?.id)
  const active = hints.find((hint) => hint.id === activeId) ?? hints[0]

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="l">
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <a
            href="#help"
            className="w-fit text-p2-medium text-[var(--grey-1514)] underline underline-offset-4"
            onClick={(event) => event.preventDefault()}
          >
            Подробнее в разделе «Помощь»
          </a>
        </ModalHeader>

        <ModalBody className="desktop:pb-12">
          <div className="flex min-h-[420px] gap-8">
            {/* Своя прокрутка у списка тем. */}
            <Scrollbar className="max-h-[420px] w-[264px] shrink-0 border-r border-[var(--divider)] pr-4">
              <ul className="flex flex-col gap-1">
                {hints.map((hint) => (
                  <li key={hint.id}>
                    <button
                      type="button"
                      onClick={() => setActiveId(hint.id)}
                      className={cn(
                        "w-full cursor-pointer rounded-[8px] px-4 py-3 text-left text-p2-medium text-[var(--grey-1514)] outline-none focus-visible:focus-ring",
                        hint.id === active?.id
                          ? "bg-[var(--grey-109)]"
                          : "hover:bg-[var(--grey-106)]"
                      )}
                    >
                      {hint.question}
                    </button>
                  </li>
                ))}
              </ul>
            </Scrollbar>

            {/* И своя — у содержимого. */}
            <Scrollbar className="max-h-[420px] min-w-0 flex-1">
              <div className="flex flex-col gap-6">
                <h3 className="text-h3 text-[var(--grey-1514)]">
                  {active?.question}
                </h3>
                <div
                  aria-hidden="true"
                  className="h-[224px] w-full rounded-[12px] border border-[var(--divider)]"
                />
                <p className="text-p2-medium text-[var(--grey-1514)]">
                  {active?.answer}
                </p>
              </div>
            </Scrollbar>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export { SectionHintsModal }
export type { Hint, SectionHintsModalProps }
