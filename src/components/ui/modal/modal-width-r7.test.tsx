import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Modal, ModalBody, ModalContent } from "./index"

// Аудит r7: окно `size="l"` жёстко 1008px, а `desktop:` включается с 768px —
// на ширине 768–1135 карточка уезжала за край, и вынесенный на 64px вправо
// крестик пропадал вовсе. Ширина ограничивается видимой областью с запасом
// под крестик (раскладку jsdom не считает — проверяется класс; геометрия
// сверена в Chrome на 800/900/1024/1280).

describe("ModalContent: ширина не шире видимой области", () => {
  it.each(["l", "m"] as const)("size=%s ограничен max-width с запасом под крестик", (size) => {
    render(
      <Modal open>
        <ModalContent size={size}>
          <ModalBody>Тело</ModalBody>
        </ModalContent>
      </Modal>
    )
    expect(screen.getByRole("dialog").className).toContain(
      "desktop:max-w-[calc(100%_-_160px)]"
    )
  })
})
