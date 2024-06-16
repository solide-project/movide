"use client"

import { NavItemCode } from "./nav-item-code"
import { NavItemContent } from "./nav-item-content"
import { NavItemDownloader } from "./nav-item-downloader"
import { NavItemEditor } from "./nav-item-editor"
import { NavItemFile } from "./nav-item-file"
import { NavItemTheme } from "./nav-item-theme"

interface NavBarProps extends React.HTMLAttributes<HTMLDivElement> {
  url: string
}

// Not to be used. This is a sample
export function NavBar({ url }: NavBarProps) {
  return (
    <div className="flex h-full flex-col gap-y-2 rounded-lg bg-grayscale-025 px-2 py-4">
      <NavItemFile />
      <NavItemCode />
      <NavItemEditor />
      <NavItemContent url={url} />
      <NavItemDownloader />

      <div className="mt-auto flex flex-col items-center gap-2">
        <NavItemTheme />
        <NavItemTheme />
      </div>
    </div>
  )
}
