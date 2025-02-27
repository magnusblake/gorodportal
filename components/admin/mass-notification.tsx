"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
  title: z.string().min(1, "Заголовок обязателен"),
  content: z.string().min(1, "Содержание обязательно"),
})

export function MassNotification() {
  const [isSending, setIsSending] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSending(true)
    try {
      const response = await fetch("/api/admin/mass-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (response.ok) {
        toast({
          title: "Уведомления отправлены",
          description: "Массовая рассылка уведомлений успешно выполнена",
        })
        form.reset()
      } else {
        throw new Error("Ошибка при отправке уведомлений")
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка отправки",
        description: "Не удалось отправить уведомления. Попробуйте позже.",
      })
    } finally {
      setIsSending(false)
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
              <FormLabel>Заголовок уведомления</FormLabel>
              <FormControl>
                <Input placeholder="Введите заголовок" {...field} />
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
              <FormLabel>Содержание уведомления</FormLabel>
              <FormControl>
                <Textarea placeholder="Введите текст уведомления" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSending}>
          {isSending ? "Отправка..." : "Отправить уведомления"}
        </Button>
      </form>
    </Form>
  )
}

