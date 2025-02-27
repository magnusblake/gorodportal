import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { ProfileForm } from "@/components/profile/profile-form"
import { db } from "@/lib/db"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Профиль | Городской портал",
  description: "Управление личным профилем на Городском портале",
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      image: true,
    },
  })

  if (!user) {
    redirect("/auth/signin")
  }

  return (
    <div className="container py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Личный профиль</h1>
        <ProfileForm user={user} />
      </div>
    </div>
  )
}

