"use client"

import { Gamepad2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  CONSOLE_KEY as NAV_KEY,
  useNav,
} from "@/components/core/providers/navbar-provider"

interface NavItemConsoleProps extends React.HTMLAttributes<HTMLButtonElement> { }

export function NavItemConsole({ ...props }: NavItemConsoleProps) {
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
    <Gamepad2
      className={isNavItemActive(NAV_KEY) ? "" : "text-grayscale-250"}
    />
  </Button>
}
