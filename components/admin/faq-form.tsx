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
import { useToast } from "@/components/ui/use-toast"
import { createFAQ, updateFAQ } from "@/lib/actions"

const formSchema = z.object({
  question: z.string().min(5, {
    message: "Вопрос должен содержать не менее 5 символов",
  }),
  answer: z.string().min(10, {
    message: "Ответ должен содержать не менее 10 символов",
  }),
  category: z.string().min(1, {
    message: "Выберите категорию",
  }),
  order: z.number().int().positive(),
})

type FAQFormValues = z.infer<typeof formSchema>

type FAQFormProps = {
  faq?: {
    id: string
    question: string
    answer: string
    category: string
    order: number
  }
}

export function FAQForm({ faq }: FAQFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FAQFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: faq?.question || "",
      answer: faq?.answer || "",
      category: faq?.category || "",
      order: faq?.order || 1,
    },
  })

  async function onSubmit(values: FAQFormValues) {
    setIsLoading(true)

    const result = faq ? await updateFAQ(faq.id, values) : await createFAQ(values)

    setIsLoading(false)

    if (result.success) {
      toast({
        title: faq ? "Вопрос обновлен" : "Вопрос создан",
        description: faq ? "Вопрос успешно обновлен" : "Вопрос успешно добавлен в FAQ",
      })
      router.push("/admin/faq")
    } else {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: result.error || "Не удалось сохранить вопрос",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Вопрос</FormLabel>
              <FormControl>
                <Input placeholder="Введите вопрос" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="answer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ответ</FormLabel>
              <FormControl>
                <Textarea placeholder="Введите ответ" className="min-h-[100px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Категория</FormLabel>
              <FormControl>
                <Input placeholder="Введите категорию" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="order"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Порядок</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={(e) => field.onChange(Number.parseInt(e.target.value, 10))} />
              </FormControl>
              <FormDescription>Порядковый номер для сортировки вопросов внутри категории</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Сохранение..." : faq ? "Обновить вопрос" : "Создать вопрос"}
        </Button>
      </form>
    </Form>
  )
}

