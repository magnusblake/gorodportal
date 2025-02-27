"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { AppealsList } from "@/components/appeals/appeals-list"
import { SearchInput } from "@/components/search-input"
import { useSearch } from "@/hooks/use-search"
import { Pagination } from "@/components/ui/pagination"

export function MyAppealsPageClient() {
  const { data: session, status } = useSession()
  const { query, handleSearch, isPending } = useSearch()
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  if (status === "unauthenticated") {
    redirect("/auth/signin?callbackUrl=/appeals/my")
  }

  if (status === "loading") {
    return <p className="text-center">Загрузка...</p>
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Мои обращения</h1>
        <div className="mb-6">
          <SearchInput onSearch={handleSearch} placeholder="Поиск обращений..." />
        </div>
        {isPending ? (
          <p className="text-center">Загрузка...</p>
        ) : (
          <>
            <AppealsList
              query={query}
              userId={session?.user.id}
              page={currentPage}
              onTotalPagesChange={setTotalPages}
            />
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </>
        )}
      </div>
    </div>
  )
}

