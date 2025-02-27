"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { formatDate } from "@/lib/utils"
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
import { deleteNews, toggleNewsPublished } from "@/lib/actions"
import { MoreHorizontal, Eye, Edit, Trash } from "lucide-react"

type NewsItem = {
  id: string
  title: string
  published: boolean
  createdAt: Date
}

export function AdminNewsList({ news }: { news: NewsItem[] }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteNewsId, setDeleteNewsId] = useState<string | null>(null)

  const handleTogglePublished = async (id: string, currentStatus: boolean) => {
    const result = await toggleNewsPublished(id, !currentStatus)
    if (result.success) {
      toast({
        title: "Статус публикации изменен",
        description: `Новость ${currentStatus ? "снята с публикации" : "опубликована"}`,
      })
      router.refresh()
    } else {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: result.error || "Не удалось изменить статус публикации",
      })
    }
  }

  const handleDelete = async (id: string) => {
    setIsDeleting(true)
    const result = await deleteNews(id)
    setIsDeleting(false)
    setDeleteNewsId(null)

    if (result.success) {
      toast({
        title: "Новость удалена",
        description: "Новость успешно удалена",
      })
      router.refresh()
    } else {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: result.error || "Не удалось удалить новость",
      })
    }
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Заголовок</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead>Дата создания</TableHead>
            <TableHead>Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {news.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.title}</TableCell>
              <TableCell>{item.published ? "Опубликовано" : "Черновик"}</TableCell>
              <TableCell>{formatDate(item.createdAt.toString())}</TableCell>
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
                    <DropdownMenuItem onClick={() => router.push(`/news/${item.id}`)}>
                      <Eye className="mr-2 h-4 w-4" />
                      <span>Просмотреть</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/admin/news/edit/${item.id}`)}>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Редактировать</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleTogglePublished(item.id, item.published)}>
                      {item.published ? "Снять с публикации" : "Опубликовать"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setDeleteNewsId(item.id)}>
                      <Trash className="mr-2 h-4 w-4" />
                      <span>Удалить</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={!!deleteNewsId} onOpenChange={() => setDeleteNewsId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Новость будет удалена навсегда.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteNewsId && handleDelete(deleteNewsId)}
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

