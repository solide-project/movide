import JSZip from "jszip"

export const zipSources = async (sources: Sources): Promise<Blob> => {
  const zip = new JSZip()

  Object.entries(sources).forEach(([key, val]) => {
    zip.file(key, val.content)
  })
  const blob = await zip.generateAsync({ type: "blob" })

  // console.log(blob.size, blob.type);
  return blob
}

export const downloadBlob = async ({
  source,
  name = "file",
}: DownloadBlobOptions): Promise<void> => {
  const link = document.createElement("a")
  link.href = URL.createObjectURL(source)
  link.download = name
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

interface DownloadBlobOptions {
  source: Blob
  name?: string
}

interface Sources {
  [key: string]: { content: string }
}
