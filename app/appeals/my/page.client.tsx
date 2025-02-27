"use client"

import { useState, Suspense } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { AppealsList } from "@/components/appeals/appeals-list"
import { SearchInput } from "@/components/search-input"
import { useSearch } from "@/hooks/use-search"
import { Pagination } from "@/components/ui/pagination"

function MyAppealsContent() {
  const { data: session } = useSession()
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
          <AppealsList query={query} userId={session?.user.id} page={currentPage} onTotalPagesChange={setTotalPages} />
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </>
      )}
    </>
  )
}

export function MyAppealsPageClient() {
  const { status } = useSession()

  if (status === "unauthenticated") {
    redirect("/auth/signin?callbackUrl=/appeals/my")
  }

  if (status === "loading") {
    return <p className="text-center">Загрузка...</p>
  }

  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Мои обращения</h1>
        <Suspense fallback={<div>Загрузка...</div>}>
          <MyAppealsContent />
        </Suspense>
      </div>
    </div>
  )
}

