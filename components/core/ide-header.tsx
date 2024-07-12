import { parse } from "path"
import { useEditor } from "./providers/editor-provider"

interface IDEHeaderProps extends React.HTMLAttributes<HTMLDivElement> { }

export function IDEHeader({ }: IDEHeaderProps) {
  const editor = useEditor()

  return (
    <div
      className="flex items-center justify-center text-center"
      style={{ height: "5vh" }}
    >
      <span className="rounded-md border bg-grayscale-025 px-16 py-1">
        {parse(editor.file?.filePath || "contract.move").base}
      </span>
    </div>
  )
}
