"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pagination } from "@/components/ui/pagination"

type Appeal = {
  id: string
  title: string
  content: string
  status: string
  createdAt: string
  updatedAt: string
  userId: string
  categoryId: string
  category: {
    name: string
  }
  user: {
    name: string
    email: string
  }
}

export function AdminAppealsList() {
  const [appeals, setAppeals] = useState<Appeal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const fetchAppeals = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch(
        `/api/appeals/admin?page=${currentPage}&query=${searchQuery}&status=${statusFilter}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
      )
      const data = await response.json()
      setAppeals(data.appeals)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error("Error fetching appeals:", error)
    }
    setIsLoading(false)
  }, [currentPage, searchQuery, statusFilter, sortBy, sortOrder])

  useEffect(() => {
    fetchAppeals()
  }, [fetchAppeals])

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchAppeals()
  }

  const handleStatusChange = (value: string) => {
    setStatusFilter(value)
    setCurrentPage(1)
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    setCurrentPage(1)
  }

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    setCurrentPage(1)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="warning">На рассмотрении</Badge>
      case "IN_PROGRESS":
        return <Badge variant="info">В работе</Badge>
      case "RESOLVED":
        return <Badge variant="success">Решено</Badge>
      case "REJECTED":
        return <Badge variant="destructive">Отклонено</Badge>
      default:
        return <Badge variant="secondary">Неизвестно</Badge>
    }
  }

  if (isLoading) {
    return <div>Загрузка...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Управление обращениями</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <Input
            type="text"
            placeholder="Поиск по обращениям..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button type="submit">Поиск</Button>
        </form>
        <div className="flex gap-2 mb-4">
          <Select value={statusFilter} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Фильтр по статусу" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              <SelectItem value="PENDING">На рассмотрении</SelectItem>
              <SelectItem value="IN_PROGRESS">В работе</SelectItem>
              <SelectItem value="RESOLVED">Решено</SelectItem>
              <SelectItem value="REJECTED">Отклонено</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Сортировать по" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Дате создания</SelectItem>
              <SelectItem value="updatedAt">Дате обновления</SelectItem>
              <SelectItem value="status">Статусу</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={toggleSortOrder}>{sortOrder === "asc" ? "По возрастанию" : "По убыванию"}</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Заголовок</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Категория</TableHead>
              <TableHead>Пользователь</TableHead>
              <TableHead>Дата создания</TableHead>
              <TableHead>Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appeals.map((appeal) => (
              <TableRow key={appeal.id}>
                <TableCell>{appeal.id}</TableCell>
                <TableCell>{appeal.title}</TableCell>
                <TableCell>{getStatusBadge(appeal.status)}</TableCell>
                <TableCell>{appeal.category.name}</TableCell>
                <TableCell>{appeal.user.name}</TableCell>
                <TableCell>{formatDate(appeal.createdAt)}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" asChild>
                    <a href={`/admin/appeals/${appeal.id}`}>Просмотр</a>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </CardFooter>
    </Card>
  )
}

