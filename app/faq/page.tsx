import { db } from "@/lib/local-db"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Часто задаваемые вопросы | Городской портал",
  description: "Ответы на часто задаваемые вопросы о работе Городского портала",
}

export default async function FAQPage() {
  const faqs = db.findAll("faq").sort((a: any, b: any) => {
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category)
    }
    return a.order - b.order
  })

  const groupedFaqs = faqs.reduce(
    (acc: Record<string, any[]>, faq: any) => {
      if (!acc[faq.category]) {
        acc[faq.category] = []
      }
      acc[faq.category].push(faq)
      return acc
    },
    {} as Record<string, any[]>,
  )

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Часто задаваемые вопросы</h1>
      {Object.entries(groupedFaqs).map(([category, categoryFaqs]) => (
        <div key={category} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{category}</h2>
          <Accordion type="single" collapsible className="w-full">
            {categoryFaqs.map((faq, index) => (
              <AccordionItem key={faq.id} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ))}
    </div>
  )
}

