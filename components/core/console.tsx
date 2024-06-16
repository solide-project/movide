"use client"

import { useLogger } from "./providers/logger-provider"
import { Title } from "./components/title"
import { Check, CircleX, LucideIcon } from "lucide-react";

interface ConsoleLoggerProps extends React.HTMLAttributes<HTMLButtonElement> { }

export function ConsoleLogger({ className }: ConsoleLoggerProps) {
  const logger = useLogger()

  const generateColor = (type: string = "default"): string => {
    const colors: { [key: string]: string } = {
      info: "text-blue-500",
      error: "text-red-700",
      warn: "text-yellow-500",
      success: "text-green-500",
      default: "text-grayscale-250"
    };

    return colors[type] || colors.default;
  };


  const generateIcon = (type: string = "default"): JSX.Element => {
    const colors: { [key: string]: JSX.Element } = {
      error: <CircleX size={18} className="text-red-700" />,
      success: <Check size={18} className="text-green-500" />,
    };

    return colors[type] || colors.error;
  };

  const extractTimeFromISOString = (isoString: string): string => {
    return new Date(isoString).toISOString().substring(11, 19);
  };

  return (
    <div className={className}>
      <Title text={"Console"} />
      <div className="flex flex-col">
        {logger.logs.map((log, index) => (
          <div key={index} className="text-sm flex items-center justify-between border-t py-1 break-words text-wrap">
            <code className={`flex items-center space-x-2 ${generateColor(log.type)}`}>
              <div>{log.icon && generateIcon(log.type)}</div>
              <div>{log.text}</div>
            </code>
            <div>{extractTimeFromISOString(log.timestamp)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
