"use client"

import React, { createContext, useContext, useState } from "react"

/**
 * VFS Provider to handle files and folders in the IDE
 */
export const LoggerProvider = ({ children }: LoggerProviderProps) => {
  const [logs, setLogs] = useState<LogEntry[]>([])

  const log = (
    text: string | object | JSX.Element,
    type: LogType,
    icon: boolean = false
  ) => {
    if (typeof text === "object" && !(text as JSX.Element).type) {
      console.log("object")
      text = JSON.stringify(
        text,
        (_, value) => (typeof value === "bigint" ? value.toString() : value),
        2
      )
    }

    var now = new Date()
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
    setLogs((currentLogs: LogEntry[]) => [
      ...currentLogs,
      {
        text,
        type: type,
        timestamp: now.toISOString(),
        icon,
      } as LogEntry,
    ])
  }

  const info = (text: string | object, icon: boolean = false) => {
    log(text, LogOptions.Info, icon)
  }

  const warn = (text: string | object, icon: boolean = false) => {
    log(text, LogOptions.Warning, icon)
  }

  const error = (text: string | object, icon: boolean = false) => {
    log(text, LogOptions.Error, icon)
  }

  const success = (text: string | object, icon: boolean = false) => {
    log(text, LogOptions.Success, icon)
  }

  const clear = () => {
    setLogs([])
  }

  return (
    <LoggerContext.Provider
      value={{
        logs,
        log,
        info,
        error,
        warn,
        success,
        clear,
      }}
    >
      {children}
    </LoggerContext.Provider>
  )
}

interface LoggerProviderProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string
}

export const LoggerContext = createContext({
  logs: [] as LogEntry[],
  log: (text: string | object, type: LogType, icon: boolean = false) => {},
  info: (text: string | object, icon: boolean = false) => {},
  error: (text: string | object, icon: boolean = true) => {},
  warn: (text: string | object, icon: boolean = false) => {},
  success: (text: string | object, icon: boolean = false) => {},
  clear: () => {},
})

export const useLogger = () => useContext(LoggerContext)

export type LogType = "success" | "info" | "warning" | "error"
export enum LogOptions {
  Success = "success",
  Info = "info",
  Warning = "warning",
  Error = "error",
}

export interface LogEntry {
  text: string | JSX.Element
  type: LogType
  timestamp: string
  icon?: boolean
}
