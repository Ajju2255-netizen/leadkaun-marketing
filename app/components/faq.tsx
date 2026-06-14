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
      className={cn("mx-auto flex w-full max-w-3xl flex-col gap-3", className)}
    >
      {items.map((item, i) => (
        <AccordionItem
          key={i}
          value={`item-${i}`}
          className="rounded-2xl px-5 glass-2 elevate-1 gloss-edge transition-shadow hover:elevate-2 border-0"
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
