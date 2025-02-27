"use client"

import { useState, Suspense } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { AdminAppealsList } from "@/components/admin/admin-appeals-list"
import { SearchInput } from "@/components/search-input"
import { useSearch } from "@/hooks/use-search"
import { Pagination } from "@/components/ui/pagination"

function AdminAppealsContent() {
  const { query, handleSearch, isPending } = useSearch()
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <>
      <div className="mb-6">
        <SearchInput onSearch={handleSearch} placeholder="Поиск обращений..." />
      </div>
      {isPending ? (
        <p className="text-center">Загрузка...</p>
      ) : (
        <>
          <AdminAppealsList query={query} page={currentPage} onTotalPagesChange={setTotalPages} />
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </>
      )}
    </>
  )
}

export default function AdminAppealsPageClient() {
  const { data: session, status } = useSession()

  if (status === "unauthenticated" || (status === "authenticated" && session.user.role !== "ADMIN")) {
    redirect("/")
  }

  if (status === "loading") {
    return <p className="text-center">Загрузка...</p>
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Управление обращениями</h1>
      <Suspense fallback={<div>Загрузка...</div>}>
        <AdminAppealsContent />
      </Suspense>
    </div>
  )
}

