import type { Metadata } from "next"
import NewsPageClient from "./NewsPageClient"

export const metadata: Metadata = {
  title: "Новости города | Городской портал",
  description: "Актуальные новости и события нашего города",
}

export default function NewsPage() {
  return <NewsPageClient />
}

