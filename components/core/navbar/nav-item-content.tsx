"use client"

import path from "path"
import { ReactNode, useEffect, useState } from "react"
import Link from "next/link"
import { Box, Github, IconNode, LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

interface NavItemContentProps extends React.HTMLAttributes<HTMLDivElement> {
  url: string
}

export function NavItemContent({ url }: NavItemContentProps) {
  const [icon, setIcon] = useState<ReactNode>(<Box />)

  useEffect(() => {
    const { ext } = path.parse(url)

    if (ext) {
      setIcon(<Github />)
    }
  }, [url])

  return (
    <Link
      href={url}
      target="_blank"
      className={cn(
        buttonVariants({ size: "icon", variant: "ghost" }),
        "cursor-pointer border-0 hover:bg-grayscale-100"
      )}
    >
      {icon}
    </Link>
  )
}
