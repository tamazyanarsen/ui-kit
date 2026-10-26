export { Modal, ModalTrigger, ModalClose } from "./root"
export { ModalContent, modalPopupVariants } from "./popup"
export {
  ModalHeader,
  ModalTopHolder,
  ModalTitle,
  ModalDescription,
} from "./header"
export { ModalBody } from "./body"
export { ModalColumns } from "./columns"
export type { ModalColumnsProps } from "./columns"
export { ModalFooter } from "./footer"
// Плавная смена высоты (Правки UI-Kit от 25.10) — общий хук кита, которым
// модалка меняет высоту; отдаётся и экранам/блокам с высотой по содержимому.
export { useSmoothHeight } from "@/lib/use-smooth-height"
export type { SmoothHeightOptions } from "@/lib/use-smooth-height"
