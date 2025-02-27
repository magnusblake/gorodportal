"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

interface SearchInputProps {
  onSearch: (query: string) => void
  placeholder?: string
}

export function SearchInput({ onSearch, placeholder = "Поиск..." }: SearchInputProps) {
  const [query, setQuery] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm items-center space-x-2">
      <Input type="text" placeholder={placeholder} value={query} onChange={(e) => setQuery(e.target.value)} />
      <Button type="submit" size="icon">
        <Search className="h-4 w-4" />
        <span className="sr-only">Поиск</span>
      </Button>
    </form>
  )
}

