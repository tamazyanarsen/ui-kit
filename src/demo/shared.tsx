function RowLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="w-40 shrink-0 text-sm text-muted-foreground">
      {children}
    </span>
  )
}

export { RowLabel }
