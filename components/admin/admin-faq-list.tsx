"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
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
import { deleteFAQ } from "@/lib/actions"
import { MoreHorizontal, Edit, Trash } from "lucide-react"

type FAQ = {
  id: string
  question: string
  answer: string
  category: string
  order: number
}

export function AdminFAQList({ faqs }: { faqs: FAQ[] }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteFAQId, setDeleteFAQId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    setIsDeleting(true)
    const result = await deleteFAQ(id)
    setIsDeleting(false)
    setDeleteFAQId(null)

    if (result.success) {
      toast({
        title: "Вопрос удален",
        description: "Вопрос успешно удален из FAQ",
      })
      router.refresh()
    } else {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: result.error || "Не удалось удалить вопрос",
      })
    }
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Вопрос</TableHead>
            <TableHead>Категория</TableHead>
            <TableHead>Порядок</TableHead>
            <TableHead>Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {faqs.map((faq) => (
            <TableRow key={faq.id}>
              <TableCell className="font-medium">{faq.question}</TableCell>
              <TableCell>{faq.category}</TableCell>
              <TableCell>{faq.order}</TableCell>
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
                    <DropdownMenuItem onClick={() => router.push(`/admin/faq/edit/${faq.id}`)}>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Редактировать</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setDeleteFAQId(faq.id)}>
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

      <AlertDialog open={!!deleteFAQId} onOpenChange={() => setDeleteFAQId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
            <AlertDialogDescription>Это действие нельзя отменить. Вопрос будет удален из FAQ.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteFAQId && handleDelete(deleteFAQId)}
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

