import { Suspense } from "react"
import { SearchResults } from "@/components/search-results"
import { GlobalSearch } from "@/components/global-search"

export const metadata = {
  title: "Результаты поиска | Городской портал",
  description: "Результаты поиска по Городскому порталу",
}

export default function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const query = typeof searchParams.q === "string" ? searchParams.q : undefined

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Результаты поиска</h1>
      <div className="mb-6">
        <GlobalSearch />
      </div>
      <Suspense fallback={<div>Загрузка результатов...</div>}>
        <SearchResults query={query} />
      </Suspense>
    </div>
  )
}

