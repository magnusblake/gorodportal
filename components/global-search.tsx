"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export function GlobalSearch() {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm items-center space-x-2">
      <Input type="text" placeholder="Поиск по сайту..." value={query} onChange={(e) => setQuery(e.target.value)} />
      <Button type="submit" size="icon">
        <Search className="h-4 w-4" />
        <span className="sr-only">Поиск</span>
      </Button>
    </form>
  )
}

