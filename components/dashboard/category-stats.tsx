"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { addDays, format } from "date-fns"

interface CategoryStats {
  name: string
  count: number
}

export function CategoryStats() {
  const [stats, setStats] = useState<CategoryStats[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    from: addDays(new Date(), -30),
    to: new Date(),
  })

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true)
      const response = await fetch(
        `/api/appeals/category-stats?from=${format(dateRange.from, "yyyy-MM-dd")}&to=${format(dateRange.to, "yyyy-MM-dd")}`,
      )
      const data = await response.json()
      setStats(data)
      setIsLoading(false)
    }
    fetchStats()
  }, [dateRange])

  if (isLoading) {
    return <p>Загрузка статистики...</p>
  }

  if (stats.length === 0) {
    return <p>Нет данных для отображения</p>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Статистика по категориям обращений</CardTitle>
      </CardHeader>
      <CardContent>
        <DateRangePicker value={dateRange} onValueChange={setDateRange} className="mb-4" />
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

