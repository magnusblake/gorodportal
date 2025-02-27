"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircle, Eye } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Appeal = {
  id: string
  title: string
  content: string
  status: string
  createdAt: Date
  category: {
    id: string
    name: string
    slug: string
  }
  responses: {
    id: string
    content: string
    createdAt: Date
  }[]
}

interface AppealsListProps {
  query: string
  userId?: string
  page: number
  onTotalPagesChange: (totalPages: number) => void
}

export function AppealsList({ query, userId, page, onTotalPagesChange }: AppealsListProps) {
  const [appeals, setAppeals] = useState<Appeal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy] = useState("createdAt")
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    const fetchAppeals = async () => {
      setIsLoading(true)
      const response = await fetch(
        `/api/appeals?query=${encodeURIComponent(query)}&userId=${userId || ""}&page=${page}&sortBy=${sortBy}&filterStatus=${filterStatus}`,
      )
      const data = await response.json()
      setAppeals(data.appeals)
      onTotalPagesChange(data.totalPages)
      setIsLoading(false)
    }

    fetchAppeals()
  }, [query, userId, page, onTotalPagesChange, sortBy, filterStatus])

  if (isLoading) {
    return <p className="text-center">Загрузка обращений...</p>
  }

  if (appeals.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground mb-4">У вас пока нет обращений</p>
        <Link href="/appeals/new" className="text-primary hover:underline">
          Создать новое обращение
        </Link>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            На рассмотрении
          </Badge>
        )
      case "IN_PROGRESS":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            В работе
          </Badge>
        )
      case "ANSWERED":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            Есть ответ
          </Badge>
        )
      case "CLOSED":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
            Закрыто
          </Badge>
        )
      case "REJECTED":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
            Отклонено
          </Badge>
        )
      default:
        return <Badge variant="outline">Неизвестно</Badge>
    }
  }

  return (
    <div>
      <div className="flex justify-between mb-4">
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Сортировать по" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Дате создания</SelectItem>
            <SelectItem value="status">Статусу</SelectItem>
            <SelectItem value="title">Заголовку</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Фильтр по статусу" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            <SelectItem value="PENDING">На рассмотрении</SelectItem>
            <SelectItem value="IN_PROGRESS">В работе</SelectItem>
            <SelectItem value="ANSWERED">Есть ответ</SelectItem>
            <SelectItem value="CLOSED">Закрыто</SelectItem>
            <SelectItem value="REJECTED">Отклонено</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-4">
        {appeals.map((appeal) => (
          <Card key={appeal.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{appeal.title}</CardTitle>
                  <CardDescription>
                    {formatDate(appeal.createdAt.toString())} • {appeal.category.name}
                  </CardDescription>
                </div>
                <div>{getStatusBadge(appeal.status)}</div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-3 text-muted-foreground">{appeal.content}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center text-sm text-muted-foreground">
                <MessageCircle className="mr-1 h-4 w-4" />
                <span>
                  {appeal.responses.length}{" "}
                  {appeal.responses.length === 1
                    ? "ответ"
                    : appeal.responses.length > 1 && appeal.responses.length < 5
                      ? "ответа"
                      : "ответов"}
                </span>
              </div>
              <Link href={`/appeals/${appeal.id}`}>
                <Button variant="outline" size="sm">
                  <Eye className="mr-2 h-4 w-4" />
                  Просмотреть
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

