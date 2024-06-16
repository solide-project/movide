"use client"

import { Download } from "lucide-react"

import { downloadBlob } from "@/lib/core"
import { Button } from "@/components/ui/button"

import { useLogger } from "../providers/logger-provider"

interface NavItemDownloaderProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  payload?: Blob
}

export function NavItemDownloader({
  payload,
  ...props
}: NavItemDownloaderProps) {
  const logger = useLogger()
  const handleOnClick = async (event: any) => {
    if (payload) {
      logger.info(`Downloading contract... ${payload.size} bytes.`)
      downloadBlob({
        source: payload,
        name: "contract.zip",
      })
    } else {
      logger.error("No payload found.")
    }
  }

  return (
    <Button
      className="cursor-pointer border-0 hover:bg-grayscale-100"
      size="icon"
      variant="ghost"
      onClick={handleOnClick}
      {...props}
    >
      <Download />
    </Button>
  )
}
