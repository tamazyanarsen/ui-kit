import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal"
import { Button } from "@/components/ui/button"

// Подтверждение выхода — текст зафиксирован макетом («Выйти из личного
// кабинета?» и «Для повторного входа потребуется авторизация»), а само окно
// полностью управляется снаружи, потому что вызывается из двух разных мест
// в Header (пункт «Выйти» в ProfileMenu и отдельная кнопка-значок выхода у
// Employee), а не владеет своим триггером.
interface LogoutModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

function LogoutModal({ open, onOpenChange, onConfirm }: LogoutModalProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="m">
        <ModalHeader>
          <ModalTitle>Выйти из личного кабинета?</ModalTitle>
          <ModalDescription>
            Для повторного входа потребуется авторизация
          </ModalDescription>
        </ModalHeader>
        <ModalFooter>
          <Button variant="secondary-grey" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              onConfirm()
              onOpenChange(false)
            }}
          >
            Выйти
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export { LogoutModal }
export type { LogoutModalProps }
