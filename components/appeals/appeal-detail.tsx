"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import { updateAppealStatus, deleteAppeal } from "@/lib/actions"
import { ArrowLeft, Trash } from "lucide-react"

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
  user: {
    id: string
    name: string | null
    email: string | null
  }
  responses: {
    id: string
    content: string
    createdAt: Date
  }[]
}

export function AppealDetail({ appeal, isAdmin }: { appeal: Appeal; isAdmin: boolean }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

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

  const handleStatusChange = async (status: string) => {
    setIsUpdating(true)

    const result = await updateAppealStatus(appeal.id, status)

    setIsUpdating(false)

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

  const handleDelete = async () => {
    setIsDeleting(true)

    const result = await deleteAppeal(appeal.id)

    setIsDeleting(false)

    if (result.success) {
      toast({
        title: "Обращение удалено",
        description: "Обращение успешно удалено",
      })
      router.push(isAdmin ? "/admin/appeals" : "/appeals/my")
    } else {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: result.error || "Не удалось удалить обращение",
      })
    }
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад
        </Button>
        <h1 className="text-3xl font-bold">Обращение</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{appeal.title}</CardTitle>
              <CardDescription>
                {formatDate(appeal.createdAt.toString())} • {appeal.category.name}
              </CardDescription>
            </div>
            <div>{getStatusBadge(appeal.status)}</div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-1">Автор:</p>
            <p>
              {appeal.user.name} ({appeal.user.email})
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Содержание:</p>
            <p className="whitespace-pre-line">{appeal.content}</p>
          </div>
        </CardContent>
        {isAdmin && (
          <CardFooter className="flex justify-between">
            <div className="flex gap-2">
              {appeal.status === "PENDING" && (
                <Button variant="outline" onClick={() => handleStatusChange("IN_PROGRESS")} disabled={isUpdating}>
                  Взять в работу
                </Button>
              )}
              {appeal.status !== "CLOSED" && appeal.status !== "REJECTED" && (
                <Button variant="outline" onClick={() => handleStatusChange("CLOSED")} disabled={isUpdating}>
                  Закрыть
                </Button>
              )}
              {appeal.status !== "REJECTED" && (
                <Button variant="outline" onClick={() => handleStatusChange("REJECTED")} disabled={isUpdating}>
                  Отклонить
                </Button>
              )}
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash className="mr-2 h-4 w-4" />
                  Удалить
                </Button>
              </AlertDialogTrigger>
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
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? "Удаление..." : "Удалить"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}

