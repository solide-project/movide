export type VFSNode = {
  [x: string]: VFSFile | VFSNode
}

export interface VFSFile {
  content: string
  filePath: string
}

export interface Sources {
  [key: string]: { content: string }
}

export function isVFSFile(obj: any): obj is VFSFile {
  if (typeof obj !== "object") return false
  if (typeof obj.content !== "string") return false
  if (typeof obj.filePath !== "string") return false

  return true
}
