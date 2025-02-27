import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import type { Metadata } from "next"
import { NewsForm } from "@/components/admin/news-form"

export const metadata: Metadata = {
  title: "Создание новости | Городской портал",
  description: "Создание новой новости для Городского портала",
}

export default async function CreateNewsPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    redirect("/")
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Создание новости</h1>
      <NewsForm />
    </div>
  )
}

