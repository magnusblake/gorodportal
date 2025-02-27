"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { updateUserNotificationSettings } from "@/lib/actions"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"

const notificationSettingsSchema = z.object({
  emailNotifications: z.boolean(),
  appealStatusUpdates: z.boolean(),
  newResponses: z.boolean(),
  newsUpdates: z.boolean(),
})

type NotificationSettingsValues = z.infer<typeof notificationSettingsSchema>

interface UserNotificationSettingsProps {
  userId: string
}

export function UserNotificationSettings({ userId }: UserNotificationSettingsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<NotificationSettingsValues>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      emailNotifications: false,
      appealStatusUpdates: false,
      newResponses: false,
      newsUpdates: false,
    },
  })

  useEffect(() => {
    const fetchNotificationSettings = async () => {
      const response = await fetch(`/api/users/${userId}/notification-settings`)
      const settings = await response.json()
      form.reset(settings)
    }
    fetchNotificationSettings()
  }, [userId, form])

  async function onSubmit(data: NotificationSettingsValues) {
    setIsLoading(true)
    const result = await updateUserNotificationSettings(userId, data)
    setIsLoading(false)

    if (result.success) {
      toast({
        title: "Настройки обновлены",
        description: "Ваши настройки уведомлений успешно сохранены",
      })
    } else {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: result.error || "Не удалось обновить настройки уведомлений",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="emailNotifications"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Получать уведомления по email</FormLabel>
                <FormDescription>Включите, чтобы получать все уведомления на ваш email адрес</FormDescription>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="appealStatusUpdates"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Уведомления об изменении статуса обращений</FormLabel>
                <FormDescription>Получайте уведомления, когда статус ваших обращений изменяется</FormDescription>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newResponses"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Уведомления о новых ответах</FormLabel>
                <FormDescription>Получайте уведомления, когда на ваши обращения поступают новые ответы</FormDescription>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newsUpdates"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Уведомления о новостях</FormLabel>
                <FormDescription>Получайте уведомления о новых публикациях на портале</FormDescription>
              </div>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Сохранение..." : "Сохранить настройки"}
        </Button>
      </form>
    </Form>
  )
}

