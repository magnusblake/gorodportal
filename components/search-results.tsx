import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

async function getSearchResults(query: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/search?q=${encodeURIComponent(query)}`)
  if (!res.ok) {
    throw new Error("Failed to fetch search results")
  }
  return res.json()
}

export async function SearchResults({ query }: { query?: string }) {
  if (!query) {
    return <div>Введите поисковый запрос для отображения результатов.</div>
  }

  const results = await getSearchResults(query)

  if (results.length === 0) {
    return <div>По вашему запросу ничего не найдено.</div>
  }

  return (
    <div className="space-y-4">
      {results.map((result: any) => (
        <Card key={`${result.type}-${result.id}`}>
          <CardHeader>
            <CardTitle>{result.title}</CardTitle>
            <CardDescription>{result.type}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{result.excerpt}</p>
            <Link href={result.url} className="text-primary hover:underline mt-2 inline-block">
              Подробнее
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

