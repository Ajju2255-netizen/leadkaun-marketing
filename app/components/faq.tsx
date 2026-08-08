import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"

type Item = { q: string; a: string }

type Props = {
  items: Item[]
  className?: string
  /** allow multiple items open simultaneously */
  multiple?: boolean
}

export function Faq({ items, className, multiple = false }: Props) {
  return (
    <Accordion
      multiple={multiple}
      className={cn("mx-auto w-full max-w-3xl border-t", className)}
      style={{ borderColor: "var(--paper-line)" }}
    >
      {items.map((item, i) => (
        <AccordionItem
          key={i}
          value={`item-${i}`}
          className="border-b" style={{ borderColor: "var(--paper-line)" }}
        >
          <AccordionTrigger className="py-5 text-left text-[16px] font-semibold text-ink hover:no-underline hover:text-sky-600 [&_svg]:text-sky-500">
            {item.q}
          </AccordionTrigger>
          <AccordionContent className="pb-5 text-[15px] leading-[1.65] text-ink-soft">
            {item.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
