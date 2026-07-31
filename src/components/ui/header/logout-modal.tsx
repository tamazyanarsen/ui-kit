import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal"
import { Button } from "@/components/ui/button"

// Logout confirmation — fixed copy per the spec ("Выйти из личного
// кабинета?" / "Для повторного входа потребуется авторизация"), fully
// controlled from outside since it's triggered from two different places
// in Header (ProfileMenu's "Выйти" item, and Employee's standalone logout
// icon button) rather than owning its own trigger.
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
