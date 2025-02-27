import type { Metadata } from "next"
import { MyAppealsPageClient } from "./page.client"

export const metadata: Metadata = {
  title: "Мои обращения | Городской портал",
  description: "Список ваших обращений в Администрацию города",
}

export default function MyAppealsPage() {
  return <MyAppealsPageClient />
}

