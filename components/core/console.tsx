"use client"

import { useEffect, useRef } from "react"

import { Title } from "./components/title"
import { useLogger } from "./providers/logger-provider"

interface ConsoleLoggerProps extends React.HTMLAttributes<HTMLButtonElement> { }

export function ConsoleLogger({ className }: ConsoleLoggerProps) {
  const logger = useLogger()
  const lastLogRef = useRef<HTMLDivElement>(null) // Reference for the console container

  // useEffect(() => {
  //   if (lastLogRef.current) {
  //     lastLogRef.current.scrollIntoView({ behavior: "smooth" })
  //   }
  // }, [logger.logs])

  const generateColor = (type: string = "default"): string => {
    const colors: { [key: string]: string } = {
      info: "text-blue-500",
      error: "text-red-700",
      warn: "text-yellow-500",
      success: "text-green-500",
      default: "text-grayscale-250",
    }

    return colors[type] || colors.default
  }

  const extractTimeFromISOString = (isoString: string): string => {
    return new Date(isoString).toISOString().substring(11, 19)
  }

  return (
    <div className={className}>
      <Title text={"Console"} />
      <div className="flex flex-col">
        {logger.logs.map((log, index) => (
          <div
            ref={index === logger.logs.length - 1 ? lastLogRef : null}
            key={index}
            className="flex items-center justify-between text-wrap break-words border-t py-1 text-sm"
          >
            <code
              className={`flex items-center space-x-2 ${generateColor(
                log.type
              )}`}
            >
              <div className="break-all">{log.text}</div>
            </code>
            <div>{extractTimeFromISOString(log.timestamp)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}