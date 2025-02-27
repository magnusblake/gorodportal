"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface AppealStats {
  total: number
  pending: number
  inProgress: number
  answered: number
  closed: number
  rejected: number
}

interface UserAppealsStatsProps {
  userId: string
}

export function UserAppealsStats({ userId }: UserAppealsStatsProps) {
  const [stats, setStats] = useState<AppealStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true)
      const response = await fetch(`/api/users/${userId}/appeals-stats`)
      const data = await response.json()
      setStats(data)
      setIsLoading(false)
    }
    fetchStats()
  }, [userId])

  if (isLoading) {
    return <p>Загрузка статистики...</p>
  }

  if (!stats) {
    return <p>Не удалось загрузить статистику</p>
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Всего обращений</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{stats.total}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>На рассмотрении</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{stats.pending}</p>
          <Progress value={(stats.pending / stats.total) * 100} className="mt-2" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>В работе</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{stats.inProgress}</p>
          <Progress value={(stats.inProgress / stats.total) * 100} className="mt-2" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Есть ответ</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{stats.answered}</p>
          <Progress value={(stats.answered / stats.total) * 100} className="mt-2" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Закрыто</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{stats.closed}</p>
          <Progress value={(stats.closed / stats.total) * 100} className="mt-2" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Отклонено</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{stats.rejected}</p>
          <Progress value={(stats.rejected / stats.total) * 100} className="mt-2" />
        </CardContent>
      </Card>
    </div>
  )
}

