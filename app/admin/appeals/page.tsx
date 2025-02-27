import type { Metadata } from "next"
import AdminAppealsPageClient from "./AdminAppealsPageClient"

export const metadata: Metadata = {
  title: "Управление обращениями | Городской портал",
  description: "Административная панель для управления обращениями граждан",
}

export default function AdminAppealsPage() {
  return <AdminAppealsPageClient />
}

