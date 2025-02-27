"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { updateUserProfile, changeUserPassword } from "@/lib/actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Имя должно содержать не менее 2 символов",
  }),
  email: z.string().email({
    message: "Введите корректный email",
  }),
  phone: z.string().optional(),
  address: z.string().optional(),
})

const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(6, {
      message: "Текущий пароль должен содержать не менее 6 символов",
    }),
    newPassword: z.string().min(6, {
      message: "Новый пароль должен содержать не менее 6 символов",
    }),
    confirmNewPassword: z.string().min(6, {
      message: "Подтверждение пароля должно содержать не менее 6 символов",
    }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Пароли не совпадают",
    path: ["confirmNewPassword"],
  })

type UserData = {
  id: string
  name: string | null
  email: string | null
  phone: string | null
  address: string | null
  image: string | null
}

export function ProfileForm({ user }: { user: UserData }) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
    },
  })

  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  })

  async function onProfileSubmit(values: z.infer<typeof profileFormSchema>) {
    setIsLoading(true)

    const result = await updateUserProfile(user.id, {
      name: values.name,
      email: values.email,
      phone: values.phone,
      address: values.address,
    })

    setIsLoading(false)

    if (result.success) {
      toast({
        title: "Профиль обновлен",
        description: "Ваши данные успешно сохранены",
      })
    } else {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: result.error || "Не удалось обновить профиль",
      })
    }
  }

  async function onPasswordSubmit(values: z.infer<typeof passwordFormSchema>) {
    setIsLoading(true)

    const result = await changeUserPassword(user.id, values.currentPassword, values.newPassword)

    setIsLoading(false)

    if (result.success) {
      toast({
        title: "Пароль изменен",
        description: "Ваш пароль успешно обновлен",
      })
      passwordForm.reset()
    } else {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: result.error || "Не удалось изменить пароль",
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.image || ""} alt={user.name || "Пользователь"} />
              <AvatarFallback>{user.name?.charAt(0) || "П"}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
              <FormField
                control={profileForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Имя</FormLabel>
                    <FormControl>
                      <Input placeholder="Иван Иванов" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={profileForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="example@mail.ru" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={profileForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Телефон</FormLabel>
                    <FormControl>
                      <Input placeholder="+7 (123) 456-78-90" {...field} />
                    </FormControl>
                    <FormDescription>Телефон для связи (необязательно)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={profileForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Адрес</FormLabel>
                    <FormControl>
                      <Input placeholder="г. Москва, ул. Пример, д. 1, кв. 1" {...field} />
                    </FormControl>
                    <FormDescription>Ваш адрес (необязательно)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Сохранение..." : "Сохранить изменения"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Изменение пароля</CardTitle>
          <CardDescription>Обновите ваш пароль для повышения безопасности аккаунта</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Текущий пароль</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Новый пароль</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="confirmNewPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Подтвердите новый пароль</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Изменение..." : "Изменить пароль"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

