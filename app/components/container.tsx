import { cn } from "@/lib/utils"
import { ComponentPropsWithoutRef } from "react"

type Props = ComponentPropsWithoutRef<"div"> & {
  as?: "div" | "section" | "article" | "header" | "footer" | "main"
}

export function Container({ className, as: Tag = "div", ...props }: Props) {
  return (
    <Tag
      className={cn("mx-auto w-full max-w-[1200px] px-6 md:px-8", className)}
      {...props}
    />
  )
}
