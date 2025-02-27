import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import type { Metadata } from "next"
import { FAQForm } from "@/components/admin/faq-form"

export const metadata: Metadata = {
  title: "Добавление вопроса FAQ | Городской портал",
  description: "Добавление нового вопроса в FAQ Городского портала",
}

export default async function CreateFAQPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    redirect("/")
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Добавление вопроса FAQ</h1>
      <FAQForm />
    </div>
  )
}

