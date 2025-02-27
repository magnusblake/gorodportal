import { getServerSession } from "next-auth/next"
import { redirect, notFound } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"
import type { Metadata } from "next"
import { NewsForm } from "@/components/admin/news-form"

export const metadata: Metadata = {
  title: "Редактирование новости | Городской портал",
  description: "Редактирование существующей новости на Городском портале",
}

type Props = {
  params: {
    id: string
  }
}

export default async function EditNewsPage({ params }: Props) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    redirect("/")
  }

  const news = await db.news.findUnique({
    where: { id: params.id },
  })

  if (!news) {
    notFound()
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Редактирование новости</h1>
      <NewsForm news={news} />
    </div>
  )
}

