import * as React from "react"

import { cn } from "@/lib/utils"

/* A looser layout for components that are too wide or too composite for a
   real grid (Modal, Header, Table, …): a stack of captioned sections. */
export function StoryShowcase({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex flex-col gap-10 bg-[#F8F8F8] p-8", className)}>
      {children}
    </div>
  )
}

export function StorySection({
  title,
  description,
  children,
  className,
}: {
  title: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h3 className="text-p2-medium text-[#252628]">{title}</h3>
        {description && (
          <p className="text-p3-regular text-[#6D6D6D]">{description}</p>
        )}
      </div>
      <div className={cn("flex flex-wrap items-start gap-4", className)}>
        {children}
      </div>
    </section>
  )
}
