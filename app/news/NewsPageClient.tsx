"use client"

import { useState } from "react"
import { NewsList } from "@/components/news/news-list"
import { SearchInput } from "@/components/search-input"
import { useSearch } from "@/hooks/use-search"
import { Pagination } from "@/components/ui/pagination"

export default function NewsPageClient() {
  const { query, handleSearch, isPending } = useSearch()
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Новости города</h1>
      <div className="mb-6">
        <SearchInput onSearch={handleSearch} placeholder="Поиск новостей..." />
      </div>
      {isPending ? (
        <p className="text-center">Загрузка...</p>
      ) : (
        <>
          <NewsList query={query} page={currentPage} onTotalPagesChange={setTotalPages} />
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </>
      )}
    </div>
  )
}

