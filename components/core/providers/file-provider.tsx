"use client"

import path from "path"
import React, { createContext, useContext, useState } from "react"

import { useVirtualFileSystem } from "@/lib/core/file-system/hook"
import { Sources, VFSFile, VFSNode } from "@/lib/core/file-system/interfaces"

export const FileSystemProvider = ({ children }: FileSystemProviderProps) => {
  const vfs = useVirtualFileSystem()

  const init = (sources: Sources) => {
    // vfs.clear()

    Object.entries(sources).forEach(([key, val]) => {
      vfs.touch(key, val.content)
    })
  }

  const initAndFoundEntry = async (sources: Sources, entry: string) => {
    await init(sources)

    const entryFile = Object.entries(sources).find(([key, _]) =>
      path.basename(key).startsWith(path.basename(entry))
    )

    if (entryFile) {
      return {
        content: entryFile[1].content.toString(),
        filePath: entryFile[0],
      } as VFSFile
    }

    return undefined
  }

  const generateSources = (): Sources => {
    return vfs.pack()
  }

  return (
    <FileContext.Provider
      value={{
        vfs,
        init,
        initAndFoundEntry,
        generateSources,
      }}
    >
      {children}
    </FileContext.Provider>
  )
}

interface FileSystemProviderProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string
}

export const FileContext = createContext({
  vfs: {
    vfs: {} as VFSNode,
    ls: (filePath: string) => [] as string[],
    mkdir: (filePath: string) => {},
    touch: (filePath: string, content?: string) => {},
    cat: (filePath: string) => {
      return {} as any
    },
    pack: (filePath?: string) => {},
    rm: (filePath: string) => {},
    mv: (oldPath: string, newPath: string) => {},
    clear: () => {},
  },
  init: (sources: { [key: string]: { content: string } }) => {},
  initAndFoundEntry: async (
    sources: { [key: string]: { content: string } },
    entry: string
  ): Promise<VFSFile | undefined> => undefined,
  generateSources: (): Sources => ({}),
})

export const useFileSystem = () => useContext(FileContext)
