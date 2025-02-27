"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import { updateAppealStatus, deleteAppeal } from "@/lib/actions"
import { MoreHorizontal, Eye } from "lucide-react"

type Appeal = {
  id: string
  title: string
  status: string
  createdAt: Date
  user: {
    name: string | null
    email: string | null
  }
  category: {
    name: string
  }
}

interface AdminAppealsListProps {
  query: string
  page: number
  onTotalPagesChange: (totalPages: number) => void
}

export function AdminAppealsList({ query, page, onTotalPagesChange }: AdminAppealsListProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [appeals, setAppeals] = useState<Appeal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteAppealId, setDeleteAppealId] = useState<string | null>(null)

  useEffect(() => {
    const fetchAppeals = async () => {
      setIsLoading(true)
      const response = await fetch(`/api/appeals/admin?query=${encodeURIComponent(query)}&page=${page}`)
      const data = await response.json()
      setAppeals(data.appeals)
      onTotalPagesChange(data.totalPages)
      setIsLoading(false)
    }

    fetchAppeals()
  }, [query, page, onTotalPagesChange])

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

  const handleStatusChange = async (appealId: string, newStatus: string) => {
    const result = await updateAppealStatus(appealId, newStatus)
    if (result.success) {
      toast({
        title: "Статус обновлен",
        description: "Статус обращения успешно изменен",
      })
      router.refresh()
    } else {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: result.error || "Не удалось обновить статус",
      })
    }
  }

  const handleDelete = async (appealId: string) => {
    setIsDeleting(true)
    const result = await deleteAppeal(appealId)
    setIsDeleting(false)
    setDeleteAppealId(null)

    if (result.success) {
      toast({
        title: "Обращение удалено",
        description: "Обращение успешно удалено",
      })
      router.refresh()
    } else {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: result.error || "Не удалось удалить обращение",
      })
    }
  }

  if (isLoading) {
    return <p className="text-center">Загрузка обращений...</p>
  }

  if (appeals.length === 0) {
    return <p className="text-center text-muted-foreground">Обращения не найдены</p>
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Заголовок</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead>Автор</TableHead>
            <TableHead>Категория</TableHead>
            <TableHead>Дата создания</TableHead>
            <TableHead>Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appeals.map((appeal) => (
            <TableRow key={appeal.id}>
              <TableCell className="font-medium">{appeal.id}</TableCell>
              <TableCell>{appeal.title}</TableCell>
              <TableCell>{getStatusBadge(appeal.status)}</TableCell>
              <TableCell>{appeal.user.name || appeal.user.email}</TableCell>
              <TableCell>{appeal.category.name}</TableCell>
              <TableCell>{formatDate(appeal.createdAt.toString())}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Открыть меню</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Действия</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => router.push(`/appeals/${appeal.id}`)}>
                      <Eye className="mr-2 h-4 w-4" />
                      <span>Просмотреть</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(appeal.id, "IN_PROGRESS")}>
                      Взять в работу
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(appeal.id, "CLOSED")}>Закрыть</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(appeal.id, "REJECTED")}>
                      Отклонить
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setDeleteAppealId(appeal.id)}>Удалить</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={!!deleteAppealId} onOpenChange={() => setDeleteAppealId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Обращение будет удалено навсегда.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteAppealId && handleDelete(deleteAppealId)}
              className="bg-red-600 focus:ring-red-600"
            >
              {isDeleting ? "Удаление..." : "Удалить"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

