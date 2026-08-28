import { useEffect, useState } from "react"
import { Accordion } from "@/demo/scaffold"
import { Button } from "@/components/ui/button"
import { ToastProvider, Toaster } from "@/components/ui/toast-message"

import { ButtonDemo } from "@/demo/button-demo"
import { InputDemo } from "@/demo/input-demo"
import { TextareaDemo } from "@/demo/textarea-demo"
import { CalendarDemo } from "@/demo/calendar-demo"
import { DatePickerDemo } from "@/demo/date-picker-demo"
import { SelectDemo } from "@/demo/select-demo"
import { ComboboxDemo } from "@/demo/combobox-demo"
import { FileUploadDemo } from "@/demo/file-upload-demo"
import { AccordionCardDemo } from "@/demo/accordion-card-demo"
import { AccordionListDemo } from "@/demo/accordion-list-demo"
import { OtpDemo } from "@/demo/otp-demo"
import { ModalDemo } from "@/demo/modal-demo"
import { ButtonMenuDemo } from "@/demo/button-menu-demo"
import { CheckboxDemo } from "@/demo/checkbox-demo"
import { RadioDemo } from "@/demo/radio-demo"
import { ToggleDemo } from "@/demo/toggle-demo"
import { RangeInputDemo } from "@/demo/range-input-demo"
import { BannerDemo } from "@/demo/banner-demo"
import { SelectionButtonDemo } from "@/demo/selection-button-demo"
import { CardBoxDemo } from "@/demo/card-box-demo"
import { CardDemo } from "@/demo/card-demo"
import { BankCardDemo } from "@/demo/bank-card-demo"
import { ProgressBarDemo } from "@/demo/progress-bar-demo"
import { StepsDemo } from "@/demo/steps-demo"
import { TooltipDemo } from "@/demo/tooltip-demo"
import { BadgeDemo } from "@/demo/badge-demo"
import { EventDemo } from "@/demo/event-demo"
import { InformerDemo } from "@/demo/informer-demo"
import { NotificationDemo } from "@/demo/notification-demo"
import { ToastMessageDemo } from "@/demo/toast-message-demo"
import { TopFixedMessageDemo } from "@/demo/top-fixed-message-demo"
import { TagDemo } from "@/demo/tag-demo"
import { ThumbnailDemo } from "@/demo/thumbnail-demo"
import { ChipsDemo } from "@/demo/chips-demo"
import { FilterDemo } from "@/demo/filter-demo"
import { CountButtonDemo } from "@/demo/count-button-demo"
import { UpButtonDemo } from "@/demo/up-button-demo"
import { SidebarDemo } from "@/demo/sidebar-demo"
import { TabsDemo } from "@/demo/tabs-demo"
import { SwitcherDemo } from "@/demo/switcher-demo"
import { HeaderDemo } from "@/demo/header-demo"
import { EmptySearchDemo } from "@/demo/empty-search-demo"
import { NpsDemo } from "@/demo/nps-demo"
import { ErrorPageDemo } from "@/demo/error-page-demo"
import { PaginationDemo } from "@/demo/pagination-demo"
import { ItemDemo } from "@/demo/item-demo"
import { ItemInformationFieldDemo } from "@/demo/item-information-field-demo"
import { StatusScreenDemo } from "@/demo/status-screen-demo"
import { AutocompleteDemo } from "@/demo/autocomplete-demo"
import { TableDemo } from "@/demo/table-demo"
import { TableTopDemo } from "@/demo/table-top-demo"
import { ShimmerDemo } from "@/demo/shimmer-demo"
import { ScrollbarDemo } from "@/demo/scrollbar-demo"
import { MailFeedDemo } from "@/demo/mail-feed-demo"

function App() {
  const [product, setProduct] = useState<"elk" | "odl-elk">(
    () => (document.documentElement.getAttribute("data-product") as "elk" | "odl-elk" | null) ?? "elk",
  )

  useEffect(() => {
    document.documentElement.setAttribute("data-product", product)
  }, [product])

  return (
    <ToastProvider>
      <main className="mx-auto min-h-screen max-w-4xl space-y-10 bg-[#F8F8F8] px-6 py-16">
        <header className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold">UI-кит</h1>
            <p className="text-muted-foreground">
              Button / Input — вариант ЕЛК. Основной размер по умолчанию — L.
            </p>
          </div>
          <Button
            variant="secondary-outline"
            size="sm"
            onClick={() => setProduct((p) => (p === "elk" ? "odl-elk" : "elk"))}
          >
            {product === "elk" ? "Новые цвета (ЕЛК)" : "Старые цвета"}
          </Button>
        </header>

        <Accordion
          multiple
          // defaultValue={["button-variants", "input-states", "textarea-states"]}
          className="rounded-2xl border bg-white px-6"
        >
          <ButtonDemo />
          <InputDemo />
          <TextareaDemo />
          <CalendarDemo />
          <DatePickerDemo />
          <SelectDemo />
          <ComboboxDemo />
          <FileUploadDemo />
          <AccordionCardDemo />
          <AccordionListDemo />
          <OtpDemo />
          <ModalDemo />
          <ButtonMenuDemo />
          <CheckboxDemo />
          <RadioDemo />
          <ToggleDemo />
          <RangeInputDemo />
          <BannerDemo />
          <SelectionButtonDemo />
          <CardBoxDemo />
          <CardDemo />
          <BankCardDemo />
          <ProgressBarDemo />
          <StepsDemo />
          <TooltipDemo />
          <BadgeDemo />
          <EventDemo />
          <InformerDemo />
          <NotificationDemo />
          <ToastMessageDemo />
          <TopFixedMessageDemo />
          <TagDemo />
          <ThumbnailDemo />
          <ChipsDemo />
          <FilterDemo />
          <CountButtonDemo />
          <UpButtonDemo />
          <SidebarDemo />
          <TabsDemo />
          <SwitcherDemo />
          <HeaderDemo />
          <EmptySearchDemo />
          <NpsDemo />
          <ErrorPageDemo />
          <PaginationDemo />
          <ItemDemo />
          <ItemInformationFieldDemo />
          <StatusScreenDemo />
          <AutocompleteDemo />
          <TableTopDemo />
          <TableDemo />
          <ShimmerDemo />
          <ScrollbarDemo />
          <MailFeedDemo />
        </Accordion>
      </main>
      <Toaster />
    </ToastProvider>
  )
}

export default App
