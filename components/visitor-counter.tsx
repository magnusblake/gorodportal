import { getVisitorCount } from "@/lib/actions"

export async function VisitorCounter() {
  const count = await getVisitorCount()

  return (
    <div className="py-4 text-center">
      <div className="inline-flex items-center justify-center rounded-full bg-muted px-4 py-2">
        <span className="text-sm font-medium">Посещений сайта: {count}</span>
      </div>
    </div>
  )
}

