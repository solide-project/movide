"use client"

import { MouseEventHandler, useState } from "react"
import { Hammer } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  CODE_KEY as NAV_KEY,
  useNav,
} from "@/components/core/providers/navbar-provider"

interface NavItemCodeProps extends React.HTMLAttributes<HTMLButtonElement> { }

export function NavItemCode({ ...props }: NavItemCodeProps) {
  const { isNavItemActive, setNavItemActive } = useNav()

  const handleOnClick = async (event: any) => {
    setNavItemActive(NAV_KEY)
    props.onClick && props.onClick(event)
  }

  return <Button
    className="cursor-pointer border-0 hover:bg-grayscale-100"
    size="icon"
    variant="ghost"
    onClick={handleOnClick}
    {...props}
  >
    <Hammer
      className={isNavItemActive(NAV_KEY) ? "" : "text-grayscale-250"}
    />
  </Button>
}
