"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { createNews, updateNews } from "@/lib/actions"

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Заголовок должен содержать не менее 5 символов",
  }),
  content: z.string().min(20, {
    message: "Содержание должно содержать не менее 20 символов",
  }),
  image: z.string().url().optional().or(z.literal("")),
  published: z.boolean().default(false),
})

type NewsFormProps = {
  news?: {
    id: string
    title: string
    content: string
    image: string | null
    published: boolean
  }
}

export function NewsForm({ news }: NewsFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: news?.title || "",
      content: news?.content || "",
      image: news?.image || "",
      published: news?.published || false,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    const result = news ? await updateNews(news.id, values) : await createNews(values)

    setIsLoading(false)

    if (result.success) {
      toast({
        title: news ? "Новость обновлена" : "Новость создана",
        description: news ? "Новость успешно обновлена" : "Новость успешно создана",
      })
      router.push("/admin/news")
    } else {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: result.error || "Не удалось сохранить новость",
      })
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
                <Input placeholder="Введите заголовок новости" {...field} />
              </FormControl>
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
                <Textarea placeholder="Введите содержание новости" className="min-h-[200px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL изображения</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} />
              </FormControl>
              <FormDescription>Оставьте пустым, если не хотите добавлять изображение</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Опубликовать</FormLabel>
                <FormDescription>Отметьте, если хотите сразу опубликовать новость</FormDescription>
              </div>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Сохранение..." : news ? "Обновить новость" : "Создать новость"}
        </Button>
      </form>
    </Form>
  )
}

