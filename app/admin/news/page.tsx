import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import Link from "next/link"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"
import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { AdminNewsList } from "@/components/admin/admin-news-list"

export const metadata: Metadata = {
  title: "Управление новостями | Городской портал",
  description: "Административная панель для управления новостями города",
}

export default async function AdminNewsPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    redirect("/")
  }

  const news = await db.news.findMany({
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Управление новостями</h1>
        <Link href="/admin/news/new">
          <Button>Добавить новость</Button>
        </Link>
      </div>
      <AdminNewsList news={news} />
    </div>
  )
}

