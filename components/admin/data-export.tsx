"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export function DataExport() {
  const [isExporting, setIsExporting] = useState(false)
  const { toast } = useToast()

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const response = await fetch("/api/admin/export", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.style.display = "none"
        a.href = url
        a.download = "city_portal_data_export.json"
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        toast({
          title: "Экспорт завершен",
          description: "Данные успешно экспортированы",
        })
      } else {
        throw new Error("Ошибка при экспорте данных")
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка экспорта",
        description: "Не удалось экспортировать данные. Попробуйте позже.",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Button onClick={handleExport} disabled={isExporting}>
      {isExporting ? "Экспорт..." : "Экспортировать данные"}
    </Button>
  )
}

