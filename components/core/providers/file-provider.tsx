"use client"

import React, { createContext, useContext, useState } from "react"

import {
  Sources,
  VFSFile,
  VFSNode,
  isVFSFile,
} from "@/lib/core/utils/interface"
import path, { parse } from "path"

/**
 * VFS Provider to handle files and folders in the IDE
 */
export const FileSystemProvider = ({ children }: FileSystemProviderProps) => {
  const [files, setFiles] = useState<VFSNode>({})

  const clear = () => {
    setFiles({})
  }

  const writeFile = (path: string, content: Buffer | string): void => {
    setFiles((currentFiles) => {
      const pathArray = path.split("/")
      let newFiles = { ...currentFiles } // Create a shallow copy at the top level

      let currentLocation = newFiles

      for (const folder of pathArray.slice(0, -1)) {
        if (!currentLocation[folder]) {
          currentLocation[folder] = {}
        } else {
          // Ensure a new object is created for each nested level to avoid direct mutation
          currentLocation[folder] = { ...currentLocation[folder] }
        }
        currentLocation = currentLocation[folder] as VFSNode
      }

      currentLocation[pathArray[pathArray.length - 1]] = {
        content: content.toString(),
        filePath: path,
      } as VFSFile

      return newFiles // Return the new state
    })
  }

  const readFile = (path: string): VFSFile | undefined => {
    const pathArray = path.split("/")
    let currentLocation = files

    for (const folder of pathArray) {
      if (!currentLocation[folder]) {
        return undefined
      }
      currentLocation = currentLocation[folder] as VFSNode
    }

    return currentLocation[pathArray[pathArray.length - 1]] as VFSFile
  }

  const init = (sources: { [key: string]: { content: string } }) => {
    clear()

    Object.entries(sources).forEach(([key, val]) => {
      writeFile(key, val.content)
    })
  }

  const initAndFoundEntry = async (sources: { [key: string]: { content: string } }, entry: string) => {
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
    let obj = { ...files } // Create a copy of the file system
    let sources: Sources = {}

    const traverse = (currentObj: any) => {
      for (const key in currentObj) {
        if (isVFSFile(currentObj[key])) {
          sources[currentObj[key].filePath] = {
            content: currentObj[key].content,
          }
        } else if (typeof currentObj[key] === "object") {
          traverse(currentObj[key])
        }
      }
    }

    traverse(obj)

    return sources
  }

  const count = (): number => {
    let count = 0

    // Recursive helper function to traverse the VFSNode
    function traverse(currentNode: VFSNode) {
      for (const key in currentNode) {
        const childNode = currentNode[key]
        if (isVFSFile(childNode)) {
          // If childNode is a VFSFile, increment the count
          count++
        } else if (isVFSFile(childNode)) {
          // If childNode is a VFSNode, recursively traverse it
          traverse(childNode)
        }
      }
    }

    // Start traversing from the root node
    traverse(files)

    return count
  }

  return (
    <FileContext.Provider
      value={{
        files,
        clear,
        writeFile,
        readFile,
        init,
        initAndFoundEntry,
        generateSources,
        count,
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
  files: {},
  clear: () => { },
  writeFile: (path: string, content: Buffer | string) => { },
  readFile: (path: string): VFSFile | undefined => undefined,
  init: (sources: { [key: string]: { content: string } }) => { },
  initAndFoundEntry: async (sources: { [key: string]: { content: string } }, entry: string): Promise<VFSFile | undefined> => undefined,
  generateSources: (): Sources => ({}),
  count: (): number => 0,
})

export const useFileSystem = () => useContext(FileContext)
