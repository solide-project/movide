"use client"

import { CodeXmlIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  EDITOR_KEY as NAV_KEY,
  useNav,
} from "@/components/core/providers/navbar-provider"

interface NavItemEditorProps extends React.HTMLAttributes<HTMLButtonElement> {}

export function NavItemEditor({ ...props }: NavItemEditorProps) {
  const { isNavItemActive, setNavItemActive } = useNav()

  const handleOnClick = async (event: any) => {
    setNavItemActive(NAV_KEY)
    props.onClick && props.onClick(event)
  }

  return (
    <Button
      className="cursor-pointer border-0 hover:bg-grayscale-100"
      size="icon"
      variant="ghost"
      onClick={handleOnClick}
      {...props}
    >
      <CodeXmlIcon
        className={isNavItemActive(NAV_KEY) ? "" : "text-grayscale-250"}
      />
    </Button>
  )
}
