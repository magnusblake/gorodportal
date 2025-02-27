"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { createAppeal } from "@/lib/actions"

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Заголовок должен содержать не менее 5 символов",
  }),
  content: z.string().min(20, {
    message: "Содержание обращения должно содержать не менее 20 символов",
  }),
  categoryId: z.string({
    required_error: "Пожалуйста, выберите категорию",
  }),
  attachments: z
    .array(
      z.object({
        name: z.string(),
        size: z.number(),
        type: z.string(),
      }),
    )
    .optional(),
})

export function NewAppealForm({ categories, userId }: { categories: any[]; userId: string }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      categoryId: "",
      attachments: [],
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("title", values.title)
      formData.append("content", values.content)
      formData.append("categoryId", values.categoryId)
      formData.append("userId", userId)

      if (values.attachments) {
        values.attachments.forEach((file, index) => {
          formData.append(`attachment${index}`, file as any)
        })
      }

      const result = await createAppeal(formData)

      if (result.success) {
        toast({
          title: "Обращение создано",
          description: "Ваше обращение успешно отправлено",
        })
        router.push("/appeals/my")
      } else {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: result.error || "Не удалось создать обращение",
        })
      }
    } catch (error) {
      console.error("Error submitting appeal:", error)
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Произошла ошибка при отправке обращения",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Заголовок</FormLabel>
              <FormControl>
                <Input placeholder="Введите заголовок обращения" {...field} />
              </FormControl>
              <FormDescription>Кратко опишите суть вашего обращения</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Содержание</FormLabel>
              <FormControl>
                <Textarea placeholder="Опишите подробно вашу проблему или предложение" {...field} />
              </FormControl>
              <FormDescription>
                Предоставьте всю необходимую информацию для рассмотрения вашего обращения
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Категория</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Выберите категорию, которая наиболее подходит для вашего обращения</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="attachments"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Прикрепить файлы</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []).map((file) => ({
                      name: file.name,
                      size: file.size,
                      type: file.type,
                    }))
                    field.onChange(files)
                  }}
                />
              </FormControl>
              <FormDescription>
                Вы можете прикрепить до 5 файлов (максимальный размер каждого файла - 5 МБ)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Отправка..." : "Отправить обращение"}
        </Button>
      </form>
    </Form>
  )
}

