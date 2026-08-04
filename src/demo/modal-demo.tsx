import * as React from "react"

import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/components/ui/accordion"

import { RowLabel } from "./shared"

function BasicModalDemo() {
  const [open, setOpen] = React.useState(false)
  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger render={<Button variant="secondary-grey" />}>
        Открыть модалку
      </ModalTrigger>
      <ModalContent size="l">
        <ModalHeader>
          <ModalTitle>Удалить карту?</ModalTitle>
          <ModalDescription>
            Это действие нельзя отменить — карта будет удалена из вашего
            профиля.
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          <p className="text-p2-regular text-[#6D6D6D]">
            Виртуальная карта •• 4482 привязана к 2 подпискам. После удаления
            платежи по ним перестанут проходить.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary-grey" onClick={() => setOpen(false)}>
            Отмена
          </Button>
          <Button variant="primary" onClick={() => setOpen(false)}>
            Удалить
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

function ScrollModalDemo() {
  const [open, setOpen] = React.useState(false)
  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger render={<Button variant="secondary-grey" />}>
        Открыть модалку со скроллом
      </ModalTrigger>
      <ModalContent size="l">
        <ModalHeader>
          <ModalTitle>Операции и выписки</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            {Array.from({ length: 14 }, (_, i) => (
              <div
                key={i}
                className="flex items-center justify-between border-b border-[#F4F4F4] pb-4 last:border-0 last:pb-0"
              >
                <div>
                  <p className="text-p2-medium text-[#252628]">
                    Операция №{i + 1}
                  </p>
                  <p className="text-p3-regular text-[#999999]">26 июля, 12:0{i % 10}</p>
                </div>
                <p className="text-p2-regular text-[#252628]">−{(i + 1) * 120} ₽</p>
              </div>
            ))}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="primary" onClick={() => setOpen(false)}>
            Готово
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

function SmallModalDemo() {
  const [open, setOpen] = React.useState(false)
  const [agree, setAgree] = React.useState(false)
  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger render={<Button variant="secondary-grey" />}>
        Открыть M-модалку
      </ModalTrigger>
      <ModalContent size="m">
        <ModalHeader>
          <ModalTitle>Согласие на обработку данных</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <label className="flex items-start gap-3 text-p2-regular text-[#252628]">
            <Checkbox checked={agree} onCheckedChange={setAgree} />
            Я согласен на обработку персональных данных в соответствии с
            политикой конфиденциальности
          </label>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="primary"
            disabled={!agree}
            onClick={() => setOpen(false)}
          >
            Подтвердить
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

function NoHeaderModalDemo() {
  const [open, setOpen] = React.useState(false)
  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger render={<Button variant="secondary-grey" />}>
        Открыть без Modal Top
      </ModalTrigger>
      <ModalContent size="l">
        <ModalBody>
          <h3 className="mb-1 text-lg font-medium text-[#252628] md:text-h4">
            Спасибо за заявку
          </h3>
          <p className="text-p2-regular text-[#6D6D6D]">
            Modal Top здесь отсутствует («None») — заголовок отрисован как
            обычный контент внутри ModalBody и скроллится вместе с ним, а не
            закреплён сверху.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="primary" onClick={() => setOpen(false)}>
            Ок
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

function ModalDemo() {
  return (
    <AccordionItem value="modal">
      <AccordionTrigger>Modal</AccordionTrigger>
      <AccordionPanel>
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <RowLabel>L, Title+Text, 2 кнопки</RowLabel>
            <BasicModalDemo />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <RowLabel>L, длинный контент (divider при скролле)</RowLabel>
            <ScrollModalDemo />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <RowLabel>M, 1 кнопка (Primary)</RowLabel>
            <SmallModalDemo />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <RowLabel>Modal Top: None</RowLabel>
            <NoHeaderModalDemo />
          </div>
        </div>
        <p className="mt-4 text-p3-regular text-muted-foreground">
          На мобильном (&lt;768px) модалка открывается как bottom sheet,
          закреплённый снизу, со скруглением только сверху; на десктопе — как
          центрированная карточка. Заголовок и кнопки закреплены (sticky),
          контент между ними скроллится; разделитель появляется только с той
          стороны, где контент скрыт скроллом. Esc и клик по фону закрывают
          модалку (Base UI Dialog).
        </p>
      </AccordionPanel>
    </AccordionItem>
  )
}

export { ModalDemo }
