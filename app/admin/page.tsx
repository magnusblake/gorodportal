import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/local-db"
import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminUsersList } from "@/components/admin/admin-users-list"
import { AdminAppealsList } from "@/components/admin/admin-appeals-list"
import { DataExport } from "@/components/admin/data-export"
import { MassNotification } from "@/components/admin/mass-notification"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Панель администратора | Городской портал",
  description: "Управление пользователями и обращениями",
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    redirect("/")
  }

  const usersCount = db.users.findAll().length
  const appealsCount = db.appeals.findAll().length
  const pendingAppealsCount = db.appeals.findAll().filter((appeal) => appeal.status === "PENDING").length
  const inProgressAppealsCount = db.appeals.findAll().filter((appeal) => appeal.status === "IN_PROGRESS").length

  const users = db.users
    .findAll()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10)

  const appeals = db.appeals
    .findAll()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10)

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Панель администратора</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Пользователи</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usersCount}</div>
            <p className="text-xs text-muted-foreground">Всего зарегистрированных пользователей</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Обращения</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appealsCount}</div>
            <p className="text-xs text-muted-foreground">Всего обращений в системе</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">На рассмотрении</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingAppealsCount}</div>
            <p className="text-xs text-muted-foreground">Обращений ожидают рассмотрения</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">В работе</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressAppealsCount}</div>
            <p className="text-xs text-muted-foreground">Обращений находятся в работе</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Быстрые действия</h2>
        <div className="space-x-2">
          <DataExport />
          <Button onClick={() => document.getElementById("mass-notification")?.scrollIntoView({ behavior: "smooth" })}>
            Массовая рассылка
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Link href="/admin/appeals">
          <Button className="w-full">Управление обращениями</Button>
        </Link>
        <Link href="/admin/users">
          <Button className="w-full">Управление пользователями</Button>
        </Link>
        <Link href="/admin/news">
          <Button className="w-full">Управление новостями</Button>
        </Link>
        <Link href="/admin/faq">
          <Button className="w-full">Управление FAQ</Button>
        </Link>
      </div>

      <Tabs defaultValue="appeals" className="space-y-4">
        <TabsList>
          <TabsTrigger value="appeals">Обращения</TabsTrigger>
          <TabsTrigger value="users">Пользователи</TabsTrigger>
        </TabsList>
        <TabsContent value="appeals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Последние обращения</CardTitle>
              <CardDescription>Список последних обращений в системе</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminAppealsList appeals={appeals} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Последние пользователи</CardTitle>
              <CardDescription>Список последних зарегистрированных пользователей</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminUsersList users={users} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="mt-8" id="mass-notification">
        <CardHeader>
          <CardTitle>Массовая рассылка уведомлений</CardTitle>
          <CardDescription>Отправка уведомлений всем пользователям системы</CardDescription>
        </CardHeader>
        <CardContent>
          <MassNotification />
        </CardContent>
      </Card>
    </div>
  )
}

