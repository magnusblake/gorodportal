import React from "react"

import { cn } from "@/lib/utils"

const PaginationContent = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn("flex items-center justify-center gap-1", className)} {...props} />
  ),
)
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("w-10 h-10", className)} {...props} />,
)
PaginationItem.displayName = "PaginationItem"

const PaginationLink = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "flex items-center justify-center rounded-md bg-background p-0.5 text-sm font-medium transition-colors hover:bg-secondary/80 data-[active=true]:bg-secondary",
        className,
      )}
      {...props}
    />
  ),
)
PaginationLink.displayName = "PaginationLink"

const PaginationEllipsis = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cn("h-8 w-8 text-sm font-medium", className)} {...props} />
  ),
)
PaginationEllipsis.displayName = "PaginationEllipsis"

const PaginationPrevious = React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>(
  ({ className, ...props }, ref) => (
    <a
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-md border border-border bg-background p-1 text-sm font-medium transition-colors hover:bg-secondary/80 disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  ),
)
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>(
  ({ className, ...props }, ref) => (
    <a
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-md border border-border bg-background p-1 text-sm font-medium transition-colors hover:bg-secondary/80 disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  ),
)
PaginationNext.displayName = "PaginationNext"

export { PaginationContent, PaginationItem, PaginationLink, PaginationEllipsis, PaginationPrevious, PaginationNext }

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const getPages = (current: number, total: number) => {
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1)
    }

    if (current <= 3) {
      return [1, 2, 3, 4, "...", total - 1, total]
    }

    if (current >= total - 2) {
      return [1, 2, "...", total - 3, total - 2, total - 1, total]
    }

    return [1, "...", current - 1, current, current + 1, "...", total]
  }

  const pages = getPages(currentPage, totalPages)

  return (
    <div className="flex items-center justify-center mt-8">
      <PaginationPrevious
        href="#"
        onClick={(e) => {
          e.preventDefault()
          if (currentPage > 1) {
            onPageChange(currentPage - 1)
          }
        }}
        disabled={currentPage === 1}
      >
        Предыдущая
      </PaginationPrevious>
      <PaginationContent>
        {pages.map((page, i) => {
          if (page === "...") {
            return <PaginationEllipsis key={i}>...</PaginationEllipsis>
          }
          return (
            <PaginationItem key={i}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  onPageChange(Number(page))
                }}
                data-active={currentPage === page}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        })}
      </PaginationContent>
      <PaginationNext
        href="#"
        onClick={(e) => {
          e.preventDefault()
          if (currentPage < totalPages) {
            onPageChange(currentPage + 1)
          }
        }}
        disabled={currentPage === totalPages}
      >
        Следующая
      </PaginationNext>
    </div>
  )
}

