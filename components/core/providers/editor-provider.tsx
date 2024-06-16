"use client"

import React, { createContext, useContext, useState } from "react"

import { VFSFile } from "@/lib/core"

/**
 * VFS Provider to handle files and folders in the IDE
 */
export const EditorProvider = ({ children }: EditorProviderProps) => {
  const [file, setFile] = useState<VFSFile | undefined>()

  const selectFile = (file: VFSFile) => {
    setFile(file)
  }

  return (
    <EditorContext.Provider
      value={{
        file,
        selectFile,
      }}
    >
      {children}
    </EditorContext.Provider>
  )
}

interface EditorProviderProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string
}

export const EditorContext = createContext({
  file: {} as VFSFile | undefined,
  selectFile: (file: VFSFile) => {},
})

export const useEditor = () => useContext(EditorContext)
