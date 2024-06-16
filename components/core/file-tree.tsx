"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, FileBox, FolderClosed, FolderOpen } from "lucide-react"

import { VFSFile, VFSNode, isVFSFile } from "@/lib/core"

import { useEditor } from "./providers/editor-provider"
import { useFileSystem } from "./providers/file-provider"
import { Title } from "./components/title"
import { cn } from "@/lib/utils"

interface FileTreeNodeProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  node: VFSNode | VFSFile
  depth: number
}

const iconsProps = {
  size: 18,
  className: "shrink-0",
}
const FileTreeNode = ({ name, node, depth }: FileTreeNodeProps) => {
  const ide = useEditor()
  const [isExpanded, setIsExpanded] = useState(false)

  if (isVFSFile(node)) {
    return <div onClick={() => ide.selectFile(node as VFSFile)}
      // style={getIndentStyle()}
      className="hover:bg-secondary flex items-center cursor-pointer space-x-1 pl-[16px]">
      <FileBox {...iconsProps} />
      <div className="truncate">
        {name}
      </div>
    </div>
  }

  return <div className={`${depth === 0 ? "pl-[4px]" : "pl-[16px]"}`}>
    <div onClick={() => node && setIsExpanded(!isExpanded)}
      className="hover:bg-secondary flex items-center cursor-pointer space-x-1 pl-[4px]" >
      {isExpanded ? <FolderOpen {...iconsProps} /> : <FolderClosed {...iconsProps} />}
      <div className="truncate">
        {name}
      </div>
    </div >
    {isExpanded && node && (
      <ul style={{ listStyleType: "none" }}>
        {Object.entries(node).map(([childName, childNode]) => <li key={childName}>
          <FileTreeNode name={childName} node={childNode} depth={depth + 1} />
        </li>)}
      </ul>
    )}
  </div>
}

interface FileTreeProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string
}

export const FileTree = ({ className, name = "root" }: FileTreeProps) => {
  const { files } = useFileSystem()

  if (!files) {
    return <div className={className}>Empty</div>
  }

  return (
    <div className={className}>
      <Title text="File Tree" />
      <FileTreeNode name={name} node={files || {}} depth={0} />
    </div>
  )
}
