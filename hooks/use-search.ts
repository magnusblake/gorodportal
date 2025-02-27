"use client"

import { useState, useCallback, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export function useSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [query, setQuery] = useState(searchParams.get("query") || "")

  const handleSearch = useCallback(
    (newQuery: string) => {
      setQuery(newQuery)
      startTransition(() => {
        const params = new URLSearchParams(searchParams)
        if (newQuery) {
          params.set("query", newQuery)
        } else {
          params.delete("query")
        }
        router.push(`?${params.toString()}`)
      })
    },
    [router, searchParams],
  )

  return { query, handleSearch, isPending }
}

