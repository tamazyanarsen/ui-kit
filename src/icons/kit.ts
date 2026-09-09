// Канонические иконки кита — те, по которым ходят сами компоненты.
//
// Every name below is re-exported under every alias the components
// actually import (some files use lucide's newer `XIcon` naming
// convention, others the older bare name) so swapping a file's content
// from a lucide passthrough to the real Figma SVG never requires touching
// any of the ~48 usage sites — only this alias list.

// ⚠️ ЧАСТЬ ИМЁН НИЖЕ — ПСЕВДОНИМЫ НАСТОЯЩИХ ИКОНОК КИТА.
//
// Дизайн-чек от 08.09, замечания 28 и 31: «Корневое правило — иконки брать
// только из кита, те что есть в разделе icons данного сторибука» и «Видно,
// что в размере иконки 24×24 взят вариант 16×16, что приводит к слишком
// жирному штриху… везде подобрать размеры исходя из итогового размера».
//
// Оба замечания об одном: часть кита ходила по именам из чужого набора
// (`chevron-down`, `circle-help`, `settings`…), а у таких файлов нарисован
// ТОЛЬКО шестнадцатый кегль. В слоте 24×24 он растягивался, и штрих выходил
// в полтора раза жирнее соседних иконок. У настоящих иконок ELK 16 и 24 —
// два отдельных начертания, и `size={24}` берёт нужное.
//
// Замена сделана здесь, а не в 48 файлах-потребителях: этот барель для того
// и заведён (см. абзац выше). Меняется только источник глифа, имена, под
// которыми компоненты его импортируют, остаются прежними.
//
// Пары, которые НЕ заменены и почему: `check` (в наборе ELK ближайшее — `ok`,
// а это логотип Одноклассников), `search` (`zoom` — лупа с плюсом, то есть
// «увеличить»), `clock` (`time` — песочные часы), `coins` (`money` —
// банкнота), `lock`, `copy`, `image`, `minus`, `plus`, `star`, `loader`,
// `download`, `drag`, `sbp`, `alarm`, `chevrons-up-down` — равнозначного
// глифа в наборе нет, подменять на похожий по смыслу нельзя.

export {
  ArrowDownChevron as ChevronDown,
  ArrowDownChevron as ChevronDownIcon,
} from "./arrow-down-chevron"
export {
  ArrowUpChevron as ChevronUp,
  ArrowUpChevron as ChevronUpIcon,
} from "./arrow-up-chevron"
export { ArrowBackChevron as ChevronLeft } from "./arrow-back-chevron"
export { ArrowNextChevron as ChevronRight } from "./arrow-next-chevron"
export { ChevronsUpDown } from "./chevrons-up-down"
export type { IconProps } from "./types"
export { ArrowLeftSmall, ArrowRightSmall } from "./arrow-right-small"
export { Ellipsis, Ellipsis as MoreHorizontal } from "./ellipsis"
export { X } from "./x"
export { Loader2, Loader2 as LoaderCircle } from "./loader"
export { Lock } from "./lock"
export { OpenEye as Eye } from "./open-eye"
export { CloseEye as EyeOff } from "./close-eye"
export { Info } from "./info"
export { Copy } from "./copy"
export { Drag } from "./drag"
export { Check, Check as CheckIcon } from "./check"
export { Minus } from "./minus"
export { Plus } from "./plus"
export { CircleAlert } from "./circle-alert"
export { CircleCheck } from "./circle-check"
export { Question as CircleHelp } from "./question"
export { CloseCircle as CircleX } from "./close-circle"
export { Clock } from "./clock"
export { Search } from "./search"
export { Pen as Pencil } from "./pen"
export { Download } from "./download"
export { Doc as FileText } from "./doc"
export { FileIcon } from "./file-icon"
export { PlusCircleAdd as CirclePlus } from "./plus-circle-add"
export { Star } from "./star"
export { ImageIcon, ImageIcon as Image } from "./image"
export { Calendar as CalendarDays } from "./calendar"
export { Burger as Menu } from "./burger"
export { Mail } from "./mail"
export { Bell } from "./bell"
export { Briefcase } from "./briefcase"
export { UserCircle as CircleUser } from "./user-circle"
export { Signout as LogOut } from "./signout"
export { Wallet } from "./wallet"
export { Settings2 as Settings } from "./settings-2"
export { Sbp } from "./sbp"
export { Coins } from "./coins"
export { Alarm } from "./alarm"

