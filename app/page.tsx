import { MoveIDE } from "@/components/move/ide";
import { MoveProvider } from "@/components/move/move-provider";
import { getTypescriptContract } from "@/lib/server/move-loader";
import path from "path";
import fs from "fs";

interface SearchParams {
  params: { slug: string }
  searchParams?: { [key: string]: string | undefined }
}
export default async function Home({ searchParams }: SearchParams) {
  const wasmSource = 'move.toml'
  const wasmDirectory = path.resolve('./public/sample', wasmSource);
  const content: string = fs.readFileSync(wasmDirectory).toString();

  const wasmSource2 = 'counter.move'
  const wasmDirectory2 = path.resolve('./public/sample/sources', wasmSource2);
  const content2: string = fs.readFileSync(wasmDirectory2).toString();

  let input = {
    sources: {
      "Move.toml": {
        content: content
      },
      "sources/counter.move": {
        content: content2
      }
    }
  }

  if (searchParams?.url) {
    input = await getTypescriptContract(searchParams?.url)
  }

  return <MoveProvider>
    <MoveIDE content={JSON.stringify(input)} />
  </MoveProvider>
}
