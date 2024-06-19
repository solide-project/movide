import { MoveIDE } from "@/components/move/ide";
import { MoveProvider } from "@/components/move/move-provider";
import { getTypescriptContract } from "@/lib/server/move-loader";
import fs from 'fs';
import path from "path";

interface SearchParams {
  params: { slug: string }
  searchParams?: { [key: string]: string | undefined }
}
export default async function Home({ searchParams }: SearchParams) {
  let url = "https://github.com/MystenLabs/sui/tree/06c32a855bad241c03cc38ab0102c56149a6be52/sdk/create-dapp/templates/react-e2e-counter/move/counter"
  searchParams?.url && (url = searchParams.url)
  const input = await getTypescriptContract("https://github.com/MystenLabs////sui/tree////main/examples/move/coin")

  // const wasmSource = 'move.toml'
  // const wasmDirectory = path.resolve('./public/sample', wasmSource);
  // const content: string = fs.readFileSync(wasmDirectory).toString();

  // const wasmSource2 = 'counter.move'
  // const wasmDirectory2 = path.resolve('./public/sample/sources', wasmSource2);
  // const content2: string = fs.readFileSync(wasmDirectory2).toString();

  // const input = {
  //   sources: {
  //     "Move.toml": {
  //       content: content
  //     },
  //     "sources/counter.move": {
  //       content: content2
  //     }
  //   }
  // }

  return <MoveProvider>
    <MoveIDE content={JSON.stringify(input)} />
  </MoveProvider>
}
