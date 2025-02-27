"use client"

import type * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

interface DateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: { from: Date; to?: Date } | undefined
  onValueChange?: (date: { from: Date; to?: Date }) => void
}

export function DateRangePicker({ className, value, onValueChange }: DateRangePickerProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn("w-[300px] justify-start text-left font-normal", !value && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value?.from ? (
              value.to ? (
                `${format(value.from, "LLL dd, y")} - ${format(value.to, "LLL dd, y")}`
              ) : (
                format(value.from, "LLL dd, y")
              )
            ) : (
              <span>Выберите период</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="center">
          <Calendar
            mode="range"
            defaultMonth={value?.from ? value.from : new Date()}
            selected={value}
            onSelect={onValueChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

