import path from "path"

export class ContractPaths {
  originalFilePath: string
  parentPath: string
  filePath: string
  folderPath: string

  constructor(originalPath: string, fromPath: string) {
    this.originalFilePath = originalPath
    this.parentPath = fromPath

    const { filePath } = normalizeDependency(originalPath, fromPath)
    this.filePath = filePath
    this.folderPath = ""
    if (this.isHttp()) {
      this.folderPath = filePath.replace(
        /https:\/\/raw.githubusercontent.com\/[a-zA-Z0-9\-]+\/[a-zA-Z0-9\-]+\/[a-zA-Z0-9\-]+\//,
        ""
      )
    }
  }

  isHttp() {
    return this.filePath.startsWith("http")
  }
}

function normalizeDependency(dependency: string, filePath: string) {
  if (dependency.startsWith("./") || dependency.startsWith("../")) {
    if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
      /**
       * Remove protocol
       * Get Directory path
       * Normalize the path
       * Reconstruct the URL
       */
      const { hostname, pathname, protocol } = new URL(filePath)
      const { dir } = path.parse(`${hostname}${pathname}`)

      dependency = path.join(dir, dependency)
      dependency = path.normalize(dependency)
      dependency = `${protocol}//${dependency}`
    } else {
      const { dir } = path.parse(filePath)

      dependency = path.join(dir, dependency)
      dependency = path.normalize(dependency)
    }
  }

  return {
    filePath: dependency.replace(/\\/g, "/"),
  }
}
