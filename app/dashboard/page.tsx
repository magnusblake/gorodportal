import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { DashboardTabs } from "@/components/dashboard/dashboard-tabs"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Личный кабинет | Городской портал",
  description: "Управление личным профилем и обращениями на Городском портале",
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin?callbackUrl=/dashboard")
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Личный кабинет</h1>
      <DashboardTabs userId={session.user.id} />
    </div>
  )
}

