"use client"

import { Download } from "lucide-react"

import { downloadBlob, zipSources } from "@/lib/core"
import { Button } from "@/components/ui/button"
import { useLogger } from "@/components/core/providers/logger-provider"
import { useFileSystem } from "@/components/core/providers/file-provider"

interface NavItemDownloaderProps
    extends React.HTMLAttributes<HTMLButtonElement> {
}

export function NavItemDownloader({
    ...props
}: NavItemDownloaderProps) {
    const logger = useLogger()
    const fs = useFileSystem()

    const handleOnClick = async (event: any) => {
        try {
            const payload = await zipSources(await fs.generateSources())
            logger.info(`Downloading contract... ${payload.size} bytes`)

            downloadBlob({
                source: payload,
                name: "package.zip",
            })
        } catch (error) {
            logger.error("Failed to download contract.")
        }
    }

    return <Button
        className="cursor-pointer border-0 hover:bg-grayscale-100"
        size="icon"
        variant="ghost"
        onClick={handleOnClick}
        {...props}
    >
        <Download />
    </Button>
}